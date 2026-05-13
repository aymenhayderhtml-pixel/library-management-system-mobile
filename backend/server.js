const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/Book');
const User = require('./models/User');

const bookRoutes = require('./routes/books');
const borrowRoutes = require('./routes/borrows');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/library_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Seed default admin user if not exists
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        fullName: 'System Administrator',
        email: 'admin@library.com'
      });
      console.log('✅ Default admin created (admin / admin123)');
    }
  } catch (err) {
    console.log('Seed error:', err);
  }
};
seedAdmin();

// Login endpoint - checks User collection
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    // Find user with matching credentials AND role
    const user = await User.findOne({ username, password, role });
    
    if (user) {
      res.json({ 
        success: true, 
        role: user.role, 
        username: user.username,
        fullName: user.fullName,
        userId: user._id
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials for selected role' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/users', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
