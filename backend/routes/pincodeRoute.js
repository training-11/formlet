import express from "express";
import { checkPincode } from "../controllers/pincodecontroller.js";

const router = express.Router();

router.post("/check", checkPincode);

export default router;
