import db from "./config/db.js";

const pincodes = [
    { code: "500001", day: "Monday" }, // Hyderabad GPO
    { code: "500002", day: "Tuesday" },
    { code: "500003", day: "Wednesday" }, // Secunderabad
    { code: "500004", day: "Thursday" },
    { code: "500008", day: "Friday" }, // Mehdipatnam
    { code: "500016", day: "Saturday" }, // Begumpet
    { code: "500018", day: "Monday" }, // Sanath Nagar
    { code: "500032", day: "Tuesday" }, // Gachibowli
    { code: "500033", day: "Wednesday" }, // Jubilee Hills
    { code: "500034", day: "Thursday" }, // Banjara Hills
    { code: "500081", day: "Friday" }, // Hitech City
    { code: "500084", day: "Saturday" }, // Miyapur
    { code: "500085", day: "Monday" }, // Kukatpally
    { code: "500019", day: "Tuesday" },
    { code: "500050", day: "Wednesday" }, // Chandanagar
    { code: "500060", day: "Thursday" },
    { code: "500072", day: "Friday" },
    { code: "500073", day: "Saturday" },
];

const seedPincodes = async () => {
    try {
        console.log("Seeding Hyderabad pincodes...");

        // Create query
        const sql = "INSERT IGNORE INTO pincodes (pincode, delivery_day) VALUES ?";
        const values = pincodes.map(p => [p.code, p.day]);

        const [result] = await db.query(sql, [values]);

        console.log(`Seeded ${result.affectedRows} pincodes.`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedPincodes();
