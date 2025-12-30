// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\paymentController.js

const Razorpay = require('razorpay');
const Registration = require('../models/Registration');
const { sendInvoiceEmail } = require('../services/emailService');

// Initialize the Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    // ✅ FIX: Changed to match your .env variable name
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Optional: Temporary log to verify keys are loading in the terminal
console.log("Razorpay Keys Initialized:", {
    key_id: !!process.env.RAZORPAY_KEY_ID,
    key_secret: !!process.env.RAZORPAY_KEY_SECRET
});

// --------------------------------------------------
// 1️⃣ Create Razorpay Order
// --------------------------------------------------
exports.createOrder = async (req, res) => {
    const { registrationId, amount } = req.body;

    if (!registrationId || !amount) {
        return res.status(400).json({
            success: false,
            message: 'Missing registration ID or amount.',
        });
    }

    try {
        const options = {
            amount: Math.round(amount * 100), // amount in paise
            currency: 'INR',
            receipt: `receipt_${registrationId}`,
            notes: {
                registrationId,
            },
            // Note: 'config' is intentionally omitted here to prevent backend 500 errors.
            // UI customization (hiding EMI/Wallets) is handled in the frontend.
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
            order,
        });

    } catch (error) {
        // This will now show the correct error if keys mismatch
        console.error('Razorpay Order Creation Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment order.',
        });
    }
};

// changed for testing 
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

    try {
        // 1. Fetch the registration (DO NOT use .lean() here)
        const registration = await Registration.findById(registrationId);
        if (!registration) return res.status(404).json({ success: false, message: 'Not found.' });

        // 2. Convert to JSON to turn MongoDB Decimals into actual Numbers
        const regObj = registration.toJSON();
        const runner = regObj.runnerDetails || {};

        const invoiceData = {
            firstName: runner.firstName || "Runner",
            lastName: runner.lastName || "",
            fullName: `${runner.firstName || ""} ${runner.lastName || ""}`.trim() || "Runner",
            phone: runner.phone || "N/A",
            email: runner.email,
            raceCategory: regObj.raceCategory,
            paymentMode: "UPI", 
            invoiceNo: `LRCP-${regObj.raceCategory}-${Date.now().toString().slice(-4)}`,

            // 💰 FORCED CASTING: Ensures the PDF sees the 1.04 instead of 0.00
            rawRegistrationFee: parseFloat(runner.registrationFee || 0),
            discountAmount: parseFloat(runner.discountAmount || 0),
            platformFee: parseFloat(runner.platformFee || 0),
            pgFee: parseFloat(runner.pgFee || 0),
            gstAmount: parseFloat(runner.gstAmount || 0),
            amount: parseFloat(runner.amount || 0) 
        };

        console.log(`[FIX-LOG] Sending Invoice for Amount: ${invoiceData.amount}`);

        await sendInvoiceEmail(invoiceData.email, invoiceData);

        return res.status(200).json({ success: true, message: "Invoice Sent!", amountSent: invoiceData.amount });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

