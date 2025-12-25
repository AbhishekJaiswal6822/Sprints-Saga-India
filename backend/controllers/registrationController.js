// // C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\registrationController.js

// const Registration = require('../models/Registration');
// const multer = require('multer'); 
// const fs = require('fs'); 
// const Registration = require('../models/Registration');
// // Assuming the required Mongoose model Registration is correctly imported

// // --- 1. Multer Storage Setup ---
// const uploadDir = 'uploads/';

// // Ensure the upload directory exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir); 
//     },
//     filename: function (req, file, cb) {
//         // Create unique file name: fieldname-timestamp.ext
//         cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
//     }
// });

// // --- 2. Multer upload middleware configuration ---
// // 'idProofFile' must match the FormData key from the frontend
// exports.uploadIDProof = multer({ 
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only JPEG, PNG, or PDF are allowed.'), false);
//         }
//     }
// }).single('idProofFile');

// exports.submitRegistration = async (req, res) => {
//     try {
//         const { 
//             registrationType, 
//             raceCategory, 
//             runnerDetails,
//             registrationFee,
//             discountAmount,
//             platformFee,
//             pgFee,
//             gstAmount,
//             amount 
//         } = req.body;

//         const registration = new Registration({
//             user: req.user.id,
//             registrationType,
//             raceCategory,
//             runnerDetails: {
//                 ...runnerDetails, 
//                 registrationFee: registrationFee || 0,
//                 discountAmount: discountAmount || 0,
//                 platformFee: platformFee || 0,
//                 pgFee: pgFee || 0,
//                 gstAmount: gstAmount || 0,
//                 amount: amount 
//             },
//             idProof: {
//                 idType: req.body.idType,
//                 idNumber: req.body.idNumber,
//                 path: req.file ? req.file.path : ''
//             },
//             registrationStatus: 'Pending Payment'
//         });

//         const savedRegistration = await registration.save();
//         res.status(201).json({ success: true, registrationId: savedRegistration._id });
        
//     } catch (error) {
//         console.error('Registration Error:', error.message);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

// // --- 3. Main Registration Logic ---
// exports.submitRegistration = async (req, res) => {
//     
//     // 🛑 CRITICAL FIX: Extract ALL necessary fields from req.body
//     const { 
//         registrationType, 
//         raceId, // Race ID from frontend (e.g., '5k', '10k')
//         
//         // Runner Details (Individual Example - Must match RunnerDetailsSchema)
//         firstName, lastName, parentName, parentPhone, email, phone, whatsapp, 
//         dob, gender, bloodGroup, nationality, address, city, state, pincode, 
//         country, experience, finishTime, dietary, tshirtSize,
//         
//         // ID Proof Details (Must match IDProofSchema)
//         idType, idNumber,

//         // Note: For 'group' and 'charity', the req.body structure will be different 
//         // and require conditional mapping logic here. We focus on 'individual' for now.
//     } = req.body; 

//     const userId = req.user.id; // User ID extracted from authMiddleware

//     // --- Validation and File Check ---
//     if (!req.file) {
//         return res.status(400).json({ message: 'ID Proof file is required.' });
//     }

//     // --- Temp Variable to get Full Race Name (assuming Race Categories are fixed on frontend) ---
//     // In a real app, you would look this up from a Race model/DB, but we use the provided ID for now.
//     // A more robust solution would be to match the ID to the full name saved in the frontend constants.
//     const raceCategoryName = raceId ? `${raceId.toUpperCase()} Run` : 'N/A'; 

//     try {
//         // --- Prevent Duplicate Registration ---
// //        const existingRegistration = await Registration.findOne({ user: userId });

// // if (existingRegistration) {
// //   if (req.file) {
// //     fs.unlinkSync(req.file.path);
// //   }

// //   return res.status(400).json({
// //     errorCode: "REGISTRATION_EXISTS",
// //     message: "User already has an active registration.",
// //     registrationId: existingRegistration._id
// //   });
// // }




//         // --- Create New Registration Document with CORRECT MAPPING ---
//         const newRegistration = new Registration({
//             user: userId,
//             registrationType,
//             raceCategory: raceCategoryName, // Save the full name

//             // 🛑 CRITICAL MAPPING: Nest flat fields into runnerDetails object
//             runnerDetails: {
//                 firstName, lastName, parentName, parentPhone, email, phone, whatsapp, 
//                 dob: new Date(dob), // <<< FINAL FIX APPLIED: Convert string to Date object
//                 gender, bloodGroup, nationality, address, city, state, pincode, 
//                 country, experience, finishTime, dietary, tshirtSize,
//             },
//             
//             // 🛑 CRITICAL MAPPING: Nest flat fields into idProof object
//             idProof: {
//                 idType,
//                 idNumber,
//                 path: req.file.path // Store the local file path
//             },

//             // Use the status field name from the Model
//             registrationStatus: 'Pending Payment' 
//         });

//         await newRegistration.save();

//         console.log(`[BACKEND SAVE]: Registration saved for User ${userId}. ID: ${newRegistration._id}`);

//         res.status(201).json({
//             success: true,
//             message: 'Registration details saved successfully! Proceed to payment.',
//             registrationId: newRegistration._id
//         });

//     } catch (err) {
//         console.error("CRITICAL BACKEND ERROR (Mongoose/Save Failure):", err);
//         // Clean up the uploaded file if saving fails
//         if (req.file) {
//             fs.unlinkSync(req.file.path);
//         }
//         // Send a detailed error response for debugging
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// };

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
                // Spread all data from body to capture firstName, lastName, phone, etc.
                ...data,
                dob: new Date(rawDob), 
                registrationFee: Number(data.registrationFee) || 0,
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

