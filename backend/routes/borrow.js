const express = require('express');
const router = express.Router();
const { borrowBook, returnBook, getHistory } = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');

router.post('/', protect, borrowBook);
router.post('/return', protect, returnBook);
router.get('/history', protect, getHistory);

module.exports = router;
