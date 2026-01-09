import express from "express";
import multer from "multer";

import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import pincodeRoute from "./routes/pincodeRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";
import productRoute from "./routes/productRoute.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Serve Static Uploads
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Also serve frontend public images if we want to fallback? No, let's stick to what we have.
// Wait, the seed script used '/images/'. Those are in frontend.
// The new uploaded images will be '/uploads/filename.jpg'.
// We need to support both or standardize.
// For now, let's keep frontend serving its images via standard React build, and backend serving uploads.
// But for development, 'frontend/public' isn't automatically served by backend unless we tell it.
// React Dev Server serves 'frontend/public'.
// So if we browse to localhost:3000/images/fruit.png it works.
// If we browse to localhost:5001/uploads/foo.png it works.
// So we are good.


// mount routes
app.use("/api/user", userRoute);
app.use("/api/pincode", pincodeRoute);
app.use("/api/order", orderRoute);
app.use("/api/admin", adminRoute);
app.use("/api/public", productRoute);

// Error Handling Middleware (for Multer and others)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum limit is 100MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // An unknown error occurred when uploading.
    return res.status(500).json({ error: err.message });
  }
  next();
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
