const Registration = require('../models/Registration');
const multer = require('multer');
const AWS = require('aws-sdk');

/* =====================================================
   AWS S3 CONFIG
===================================================== */
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/* =====================================================
   MULTER (MEMORY STORAGE)
===================================================== */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Invalid file type'), false);
    }
});

exports.uploadIDProof = upload.single('idProofFile');

/* =====================================================
   COUPON CONFIG
===================================================== */
const COUPONS = {
    LOKRAJA10: {
        percent: 10,
        registrationType: 'individual'
    }
};

/* =====================================================
   SUBMIT REGISTRATION
===================================================== */
exports.submitRegistration = async (req, res) => {
    try {
        const data = req.body;

        /* ----------------------------------
           FILE REQUIRED FOR NON-GROUP
        ---------------------------------- */
        if (
            (data.registrationType !== 'group' && !req.file) ||
            (data.registrationType === 'group' && !req.file)
        ) {
            return res.status(400).json({
                success: false,
                message: 'ID proof document is required'
            });
        }


        /* ----------------------------------
           PARSE runnerDetails (SAFE)
        ---------------------------------- */
        let runnerDetailsParsed = {};
        if (data.runnerDetails && typeof data.runnerDetails === 'string') {
            try {
                runnerDetailsParsed = JSON.parse(data.runnerDetails);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid runnerDetails format'
                });
            }
        }

        const mergedData = { ...data, ...runnerDetailsParsed };

        /* ----------------------------------
           DOB VALIDATION (NON-GROUP)
        ---------------------------------- */
        if (mergedData.registrationType !== 'group' && !mergedData.dob) {
            return res.status(400).json({
                success: false,
                message: 'Date of Birth (dob) is required'
            });
        }

        /* ----------------------------------
           AMOUNT VALIDATION
        ---------------------------------- */
        const finalAmount = Number(mergedData.amount);
        if (!finalAmount || finalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid registration amount'
            });
        }

        /* ----------------------------------
           COUPON CALCULATION
        ---------------------------------- */
        let discountPercent = 0;
        let discountAmount = 0;

        const couponCode =
            typeof mergedData.referralCode === 'string'
                ? mergedData.referralCode.trim().toUpperCase()
                : null;

        if (
            couponCode &&
            COUPONS[couponCode] &&
            mergedData.registrationType === COUPONS[couponCode].registrationType
        ) {
            discountPercent = COUPONS[couponCode].percent;
            const baseFee = Number(mergedData.registrationFee) || 0;
            if (baseFee > 0) {
                discountAmount = Math.round(baseFee * (discountPercent / 100));
            }
        }

        /* ----------------------------------
           GROUP MEMBERS PARSE + NORMALIZE
        ---------------------------------- */
        let groupMembers = [];
        if (mergedData.registrationType === 'group') {
            try {
                const rawMembers = JSON.parse(mergedData.groupMembers || '[]');
                groupMembers = rawMembers.map(m => ({
                    firstName: m.firstName,
                    lastName: m.lastName,
                    email: m.email,
                    phone: m.phone,
                    dob: new Date(m.dob),
                    gender: m.gender,
                    tshirtSize: m.tshirtSize,
                    nationality: m.nationality,
                    raceCategory: m.raceCategory || m.raceId
                }));
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid group members data'
                });
            }
        }

        /* ----------------------------------
           UPLOAD ID PROOF TO S3
        ---------------------------------- */
        let idProofData;

        if (req.file) {
            const ext = req.file.originalname.split('.').pop();

            const uploadResult = await s3.upload({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `id-proofs/${req.user.id}-${Date.now()}.${ext}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'private'
            }).promise();

            idProofData = {
                idType: mergedData.idType,
                idNumber: mergedData.idNumber,
                path: uploadResult.Location
            };
        }

        // ----------------------------------
        // PREVENT DUPLICATE PENDING REGISTRATION
        // ----------------------------------
        const existingRegistration = await Registration.findOne({
            user: req.user.id,
            paymentStatus: 'pending'
        });

        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                errorCode: 'REGISTRATION_EXISTS',
                message: 'You already have a pending registration.',
                registrationId: existingRegistration._id
            });
        }

        /* ----------------------------------
           CREATE REGISTRATION DOCUMENT
        ---------------------------------- */
        const registration = new Registration({
            user: req.user.id,
            registrationType: mergedData.registrationType,
            raceCategory: mergedData.raceId || mergedData.raceCategory,

            runnerDetails:
                mergedData.registrationType !== 'group'
                    ? {
                        firstName: mergedData.firstName,
                        lastName: mergedData.lastName,
                        parentName: mergedData.parentName,
                        parentPhone: mergedData.parentPhone,
                        email: mergedData.email,
                        phone: mergedData.phone,
                        whatsapp: mergedData.whatsapp,
                        dob: mergedData.dob,
                        gender: mergedData.gender,
                        bloodGroup: mergedData.bloodGroup,
                        nationality: mergedData.nationality,
                        address: mergedData.address,
                        city: mergedData.city,
                        state: mergedData.state,
                        pincode: mergedData.pincode,
                        country: mergedData.country,
                        experience: mergedData.experience,
                        finishTime: mergedData.finishTime,
                        dietary: mergedData.dietary,
                        tshirtSize: mergedData.tshirtSize,
                        registrationFee: Number(mergedData.registrationFee) || finalAmount,
                        couponCode,
                        discountPercent,
                        discountAmount,
                        platformFee: Number(mergedData.platformFee) || 0,
                        pgFee: Number(mergedData.pgFee) || 0,
                        gstAmount: Number(mergedData.gstAmount) || 0,
                        amount: finalAmount
                    }
                    : undefined,

            idProof: idProofData,

            groupName:
                mergedData.registrationType === 'group'
                    ? mergedData.groupName
                    : undefined,

            groupMembers:
                mergedData.registrationType === 'group'
                    ? groupMembers
                    : undefined,

            registrationStatus: 'Pending Payment',
            paymentStatus: 'pending'
        });

        const savedRegistration = await registration.save();

        return res.status(201).json({
            success: true,
            message: 'Registration saved! Proceed to payment.',
            registrationId: savedRegistration._id
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
