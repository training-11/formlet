import db from "../config/db.js";

// GET STATS
export const getStats = async (req, res) => {
    try {
        const [orders] = await db.query("SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users");

        const totalSales = orders[0].revenue || 0;
        const totalOrders = orders[0].count || 0;
        const totalUsers = users[0].count || 0;

        res.json({ totalOrders, totalUsers, totalSales: parseFloat(totalSales) });
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
