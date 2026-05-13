const Book = require('../models/Book');

// GET /api/books — get all books
const getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/books/:id — get single book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/books — add book (admin only)
const addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, description, image, totalCopies } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Title, author, and category are required' });
    }

    const copies = totalCopies || 1;
    const book = await Book.create({
      title,
      author,
      category,
      isbn: isbn || '',
      description: description || '',
      image: image || '',
      totalCopies: copies,
      availableCopies: copies,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/books/:id — update book (admin only)
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const { title, author, category, isbn, description, image, totalCopies } = req.body;

    // Recalculate available copies if total changes
    if (totalCopies !== undefined) {
      const diff = totalCopies - book.totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
      book.totalCopies = totalCopies;
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.isbn = isbn !== undefined ? isbn : book.isbn;
    book.description = description !== undefined ? description : book.description;
    book.image = image !== undefined ? image : book.image;

    const updated = await book.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/books/:id — delete book (admin only)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, getBook, addBook, updateBook, deleteBook };
