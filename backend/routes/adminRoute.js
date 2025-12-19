import express from "express";
import auth, { admin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
    getStats, getAllOrders, getOrderById, updateOrderStatus, getAllUsers, notifyDelivery,
    getAllPincodes, addPincode, deletePincode, getOrderItems,
    getAllCoupons, addCoupon, deleteCoupon,
    getAllCategories, addCategory, deleteCategory, // Categories
    getAllProducts, addProduct, deleteProduct, updateProduct, getDeliveries, getPausedDeliveries, getDeliveryLogs     // Products
} from "../controllers/adminController.js";

const router = express.Router();

// ALL Routes Protected by Auth + Admin
router.get("/stats", auth, admin, getStats);
router.get("/orders", auth, admin, getAllOrders);
router.get("/orders/:id", auth, admin, getOrderById); // Single Order
router.put("/orders/:id/status", auth, admin, updateOrderStatus);
router.post("/orders/:id/notify-delivery", auth, admin, notifyDelivery);
router.get("/orders/:id/items", auth, admin, getOrderItems);
router.get("/orders/:id/delivery-logs", auth, admin, getDeliveryLogs);
router.get("/deliveries", auth, admin, getDeliveries); // Delivery Schedule
router.get("/users", auth, admin, getAllUsers);
router.get("/paused-deliveries", auth, admin, getPausedDeliveries); // Paused Deliveries

// Pincodes
router.get("/pincodes", auth, admin, getAllPincodes);
router.post("/pincodes", auth, admin, addPincode);
router.delete("/pincodes/:id", auth, admin, deletePincode);

// Coupons
router.get("/coupons", auth, admin, getAllCoupons);
router.post("/coupons", auth, admin, addCoupon);
router.delete("/coupons/:id", auth, admin, deleteCoupon);

// Categories
router.get("/categories", auth, admin, getAllCategories);
router.post("/categories", auth, admin, upload.single('image'), addCategory);
router.delete("/categories/:id", auth, admin, deleteCategory);

// Products
router.get("/products", auth, admin, getAllProducts);
router.post("/products", auth, admin, upload.single('image'), addProduct); // Image Upload
router.put("/products/:id", auth, admin, upload.single('image'), updateProduct); // Image Upload
router.delete("/products/:id", auth, admin, deleteProduct);

export default router;
