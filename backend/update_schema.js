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

        await connection.end();
        console.log("Schema update complete.");
        process.exit(0);

    } catch (error) {
        console.error("Update error:", error);
        process.exit(1);
    }
};

updateSchema();
