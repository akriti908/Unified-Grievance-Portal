const express = require("express");
const router = express.Router();

const controller = require("./grievanceController");
const upload = require("./uploadMiddleware");

// Submit grievance
router.post("/grievance", upload.single("image"), controller.submitGrievance);

// Admin
router.get("/admin/all", controller.getAll);

// User
router.get("/my-grievances", controller.getMyGrievances);

router.get("/track/:id", controller.trackById);

// ✅ Update grievance status
router.post("/update-status", controller.updateStatus);

// ✅ Assign officer
router.post("/assign-officer", controller.assignOfficer);

router.post("/submit-review", controller.submitReview);

router.get("/analytics", controller.getAnalytics);

router.get("/settings", controller.getSettings);

router.post("/settings", controller.updateSettings);

const User = require('./user');
router.get('/admin/users', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// SIGNUP
router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, location, role, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, phone, location, role, password });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
