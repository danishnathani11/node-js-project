const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `book-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to delete old image
const deleteImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '..', 'uploads', imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
};

// GET /books - List all books
router.get('/', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') query.category = category;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'title') sortOption = { title: 1 };

    const books = await Book.find(query).sort(sortOption);
    const totalBooks = await Book.countDocuments();
    const totalValue = await Book.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ]);

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Finance',
      'History', 'Biography', 'Self-Help', 'Philosophy', 'Children', 'Mystery', 'Romance', 'Horror', 'Other'];

    res.render('books/index', {
      books,
      totalBooks,
      totalValue: totalValue[0]?.total || 0,
      categories,
      currentCategory: category || 'All',
      search: search || '',
      sort: sort || 'newest',
      success: req.query.success || null
    });
  } catch (err) {
    res.render('error', { error: err });
  }
});

// GET /books/new - New book form
router.get('/new', (req, res) => {
  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Finance',
    'History', 'Biography', 'Self-Help', 'Philosophy', 'Children', 'Mystery', 'Romance', 'Horror', 'Other'];
  res.render('books/new', { categories, errors: [] });
});

// POST /books - Create book
router.post('/', upload.single('image'), async (req, res) => {
  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Finance',
    'History', 'Biography', 'Self-Help', 'Philosophy', 'Children', 'Mystery', 'Romance', 'Horror', 'Other'];
  try {
    const { title, author, category, price, quantity, description } = req.body;
    const book = new Book({
      title, author, category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description,
      image: req.file ? req.file.filename : null
    });
    await book.save();
    res.redirect('/books?success=Book added successfully!');
  } catch (err) {
    if (req.file) deleteImage(req.file.filename);
    const errors = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : [err.message];
    res.render('books/new', { categories, errors, formData: req.body });
  }
});

// GET /books/:id - View single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).render('404');
    res.render('books/show', { book });
  } catch (err) {
    res.status(404).render('404');
  }
});

// GET /books/:id/edit - Edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).render('404');
    const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Finance',
      'History', 'Biography', 'Self-Help', 'Philosophy', 'Children', 'Mystery', 'Romance', 'Horror', 'Other'];
    res.render('books/edit', { book, categories, errors: [] });
  } catch (err) {
    res.status(404).render('404');
  }
});

// PUT /books/:id - Update book
router.put('/:id', upload.single('image'), async (req, res) => {
  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Finance',
    'History', 'Biography', 'Self-Help', 'Philosophy', 'Children', 'Mystery', 'Romance', 'Horror', 'Other'];
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).render('404');

    const { title, author, category, price, quantity, description } = req.body;
    book.title = title;
    book.author = author;
    book.category = category;
    book.price = parseFloat(price);
    book.quantity = parseInt(quantity);
    book.description = description;

    if (req.file) {
      deleteImage(book.image);
      book.image = req.file.filename;
    }

    await book.save();
    res.redirect(`/books/${book._id}?success=Book updated successfully!`);
  } catch (err) {
    if (req.file) deleteImage(req.file.filename);
    const book = await Book.findById(req.params.id).catch(() => null);
    const errors = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : [err.message];
    res.render('books/edit', { book, categories, errors, formData: req.body });
  }
});

// DELETE /books/:id - Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book?.image) deleteImage(book.image);
    res.redirect('/books?success=Book deleted successfully!');
  } catch (err) {
    res.redirect('/books');
  }
});

module.exports = router;
