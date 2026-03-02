// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\paymentController.js

const Razorpay = require('razorpay');
const Registration = require('../models/Registration');
const { sendInvoiceEmail } = require('../services/emailService');
const crypto = require('crypto');

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

// Race Labels
const raceLabels = {
  '5k': '5K Fun Run',
  '10k': '10K Challenge',
  'half': 'Half Marathon (21.097K)',
  'full': 'Full Marathon (42K)',
  '35k': '35K Ultra'
};

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
  try {
    let orderId, paymentId, signature, registrationId;

    // 1. DETERMINE DATA SOURCE (Webhook vs Frontend)
    if (req.body.event) {
      // --- WEBHOOK FLOW ---
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const headerSignature = req.headers['x-razorpay-signature'];
      
      // Verify Signature for Security
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== headerSignature) {
        console.error("Invalid Webhook Signature");
        return res.status(400).json({ message: 'Invalid signature' });
      }

      const payload = req.body.payload.payment.entity;
      orderId = payload.order_id;
      paymentId = payload.id;
      registrationId = payload.notes.registrationId;
      signature = 'webhook_verified'; 
    } else {
      // --- FRONTEND REDIRECT FLOW ---
      ({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, registrationId } = req.body);
    }

    // 2. FETCH REGISTRATION
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      console.error("Registration not found for ID:", registrationId);
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // 3. PREVENT DOUBLE PROCESSING
    if (registration.paymentStatus === "paid") {
      return res.status(200).json({ success: true, message: "Payment already verified" });
    }

    // 4. FETCH DYNAMIC PAYMENT METHOD
    let dynamicMethod = 'Razorpay';
    try {
      const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
      const method = paymentDetails.method;
      dynamicMethod = method === 'upi' ? 'UPI' : method.charAt(0).toUpperCase() + method.slice(1);
    } catch (razorpayError) {
      console.error("Could not fetch payment method:", razorpayError.message);
    }

    // 5. UPDATE DATABASE (Using the variables we extracted)
    registration.paymentDetails = {
      orderId: orderId,
      paymentId: paymentId,
      signature: signature,
      status: 'success',
      paidAt: new Date()
    };

    registration.paymentStatus = "paid";
    registration.registrationStatus = "Verified";
    await registration.save();

    // ---------------------------------------------------------
    // 6. PREPARE EMAIL DATA (FIXED FOR NEW INVOICE STYLE)
    // ---------------------------------------------------------
    const isGroup = registration.registrationType === 'group';
    const primary = isGroup ? registration.groupMembers[0] : registration.runnerDetails;

    const invoiceData = {
      firstName: primary.firstName,
      lastName: primary.lastName,
      fullName: `${primary.firstName} ${primary.lastName}`,
      phone: primary.phone,
      email: primary.email,
      registrationType: registration.registrationType,
      raceCategory: raceLabels[registration.raceCategory] || registration.raceCategory,
      paymentMode: dynamicMethod,
      invoiceNo: `LRCP-${paymentId.slice(-6).toUpperCase()}`, 
      
      // CRITICAL: Matches the keys used in emailService.js PDF generator
      rawRegistrationFee: registration.registrationFee || 0,
      registrationFee: registration.registrationFee || 0,
      discountAmount: registration.discountAmount || 0,
      platformFee: registration.platformFee || 0,
      pgFee: registration.pgFee || 0,
      gstAmount: registration.gstAmount || 0,
      amount: Number(registration.amount || 0)
    };

    // ---------------------------------------------------------
    // 7. SEND INVOICE (Triggers the new PDF + HTML template)
    // ---------------------------------------------------------
    await sendInvoiceEmail(invoiceData.email, invoiceData);

        return res.status(200).json({
          success: true,
          message: 'Payment verified & invoice sent'
        });
      } catch (error) {
        console.error('Payment Verification Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to verify payment.'
        });
      }
    };
  exports.downloadInvoice = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration || registration.paymentStatus !== 'paid') {
      return res.status(404).send("Invoice not available.");
    }

    // --- FETCH DYNAMIC PAYMENT METHOD FROM RAZORPAY ---
    let dynamicMethod = 'Razorpay';
    try {
      const paymentId = registration.paymentDetails.paymentId;
      const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
      const method = paymentDetails.method;
      dynamicMethod = method === 'upi' ? 'UPI' : method.charAt(0).toUpperCase() + method.slice(1);
    } catch (razorpayError) {
      console.error("Could not fetch Razorpay method, defaulting to Razorpay");
    }

    const isGroup = registration.registrationType === 'group';
    const primary = isGroup ? registration.groupMembers[0] : registration.runnerDetails;

    const paymentData = {
      invoiceNo: registration.paymentDetails.paymentId.slice(-8).toUpperCase(),
      firstName: primary?.firstName || "Participant",
      fullName: `${primary?.firstName} ${primary?.lastName}`,
      phone: primary?.phone,
      email: primary?.email,
      raceCategory: raceLabels[registration.raceCategory] || registration.raceCategory,
      registrationType: registration.registrationType,
      
      // SYNCED KEYS FOR NEW PDF DESIGN
      amount: registration.amount || 0,
      rawRegistrationFee: registration.registrationFee || 0,
      registrationFee: registration.registrationFee || 0,
      discountAmount: registration.discountAmount || 0,
      platformFee: registration.platformFee || 0,
      pgFee: registration.pgFee || 0,
      gstAmount: registration.gstAmount || 0,
      paymentMode: dynamicMethod // Uses the fetched method
    };

    await sendInvoiceEmail(paymentData.email, paymentData, res);
  } catch (error) {
    console.error("Invoice Download Error:", error);
    res.status(500).send("Error generating invoice");
  }
};