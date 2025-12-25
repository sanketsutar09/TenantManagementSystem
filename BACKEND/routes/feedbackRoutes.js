const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST - Save feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    if (!name || !email || !feedback) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().exec();

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

module.exports = router;