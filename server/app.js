// app.js (ESM) - updated
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
dotenv.config();

const app = express();

// ====== CONFIG ======
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "secretKey";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/locallynk";

// ====== Connect to MongoDB ======
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Middlewares ======
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====== Auth check (for frontend nav / initial load) ======
app.get("/api/auth/check", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      authenticated: true,
      user: { id: decoded.id, username: decoded.username, email: decoded.email },
    });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

// ====== SignOut ======
app.post("/api/auth/signout", (req, res) => {
  // clear cookie (path set to root)
  res.clearCookie("token", { path: "/" });
  return res.json({ message: "Signed out successfully" });
});

// ====== Signup ======
app.post("/api/auth/signup", async (req, res) => {
  try {
    let { username, email, dob, password, confirmPassword } = req.body;

    if (!username || !email || !dob || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const existingByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingByEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      dob: birthDate,
      age,
      password: hashedPassword,
    });

    await newUser.save();

    const tokenPayload = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    // cookie options
    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax", // consider "none" & secure:true if cross-site (production)
      // secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Signup successful",
      redirectUrl: "/login",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ====== Login ======
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Login successful",
      user: tokenPayload,
      redirectUrl: "/",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ====== Start server ======
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));


