const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  feedback: { type: String, required: true, minlength: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

// const mongoose = require('mongoose');

// const feedbackSchema = new mongoose.Schema({
//   name: { type: String, required: true, minlength: 2 },
//   email: { type: String, required: true, match: /.+\@.+\..+/ },
//   feedback: { type: String, required: true, minlength: 5 },
// }, { timestamps: true });

// module.exports = mongoose.model('Feedback', feedbackSchema);
