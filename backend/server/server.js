// require("dotenv").config();
// const express = require("express");

// const cors = require("cors");
// const connectDB = require("./db");

// const path = require("path");
// const fs = require("fs");

// const grievanceRoutes = require("./grievanceRoutes");
// const authRoutes = require("./authRoutes");

// const app = express();

// // ✅ 1. Connect DB
// connectDB();

// // ✅ 2. Middleware FIRST
// app.use(cors({
//   origin: "*"
// }));
// app.use(express.json());

// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }
// // ✅ 4. Static files
// app.use("/uploads", express.static("uploads"));

// // ✅ 5. Routes AFTER middleware
// app.use("/api/auth", authRoutes);
// app.use("/api", grievanceRoutes);

// // ✅ 3. Debug logger
// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });


// // serve frontend build
// app.use(express.static(path.join(__dirname, "../frontend/dist")));


// // ✅ 6. Test routes
// app.get("/", (req, res) => {
//   res.send("SERVER WORKING ✅");
// });

// app.get("/api/test-track", (req, res) => {
//   res.send("TRACK ROUTE WORKS");
// });

// // ✅ Start server LAST
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// // fallback route (SAFE)
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const path = require("path");
const fs = require("fs");

const grievanceRoutes = require("./grievanceRoutes");
const authRoutes = require("./authRoutes");

const app = express();

// DB
connectDB();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// uploads
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", grievanceRoutes);

// STATIC FRONTEND (IMPORTANT)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// FRONTEND FALLBACK (IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});