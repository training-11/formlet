import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const updateDatabase = async () => {
    console.log(`Connecting to database at ${process.env.DB_HOST}...`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Connected successfully.");

        // 1. Add missing tables if they don't exist
        const tableQueries = [
            `CREATE TABLE IF NOT EXISTS tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS product_tags (
                product_id INT NOT NULL,
                tag_id INT NOT NULL,
                PRIMARY KEY (product_id, tag_id),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS skipped_deliveries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                skip_date DATE NOT NULL,
                reason VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_date (user_id, skip_date)
            )`,
            `CREATE TABLE IF NOT EXISTS delivery_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                delivery_date DATE,
                status VARCHAR(50) DEFAULT 'delivered',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )`
        ];

        for (const query of tableQueries) {
            await connection.query(query);
            console.log("Executed table creation query.");
        }

        // 2. Add 'min_order_value' column to 'pincodes' table if it doesn't exist
        try {
            await connection.query(`ALTER TABLE pincodes ADD COLUMN min_order_value DECIMAL(10, 2) DEFAULT 0.00`);
            console.log("Added min_order_value column to pincodes table.");
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log("Column min_order_value already exists in pincodes table.");
            } else {
                console.error("Error adding column to pincodes:", error);
            }
        }

        console.log("Update finished. You can now delete this script.");
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error("Connection failed or error occurred:", error);
        process.exit(1);
    }
};

updateDatabase();
