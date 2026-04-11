// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\models\Registration.js
const mongoose = require('mongoose');

// Sub-Schema for Runner Details
const RunnerDetailsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    parentName: { type: String, default: "" },
    parentPhone: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    // CHANGE: Changed to Mixed to allow strings like "NA" or messy Excel dates
    dob: { type: mongoose.Schema.Types.Mixed, default: "NA" }, 
    gender: { type: String, default: "NA" },
    bloodGroup: { type: String, default: "" },
    nationality: { type: String, default: "India" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: 'India' },
    experience: { type: String, default: "" },
    finishTime: { type: String, default: "" },
    dietary: { type: String, default: "" },
    tshirtSize: { type: String, default: "NA" }
}, { strict: false });

// Sub-Schema for ID Proof
const IDProofSchema = new mongoose.Schema({
    idType: { type: String, default: "Other" },
    idNumber: { type: String, default: "" },
    path: { type: String, default: "" }
});

// Sub-Schema for Payment tracking
const PaymentDetailsSchema = new mongoose.Schema({
    orderId: { type: String, default: "MANUAL" }, 
    paymentId: { type: String, default: "OFFLINE" },
    signature: { type: String }, 
    status: { type: String, default: 'success' },
    paidAt: { type: Date, default: Date.now },
}, { _id: false });

const ExpoDetailsSchema = new mongoose.Schema({
    bibNumber: { type: String, sparse: true }, 
    assignedBib: { type: String }, 
    isVerifiedByScan: { type: Boolean, default: false }, 
    isEmailSent: { type: Boolean, default: false }, // The "Memory" flag
    bibCollected: { type: Boolean, default: false },
    tshirtIssued: { type: Boolean, default: false },
    kitIssued: { type: Boolean, default: false },
    collectedAt: { type: Date },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const RegistrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    
    registrationSource: { 
        type: String, 
        enum: ['website', 'external_import', 'India Running'], 
        default: 'website' 
    },

    registrationType: { type: String, required: true, enum: ['individual', 'group', 'charity'] },
    raceCategory: { type: String, default: "5K" },
    amount: { type: Number, default: 0 },
    registrationFee: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    pgFee: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    
    runnerDetails: {
        type: RunnerDetailsSchema,
        required: function () { return this.registrationType !== 'group'; }
    },

    idProof: {
        type: IDProofSchema,
        required: function () { 
            return this.registrationType !== 'group' && this.registrationSource === 'website'; 
        }
    },

    groupName: {
        type: String,
        required: function () { return this.registrationType === 'group'; }
    },

    groupMembers: [new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, default: "" },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
        // CHANGE: Also Mixed here for consistency
        dob: { type: mongoose.Schema.Types.Mixed, default: "NA" },
        gender: { type: String, default: "NA" },
        tshirtSize: { type: String, default: "NA" },
        raceCategory: { type: String, default: "5K" },
        expoDetails: { type: ExpoDetailsSchema, default: () => ({}) },
        nationality: { type: String, default: "India" },
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        country: { type: String, default: "India" },
        parentName: { type: String, default: "" },
        parentPhone: { type: String, default: "" },
    })],

    paymentDetails: { type: PaymentDetailsSchema, required: false },
    expoDetails: { type: ExpoDetailsSchema, default: () => ({}) },

    registrationStatus: {
        type: String,
        default: 'Verified',
        enum: ['Pending Payment', 'Awaiting Verification', 'Verified', 'Rejected']
    },

    registeredAt: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "paid" }
});

RegistrationSchema.index({ user: 1, registrationStatus: 1 });
RegistrationSchema.index({ "runnerDetails.phone": 1 });
RegistrationSchema.index({ "runnerDetails.email": 1 });

module.exports = mongoose.model('Registration', RegistrationSchema);