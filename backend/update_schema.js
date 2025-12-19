import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const updateSchema = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Connected to MySQL...");

        // Create Categories Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("Categories table checked/created.");

        // Create Products Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                weight VARCHAR(100),
                price DECIMAL(10, 2) NOT NULL,
                location VARCHAR(255),
                image_url TEXT,
                stock INT DEFAULT 0,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("Products table checked/created.");

        // Create Tags Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tags table checked/created.");

        // Create Product_Tags Junction Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_tags (
                product_id INT NOT NULL,
                tag_id INT NOT NULL,
                PRIMARY KEY (product_id, tag_id),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            )
        `);
        console.log("Product Tags table checked/created.");

        // Create Skipped Deliveries Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS skipped_deliveries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                skip_date DATE NOT NULL,
                reason VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_date (user_id, skip_date)
            )
        `);
        console.log("Skipped Deliveries table checked/created.");

        // Check/Add 'pincode' column to 'users' table
        try {
            // Check if column exists
            const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'pincode'");
            if (columns.length === 0) {
                console.log("Adding 'pincode' column to 'users' table...");
                await connection.query("ALTER TABLE users ADD COLUMN pincode VARCHAR(10) AFTER address");
                console.log("'pincode' column added.");
            } else {
                console.log("'pincode' column already exists in 'users' table.");
            }
        } catch (err) {
            console.error("Error checking/adding pincode column:", err.message);
        }

        await connection.end();
        console.log("Schema update complete.");
        process.exit(0);

    } catch (error) {
        console.error("Update error:", error);
        process.exit(1);
    }
};

updateSchema();
