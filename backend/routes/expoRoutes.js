// backend\routes\expoRoutes.js

const express = require('express');
const router = express.Router();
const expoController = require('../controllers/expoController');

// Import using your EXACT names to maintain link with other files
const { authMiddleware, staffMiddleware } = require('../middleware/authMiddleware');

// Route for searching
router.get('/search/:query', authMiddleware, staffMiddleware, expoController.searchRunner);

// Route for final check-in/bib assignment
router.post('/checkin/:registrationId', authMiddleware, staffMiddleware, expoController.checkInRunner);


router.get('/all-runners', authMiddleware, staffMiddleware, expoController.getAllRunners);

module.exports = router;