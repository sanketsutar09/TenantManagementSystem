const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const { error } = require("console");



// POST: Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please sign in." });
    }

    // Store password directly (no hashing)
    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST: Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    // Compare plain text password
    if (password !== existingUser.password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Store password directly (no hashing)


    res.status(200).json({
      message: "Login successful",
      user: { name: existingUser.name, email: existingUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
 
});

//Get all users admin side
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment login count by email
router.put('/increment-login/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { loginCount: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Login count updated successfully',
      loginCount: user.loginCount
    });
  } catch (error) {
    console.error('Error updating login count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "userUpload/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const userUpload = multer({ storage });

//GET User by Email
router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "server error" });
  }
});

//UPDATE User Info
router.put("/update/:id", userUpload.single("profileImage"), async (req, res) => {

  try {
    const existingUser = await User.findById(req.params.id);
    let updateData = {
      name: req.body.name,
      email: req.body.email,
      profileImage: existingUser.profileImage
    };

    if (req.body.password) {
      updateData.password = req.body.password;
    }

    if (req.file) {
      updateData.profileImage = `http://localhost:3000/userUpload/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ message: "Profile Updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;