const mongoose = require('mongoose');

const DeletedPropertySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // keep original id
  title: String,
  description: String,
  type: String,
  bhk: String,       // match your Property type
  size: Number,
  price: Number,
  address: String,
  available: Number,
  images: [String],  // include images array
  userEmail: String,     // if owner email is stored
  userName: String,
  name: String,
  email: String,
  deletedOn: { type: Date, default: Date.now},
  createdOn: { type: Date}
});

module.exports = mongoose.model('DeletedProperty', DeletedPropertySchema);

// const mongoose = require('mongoose');

// const deletedPropertySchema = new mongoose.Schema({
//   originalPropertyId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
//   // Property snapshot
//   title: String,
//   description: String,
//   type: String,
//   bhk: String,
//   size: Number,
//   price: Number,
//   address: String,
//   available: Number,
//   images: [String],

//   deletedOn: { type: Date, default: Date.now },
//   createdOn: Date, // original createdAt of property
// }, { timestamps: false });

// module.exports = mongoose.model('DeletedProperty', deletedPropertySchema);
