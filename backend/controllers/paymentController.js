// const Razorpay = require('razorpay');
// const Registration = require('../models/Registration');

// // Initialize the Razorpay instance
// const razorpayInstance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET, // must match .env
// });


// // --------------------------------------------------
// // 1️⃣ Create Razorpay Order
// // --------------------------------------------------
// exports.createOrder = async (req, res) => {
//     const { registrationId, amount } = req.body;

//     if (!registrationId || !amount) {
//         return res.status(400).json({
//             success: false,
//             message: 'Missing registration ID or amount.',
//         });
//     }

//     try {
//         const options = {
//             amount: Math.round(amount * 100), // paise
//             currency: 'INR',
//             receipt: `receipt_${registrationId}`,
//             notes: {
//                 registrationId,
//             },
//         };

//         const order = await razorpayInstance.orders.create(options);

//         return res.status(200).json({
//             key: process.env.RAZORPAY_KEY_ID,
//             order,
//         });

//     } catch (error) {
//         console.error('Razorpay Order Creation Error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to create payment order.',
//         });
//     }
// };


// // --------------------------------------------------
// // 2️⃣ Verify Payment & Update Registration
// // --------------------------------------------------
// exports.verifyPayment = async (req, res) => {
//     const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         registrationId,
//     } = req.body;

//     if (!razorpay_payment_id || !registrationId) {
//         return res.status(400).json({
//             success: false,
//             message: 'Missing payment details for verification.',
//         });
//     }

//     try {
//         // 🔎 Find registration
//         const registration = await Registration.findById(registrationId);

//         if (!registration) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Registration not found.',
//             });
//         }

//         // 🚫 PREVENT DUPLICATE PAYMENT (CRITICAL FIX)
//         if (registration.registrationStatus === 'Verified') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Payment already completed',
//             });
//         }

//         // ✅ Update registration after successful payment
//         registration.registrationStatus = 'Verified';
//         registration.paymentDetails = {
//             orderId: razorpay_order_id,
//             paymentId: razorpay_payment_id,
//             signature: razorpay_signature,
//             status: 'success',
//             paidAt: new Date(),
//         };

//         await registration.save();

//         return res.status(200).json({
//             success: true,
//             message: 'Payment verified successfully. Registration complete!',
//             registrationId,
//         });

//     } catch (error) {
//         console.error('Payment Verification Error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Payment verification failed on server.',
//         });
//     }
// };



const Razorpay = require('razorpay');
const Registration = require('../models/Registration');

// Initialize the Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET, // must match .env
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
            amount: Math.round(amount * 100), // paise
            currency: 'INR',
            receipt: `receipt_${registrationId}`,
            notes: {
                registrationId,
            },
            // -------------------------------------------------------------------
            // ✅ ADDED CONFIGURATION TO HIDE PAYMENT METHODS (EMI, WALLET, PAY LATER)
            // -------------------------------------------------------------------
            config: {
                display: {
                    hide: [
                        { method: 'emi' },      // Hides all EMI options
                        { method: 'paylater' }, // Hides all Pay Later options
                        { method: 'wallet' }    // Hides all Wallet options
                    ]
                }
            },
            // -------------------------------------------------------------------
        };

        const order = await razorpayInstance.orders.create(options);

        // NOTE: The 'order' object returned here is passed to the frontend.
        // The frontend then uses this order object and the KEY_ID to open the checkout
        // The 'config' object is carried along with the order ID to influence the checkout UI.
        return res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
            order,
        });

    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create payment order.',
        });
    }
};


// --------------------------------------------------
// 2️⃣ Verify Payment & Update Registration
// --------------------------------------------------
exports.verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        registrationId,
    } = req.body;

    if (!razorpay_payment_id || !registrationId) {
        return res.status(400).json({
            success: false,
            message: 'Missing payment details for verification.',
        });
    }

    try {
        // 🔎 Find registration
        const registration = await Registration.findById(registrationId);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found.',
            });
        }

        // 🚫 PREVENT DUPLICATE PAYMENT (CRITICAL FIX)
        if (registration.registrationStatus === 'Verified') {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed',
            });
        }

        // ✅ Update registration after successful payment
        registration.registrationStatus = 'Verified';
        registration.paymentDetails = {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            status: 'success',
            paidAt: new Date(),
        };

        await registration.save();

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully. Registration complete!',
            registrationId,
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Payment verification failed on server.',
        });
    }
};