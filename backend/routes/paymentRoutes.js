// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\routes\paymentRoutes.js

const express = require("express");
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController'); 

// GET /api/payments/invoice/:registrationId
router.get('/invoice/:registrationId', paymentController.downloadInvoice);

// Creating the Order
router.post("/order", authMiddleware, paymentController.createOrder);

// Verifying the Payment
router.post('/verify', authMiddleware, paymentController.verifyPayment);
// router.post('/verify', paymentController.verifyPayment);

module.exports = router;