// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\routes\registrationRoutes.js - FINAL FIX

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');


// Import BOTH middlewares
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// 1. ADMIN ONLY: Get all registrations
// We use BOTH middlewares here to keep the master list secret.
router.get(
  '/all', 
  authMiddleware, 
  adminMiddleware, 
  registrationController.getAllRegistrations
);

// 2. USER DASHBOARD: Get only the logged-in user's data
// We only use authMiddleware here so any logged-in runner can see their own info.
router.get(
  '/my-registration', 
  authMiddleware, 
  registrationController.getUserRegistration
);

// 3. PUBLIC REGISTRATION: Allow anyone logged in to register
// Remove adminMiddleware from here so regular users can sign up!
router.post(
  '/', 
  authMiddleware, 
  registrationController.uploadIDProof,
  registrationController.submitRegistration
);

module.exports = router;