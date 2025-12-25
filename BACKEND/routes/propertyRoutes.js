const express = require('express');
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const DeletedProperty = require('../models/deletedProperty');
const User = require("../models/User");
const router = express.Router();

// Set up multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Handle form + image upload
router.post('/upload', upload.fields([
  { name: 'image1' },
  { name: 'image2' },
  { name: 'image3' }
]), async (req, res) => {
  try {

    const { email } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email. Please create the account first." });
    }
    const images = [];

    if (req.files.image1) images.push(req.files.image1[0].filename);
    if (req.files.image2) images.push(req.files.image2[0].filename);
    if (req.files.image3) images.push(req.files.image3[0].filename);

    const propertyData = {
      ...req.body,
      images
    };

    const newProperty = new Property(propertyData);
    await newProperty.save();

    res.status(201).json({ message: 'Property uploaded successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// Get all properties 
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/property?email=user@example.com
router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const properties = await Property.find({ email });
    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing PUT route
router.put('/:id', upload.fields([
  { name: 'image1' },
  { name: 'image2' },
  { name: 'image3' }
]), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Update images if new ones are uploaded
    const images = property.images || [];
    if (req.files.image1) images[0] = req.files.image1[0].filename;
    if (req.files.image2) images[1] = req.files.image2[0].filename;
    if (req.files.image3) images[2] = req.files.image3[0].filename;

    // Merge form fields
    Object.assign(property, req.body, { images });

    const updatedProperty = await property.save();

    res.json({ message: 'Property updated successfully!', property: updatedProperty });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

//to store the deleted properties
router.delete('/delete/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Save in deletedProperty collection
    const deleted = new DeletedProperty({
      _id: property._id,
      title: property.title,
      description: property.description,
      type: property.type,
      bhk: property.bhk,
      size: property.size,
      price: property.price,
      address: property.address,
      available: property.available,
      images: property.images,
      email: property.email,
      name: property.name,
      ownerName: property.ownerName,
      ownerEmail: property.ownerEmail,
      createdOn: property.createdAt
    });

    await deleted.save();

    // Remove from main collection
    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error(err); // this will show the exact error in console
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;