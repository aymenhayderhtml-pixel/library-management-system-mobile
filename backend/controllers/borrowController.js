const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// POST /api/borrow — borrow a book
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Check if user already has this book borrowed
    const existing = await Borrow.findOne({ userId, bookId, status: 'borrowed' });
    if (existing) {
      return res.status(400).json({ message: 'You already have this book borrowed' });
    }

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    const borrow = await Borrow.create({ userId, bookId });

    // Populate book info for response
    const populated = await borrow.populate('bookId', 'title author category image');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/return — return a book
const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;
    const userId = req.user._id;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    if (borrow.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (borrow.status === 'returned') {
      return res.status(400).json({ message: 'Already returned' });
    }

    // Update borrow record
    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    // Restore available copies
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/borrow/history — get borrow history
// Admin: all records. Student: their own records.
const getHistory = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const records = await Borrow.find(query)
      .populate('bookId', 'title author category image')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { borrowBook, returnBook, getHistory };
