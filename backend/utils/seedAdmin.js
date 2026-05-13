const User = require('../models/User');

// Seed a default admin account on startup
const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@library.com' });
    if (!existing) {
      await User.create({
        name: 'System Admin',
        email: 'admin@library.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Default admin created: admin@library.com / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = { seedAdmin };
