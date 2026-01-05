// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\registrationController.js

const Registration = require('../models/Registration');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// --- 1. Multer Storage Setup ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// --- COUPON CONFIG ---
const COUPONS = {
    LOKRAJA10: {
        percent: 10,
        registrationType: "individual"
    }
};

// --- 2. Middleware Configuration ---
exports.uploadIDProof = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, or PDF are allowed.'), false);
        }
    }
}).single('idProofFile');

// --- 3. Unified Registration Logic ---
exports.submitRegistration = async (req, res) => {
    try {
        // --- NECESSARY CHANGE 1: CHECK FILE FIRST ---
        if (!req.file) {
            return res.status(400).json({ success: false, message: "ID proof document is required" });
        }

        let data = req.body;
        if (data.runnerDetails && typeof data.runnerDetails === 'string') {
            try {
                const nestedData = JSON.parse(data.runnerDetails);
                data = { ...data, ...nestedData }; 
            } catch (e) {
                console.log("runnerDetails was not a JSON string, using raw body.");
            }
        }

        let parsedRunnerDetails = null;
        if (data.runnerDetails && typeof data.runnerDetails === "string") {
            try {
                parsedRunnerDetails = JSON.parse(data.runnerDetails);
            } catch {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({ success: false, message: "Invalid runner details format" });
            }
        }

        const finalAmount = Number(data.amount);
        const rawDob = data.dob || parsedRunnerDetails?.dob;

        if (!rawDob) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: 'Date of Birth (dob) is required.' });
        }

        // --- NECESSARY CHANGE 2: CALCULATE VARIABLES BEFORE USING THEM IN OBJECTS ---
        let discountAmount = 0;
        let discountPercent = 0;
        const couponCode = typeof data.referralCode === "string" ? data.referralCode.trim().toUpperCase() : "";

        if (couponCode && COUPONS[couponCode] && data.registrationType === COUPONS[couponCode].registrationType) {
            discountPercent = COUPONS[couponCode].percent;
            const baseFee = Number(data.registrationFee) || 0;
            if (baseFee > 0) {
                discountAmount = Math.round(baseFee * (discountPercent / 100));
            }
        }

        let parsedGroupMembers = [];
        if (data.registrationType === "group") {
            try {
                parsedGroupMembers = JSON.parse(data.groupMembers);
            } catch {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({ success: false, message: "Invalid group members data" });
            }
        }

        const registrationData = {
            user: req.user.id,
            registrationType: data.registrationType,
            raceCategory: data.raceId || data.raceCategory,
            groupName: data.registrationType === "group" ? data.groupName : undefined,
            groupMembers: data.registrationType === "group" ? parsedGroupMembers : undefined,
            runnerDetails: {
                ...data,
                ...parsedRunnerDetails,
                registrationFee: Number(data.registrationFee) || finalAmount,
                couponCode,
                discountPercent,
                discountAmount,
                platformFee: Number(data.platformFee) || 0,
                pgFee: Number(data.pgFee) || 0,
                gstAmount: Number(data.gstAmount) || 0,
                amount: finalAmount
            },
            idProof: {
                idType: data.idType,
                idNumber: data.idNumber,
                path: req.file.path
            },
            registrationStatus: "Pending Payment"
        };

        if (!finalAmount || finalAmount <= 0) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: 'Invalid registration amount' });
        }

        const registration = new Registration({
            user: req.user.id,
            registrationType: data.registrationType,
            raceCategory: data.raceId || data.raceCategory,
            runnerDetails: {
                ...data,
                registrationFee: Number(data.registrationFee) || finalAmount,
                couponCode: couponCode || null,
                discountPercent: discountPercent,
                discountAmount: discountAmount,
                platformFee: Number(data.platformFee) || 0,
                pgFee: Number(data.pgFee) || 0,
                gstAmount: Number(data.gstAmount) || 0,
                amount: finalAmount
            },
            idProof: {
                idType: data.idType,
                idNumber: data.idNumber,
                path: req.file.path
            },
            registrationStatus: 'Pending Payment'
        });

        const savedRegistration = await registration.save();

        res.status(201).json({
            success: true,
            message: 'Registration saved! Proceed to payment.',
            registrationId: savedRegistration._id
        });

    } catch (error) {
        if (req.file) { fs.unlinkSync(req.file.path); }
        console.error('Registration Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};