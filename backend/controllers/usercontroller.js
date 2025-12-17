// controllers/usercontroller.js
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // Import MySQL pool
import crypto from "crypto";

import nodemailer from "nodemailer";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// HELPER: Send Email
const sendWelcomeEmail = async (toEmail, userName) => {
  // Configure Transporter (Use Gmail or other simple SMTP for demo)
  // NOTE: For Gmail, you usually need an App Password if 2FA is on.
  // For now, we will log if credentials are missing
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.log("[DEBUG] Email credentials missing. Skipping email.");
    console.log(`[DEBUG] Would send 'Welcome' email to ${toEmail}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or host: 'smtp.example.com'
    auth: {
      user: user,
      pass: pass
    }
  });

  const mailOptions = {
    from: `"Farmlet" <${user}>`,
    to: toEmail,
    subject: 'Account Created Successfully - Farmlet',
    html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #00a046;">Welcome to Farmlet, ${userName}!</h1>
                <p>We are thrilled to valid have you with us.</p>
                <p>Your account has been successfully created.</p>
                <br/>
                <p>Happy Shopping!</p>
                <p>The Farmlet Team</p>
            </div>
        `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SUCCESS] Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// HELPER: Send SMS
const sendWelcomeSMS = async (phone, userName) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey || apiKey === "YOUR_FAST2SMS_API_KEY") {
    console.log(`[DEBUG] SMS Key missing. Would send SMS to ${phone}: "Welcome to Farmlet!"`);
    return;
  }

  try {
    // NOTE: Fast2SMS Free plan only supports specific approved templates or OTP route.
    // Sending custom text might fail on free plan. We use simple text for demo.
    const message = `Welcome to Farmlet! Your account is created successfully.`;
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&message=${encodeURIComponent(message)}&language=english&route=q&numbers=${phone}`;

    await axios.get(url);
    console.log(`[SUCCESS] Welcome SMS sent to ${phone}`);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
};

// SIGNUP / CREATE
export const create = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email || !address || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const cleanPhone = phone ? phone.toString().replace(/\s+/g, '') : null;

    // Check if user exists (by email OR phone)
    // We use a parameterized query with OR
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ? OR (phone IS NOT NULL AND phone = ?)",
      [email, cleanPhone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists (email or phone)." });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    // Add pincode column if exists in DB, else this might error if I don't migrate DB.
    // I will migrate DB in next step.
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)",
      [name, email, cleanPhone, address, hashedPassword]
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone: cleanPhone,
      address,
      pincode // Return it
    };

    const token = generateToken(newUser);

    // Send Notifications (Async - don't block response)
    sendWelcomeEmail(email, name);
    if (cleanPhone) {
      sendWelcomeSMS(cleanPhone, name);
    }

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    const cleanPhone = phone.toString().replace(/\s+/g, '');

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE phone = ?", [cleanPhone]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User with this phone number not found. Please sign up first." });
    }

    // Generate Random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // Save OTP to DB
    await db.query(
      "UPDATE users SET otp_code = ?, otp_expires = ? WHERE phone = ?",
      [otp, otpExpires, cleanPhone]
    );

    console.log(`[DEBUG] Generated OTP for ${cleanPhone}: ${otp}`);

    // Call Fast2SMS API
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (apiKey && apiKey !== "YOUR_FAST2SMS_API_KEY") {
      try {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${otp}&route=otp&numbers=${cleanPhone}`;
        await axios.get(url);
        console.log("Fast2SMS OTP sent successfully.");
      } catch (smsError) {
        console.error("Fast2SMS Error:", smsError.response ? smsError.response.data : smsError.message);
        // We don't fail the request if SMS fails, just log it, so demo still works via console
      }
    } else {
      console.log("Fast2SMS Key missing or default. Skipping SMS send.");
    }

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// VERIFY OTP & LOGIN
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required." });
    }

    const cleanPhone = phone.toString().replace(/\s+/g, '');

    // Find user
    const [users] = await db.query("SELECT * FROM users WHERE phone = ?", [cleanPhone]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];

    // Check OTP
    if (user.otp_code !== otp) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    // Check Expiry
    if (new Date() > new Date(user.otp_expires)) {
      return res.status(401).json({ message: "OTP has expired." });
    }

    // Clear OTP
    await db.query("UPDATE users SET otp_code = NULL, otp_expires = NULL WHERE id = ?", [user.id]);

    const token = generateToken(user);
    const { password: _p, otp_code: _o, otp_expires: _e, ...userResp } = user;

    res.status(200).json({ user: userResp, token });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
