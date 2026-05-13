const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  bookTitle:   { type: String, required: true },
  bookId:      { type: String, required: true },
  userId:      { type: String, required: true },
  borrowDate:  { type: Date, default: Date.now },
  dueDate:     { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
});

module.exports = mongoose.model('Borrow', borrowSchema);
