import db from '../config/db.js';
import redisClient from "../config/redis.js";

// GET ALL CATEGORIES (Public)
export const getPublicCategories = async (req, res) => {
    try {
        const cachedCats = await redisClient.get('categories_public');
        if (cachedCats) return res.json(JSON.parse(cachedCats));

        const [categories] = await db.query("SELECT * FROM categories ORDER BY id ASC");

        await redisClient.setEx('categories_public', 3600, JSON.stringify(categories));
        res.json(categories);
    } catch (error) {
        console.error("Public Categories Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// GET ALL PRODUCTS (Public)
export const getPublicProducts = async (req, res) => {
    try {
        const cachedProds = await redisClient.get('products_public');
        if (cachedProds) return res.json(JSON.parse(cachedProds));

        // We join with categories to help frontend grouping if needed, 
        // but simple select is enough if we transform in frontend.
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.category_id ASC, p.id ASC
        `;
        const [products] = await db.query(query);

        await redisClient.setEx('products_public', 3600, JSON.stringify(products));
        res.json(products);
    } catch (error) {
        console.error("Public Products Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
