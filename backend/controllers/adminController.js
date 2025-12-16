import db from "../config/db.js";
import redisClient from "../config/redis.js";

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
        const { pincode, deliveryDay } = req.body;
        if (!pincode || !deliveryDay) {
            return res.status(400).json({ message: "Pincode and Delivery Day are required" });
        }

        // Check duplicate
        const [existing] = await db.query("SELECT * FROM pincodes WHERE pincode = ?", [pincode]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Pincode already exists" });
        }

        await db.query("INSERT INTO pincodes (pincode, delivery_day) VALUES (?, ?)", [pincode, deliveryDay]);
        res.status(201).json({ message: "Pincode added successfully" });
    } catch (error) {
        console.error("Add Pincode Error:", error);
        res.status(500).json({ error: "Server Error" });
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
            SELECT p.*, c.name as category_name
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

        await connection.commit();
        await redisClient.del('products_all'); // Clear Admin Cache
        await redisClient.del('products_public'); // Clear Public Cache
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

        await connection.commit();
        await redisClient.del('products_all'); // Clear Admin Cache
        await redisClient.del('products_public'); // Clear Public Cache
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

        const events = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const futureLimit = new Date();
        futureLimit.setDate(today.getDate() + 28); // Next 4 weeks

        items.forEach(item => {
            // Determine Start Date (Prefer delivery_date, fallback to created_at)
            let startDate = new Date(item.order_created_at);
            if (item.delivery_date && !isNaN(new Date(item.delivery_date).getTime())) {
                // If delivery_date is a valid date string (YYYY-MM-DD or similar)
                // Note: user input might be textual "Wednesday". Frontend sends specific dates mostly now? 
                // If it is just "Wednesday", new Date("Wednesday") is invalid.
                // Let's try to parse.
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

            if (daysToAdd) {
                // Recurring Logic
                while (nextDate <= futureLimit) {
                    if (nextDate >= today) {
                        events.push({
                            date: nextDate.toISOString().split('T')[0],
                            user_name: item.user_name,
                            address: item.delivery_address,
                            user_phone: item.user_phone,
                            product: item.product_name,
                            quantity: item.quantity,
                            price: item.price,
                            image: item.image_url,
                            frequency: item.frequency,
                            notes: item.delivery_notes,
                            order_id: item.order_id
                        });
                    }
                    nextDate.setDate(nextDate.getDate() + daysToAdd);
                }
            } else {
                // One-off Logic
                // If it's one-off, it happens ON the start date.
                // We show it if it is within [today, futureLimit] OR if it is today.
                // Actually, if a user selected a specific date, we show it on that date.

                if (nextDate >= today && nextDate <= futureLimit) {
                    events.push({
                        date: nextDate.toISOString().split('T')[0],
                        user_name: item.user_name,
                        address: item.delivery_address,
                        user_phone: item.user_phone,
                        product: item.product_name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image_url,
                        frequency: "One-Time",
                        notes: item.delivery_notes,
                        order_id: item.order_id
                    });
                }
            }
        });

        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(events);
    } catch (error) {
        console.error("Get Deliveries Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
