// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\expoController.js
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const BIB_RANGES = require('../constants/bibRanges');

// 1. SEARCH RUNNER (By QR ID, Phone, or Name)
exports.searchRunner = async (req, res) => {
    try {
        const { query } = req.params;

        const runner = await Registration.findOne({
            $or: [
                { "runnerDetails.phone": query },
                { "runnerDetails.email": query.toLowerCase() },
                { "_id": query.length === 24 ? query : null } // Check if query is a valid MongoDB ID
            ]
        });

        if (!runner) {
            return res.status(404).json({ success: false, message: "No runner found with those details." });
        }

        res.status(200).json({ success: true, data: runner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. AUTO-ASSIGN AND ISSUE KIT
exports.checkInRunner = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { tshirtIssued, kitIssued, isVerified } = req.body;

        const registration = await Registration.findById(registrationId);
        if (!registration) return res.status(404).json({ message: "Registration not found" });

        // Prevent double distribution
        if (registration.expoDetails.bibCollected) {
            return res.status(400).json({ success: false, message: "Kit already collected for this runner!" });
        }

        // Identify Bib Range
        const categoryKey = registration.registrationType === 'charity' ? 'charity' : registration.raceCategory.toLowerCase();
        const config = BIB_RANGES[categoryKey];

        // Find the latest assigned bib in this category to get the next number
        const lastAssigned = await Registration.findOne({
            raceCategory: registration.raceCategory,
            "expoDetails.bibNumber": { $regex: `^${config.prefix}` }
        }).sort({ "expoDetails.bibNumber": -1 });

        let nextNumber;
        if (!lastAssigned || !lastAssigned.expoDetails.bibNumber) {
            nextNumber = config.start;
        } else {
            // Extract number from bib string (e.g., "C1005" -> 1005)
            const currentMax = parseInt(lastAssigned.expoDetails.bibNumber.replace(/^\D+/g, ''));
            nextNumber = currentMax + 1;
        }

        if (nextNumber > config.end) {
            return res.status(400).json({ success: false, message: `Bib range exhausted for ${categoryKey}` });
        }

        const finalBib = `${config.prefix}${nextNumber}`;

        // Update Registration
        registration.expoDetails = {
            bibNumber: finalBib,
            bibCollected: true,
            tshirtIssued: tshirtIssued,
            kitIssued: kitIssued,
            isVerified: isVerified,
            collectedAt: new Date(),
            lastUpdatedBy: req.user.id // ID of the volunteer/admin logged in
        };

        await registration.save();

        res.status(200).json({ 
            success: true, 
            message: "Check-in Successful", 
            bibAssigned: finalBib 
        });

    } catch (error) {
        console.error("Check-in Error:", error);
        res.status(500).json({ success: false, message: "Server error during check-in" });
    }
};