const express = require('express');
const router = express.Router();
const { getBooks, getBook, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getBooks);
router.get('/:id', protect, getBook);
router.post('/', protect, adminOnly, addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
