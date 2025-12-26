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
// exports.verifyPayment = async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

//     if (!razorpay_payment_id || !registrationId) {
//         return res.status(400).json({ success: false, message: 'Missing payment details.' });
//     }

//     try {
//         const registration = await Registration.findById(registrationId).lean();
//         if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });
//         // if (registration.registrationStatus === 'Verified') {
//         //     return res.status(400).json({ success: false, message: 'Payment already completed' });
//         // }

//         // 1. Get Payment Method
//         let paymentMethod = 'ONLINE';
//         try {
//             const paymentInstance = await razorpayInstance.payments.fetch(razorpay_payment_id);
//             paymentMethod = paymentInstance.method.toUpperCase(); 
//         } catch (fetchError) {
//             console.error("⚠️ Could not fetch payment method");
//         }

//         // 2. Update Status
//         registration.registrationStatus = 'Verified';
//         registration.paymentDetails = {
//             orderId: razorpay_order_id,
//             paymentId: razorpay_payment_id,
//             signature: razorpay_signature,
//             status: 'success',
//             paidAt: new Date(),
//         };
//         await registration.save();

//         // 3. Prepare Invoice Data (Mapped directly to your runnerDetails storage)
//         try {
//             // Shorthand to access nested fields confirmed in your Registration.js model
//             const runner = registration.runnerDetails; 

//             const invoiceData = {
//                 firstName: runner.firstName,
//                 lastName: runner.lastName,
//                 fullName: `${runner.firstName} ${runner.lastName}`,
//                 phone: runner.phone,
//                 email: runner.email,
//                 raceCategory: registration.raceCategory,
//                 paymentMode: paymentMethod,
//                 invoiceNo: `LRCP-${registration.raceCategory}-${Date.now().toString().slice(-4)}`,

//                 // 💰 Corrected Mapping to match your registrationController save logic
//                 rawRegistrationFee: runner.registrationFee || 0,
//                 discountAmount: runner.discountAmount || 0,
//                 platformFee: runner.platformFee || 0,
//                 pgFee: runner.pgFee || 0,
//                 gstAmount: runner.gstAmount || 0,
//                 amount: runner.amount || 0 // This captures the ₹1.04 paid amount
//             };

//             // SYSTEM LOG: Verify the mapping in your AWS logs
//             console.log(`[INVOICE-SYSTEM] Preparing email for ${invoiceData.email}. Amount Detected: ${invoiceData.amount}`);

//             // Send Email
//             await sendInvoiceEmail(runner.email, invoiceData);
//             console.log(`✅ Invoice ${invoiceData.invoiceNo} sent successfully.`);

//         } catch (emailDataError) {
//             console.error("❌ Error during invoice generation:", emailDataError.message);
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Payment verified successfully. Registration complete!',
//             registrationId,
//         });

//     } catch (error) {
//         console.error('Payment Verification Error:', error);
//         return res.status(500).json({ success: false, message: 'Payment verification failed.' });
//     }
// };

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

    if (!razorpay_payment_id || !registrationId) {
        return res.status(400).json({ success: false, message: 'Missing payment details.' });
    }

    try {
        // Use .lean() to get raw data for the invoice
        const registration = await Registration.findById(registrationId).lean();
        if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });

        // BYPASS 1: Hardcode payment method for this test to avoid Razorpay API error
        let paymentMethod = 'UPI'; 

        // BYPASS 2: Comment out .save() because .lean() objects can't be saved
        // registration.registrationStatus = 'Verified';
        // await registration.save();

        // 3. Prepare Invoice Data
        try {
            const runner = registration.runnerDetails; 
            const invoiceData = {
                firstName: runner.firstName,
                lastName: runner.lastName,
                fullName: `${runner.firstName} ${runner.lastName}`,
                phone: runner.phone,
                email: runner.email,
                raceCategory: registration.raceCategory,
                paymentMode: paymentMethod,
                invoiceNo: `LRCP-${registration.raceCategory}-${Date.now().toString().slice(-4)}`,
                rawRegistrationFee: runner.registrationFee || 0,
                discountAmount: runner.discountAmount || 0,
                platformFee: runner.platformFee || 0,
                pgFee: runner.pgFee || 0,
                gstAmount: runner.gstAmount || 0,
                amount: runner.amount || 0 
            };

            console.log(`[INVOICE-SYSTEM] Amount Detected: ${invoiceData.amount}`);

            await sendInvoiceEmail(runner.email, invoiceData);
            console.log(`✅ Invoice sent successfully.`);

        } catch (emailDataError) {
            console.error("❌ Error during invoice generation:", emailDataError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'TEST MODE: Invoice triggered successfully!',
            registrationId,
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        return res.status(500).json({ success: false, message: 'Payment verification failed.' });
    }
};