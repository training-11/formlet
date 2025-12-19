import db from "../config/db.js";

// Check Pincode
export const checkPincode = async (req, res) => {
    try {
        const { pincode } = req.body;

        if (!pincode) {
            return res.status(400).json({ message: "Pincode is required." });
        }

        const [rows] = await db.query(
            "SELECT * FROM pincodes WHERE pincode = ?",
            [pincode]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Sorry, we don't deliver to this area yet.",
                available: false
            });
        }

        // Return delivery day if found
        const { delivery_day, min_order_value } = rows[0]; // Destructure min_order_value
        res.status(200).json({
            available: true,
            pincode,
            deliveryDay: delivery_day,
            minOrderValue: min_order_value, // Return to frontend
            message: `Great! We deliver to ${pincode} on ${delivery_day}s.`
        });

    } catch (error) {
        console.error("Check pincode error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
