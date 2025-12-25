const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST - Store contact form data
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error('Error saving contact form:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// (Optional) GET - View all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;