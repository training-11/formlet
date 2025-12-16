import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setup = async () => {
    try {
        // 1. Connect without database to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log("Connected to MySQL...");

        // 2. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created or exists.`);

        // 3. Use Database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // 4. Read SQL file
        const sqlPath = path.join(__dirname, 'db.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // 5. Execute statements (split by ;)
        // Simple split by ';' usually works for simple schemas, but might break on complex stored procs
        // For this schema it is fine.
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            // Skip USE command if present since we already selected it, or just run it.
            await connection.query(statement);
        }

        console.log("Schema applied successfully.");
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error("Setup error:", error);
        process.exit(1);
    }
};

setup();
