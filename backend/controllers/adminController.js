import db from "../config/db.js";
import redisClient from "../config/redis.js";
import nodemailer from "nodemailer";

// GET STATS
export const getStats = async (req, res) => {
    try {
        const cachedStats = await redisClient.get('admin_stats');
        if (cachedStats) {
            return res.json(JSON.parse(cachedStats));
        }

        const [orders] = await db.query("SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders WHERE status != 'pending'");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users");

        const totalSales = orders[0].revenue || 0;
        const totalOrders = orders[0].count || 0;
        const totalUsers = users[0].count || 0;

        const statsData = { totalOrders, totalUsers, totalSales: parseFloat(totalSales) };

        await redisClient.setEx('admin_stats', 300, JSON.stringify(statsData)); // Cache for 5 mins

        res.json(statsData);
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET ALL ORDERS (Admin) - Only Paid/Processed
export const getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.status != 'pending'
            ORDER BY o.created_at DESC
        `;
        const [orders] = await db.query(query);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Orders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET SINGLE ORDER (Admin)
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        `;
        const [orders] = await db.query(query, [id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(orders[0]);
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET ORDER ITEMS (Admin)
export const getOrderItems = async (req, res) => {
    try {
        const { id } = req.params;
        const [items] = await db.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
        res.json(items);
    } catch (error) {
        console.error("Order Items Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Order updated successfully" });
    } catch (error) {
        console.error("Update Order Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC");
        res.json(users);
    } catch (error) {
        console.error("Users Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// --- PINCODE MANAGEMENT ---

// GET ALL PINCODES
export const getAllPincodes = async (req, res) => {
    try {
        const [pincodes] = await db.query("SELECT * FROM pincodes ORDER BY created_at DESC");
        res.json(pincodes);
    } catch (error) {
        console.error("Get Pincodes Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// ADD PINCODE
export const addPincode = async (req, res) => {
    try {
        const { pincode, deliveryDay, minOrderValue } = req.body; // Added minOrderValue
        if (!pincode || !deliveryDay) {
            return res.status(400).json({ message: "Pincode and Delivery Day are required" });
        }

        // Check duplicate
        const [existing] = await db.query("SELECT * FROM pincodes WHERE pincode = ?", [pincode]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Pincode already exists" });
        }

        await db.query(
            "INSERT INTO pincodes (pincode, delivery_day, min_order_value) VALUES (?, ?, ?)",
            [pincode, deliveryDay, minOrderValue || 0]
        );
        res.status(201).json({ message: "Pincode added successfully" });
    } catch (error) {
        console.error("Add Pincode Error:", error);
        res.status(500).json({ error: "Server Error", details: error.message, sql: error.sqlMessage });
    }
};

// DELETE PINCODE
export const deletePincode = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM pincodes WHERE id = ?", [id]);
        res.json({ message: "Pincode deleted successfully" });
    } catch (error) {
        console.error("Delete Pincode Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// --- COUPON MANAGEMENT ---

// GET ALL COUPONS
export const getAllCoupons = async (req, res) => {
    try {
        const [coupons] = await db.query("SELECT * FROM coupons ORDER BY created_at DESC");
        res.json(coupons);
    } catch (error) {
        console.error("Get Coupons Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// ADD COUPON
export const addCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_amount, description, expiry_date, usage_limit, minimum_amount } = req.body;

        if (!code || !discount_amount) {
            return res.status(400).json({ message: "Code and Discount Amount are required" });
        }

        // Check duplicate
        const [existing] = await db.query("SELECT * FROM coupons WHERE code = ?", [code]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const query = `
            INSERT INTO coupons (code, discount_type, discount_amount, description, expiry_date, usage_limit, minimum_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [code, discount_type || 'flat', discount_amount, description, expiry_date, usage_limit, minimum_amount || 0];

        await db.query(query, values);
        res.status(201).json({ message: "Coupon added successfully" });
    } catch (error) {
        console.error("Add Coupon Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// DELETE COUPON
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM coupons WHERE id = ?", [id]);
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Delete Coupon Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// --- CATEGORY MANAGEMENT ---

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM categories ORDER BY created_at DESC");
        res.json(categories);
    } catch (error) {
        console.error("Get Categories Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// ADD CATEGORY
export const addCategory = async (req, res) => {
    try {
        let { name, image_url } = req.body;

        if (req.file) {
            image_url = "/uploads/" + req.file.filename;
        }

        if (!name) return res.status(400).json({ message: "Category name is required" });

        const [existing] = await db.query("SELECT * FROM categories WHERE name = ?", [name]);
        if (existing.length > 0) return res.status(400).json({ message: "Category already exists" });

        await db.query("INSERT INTO categories (name, image_url) VALUES (?, ?)", [name, image_url || ""]);
        await redisClient.del('categories_public'); // Clear Public Cache
        res.status(201).json({ message: "Category added successfully" });
    } catch (error) {
        console.error("Add Category Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM categories WHERE id = ?", [id]);
        await redisClient.del('categories_public'); // Clear Public Cache
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete Category Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {
        const cachedProducts = await redisClient.get('products_all');
        if (cachedProducts) {
            return res.json(JSON.parse(cachedProducts));
        }

        const query = `
            SELECT p.*, c.name as category_name,
                   (SELECT JSON_ARRAYAGG(t.name) 
                    FROM product_tags pt 
                    JOIN tags t ON pt.tag_id = t.id 
                    WHERE pt.product_id = p.id) as tags,
                   (SELECT JSON_ARRAYAGG(pt.tag_id)
                    FROM product_tags pt
                    WHERE pt.product_id = p.id) as tag_ids
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `;
        const [products] = await db.query(query);

        await redisClient.setEx('products_all', 3600, JSON.stringify(products)); // Cache for 1 hour

        res.json(products);
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// ADD PRODUCT
export const addProduct = async (req, res) => {
    console.log("Adding Product Body:", req.body); // DEBUG LOG
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        let { category_id, name, weight, price, location, stock } = req.body;

        // Handle Image Upload
        let image_url = req.body.image_url || ""; // Default or from body
        if (req.file) {
            image_url = "/uploads/" + req.file.filename;
        }

        if (!category_id || !name || !price) {
            return res.status(400).json({ message: "Category, Name, and Price are required" });
        }

        const [result] = await connection.query(
            "INSERT INTO products (category_id, name, weight, price, location, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [category_id, name, weight, price, location, image_url, stock || 0]
        );

        const productId = result.insertId;

        // Add Tags
        let tagIds = req.body.tag_ids;
        console.log(`[DEBUG] Adding Tags for Product ${productId}:`, tagIds);

        if (tagIds) {
            // Ensure array
            if (!Array.isArray(tagIds)) {
                try {
                    const parsed = JSON.parse(tagIds);
                    if (Array.isArray(parsed)) {
                        tagIds = parsed;
                    } else {
                        // Single value (number/string)
                        tagIds = [parsed];
                    }
                } catch (e) {
                    // Not JSON, treat as single string value
                    tagIds = [tagIds];
                }
            }

            // Ensure numbers
            tagIds = tagIds.map(t => parseInt(t)).filter(t => !isNaN(t));

            if (tagIds.length > 0) {
                const tagValues = tagIds.map(tagId => [productId, tagId]);
                await connection.query("INSERT INTO product_tags (product_id, tag_id) VALUES ?", [tagValues]);
            }
        }

        await connection.commit();
        try {
            await redisClient.del('products_all'); // Clear Admin Cache
            await redisClient.del('products_public'); // Clear Public Cache
        } catch (redisErr) {
            console.error("[WARN] Redis Clear Failed:", redisErr);
        }

        res.status(201).json({ message: "Product added successfully", productId });
    } catch (error) {
        await connection.rollback();
        console.error("Add Product Error:", error);
        res.status(500).json({ error: "Server Error" });
    } finally {
        connection.release();
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    const { id } = req.params;

    let { category_id, name, weight, price, location, stock, image_url } = req.body;

    // Handle Image Upload
    if (req.file) {
        image_url = "/uploads/" + req.file.filename;
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const query = `
        UPDATE products 
        SET category_id=?, name=?, weight=?, price=?, location=?, stock=?, image_url=?
        WHERE id=?
    `;
        await connection.query(query, [category_id, name, weight, price, location, stock, image_url, id]);

        // Update Tags (Delete and Re-insert)
        await connection.query("DELETE FROM product_tags WHERE product_id = ?", [id]);

        let tagIds = req.body.tag_ids;

        if (tagIds) {
            // Ensure array
            if (!Array.isArray(tagIds)) {
                try {
                    const parsed = JSON.parse(tagIds);
                    if (Array.isArray(parsed)) {
                        tagIds = parsed;
                    } else {
                        tagIds = [parsed];
                    }
                } catch (e) {
                    tagIds = [tagIds];
                }
            }

            // Ensure numbers
            tagIds = tagIds.map(t => parseInt(t)).filter(t => !isNaN(t));

            if (tagIds.length > 0) {
                const tagValues = tagIds.map(tagId => [id, tagId]);
                await connection.query("INSERT INTO product_tags (product_id, tag_id) VALUES ?", [tagValues]);
            }
        }

        await connection.commit();
        try {
            await redisClient.del('products_all'); // Clear Admin Cache
            await redisClient.del('products_public'); // Clear Public Cache
        } catch (redisErr) {
            console.error("[WARN] Redis Clear Failed:", redisErr);
        }

        res.json({ message: "Product updated successfully" });
    } catch (error) {
        await connection.rollback();
        console.error("Update Product Error:", error);
        res.status(500).json({ error: "Server Error" });
    } finally {
        connection.release();
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM products WHERE id = ?", [id]);
        await redisClient.del('products_all'); // Clear Admin Cache
        await redisClient.del('products_public'); // Clear Public Cache
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET DELIVERY SCHEDULE (Next 4 weeks)
export const getDeliveries = async (req, res) => {
    try {
        // Fetch all active order items
        const query = `
            SELECT oi.*, o.id as order_id, o.user_id, o.delivery_address, o.delivery_notes, o.created_at as order_created_at, o.delivery_date,
                   u.name as user_name, u.phone as user_phone
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN users u ON o.user_id = u.id
            WHERE o.status != 'pending'
            ORDER BY o.created_at DESC
        `;
        const [items] = await db.query(query);

        // Fetch Skipped Deliveries to filter out
        const [skipped] = await db.query("SELECT user_id, skip_date FROM skipped_deliveries");
        const skippedSet = new Set(skipped.map(s => {
            // Create a unique key: "userId_YYYY-MM-DD"
            const d = new Date(s.skip_date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${s.user_id}_${year}-${month}-${day}`;
        }));

        const events = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const futureLimit = new Date();
        futureLimit.setDate(today.getDate() + 28); // Next 4 weeks

        items.forEach(item => {
            // Determine Start Date (Prefer delivery_date, fallback to created_at)
            let startDate = new Date(item.order_created_at);
            if (item.delivery_date && !isNaN(new Date(item.delivery_date).getTime())) {
                const possibleDate = new Date(item.delivery_date);
                if (!isNaN(possibleDate.getTime())) {
                    startDate = possibleDate;
                }
            }

            let nextDate = new Date(startDate);
            const freqMap = {
                "Every week": 7,
                "Every 2 weeks": 14,
                "Every 3 weeks": 21,
                "Every 4 weeks": 28
            };

            const daysToAdd = freqMap[item.frequency];

            const addEventIfNotSkipped = (dateObj) => {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;
                const key = `${item.user_id}_${dateStr}`;

                if (!skippedSet.has(key)) {
                    events.push({
                        date: dateStr,
                        user_name: item.user_name,
                        address: item.delivery_address,
                        user_phone: item.user_phone,
                        product: item.product_name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image_url,
                        frequency: item.frequency || "One-Time",
                        notes: item.delivery_notes,
                        order_id: item.order_id
                    });
                }
            };

            if (daysToAdd) {
                // Recurring Logic
                while (nextDate <= futureLimit) {
                    if (nextDate >= today) {
                        addEventIfNotSkipped(nextDate);
                    }
                    nextDate.setDate(nextDate.getDate() + daysToAdd);
                }
            } else {
                // One-off Logic
                if (nextDate >= today && nextDate <= futureLimit) {
                    addEventIfNotSkipped(nextDate);
                }
            }
        });

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(events);
    } catch (error) {
        console.error("Get Deliveries Error:", error);
        res.status(500).json({ error: "Server Error", details: error.message, sql: error.sqlMessage });
    }
};

// GET PAUSED DELIVERIES
export const getPausedDeliveries = async (req, res) => {
    try {
        const query = `
            SELECT sd.id, sd.skip_date, sd.created_at, u.name as user_name, u.email as user_email, u.phone as user_phone
            FROM skipped_deliveries sd
            JOIN users u ON sd.user_id = u.id
            ORDER BY sd.skip_date ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Paused Deliveries Error:", error);
        res.status(500).json({ error: "Server Error", details: error.message, sql: error.sqlMessage });
    }
};

// GET ALL TAGS
export const getAllTags = async (req, res) => {
    try {
        const [tags] = await db.query("SELECT * FROM tags ORDER BY name ASC");
        res.json(tags);
    } catch (error) {
        console.error("Get Tags Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET DELIVERY LOGS
export const getDeliveryLogs = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM delivery_logs WHERE order_id = ?", [id]);
        res.json(rows);
    } catch (error) {
        console.error("Delivery Logs Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// NOTIFY DELIVERY (Admin Action)
export const notifyDelivery = async (req, res) => {
    try {
        const orderId = req.params.id; // Using :id from route
        const { delivery_date } = req.body;

        if (!orderId || !delivery_date) {
            return res.status(400).json({ message: "Missing Order ID or Delivery Date" });
        }

        // 1. Fetch User Info
        const [rows] = await db.query(
            "SELECT u.name, u.email, u.phone FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?",
            [orderId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Order/User not found" });
        }

        const user = rows[0];

        // 2. Send Email
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Order Delivery Update - ${delivery_date}`,
                text: `
                    Hi ${user.name},
                    
                    Your order is scheduled for delivery on ${delivery_date}.
                    Our delivery agent will reach you shortly.
                    
                    Thank you for choosing Farmlet!
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Delivery Notification Email sent to ${user.email}`);

            // Insert into delivery_logs
            await db.query(
                "INSERT INTO delivery_logs (order_id, delivery_date) VALUES (?, ?)",
                [orderId, delivery_date]
            );

        } catch (emailErr) {
            console.error("Failed to send Delivery Email:", emailErr);
        }

        // 3. Send SMS (Mock)
        console.log(`[SMS MOCK] Sending SMS to ${user.phone}: "Your Farmlet order is arriving on ${delivery_date}"`);

        res.json({ message: "Notification sent successfully" });

    } catch (error) {
        console.error("Notify Delivery Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
