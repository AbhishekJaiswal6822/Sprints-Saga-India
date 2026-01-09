// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\paymentController.js

const Razorpay = require('razorpay');
const Registration = require('../models/Registration');
const { sendInvoiceEmail } = require('../services/emailService');

// Initialize the Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  //  FIX: Changed to match your .env variable name
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Optional: Temporary log to verify keys are loading in the terminal
// console.log("Razorpay Keys Initialized:", {
//   key_id: !!process.env.RAZORPAY_KEY_ID,
//   key_secret: !!process.env.RAZORPAY_KEY_SECRET
// });

// --------------------------------------------------
// 1️ Create Razorpay Order
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

    //  STEP 1: FETCH REGISTRATION
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    //  BLOCK DOUBLE PAYMENT 
    if (registration.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        message: "Payment already completed for this registration",
      });
    }
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



exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    registrationId
  } = req.body;

  try {
    // 1️ Fetch registration
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    //  ABSOLUTE PROTECTION
    if (registration.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    // --- NEW: FETCH DYNAMIC PAYMENT METHOD FROM RAZORPAY ---
    let dynamicMethod = 'Razorpay';
    try {
      const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
      const method = paymentDetails.method;
      if (method === 'upi') {
        dynamicMethod = 'UPI';
      } else {
        dynamicMethod = method.charAt(0).toUpperCase() + method.slice(1);
      }
    } catch (razorpayError) {
      console.error("Could not fetch Razorpay method in verifyPayment:", razorpayError);
    }

    // 2️ SAVE PAYMENT DETAILS (CRITICAL)
    registration.paymentDetails = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'success',
      paidAt: new Date()
    };

    // 3️ UPDATE REGISTRATION STATUS.
    // 4️ SAVE TO DATABASE
    registration.paymentStatus = "paid";
    registration.registrationStatus = "Verified";
    await registration.save();

    // 5️  HANDLE GROUP VS INDIVIDUAL FOR EMAIL
    const isGroup = registration.registrationType === 'group';
    const primary = isGroup ? registration.groupMembers[0] : registration.runnerDetails;

    const invoiceData = {
      firstName: primary.firstName,
      lastName: primary.lastName,
      fullName: `${primary.firstName} ${primary.lastName}`,
      phone: primary.phone,
      email: primary.email,
      registrationType: registration.registrationType,
      raceCategory: registration.raceCategory,
      paymentMode: dynamicMethod,
      invoiceNo: `LRCP-${Date.now()}`,
      //  FIX: Use the root fields that you are now saving in registrationController
      rawRegistrationFee: registration.registrationFee || registration.runnerDetails?.registrationFee || 0,
      discountAmount: registration.discountAmount || registration.runnerDetails?.discountAmount || 0,
      platformFee: registration.platformFee || registration.runnerDetails?.platformFee || 0,
      pgFee: registration.pgFee || registration.runnerDetails?.pgFee || 0,
      gstAmount: registration.gstAmount || registration.runnerDetails?.gstAmount || 0,
      amount: Number(registration.amount || registration.runnerDetails?.amount || 0)
    };

    // 6️ SEND INVOICE EMAIL
    await sendInvoiceEmail(invoiceData.email, invoiceData);

    return res.status(200).json({
      success: true,
      message: 'Payment verified & invoice sent',
      amountSent: invoiceData.amount
    });

  } catch (error) {
    console.error(' Verify payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Verification failed'
    });
  }
};


exports.downloadInvoice = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);

    if (!registration || registration.paymentStatus !== 'paid') {
      return res.status(404).send("Invoice not available.");
    }

    // --- NEW: FETCH DYNAMIC PAYMENT METHOD FROM RAZORPAY ---
    let dynamicMethod = 'Razorpay'; 
    try {
      const paymentId = registration.paymentDetails.paymentId;
      const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
      const method = paymentDetails.method; 
      if (method === 'upi') {
          dynamicMethod = 'UPI'; // Keep UPI all caps
      } else {
          dynamicMethod = method.charAt(0).toUpperCase() + method.slice(1); // 'Card', 'Wallet'
      }
    } catch (razorpayError) {
      console.error("Could not fetch Razorpay method, defaulting to Razorpay");
    }

    // Fix #3: Handle both Individual and Group naming
    const isGroup = registration.registrationType === 'group';
    const primary = isGroup ? registration.groupMembers[0] : registration.runnerDetails;

    const paymentData = {
      invoiceNo: registration.paymentDetails.paymentId.slice(-8).toUpperCase(),
      firstName: primary?.firstName || "Participant",
      fullName: `${primary?.firstName} ${primary?.lastName}`,
      phone: primary?.phone,
      email: primary?.email,
      raceCategory: registration.raceCategory,
      registrationType: registration.registrationType,
      amount: registration.amount || registration.runnerDetails?.amount || 0,
      rawRegistrationFee: registration.registrationFee || registration.runnerDetails?.registrationFee || 0,
      discountAmount: registration.discountAmount || registration.runnerDetails?.discountAmount || 0,
      platformFee: registration.platformFee || registration.runnerDetails?.platformFee || 0,
      pgFee: registration.pgFee || registration.runnerDetails?.pgFee || 0,
      gstAmount: registration.gstAmount || registration.runnerDetails?.gstAmount || 0,
      paymentMode: dynamicMethod || "Razor Pay"
    };

    // Service handles headers and piping
    await sendInvoiceEmail(paymentData.email, paymentData, res);

  } catch (error) {
    console.error("Invoice Download Error:", error);
    res.status(500).send("Error generating invoice");
  }
};

