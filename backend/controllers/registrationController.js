// backend/controllers/registrationController.js

const Registration = require('../models/Registration');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

/* =====================================================
   1. MULTER STORAGE SETUP
===================================================== */
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
});

exports.uploadIDProof = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type. Only JPEG, PNG, or PDF allowed.'));
    }
}).single('idProofFile');

/* =====================================================
   2. COUPON CONFIG
===================================================== */
const COUPONS = {
    LOKRAJA10: {
        percent: 10,
        registrationType: 'individual'
    }
};

/* =====================================================
   3. SUBMIT REGISTRATION
===================================================== */
exports.submitRegistration = async (req, res) => {
    try {
        /* ---------------------------
           BASIC VALIDATIONS
        --------------------------- */
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'ID proof document is required'
            });
        }

        let data = req.body;

        /* ---------------------------
           PARSE runnerDetails (SAFE)
        --------------------------- */
        let parsedRunnerDetails = {};
        if (data.runnerDetails && typeof data.runnerDetails === 'string') {
            try {
                parsedRunnerDetails = JSON.parse(data.runnerDetails);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid runner details format'
                });
            }
        }

        // Merge flat + nested
        data = { ...data, ...parsedRunnerDetails };

        /* ---------------------------
           DOB VALIDATION
        --------------------------- */
        if (!data.dob) {
            return res.status(400).json({
                success: false,
                message: 'Date of Birth (dob) is required'
            });
        }

        /* ---------------------------
           FINAL AMOUNT VALIDATION
        --------------------------- */
        const finalAmount = Number(data.amount);
        if (!finalAmount || finalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid registration amount'
            });
        }

        /* ---------------------------
           GROUP MEMBERS (SAFE PARSE)
        --------------------------- */
        let groupMembers = [];
        if (data.registrationType === 'group') {
            try {
                groupMembers = JSON.parse(data.groupMembers || '[]');
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid group members data'
                });
            }
        }

        /* ---------------------------
           COUPON VALIDATION (BACKEND)
        --------------------------- */
        let discountPercent = 0;
        let discountAmount = 0;

        const couponCode =
            typeof data.referralCode === 'string'
                ? data.referralCode.trim().toUpperCase()
                : null;

        if (
            couponCode &&
            COUPONS[couponCode] &&
            COUPONS[couponCode].registrationType === data.registrationType
        ) {
            discountPercent = COUPONS[couponCode].percent;
            const baseFee = Number(data.registrationFee) || 0;

            if (baseFee > 0) {
                discountAmount = Math.round(baseFee * (discountPercent / 100));
            }
        }

        /* ---------------------------
           BUILD REGISTRATION OBJECT
        --------------------------- */
        const registrationData = {
            user: req.user.id,
            registrationType: data.registrationType,
            raceCategory: data.raceId || data.raceCategory,

            runnerDetails: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                dob: data.dob,
                gender: data.gender,
                nationality: data.nationality,
                address: data.address,

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

            registrationStatus: 'Pending Payment',
            paymentStatus: 'pending'
        };

        if (data.registrationType === 'group') {
            registrationData.groupName = data.groupName;
            registrationData.groupMembers = groupMembers;
        }

        /* ---------------------------
           SAVE REGISTRATION
        --------------------------- */
        const savedRegistration = await Registration.create(registrationData);

        return res.status(201).json({
            success: true,
            message: 'Registration saved! Proceed to payment.',
            registrationId: savedRegistration._id
        });

    } catch (error) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        console.error('Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
