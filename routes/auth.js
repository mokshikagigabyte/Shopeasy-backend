const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields required" });
    }

    const emailClean = email.trim().toLowerCase();

    let user = await User.findOne({ email: emailClean });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      email: emailClean,
      name,
      password
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    return res.status(201).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailClean = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailClean });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    return res.json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
