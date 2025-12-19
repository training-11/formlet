import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function removeTags() {
    try {
        const connection = await db.getConnection();

        console.log("Dropping product_tags table...");
        await connection.query("DROP TABLE IF EXISTS product_tags");

        console.log("Dropping tags table...");
        await connection.query("DROP TABLE IF EXISTS tags");

        console.log("Tags tables removed successfully.");
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("Error removing tags:", error);
        process.exit(1);
    }
}

removeTags();
