// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\models\Registration.js
const mongoose = require('mongoose');

// Define Sub-Schemas 
const RunnerDetailsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    parentName: { type: String },
    parentPhone: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    dob: { type: Date, required: false },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    experience: { type: String },
    finishTime: { type: String },
    dietary: { type: String },
    tshirtSize: { type: String, required: true }
}, { strict: true });

const IDProofSchema = new mongoose.Schema({
    idType: { type: String, required: true },
    idNumber: { type: String, required: true },
    path: { type: String, required: true }
});

const PaymentDetailsSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String }, 
    status: { type: String, default: 'success' },
    paidAt: { type: Date, default: Date.now },
}, { _id: false });

// NEW: Expo specific data sub-schema
const ExpoDetailsSchema = new mongoose.Schema({
    bibNumber: { type: String, unique: true, sparse: true },
    bibCollected: { type: Boolean, default: false },
    tshirtIssued: { type: Boolean, default: false },
    kitIssued: { type: Boolean, default: false },
    collectedAt: { type: Date },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const RegistrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrationType: { type: String, required: true, enum: ['individual', 'group', 'charity'] },
    raceCategory: { type: String, required: true },
    amount: { type: Number, required: true }, 
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
        required: function () { return this.registrationType !== 'group'; }
    },

    groupName: {
        type: String,
        required: function () { return this.registrationType === 'group'; }
    },
    groupMembers: [new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        whatsapp: { type: String },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        tshirtSize: { type: String, required: true },
        raceCategory: { type: String, required: true },
        // Track Expo status for each group member
        expoDetails: {
            bibNumber: { type: String },
            bibCollected: { type: Boolean, default: false },
            tshirtIssued: { type: Boolean, default: false }
        },
        nationality: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String },
        parentName: { type: String },
        parentPhone: { type: String },
    })],

    paymentDetails: { type: PaymentDetailsSchema, required: false },

    // For Individual/Charity Expo check-in
    expoDetails: { type: ExpoDetailsSchema, default: () => ({}) },

    registrationStatus: {
        type: String,
        default: 'Pending Payment',
        enum: ['Pending Payment', 'Awaiting Verification', 'Verified', 'Rejected']
    },

    registeredAt: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" }
});

RegistrationSchema.index({ user: 1, registrationStatus: 1 });
module.exports = mongoose.model('Registration', RegistrationSchema);