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
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'ID Proof file is required.' });
        }

        // 🟢 FIX: Take everything from req.body
        const data = req.body;

        // 🟢 FIX: Handle 'dob' whether it's nested or flat (Since you aren't changing Register.jsx)
        const rawDob = data.dob || (data.runnerDetails && JSON.parse(data.runnerDetails).dob);
        
        if (!rawDob) {
            return res.status(400).json({ success: false, message: 'Date of Birth (dob) is required.' });
        }

        const registration = new Registration({
            user: req.user.id,
            registrationType: data.registrationType,
            raceCategory: data.raceCategory || data.raceId,
            runnerDetails: {
                ...data,
                dob: new Date(rawDob), 
                // 🟢 FIX: Map 'rawRegistrationFee' and force Number type
                registrationFee: Number(data.rawRegistrationFee) || 0, 
                discountAmount: Number(data.discountAmount) || 0,
                platformFee: Number(data.platformFee) || 0,
                pgFee: Number(data.pgFee) || 0,
                gstAmount: Number(data.gstAmount) || 0,
                amount: Number(data.amount) || 0 
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

