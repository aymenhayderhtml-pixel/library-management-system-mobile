const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users (without passwords)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
      fullName: req.body.fullName,
      email: req.body.email
    });
    const savedUser = await newUser.save();
    // Don't return password in response
    const { password, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      username: req.body.username,
      role: req.body.role,
      fullName: req.body.fullName,
      email: req.body.email
    };
    // Only update password if provided
    if (req.body.password) {
      updateData.password = req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
