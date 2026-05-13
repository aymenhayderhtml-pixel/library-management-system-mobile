const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  bookTitle: { type: String, required: true },
  bookId: { type: String, required: true },
  userId: { type: String, required: true },   // track which user borrowed
  borrowDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Borrow', borrowSchema);
