import express from "express";
import { createOrder, getUserOrders, verifyPaymentWebhook, getCalendarEvents, getAvailableCoupons, applyCoupon, pauseDelivery, updateOrderStatus } from "../controllers/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/user/:userId", getUserOrders);
router.get("/calendar/:userId", getCalendarEvents);
router.get("/coupons", getAvailableCoupons);
router.post("/apply-coupon", applyCoupon); // New // New Public/User Route
router.post("/pause", pauseDelivery); // PAUSE DELIVERY
router.get("/razorpay-key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

router.post("/verify-webhook", verifyPaymentWebhook);
router.post("/update-status", updateOrderStatus); // Manual status update



export default router;
