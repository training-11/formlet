import db from "../config/db.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

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
        const itemValues = items.map(item => [
            orderId,
            item.name,
            item.quantity,
            parseFloat(item.price.replace(/[^\d.]/g, '')),
            item.frequency || "One off",
            item.image
        ]);

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
                payment_capture
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
            WHERE o.user_id = ? AND oi.frequency != 'Once only' AND oi.frequency != 'One off'
            ORDER BY o.created_at DESC
        `;

        const [items] = await db.query(query, [userId]);

        // Deduplicate: If I ordered Carrots (Every week) last week, and Carrots (Every week) this week,
        // likely the "subscription" is just the latest one.
        const activeSubscriptions = {};
        items.forEach(item => {
            if (!activeSubscriptions[item.product_name]) { // Take latest because sorted DESC
                activeSubscriptions[item.product_name] = item;
            }
        });

        const events = [];
        const today = new Date();
        const futureLimit = new Date();
        futureLimit.setDate(today.getDate() + 60); // Show next 60 days

        Object.values(activeSubscriptions).forEach(sub => {
            let nextDate = new Date(sub.order_created_at); // Start from last order
            const freqMap = {
                "Every week": 7,
                "Every 2 weeks": 14,
                "Every 3 weeks": 21,
                "Every 4 weeks": 28
            };
            const daysToAdd = freqMap[sub.frequency];

            if (daysToAdd) {
                // Project dates until limit
                while (nextDate < futureLimit) {
                    nextDate.setDate(nextDate.getDate() + daysToAdd);
                    if (nextDate >= today) {
                        events.push({
                            date: nextDate.toISOString().split('T')[0], // YYYY-MM-DD
                            product: sub.product_name,
                            image: sub.image_url,
                            frequency: sub.frequency
                        });
                    }
                }
            }
        });

        // Add "One off" deliveries that are literally in the future based on order date
        // Simple logic: if delivery_date string contains a date that is in future... 
        // Parsing "Wednesday 12th Dec" is hard without year.
        // For MVP, filter based on created_at within last 7 days + frequency='One off' ?
        // Let's stick to recurring for the "Calendar" feature as requested ("products user receives for every week").

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(events);

    } catch (error) {
        console.error("Calendar Error:", error);
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
                console.log(`Payment captured: ${payment.id} for Order: ${payment.order_id}`);

                // Extract local order ID from receipt if standard format used, 
                // or search DB for razorpay_order_id if we saved it.
                // Assuming description might contain "Order #123" or similar is not robust.
                // Use razorpay_order_id from payload (payment.order_id) to update DB.

                // Example query (if we had razorpay_order_id in orders table):
                // await db.query("UPDATE orders SET status = 'Paid' WHERE razorpay_order_id = ?", [payment.order_id]);

                // For now, since schema doesn't have razorpay_order_id, we just log it.
                // If you want auto-status update, we need to add razorpay_order_id column to orders table.
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
