const mongoose = require('mongoose');

// models/Property.js
const propertySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  available: { type: Number, default: 1 }, 
  title: String,
  description: String,
  type: String,
  bhk: {type: String, default: "Room"},
  size: Number,
  price: Number,
  address: String,
  furnished: String,
  status: { type: String, default: "Available" }, 
  images: [String],
  createdAt: { type: Date, default: Date.now}
});


module.exports = mongoose.model('Property', propertySchema);


// const mongoose = require('mongoose');

// const propertySchema = new mongoose.Schema({
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   description: String,
//   type: String,
//   bhk: { type: String, default: "Room" },
//   size: Number,
//   price: Number,
//   address: String,
//   furnished: String,
//   status: { type: String, default: "Available" },
//   available: { type: Number, default: 1 },
//   images: [String],
// }, { timestamps: true });

// module.exports = mongoose.model('Property', propertySchema);
