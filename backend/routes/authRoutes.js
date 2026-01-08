const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Register route (with logs)
router.post('/register', (req, res, next) => {
  console.log('[BACKEND RECEIVING]: POST /api/auth/register hit successfully');
  console.log('Request body:', req.body);
  next();
}, registerUser);

// Login route
router.post('/signin', loginUser);

module.exports = router;
