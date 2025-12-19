import db from './config/db.js';

const migrate = async () => {
    try {
        console.log("Adding min_order_value to pincodes table...");
        await db.query(`
            ALTER TABLE pincodes 
            ADD COLUMN min_order_value DECIMAL(10,2) DEFAULT 0.00;
        `);
        console.log("Migration successful!");
        process.exit();
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Column already exists. Skipping.");
            process.exit();
        } else {
            console.error("Migration failed:", error);
            process.exit(1);
        }
    }
};

migrate();
