// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =======================
// REGISTER USER
// =======================
exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }

  // ✅ NORMALIZE EMAIL
  const emailNormalized = email.trim().toLowerCase();

  try {
    // Check if user already exists
    let user = await User.findOne({ email: emailNormalized });
    if (user) {
      return res.status(400).json({
        message: 'User already exists with this email address.',
      });
    }

    // Create new user
    user = new User({
      name,
      email: emailNormalized,
      password,
      phone: phone || null,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Generate JWT (auto-login)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully and logged in!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during registration' });
  }
};

// =======================
// LOGIN USER
// =======================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // ✅ Normalize email
  const emailNormalized = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: emailNormalized });

    if (!user) {
      return res.status(404).json({
        errorCode: 'USER_NOT_FOUND',
        message: 'Account does not exist',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ SUCCESS RESPONSE
    return res.json({
  success: true,
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    // This line is the fix: it checks both naming versions
    role: user["\"role\""] || user.role || "user" 
  },
});

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

