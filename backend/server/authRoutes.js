const express = require("express");
const router = express.Router();
const auth = require("./authController");

router.post("/signup", auth.registerUser);
router.post("/login", auth.loginUser);

module.exports = router;
