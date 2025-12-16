// index.js
import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import pincodeRoute from "./routes/pincodeRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// mount routes
app.use("/api/user", userRoute);
app.use("/api/pincode", pincodeRoute);
app.use("/api/order", orderRoute);
app.use("/api/admin", adminRoute);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
