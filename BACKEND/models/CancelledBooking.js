const mongoose = require('mongoose');

const cancelledBookingSchema = new mongoose.Schema({
    cancellationID: Number,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userEmail: { type: String, required: true },
    userName: { type: String },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    ownerEmail: String,
    ownerName: String,
    title: String,
    type: String,
    price: Number,
    checkInDate: Date,
    furnished: String,
    address: String,
    cancelledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CancelledBooking', cancelledBookingSchema);

// const mongoose = require('mongoose');

// const cancelledBookingSchema = new mongoose.Schema({
//   booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
//   property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
//   userEmail: { type: String, required: true },
//   userName: String,

//   // Property snapshot
//   title: String,
//   type: String,
//   price: Number,
//   furnished: String,
//   address: String,
//   checkInDate: Date,

//   // Owner snapshot
//   ownerEmail: String,
//   ownerName: String,

//   cancelledAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// module.exports = mongoose.model('CancelledBooking', cancelledBookingSchema);
