const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// GET all borrow records (admin sees all)
// GET /api/borrows?userId=xxx (user sees only theirs)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    
    // If userId is provided, filter by that user
    if (userId) {
      query.userId = userId;
    }
    
    const borrows = await Borrow.find(query).sort({ borrowDate: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST borrow a book
router.post('/', async (req, res) => {
  try {
    const { studentName, bookId, userId } = req.body; // userId is now required
    
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.quantity <= 0) return res.status(400).json({ message: 'Book not available' });
    
    book.quantity -= 1;
    await book.save();
    
    const newBorrow = new Borrow({
      studentName,
      bookTitle: book.title,
      bookId,
      userId // track who borrowed
    });
    
    const savedBorrow = await newBorrow.save();
    res.status(201).json(savedBorrow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE return a book
router.delete('/:id', async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }
    
    await Borrow.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
