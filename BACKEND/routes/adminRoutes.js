const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Property = require("../models/Property");
const DeletedProperty = require("../models/deletedProperty");
const Booking = require("../models/Booking");
const CancelledBooking = require("../models/CancelledBooking");
const Feedback = require("../models/Feedback");
const AdminLogin = require("../models/adminLogin");

//POST: admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminLogin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, message: "Login successful", admin });
  } catch (error) {

    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }

});

// GET - Fetch all data or filter by email
router.get("/all-data", async (req, res) => {
  try {
    const { email } = req.query; 

    // Build filter condition
    const filter = email ? { email } : {};

    // For collections with different field names
    const bookingFilter = email ? { email } : {};
    const cancelledBookingFilter = email ? { userEmail: email } : {};

    // Fetch data
    const users = await User.find(filter).select("-password");

    const properties = await Property.find(filter)


    const deletedProperties = await DeletedProperty.find(filter);

    // ✅ Populate booking with related property & user
    const bookings = await Booking.find(bookingFilter)
      .populate("propertyId", "email name"); 

    // ✅ Populate cancelled bookings with related booking & property
    const cancelledBookings = await CancelledBooking.find(cancelledBookingFilter)

      .populate("propertyId", "email name");

    const feedbacks = await Feedback.find(filter);

    res.json({
      users,
      properties,
      deletedProperties,
      bookings,
      cancelledBookings,
      feedbacks,
    });
  } catch (err) {
    console.error("Error fetching admin data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST: Create user by admin
router.post("/create-user", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, loginCount: 0 });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;