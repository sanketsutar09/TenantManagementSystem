const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  
    //property details
    title: String,
    type: String,
    bhk: String,
    size: String,
    price: Number,
    address: String,
    furnished: String,

    //Owner details
    ownerName: String,
    ownerEmail: String,

    // user details
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    dob: { type: Date, required: true },
    govIdType: { type: String, required: true },
    govIdNumber: { type: String, required: true },

     // Booking dates
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },

  // Emergency contact
  emergencyName: { type: String, required: true },
  emergencyPhone: { type: String, required: true },

  // Notes
  notes: String,

  //link to property id

  propertyId: {type: mongoose.Schema.Types.ObjectId, ref:'Property'},
  userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},

  createdAt: { type: Date, default: Date.now}


});

module.exports = mongoose.model('Booking', bookingSchema);

// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },

//   // Property snapshot (to keep a record even if property changes later)
//   title: String,
//   type: String,
//   bhk: String,
//   size: Number,
//   price: Number,
//   address: String,
//   furnished: String,

//   // Owner snapshot
//   ownerName: String,
//   ownerEmail: String,

//   // User details
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   dob: { type: Date, required: true },
//   govIdType: { type: String, required: true },
//   govIdNumber: { type: String, required: true },

//   // Booking dates
//   checkInDate: { type: Date, required: true },
//   checkOutDate: { type: Date, required: true },

//   // Emergency contact
//   emergencyName: { type: String, required: true },
//   emergencyPhone: { type: String, required: true },

//   // Notes
//   notes: String,
// }, { timestamps: true });

// module.exports = mongoose.model('Booking', bookingSchema);
