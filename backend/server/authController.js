const User = require("./User");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};