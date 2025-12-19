// middleware/auth.js
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied." });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password)
    // const user = users.find((u) => u._id === decoded.id); // OLD
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid token: user not found." });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Token is not valid." });
  }
};



export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

export default auth;
