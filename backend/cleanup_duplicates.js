
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const cleanup = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Connected to DB for cleanup...");

        // Query to delete duplicates, keeping the one with the lowest ID
        const query = `
            DELETE t1 FROM products t1
            INNER JOIN products t2 
            WHERE t1.id > t2.id AND t1.name = t2.name
        `;


        const [result] = await connection.query(query);
        console.log(`Deleted ${result.affectedRows} duplicate products.`);

        // Clear Redis Cache
        const redis = await import('./config/redis.js');
        const redisClient = redis.default;

        try {
            await redisClient.del('products_public');
            await redisClient.del('categories_public');
            console.log("Redis Cache Cleared.");
        } catch (err) {
            console.error("Error clearing Redis cache:", err);
        } finally {
            if (redisClient) await redisClient.quit();
        }

        process.exit(0);

    } catch (error) {
        console.error("Cleanup Error:", error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

cleanup();
