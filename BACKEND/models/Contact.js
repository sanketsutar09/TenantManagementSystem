const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  message: { type: String, required: true, minlength: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);

// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   name: { type: String, required: true, minlength: 2 },
//   email: { type: String, required: true, match: /.+\@.+\..+/ },
//   message: { type: String, required: true, minlength: 5 },
// }, { timestamps: true });

// module.exports = mongoose.model('Contact', contactSchema);
