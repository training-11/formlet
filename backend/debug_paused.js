import db from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
    try {
        console.log("Checking users table for roles...");
        const [users] = await db.query("SELECT id, name, email, role FROM users");
        console.log("Users:", JSON.stringify(users, null, 2));

        const adminUsers = users.filter(u => u.role === 'admin');
        console.log("Admin Users Count:", adminUsers.length);

        if (adminUsers.length === 0) {
            console.error("WARNING: No admin user found!");
        } else {
            console.log("Admin Users:", JSON.stringify(adminUsers, null, 2));
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
};

run();
