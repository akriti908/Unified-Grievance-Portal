const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const grievanceRoutes = require("./grievanceRoutes");
const authRoutes = require("./authRoutes");

const path = require("path");
const app = express();
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ✅ 1. Connect DB
connectDB();

// ✅ 2. Middleware FIRST
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ✅ 3. Debug logger
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// ✅ 4. Static files
app.use("/uploads", express.static("uploads"));

// ✅ 5. Routes AFTER middleware
app.use("/api/auth", authRoutes);
app.use("/api", grievanceRoutes);

// ✅ 6. Test routes
app.get("/", (req, res) => {
  res.send("SERVER WORKING ✅");
});

app.get("/api/test-track", (req, res) => {
  res.send("TRACK ROUTE WORKS");
});

// ✅ 7. Start server LAST
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});


// serve frontend
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});