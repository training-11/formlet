// routes/userRoute.js
import express from "express";
import {
  fetch,
  create,
  update,
  deleteUser,
  login,
  sendOtp,
  verifyOtp,
  sendOtpRegister,
  verifyOtpRegister,
  forgotPassword,
  resetPassword
} from "../controllers/usercontroller.js";
import auth from "../middleware/auth.js";

const route = express.Router();

// Public
route.post("/signup", create);
route.post("/login", login);
route.post("/send-otp", sendOtp);
route.post("/login-otp", verifyOtp);
route.post("/send-register-otp", sendOtpRegister);
route.post("/verify-register-otp", verifyOtpRegister);
route.post("/forgot-password", forgotPassword); // New
route.post("/reset-password/:token", resetPassword); // New

// Protected
route.get("/getAllUsers", auth, fetch);
route.put("/update/:id", auth, update);
route.delete("/delete/:id", auth, deleteUser);

export default route;
