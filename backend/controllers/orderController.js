import db from "../config/db.js";
import redisClient from "../config/redis.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, deliveryAddress, deliveryNotes, deliveryDate } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: "User ID and items are required." });
        }

        // 1. Insert Order into DB (Pending)
        const [orderResult] = await db.query(
            "INSERT INTO orders (user_id, total_amount, delivery_address, delivery_notes, delivery_date, status) VALUES (?, ?, ?, ?, ?, 'pending')",
            [userId, totalAmount, deliveryAddress, deliveryNotes, deliveryDate]
        );

        const orderId = orderResult.insertId;

        // 2. Insert Order Items
        const itemValues = items.map(item => {
            let imageUrl = item.image || item.image_url; // Handle both property names

            // Ensure uploads start with /uploads if missing
            if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/uploads") && imageUrl.includes("uploads/")) {
                imageUrl = "/" + imageUrl;
            }

            return [
                orderId,
                item.name,
                item.quantity,
                parseFloat(item.price.replace(/[^\d.]/g, '')),
                item.frequency || "One off",
                imageUrl
            ];
        });

        if (itemValues.length > 0) {
            await db.query(
                "INSERT INTO order_items (order_id, product_name, quantity, price, frequency, image_url) VALUES ?",
                [itemValues]
            );
        }

        // 3. Create Razorpay Order
        const payment_capture = 1;
        const amountInPaise = Math.round(totalAmount * 100);
        const currency = "INR";

        // If credentials aren't set, we might skip or fail. For now, we try-catch specifically.
        let razorpayOrder;
        try {
            razorpayOrder = await razorpay.orders.create({
                amount: amountInPaise,
                currency,
                receipt: `receipt_order_${orderId}`,
                payment_capture,
                notes: { internal_order_id: orderId }
            });
        } catch (rzpError) {
            console.error("Razorpay Error:", rzpError);
            // Fallback: return success but without Razorpay ID (frontend can handle mock)
            return res.status(201).json({
                message: "Order created (Razorpay failed)",
                orderId,
                razorpayOrderId: null
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            orderId,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: currency
        });

    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Orders for User
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Only show orders that are NOT pending (assuming pending means payment incomplete/abandoned)
        // Or if you update status to 'Paid' on success, filter for that. 
        // For safe logic now: WHERE user_id = ? AND status != 'pending'
        const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ? AND status != 'pending' ORDER BY created_at DESC", [userId]);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



// GET User Calendar Events
export const getCalendarEvents = async (req, res) => {
    try {
        const userId = req.params.userId;

        const query = `
                SELECT oi.*, o.created_at as order_created_at, o.delivery_date
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                WHERE o.user_id = ? 
                AND o.status != 'pending' AND o.status != 'cancelled'
                -- AND oi.frequency != 'Once only' AND oi.frequency != 'One off'  <-- User wants One offs too
                ORDER BY o.created_at DESC
            `;

        const [items] = await db.query(query, [userId]);

        // Fetch Skipped Deliveries
        const [skipped] = await db.query("SELECT skip_date FROM skipped_deliveries WHERE user_id = ?", [userId]);
        const skippedDates = new Set(skipped.map(s => {
            const d = new Date(s.skip_date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }));

        const events = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today

        const futureLimit = new Date();
        futureLimit.setDate(today.getDate() + 60); // Show next 60 days

        items.forEach(item => {
            const freq = item.frequency;
            let startDate = new Date(item.order_created_at);

            // "One off" or "Once only"
            if (!freq || freq === 'One off' || freq === 'Once only') {
                const deliveryString = item.delivery_date || ""; // "Monday 22nd Dec"
                const parts = deliveryString.split(" ");
                if (parts.length > 0) {
                    const dayName = parts[0]; // "Monday"

                    // Find date
                    let d = new Date(startDate);
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const targetIndex = days.indexOf(dayName);

                    if (targetIndex !== -1) {
                        let currentDayIndex = d.getDay();
                        let daysUntil = targetIndex - currentDayIndex;
                        if (daysUntil <= 0) daysUntil += 7; // It's always forward 

                        d.setDate(d.getDate() + daysUntil);

                        if (d >= today && d < futureLimit) {
                            const year = d.getFullYear();
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const day = String(d.getDate()).padStart(2, '0');
                            const dateStr = `${year}-${month}-${day}`;

                            const isPaused = skippedDates.has(dateStr);

                            events.push({
                                date: dateStr,
                                product: item.product_name,
                                image: item.image_url,
                                frequency: "One off",
                                price: item.price,
                                quantity: item.quantity,
                                isPaused: isPaused
                            });
                        }
                    }
                }

            }
        });

        // RECURRING PROCESSING (Deduped)
        const activeSubscriptions = {};
        items.forEach(item => {
            const freq = item.frequency;
            if (freq && freq !== 'One off' && freq !== 'Once only') {
                // Latest prevails
                if (!activeSubscriptions[item.product_name]) {
                    activeSubscriptions[item.product_name] = item;
                }
            }
        });

        Object.values(activeSubscriptions).forEach(sub => {
            let nextDate = new Date(sub.order_created_at);
            const freqMap = {
                "Every week": 7,
                "Every 2 weeks": 14,
                "Every 3 weeks": 21,
                "Every 4 weeks": 28
            };
            const daysToAdd = freqMap[sub.frequency];

            if (daysToAdd) {
                // Project: Find the first occurrence of the target day (from delivery_date)
                // If delivery_date is "Monday 22nd Dec", we want "Monday"
                let alignedStartDate = new Date(nextDate);
                const deliveryString = sub.delivery_date || "";
                const parts = deliveryString.split(" ");
                if (parts.length > 0) {
                    const dayName = parts[0]; // "Monday"
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const targetIndex = days.indexOf(dayName);

                    if (targetIndex !== -1) {
                        let currentDayIndex = alignedStartDate.getDay();
                        let daysUntil = targetIndex - currentDayIndex;
                        if (daysUntil < 0) daysUntil += 7; // Only move forward or stay on same day
                        // ERROR CORRECTION: If daysUntil is 0, it means we are ON the day. 
                        // But if order_created_at matches the day, we should probably stick to it.

                        alignedStartDate.setDate(alignedStartDate.getDate() + daysUntil);
                    }
                }

                nextDate = alignedStartDate; // Use the aligned date as the starting point

                while (nextDate < futureLimit) {
                    // We intentionally include the first date (alignedStartDate) if it's in the future/today
                    // But we must loop carefully. The original loop did `nextDate.setDate(...)` BEFORE pushing?
                    // No, original loop: while(nextDate < futureLimit) { nextDate.setDate(...) ... }
                    // Wait, original logic:
                    /*
                    while (nextDate < futureLimit) {
                        nextDate.setDate(nextDate.getDate() + daysToAdd);
                        if (nextDate >= today) ... push
                    }
                    */
                    // This means the FIRST delivery is (Start + freq). That might be wrong?
                    // If I order on Monday for "Every Monday", do I get it TODAY? Or Next Monday?
                    // Typically subscription is "Next delivery". 
                    // But if I aligned it, the "alignedStartDate" IS the first valid delivery day.
                    // If alignedStartDate >= today (and maybe >= order_created_at), it should be a delivery.

                    // Let's adopt a standard: First delivery is AT LEAST alignedStartDate.
                    // If we want to include the first one:
                    if (nextDate >= today) {
                        const year = nextDate.getFullYear();
                        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
                        const day = String(nextDate.getDate()).padStart(2, '0');
                        const dateStr = `${year}-${month}-${day}`;
                        const isPaused = skippedDates.has(dateStr);

                        events.push({
                            date: dateStr,
                            product: sub.product_name,
                            image: sub.image_url,
                            frequency: sub.frequency,
                            price: sub.price,
                            quantity: sub.quantity,
                            isPaused: isPaused
                        });
                    }

                    // Move to next cycle
                    nextDate.setDate(nextDate.getDate() + daysToAdd);
                }
            }
        });

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(events);

    } catch (error) {
        console.error("Calendar Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// PAUSE DELIVERY
export const pauseDelivery = async (req, res) => {
    try {
        const { userId, date } = req.body; // Expect YYYY-MM-DD

        if (!userId || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Insert into skipped_deliveries
        // Use INSERT IGNORE or ON DUPLICATE KEY UPDATE to handle double clicks
        await db.query(
            "INSERT IGNORE INTO skipped_deliveries (user_id, skip_date) VALUES (?, ?)",
            [userId, date]
        );

        // Notify Admin
        try {
            // Fetch user info
            const [users] = await db.query("SELECT name, email, phone FROM users WHERE id = ?", [userId]);
            const user = users[0];

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: `Delivery Paused - ${user.name}`,
                text: `
                     User ${user.name} (${user.email}) has paused their delivery for ${date}.
                     
                     Please do not deliver on this date.
                 `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Admin Paused Notification sent for ${user.name} on ${date}`);

        } catch (e) {
            console.error("Failed to send Admin Pause Email:", e);
            // Don't fail the request, just log
        }

        res.json({ message: "Delivery paused successfully" });

    } catch (error) {
        console.error("Pause Delivery Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET AVAILABLE COUPONS (For User)
export const getAvailableCoupons = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [coupons] = await db.query(
            "SELECT code, discount_type, discount_amount, description, minimum_amount FROM coupons WHERE (expiry_date >= ? OR expiry_date IS NULL) ORDER BY created_at DESC",
            [today]
        );
        res.json(coupons);
    } catch (error) {
        console.error("Get Available Coupons Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// APPLY COUPON
export const applyCoupon = async (req, res) => {
    try {
        const { orderId, couponCode } = req.body;

        // 1. Fetch Order
        const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [orderId]);
        if (orders.length === 0) return res.status(404).json({ message: "Order not found" });
        const order = orders[0];

        if (order.coupon_code) {
            // Optional: Allow overwriting, or return error. Let's allow overwrite.
        }

        // 2. Fetch Coupon
        const today = new Date().toISOString().split('T')[0];
        const [coupons] = await db.query("SELECT * FROM coupons WHERE code = ? AND (expiry_date >= ? OR expiry_date IS NULL)", [couponCode, today]);

        if (coupons.length === 0) {
            return res.status(400).json({ message: "Invalid or expired coupon" });
        }
        const coupon = coupons[0];

        // 3. Validate Minimum Amount (Based on original non-discounted total? Or current?)
        // Assuming order.total_amount IS the subtotal if no discount applied yet. 
        // If discount already applied, we should probably look up the sum of items again or store subtotal.
        // For simplicity, let's assume total_amount + discount_amount = subtotal.
        const currentTotal = parseFloat(order.total_amount);
        const alreadyDiscounted = parseFloat(order.discount_amount || 0);
        const subtotal = currentTotal + alreadyDiscounted;

        if (subtotal < coupon.minimum_amount) {
            return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minimum_amount} required` });
        }

        // 4. Calculate Discount
        let discount = 0;
        if (coupon.discount_type === 'flat') {
            discount = parseFloat(coupon.discount_amount);
        } else {
            discount = (subtotal * parseFloat(coupon.discount_amount)) / 100;
        }

        // Cap discount at subtotal (cannot be negative)
        if (discount > subtotal) discount = subtotal;

        const newTotal = subtotal - discount;

        // 5. Create NEW Razorpay Order
        const payment_capture = 1;
        const amountInPaise = Math.round(newTotal * 100);
        const currency = "INR";

        let newRazorpayOrder;
        try {
            newRazorpayOrder = await razorpay.orders.create({
                amount: amountInPaise,
                currency,
                receipt: `receipt_order_${orderId}_${Date.now()}`, // Unique receipt
                payment_capture
            });
        } catch (rzpError) {
            console.error("Razorpay Error:", rzpError);
            return res.status(500).json({ message: "Failed to generate payment order" });
        }

        // 6. Update Database
        await db.query(
            "UPDATE orders SET total_amount = ?, coupon_code = ?, discount_amount = ? WHERE id = ?",
            [newTotal, couponCode, discount, orderId]
        );

        res.json({
            message: "Coupon applied",
            newTotal: newTotal,
            discountAmount: discount,
            razorpayOrderId: newRazorpayOrder.id,
            couponCode: couponCode
        });

    } catch (error) {
        console.error("Apply Coupon Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// UPDATE ORDER STATUS (Manual from Frontend)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status, paymentId } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ message: "Order ID and Status are required." });
        }

        // Update DB
        // If paymentId is provided, store it too (assuming you have a column or just in notes? 
        // For now, let's just update status. If you want payment_id column, we might need schema update.
        // But the webhook uses `notes` for internal_id. 
        // Let's assume for now we just mark as Paid. 
        // Actually, let's check if 'payment_id' exists in orders table? No, it doesn't seem so in db.sql snippet I saw earlier.
        // So just update status.

        await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

        // Clear Admin Stats Cache
        if (redisClient && redisClient.isOpen) {
            try {
                await redisClient.del('admin_stats');
            } catch (e) {
                console.error("Redis Cache Clear Error", e);
            }
        }

        // Notify Admin (optional, duplicate of webhook but good backup)
        // ... (skipped for brevity to avoid double emails if webhook works later, but simple log is fine)
        console.log(`Order #${orderId} status updated to ${status} (Manual)`);

        res.json({ message: "Order status updated successfully" });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Webhook Handler
export const verifyPaymentWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const shasum = crypto.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (digest === req.headers["x-razorpay-signature"]) {
            // Webhook is valid
            const event = req.body.event;
            const payload = req.body.payload;

            if (event === "payment.captured") {
                const payment = payload.payment.entity;
                console.log(`Payment captured: ${payment.id} for Order Razorpay ID: ${payment.order_id}`);

                // 1. Get Internal Order ID from Notes
                const notes = payment.notes;

                if (notes && notes.internal_order_id) {
                    const internalOrderId = notes.internal_order_id;

                    console.log(`Updating Status for Internal Order ID: ${internalOrderId} to 'paid'`);

                    // 2. Update DB
                    await db.query("UPDATE orders SET status = 'paid' WHERE id = ?", [internalOrderId]);

                    // 3. Clear Admin Stats Cache (Revenue updated)
                    if (redisClient && redisClient.isOpen) {
                        try {
                            await redisClient.del('admin_stats');
                        } catch (e) { console.error("Redis Cache Clear Error", e); }
                    }

                    // 4. Send Email Notification to Admin
                    try {
                        // Fetch details for email
                        const [orderRows] = await db.query(
                            "SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?",
                            [internalOrderId]
                        );

                        if (orderRows.length > 0) {
                            const orderDetails = orderRows[0];
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS
                                }
                            });

                            const mailOptions = {
                                from: process.env.EMAIL_USER,
                                to: process.env.ADMIN_EMAIL, // Admin Email
                                subject: `New Order Received - Order #${internalOrderId}`,
                                text: `
                                    New Order Received!
                                    
                                    Order ID: #${internalOrderId}
                                    Customer: ${orderDetails.user_name}
                                    Phone: ${orderDetails.user_phone}
                                    Amount: ₹${orderDetails.total_amount}
                                    
                                    Please check Admin Panel for details.
                                `
                            };

                            await transporter.sendMail(mailOptions);
                            console.log(`Admin Notification Email sent for Order #${internalOrderId}`);
                        }
                    } catch (emailErr) {
                        console.error("Failed to send Admin Notification Email:", emailErr);
                    }

                } else {
                    console.warn("Payment captured but no internal_order_id found in notes.");
                }
            }
            res.status(200).json({ status: "ok" });
        } else {
            console.error("Invalid Webhook Signature");
            // Razorpay expects 200 even on failure to prevent retries, but 400 helps debugging
            res.status(400).json({ status: "invalid signature" });
        }

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
