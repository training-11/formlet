
import db from "./config/db.js";

const createVerificationTable = async () => {
    try {
        console.log("Creating phone_verifications table...");
        const sql = `
            CREATE TABLE IF NOT EXISTS phone_verifications (
                phone VARCHAR(20) PRIMARY KEY,
                otp VARCHAR(10) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.query(sql);
        console.log("Table phone_verifications created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating table:", error);
        process.exit(1);
    }
};

createVerificationTable();
