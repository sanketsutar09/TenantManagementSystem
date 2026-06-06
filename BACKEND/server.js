require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require('./routes/propertyRoutes');
const userBooking = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/userUpload', express.static(path.join(__dirname, 'userUpload')));


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tenantSystem";
mongoose.connect(MONGODB_URI)
.then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

app.use("/api/user", userRoutes); 
app.use('/api/property', propertyRoutes);
app.use('/api/booking', userBooking);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/bookings", bookingRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
