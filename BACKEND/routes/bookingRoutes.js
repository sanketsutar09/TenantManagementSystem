const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const User = require('../models/User');
const CancelledBooking = require('../models/CancelledBooking');

// Post booking
router.post('/', async (req, res) => {
  try {
    // 1. Find property
    const property = await Property.findById(req.body.propertyId);
    // const user = await User.findById(UserId);
    const user = await User.findOne({ email: req.body.email });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.available <= 0) {
      return res.status(400).json({ message: "Property fully booked" });
    }

    // 2. Create booking with owner snapshot
    const booking = new Booking({
      ...req.body,
      userId: user._id,
      propertyId: property._id,
      ownerName: property.name,   
      ownerEmail: property.email   
    });  

    const savedBooking = await booking.save();

    // 3. Decrease available count
    property.available -= 1;

    // 4. If no availability, mark as fully booked
    if (property.available === 0) {
      property.status = "Fully Booked";
    }

    await property.save();

    res.status(201).json({
      message: 'Booking successful',
      booking: savedBooking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Get Bookings by user email

router.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const bookings = await Booking.find({ email }).populate('propertyId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message});
        
    }
});

//cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Increase property availability
    const property = await Property.findById(booking.propertyId);
    if (property) {
      property.available += 1;
      if (property.available > 0) {
        property.status = "Available";
      }
      await property.save();
    }

    // Move booking to cancelled list
    const cancelledBooking = new CancelledBooking({
      bookingId: booking._id,
      userEmail: booking.email,
      ownerEmail: property.email,
      ownerName: property.name,
      userName: booking.name,
      propertyId: booking.propertyId,
      title: booking.title,
      type: booking.type,
      price: booking.price,
      checkInDate: booking.checkInDate,
      furnished: booking.furnished,
      address: booking.address
    });

    await cancelledBooking.save();

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: 'Booking cancelled and moved to cancelled list' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for properties owned by a specific email
router.get('/owner/:email', async (req, res) => {
  try {
    const ownerEmail = req.params.ownerEmail;

    // Find all properties owned by this user
    const properties = await Property.find({ ownerEmail: ownerEmail }).select('_id');
    const propertyIds = properties.map((p) => p._id);

    // Find bookings for these properties
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } })
      .populate('propertyId') 
      .exec();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().exec();

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const cancelledBooking = await CancelledBooking.find().exec();

    res.status(200).json(cancelledBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

module.exports = router;