// SEND OTP FOR REGISTRATION (Does not require user to exist)
export const sendOtpRegister = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    const cleanPhone = phone.toString().replace(/\s+/g, '');

    // Check if user ALREADY exists (we don't want duplicates)
    const [users] = await db.query("SELECT * FROM users WHERE phone = ?", [cleanPhone]);
    if (users.length > 0) {
      return res.status(400).json({ message: "This phone number is already registered. Please login." });
    }

    // Generate Random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Upsert into verification table
    await db.query(`
      INSERT INTO phone_verifications (phone, otp, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at)
    `, [cleanPhone, otp, expiresAt]);

    console.log(`[DEBUG] Generated Register OTP for ${cleanPhone}: ${otp}`);

    // Call Fast2SMS API
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (apiKey && apiKey.length > 10) { // Check if valid key
      try {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${otp}&route=otp&numbers=${cleanPhone}`;
        await axios.get(url);
        console.log("Fast2SMS OTP sent successfully.");
      } catch (smsError) {
        console.error("Fast2SMS Error:", smsError.response ? smsError.response.data : smsError.message);
      }
    } else {
      console.log("Fast2SMS Key missing or default. Skipping SMS send.");
    }

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Send Register OTP error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// VERIFY OTP FOR REGISTRATION
export const verifyOtpRegister = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required." });
    }

    const cleanPhone = phone.toString().replace(/\s+/g, '');

    const [rows] = await db.query("SELECT * FROM phone_verifications WHERE phone = ?", [cleanPhone]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "OTP request not found." });
    }

    const record = rows[0];

    if (record.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    if (new Date() > new Date(record.expires_at)) {
      return res.status(401).json({ message: "OTP has expired." });
    }

    // Success - we can keep the record or delete it.
    // Ideally, we keep it but mark verified? Or client just trusts the 200 OK.
    // For simplicity, we just delete it so it can't be used again, and client knows it's verified.
    await db.query("DELETE FROM phone_verifications WHERE phone = ?", [cleanPhone]);

    res.status(200).json({ message: "Phone number verified successfully." });
  } catch (error) {
    console.error("Verify Register OTP error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


// LOGIN (EMAIL) - Keep existing logic for fallback or admin? Or just leave it.

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });

    // Find user
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userResp } = user;

    res.status(200).json({ user: userResp, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET ALL USERS (protected)
export const fetch = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, address, created_at, updated_at FROM users"
    );

    if (users.length === 0)
      return res.status(404).json({ message: "No users found." });

    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// UPDATE USER (protected)
export const update = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if user exists
    const [check] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (check.length === 0) return res.status(404).json({ message: "User not found." });

    const updates = { ...req.body };
    const fields = [];
    const values = [];

    if (updates.name) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.email) {
      fields.push("email = ?");
      values.push(updates.email);
    }
    if (updates.address) {
      fields.push("address = ?");
      values.push(updates.address);
    }
    if (updates.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
      const hashedPassword = await bcrypt.hash(updates.password, saltRounds);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    values.push(id); // For the WHERE clause

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await db.query(sql, values);

    // Return updated user
    const [updatedUser] = await db.query("SELECT id, name, email, address, created_at, updated_at FROM users WHERE id = ?", [id]);

    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// DELETE USER (protected)
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check user
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    // Save to DB
    await db.query("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?", [hash, expires, user.id]);

    // Send Email
    // In a real app, send actual email. Here we try if config exists, else log it.
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Attempt Email Send
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      });
      const mailOptions = {
        from: `"Farmlet" <${emailUser}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
                <p>You requested a password reset.</p>
                <p>Click this link to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link expires in 30 minutes.</p>
            `
      };
      await transporter.sendMail(mailOptions);
      console.log(`[SUCCESS] Reset email sent to ${email}`);
    } else {
      console.log(`[DEBUG] Email credentials missing. Reset Token: ${resetToken}`);
      console.log(`[DEBUG] Reset URL: ${resetUrl}`);
    }

    res.json({ message: "Password reset link sent to email." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "New password is required" });

    // Hash token to compare
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and expiry
    const [users] = await db.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()",
      [hashedToken]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }
    const user = users[0];

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update User
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password updated successfully. You can now login." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
