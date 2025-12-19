
import mysql from 'mysql2/promise';
import redisClient from './config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const allProducts = {
    "Fresh Fruits": [
        { name: "Sweet Lime", weight: "1000 Gms", price: 89.00, location: "From Vandavasi, Tamilnadu", image: "fruit1.png" },
        { name: "Sapota / Chiku", weight: "500 Gms", price: 79.00, location: "From Mysuru, Karnataka", image: "fruit3.jpg" },
        { name: "Nagpur Orange (500–600g)", weight: "500 Gms", price: 89.00, location: "From Nagpur, Maharashtra", image: "fruit2.jpg" },
        { name: "Nagpur Orange (1000–1200g)", weight: "500 Gms", price: 109.00, location: "From Nagpur, Maharashtra", image: "fruit2.jpg" },
        { name: "Red Lady Papaya - Medium (1000g - 1200g) (Seedless)", weight: "1000 Gms", price: 109.00, location: "From Kadapa, Andhra Pradesh", image: "fruit4.jpg" },
        { name: "Red Lady Papaya - Medium (600g - 800g) (Seedless)", weight: "700 Gms", price: 89.00, location: "From Kadapa, Andhra Pradesh", image: "fruit4.jpg" },
        { name: "Watermelon Kiran", weight: "2000 Gms", price: 189.00, location: "From Denkanikottai, Tamilnadu", image: "fruit5.png" },
        { name: "Banana Elakki", weight: "1000 Gms", price: 129.00, location: "From Denkanikottai, Tamilnadu", image: "fruit6.jpg" },
    ],
    "Fresh Vegetables": [
        { name: "Chilli Green", weight: "100 Gms", price: 9.00, location: "From DenkaniKottai", image: "veg1.png" },
        { name: "Knol Khol Green", weight: "250 Gms", price: 49.00, location: "From DenkaniKottai", image: "veg2.png" },
        { name: "Bottle Gourd", weight: "600 Gms", price: 65.00, location: "From Vandavasi", image: "veg3.png" },
        { name: "Chow Chow", weight: "250 Gms", price: 27.00, location: "From Nilgiris", image: "veg4.png" },
        { name: "Yellow Pumpkin", weight: "500 Gms", price: 89.00, location: "From Vandavasi, Tamilnadu", image: "veg5.jpg" },
        { name: "Cabbage", weight: "600 Gms", price: 65.00, location: "From Denkanikottai, Tamilnadu", image: "veg6.png" },
        { name: "Long Beans / Yard Beans", weight: "250 Gms", price: 59.00, location: "From Vandavasi, Tamilnadu", image: "veg7.png" },
        { name: "LYam", weight: "500 Gms", price: 65.00, location: "From Harur", image: "veg8.jpg" },
    ],
    "Leafy and Seasonings": [
        { name: "Mint Leaves", weight: "100 Gms", price: 15.00, location: "From Ooty", image: "leafy1.png" },
        { name: "Coriander Leaves", weight: "100 Gms", price: 12.00, location: "From Nilgiris", image: "leafy2.jpg" },
        { name: "Coriander Leaves (Large)", weight: "100 Gms", price: 18.00, location: "From DenkaniKottai", image: "leafy5.jpg" },
        { name: "Dhantu Green", weight: "250 Gms", price: 40.00, location: "From DenkaniKottai", image: "leafy4.png" },
        { name: "Agathi Leaves", weight: "250 Gms", price: 35.00, location: "From Denkanikottai, Tamilnadu", image: "leafy3.jpg" }
    ],
    "Other Vegetables": [
        { name: "Tomato", weight: "500 Gms", price: 25.00, location: "From Hosur", image: "veg2.png" },
        { name: "Lemon (8pcs - 11pcs)", weight: "250 Gms", price: 57.00, location: "From Kadapa", image: "otherveg1.jpg" },
        { name: "Red Capsicum", weight: "300 Gms", price: 79.00, location: "From Denkanikottai, Tamilnadu", image: "otherveg2.jpg" },
        { name: "Sambar Onion", weight: "500 Gms", price: 65.00, location: "From Harur", image: "otherveg3.jpg" },
        { name: "Brown Channa Sprouts", weight: "200 Gms", price: 65.00, location: "From Bengaluru, Karnataka", image: "otherveg4.jpeg" },
        { name: "Diced Yam", weight: "250 Gms", price: 95.00, location: "From Bengaluru, Karnataka", image: "otherveg5.jpeg" },
        { name: "Ginger", weight: "100 Gms", price: 23.00, location: "From DenkaniKottai", image: "otherveg6.png" },
        { name: "Green Beans Cut", weight: "200 Gms", price: 95.00, location: "From Bengaluru, Karnataka", image: "otherveg7.png" },
        { name: "Ooty Potato", weight: "500 Gms", price: 80.00, location: "From Nilgiris, Tamilnadu", image: "otherveg8.png" }
    ],
    "Snacks & Coffee": [
        { name: "Pure Blended Filter Coffee Powder", weight: "100 Gms", price: 135.00, image: "sna1.jpg" }
    ],
    "Dals & Rice": [
        { name: "Unpolished Toor Dal", weight: "500 Gms", price: 189.00, location: "From Bijapur, Karnataka", image: "dals1.png" },
        { name: "White Urad Dal Whole", weight: "500 Gms", price: 149.00, location: "From Thoothukudi, Tamilnadu", image: "dals2.png" },
        { name: "Green Moong Dal Whole", weight: "500 Gms", price: 180.00, location: "From Bijapur, Karnataka", image: "dals3.png" },
        { name: "Masoor Dal", weight: "500 Gms", price: 145.00, location: "From Nasik, Maharastra", image: "dals4.png" },
        { name: "Sona Masoori Raw White Rice", weight: "1000 Gms", price: 179.00, location: "From Bellary, Karnataka", image: "dals5.png" },
        { name: "Ponni Raw Rice", weight: "1000 Gms", price: 189.00, location: "From Harur, Tamilnadu", image: "dals6.png" },
        { name: "Rajamudi Rice", weight: "1000 Gms", price: 159.00, location: "From Hassan, Karnataka", image: "dals7.png" },
        { name: "Red Rice - Rakthashali", weight: "1000 Gms", price: 229.00, location: "From Bellary, Karnataka", image: "dals8.png" },
        { name: "Thooyamalli Boiled Rice (Jasmine Rice)", weight: "1000 Gms", price: 199.00, location: "From Harur, Tamilnadu", image: "dals9.png" },
    ],
    "Dehydrated": [
        { name: "Ginger Powder", weight: "50 Gms", price: 189.00, location: "From Harohalli, Karnataka", image: "deh1.jpg" }
    ],
    "Grains and millets": [
        { name: "Kodo Millet Semi polished (Harka, Varagu)", weight: "500 Gms", price: 149.00, location: "From Kanakapura, Karnataka", image: "gra1.jpg" },
        { name: "Little Millet Semi Polished", weight: "500 Gms", price: 169.00, location: "From Kanakapura, Karnataka", image: "gra2.jpg" }
    ],
    "Dairy & eggs": [
        { name: "Akshayakalpa Organic Country Eggs (Pack of 6)", weight: "6 pcs", price: 150.00, image: "dai1.jpg" },
        { name: "Akshayakalpa Organic Slim Milk", weight: "1000 ML", price: 135.00, image: "dai2.jpg" },
        { name: "Akshayakalpa Organic Cow Milk", weight: "1000 ML", price: 126.00, image: "dai3.jpg" },
        { name: "Akshayakalpa Organic Artisan Cheese Slices", weight: "100 Gms", price: 114.00, image: "dai4.png" },
        { name: "Akshayakalpa Organic Probiotic Curd", weight: "500 Gms", price: 55.00, image: "dai5.jpg" },
        { name: "Akshayakalpa Organic Country Eggs (Pack of 6) x2", weight: "6 pcs", price: 150.00, image: "dairy.png" },
        { name: "Akshayakalpa-Artisanal Organic Set Curd", weight: "200 Gms", price: 40.00, image: "dai6.jpg" },
        { name: "Akshayakalpa-Organic Cooking Butter Un-salted", weight: "200 Gms", price: 217.00, image: "dai7.jpg" },
        { name: "Akshayakalpa - Organic Cheddar Plain Young/Mild", weight: "200 Gms", price: 329.00, image: "dai8.jpg" },
        { name: "Eggs (Free Range)", weight: "12 pcs", price: 289.00, image: "dai9.jpg" }
    ],
    "Natural Sweeteners": [
        { name: "Khandsari Sugar", weight: "500 Gms", price: 110.00, location: "From Bengaluru, Karnataka", image: "ns1.png" },
        { name: "Multi Floral Raw Honey", weight: "250 Gms", price: 249.00, location: "From Puttur, Karnataka", image: "ns2.png" },
        { name: "Wild Forest Honey", weight: "250 Gms", price: 239.00, location: "From Palamu & Lathehar", image: "ns3.png" },
        { name: "Bucket Jaggery", weight: "1000 Gms", price: 149.00, location: "From Managulli, Karnataka", image: "ns4.png" },
        { name: "Palm Jaggery", weight: "500 Gms", price: 269.00, location: "From Harur, Tamilnadu", image: "ns5.png" },
        { name: "Akshayakalpa Organic Multifloral Raw Honey", weight: "250 Gms", price: 200.00, location: "From Bengaluru, Karnataka", image: "ns6.jpeg" },
        { name: "Jaggery Powder", weight: "500 Gms", price: 119.00, location: "From Sitling, Tamilnadu", image: "ns7.png" }
    ],
    "Ready to Cook": [
        { name: "Jumbo Rolled oats", weight: "500 Gms", price: 149.00, location: "From Mumbai, MH", image: "rc1.jpg" },
        { name: "Akshayakalpa - Organic Idli & Dosa Batter", weight: "750 Gms", price: 75.00, location: "From Bengaluru, Karnataka", image: "rc3.jpeg" },
        { name: "Classic Tofu", weight: "200 Gms", price: 141.00, location: "From Bengaluru, Karnataka", image: "rc2.jpg" },
        { name: "Akshayakalpa - Organic Ragi Dosa", weight: "750 Gms", price: 85.00, location: "From Bengaluru, Karnataka", image: "rc4.jpeg" }
    ],
    "Masalas and Dry Fruits": [
        { name: "Chia Seeds", weight: "100 Gms", price: 169.00, location: "From Chennai, TN", image: "md1.jpg" },
        { name: "Himalayan Pink Salt", weight: "500 Gms", price: 69.00, location: "From Himachal, HP", image: "md2.jpg" },
        { name: "Cinnamon", weight: "100 Gms", price: 229.00, location: "From Chennai, TN", image: "md3.jpg" },
        { name: "Clove", weight: "50 Gms", price: 159.00, location: "From Chennai, TN", image: "md4.jpg" },
        { name: "White Sesame Seeds", weight: "100 Gms", price: 110.00, location: "From Chennai, TN", image: "md5.jpg" },
        { name: "Cashew", weight: "200 Gms", price: 399.00, location: "From Rampachodavaram, Andhra Pradesh", image: "md6.png" },
        { name: "Almond", weight: "250 Gms", price: 383.00, location: "From Kashmir", image: "md7.png" },
        { name: "Dry Grapes Black", weight: "250 Gms", price: 259.00, location: "From Kalihalli, Karnataka", image: "md8.png" },
        { name: "Kashmiri Walnut Kernels", weight: "250 Gms", price: 519.00, location: "From Kashmir", image: "md9.png" }
    ]
};

