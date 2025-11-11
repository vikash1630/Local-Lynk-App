// server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// === CONFIG ===
// Replace with your frontend origin in production (or allow localhost during dev)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this";

app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(express.json());



// ====== Auth check ======       FINISHED
app.get("/api/auth/check", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // optionally return user info
    return res.json({ authenticated: true, user: decoded });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});




// ====== Login (for testing) ======  CONTINUATION
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {}; // avoid destructure crash
  console.log("✅ Login attempt:", username);
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  // handle login...
  
});



// ====== Logout ======
// Pass

// ====== Example protected route ======
app.get("/api/profile", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "not authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Example profile response
    res.json({ username: decoded.username, bio: "This is your profile." });
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
