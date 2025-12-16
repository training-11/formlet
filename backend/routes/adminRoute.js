import express from "express";
import auth, { admin } from "../middleware/auth.js";
import { getStats, getAllOrders, updateOrderStatus, getAllUsers, getAllPincodes, addPincode, deletePincode, getOrderItems, getAllCoupons, addCoupon, deleteCoupon } from "../controllers/adminController.js";

const router = express.Router();

// ALL Routes Protected by Auth + Admin
router.get("/stats", auth, admin, getStats);
router.get("/orders", auth, admin, getAllOrders);
router.put("/orders/:id/status", auth, admin, updateOrderStatus);
router.get("/orders/:id/items", auth, admin, getOrderItems); // New
router.get("/users", auth, admin, getAllUsers);
router.get("/pincodes", auth, admin, getAllPincodes);
router.post("/pincodes", auth, admin, addPincode);
router.delete("/pincodes/:id", auth, admin, deletePincode);
// Coupons
router.get("/coupons", auth, admin, getAllCoupons);
router.post("/coupons", auth, admin, addCoupon);
router.delete("/coupons/:id", auth, admin, deleteCoupon);

export default router;