// Map simplified names to standard images for Categories
const categoryImages = {
    "Fresh Fruits": "apple.png",
    "Fresh Vegetables": "carrot.png",
    "Leafy and Seasonings": "leaf.png",
    "Other Vegetables": "leafy1.png",
    "Dals & Rice": "dal.png",
    "Dehydrated": "dehydrated.png",
    "Grains and millets": "grains.png",
    "Dairy & eggs": "dairy.png",
    "Snacks & Coffee": "snacksncoffee.png",
    "Natural Sweeteners": "naturalsweet.png",
    "Masalas and Dry Fruits": "masalaanddry.png",
    "Ready to Cook": "readycook.png"
};

const seed = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Connected to DB...");

        for (const [categoryName, products] of Object.entries(allProducts)) {
            // 1. Insert/Get Category
            // Use image from map, or default
            const catImage = "/images/" + (categoryImages[categoryName] || "leaf.png");

            // Upsert Category
            // We use INSERT IGNORE and then SELECT because we want the ID
            await connection.query("INSERT IGNORE INTO categories (name, image_url) VALUES (?, ?)", [categoryName, catImage]);

            const [rows] = await connection.query("SELECT id FROM categories WHERE name = ?", [categoryName]);
            const categoryId = rows[0].id;

            console.log(`Processing Category: ${categoryName} (ID: ${categoryId})`);

            // 2. Insert Products
            for (const prod of products) {
                const prodImage = "/images/" + prod.image;
                const weight = prod.weight;
                const price = prod.price;
                const location = prod.location || "";

                // Check if product exists
                const [existing] = await connection.query("SELECT id FROM products WHERE name = ?", [prod.name]);

                if (existing.length === 0) {
                    await connection.query(`
                        INSERT INTO products (category_id, name, weight, price, location, image_url, stock)
                        VALUES (?, ?, ?, ?, ?, ?, 50)
                    `, [categoryId, prod.name, weight, price, location, prodImage]);
                } else {
                    console.log(`Skipping existing product: ${prod.name}`);
                }
            }
        }



        console.log("Seeding Complete!");

        // Clear Redis Cache
        try {
            await redisClient.del('products_public');
            await redisClient.del('categories_public');
            console.log("Redis Cache Cleared.");
        } catch (err) {
            console.error("Error clearing Redis cache:", err);
        }

        process.exit(0);

    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
        if (redisClient) await redisClient.quit();
    }
};

seed();
