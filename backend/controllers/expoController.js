// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\expoController.js
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const BIB_RANGES = require('../constants/bibRanges');

// 1. SEARCH RUNNER (Handles memberId for Groups)
exports.searchRunner = async (req, res) => {
    try {
        const { query } = req.params;
        const { memberId } = req.query; // Capture memberId from query string

        const runner = await Registration.findOne({
            $or: [
                { "runnerDetails.phone": query },
                { "runnerDetails.email": query.toLowerCase() },
                { "_id": mongoose.Types.ObjectId.isValid(query) ? query : null }
            ]
        });

        if (!runner) {
            return res.status(404).json({ success: false, message: "No runner found." });
        }

        // If searching a group member specifically, customize the data sent to the volunteer screen
        if (memberId && runner.registrationType === 'group') {
            const member = runner.groupMembers.id(memberId);
            if (member) {
                const memberData = runner.toObject();
                // Override main runner name with member name so volunteer sees the right person
                memberData.runnerDetails = {
                    firstName: member.firstName,
                    lastName: member.lastName,
                    tshirtSize: member.tshirtSize
                };
                // Use member-specific expo details
                memberData.expoDetails = member.expoDetails || { bibCollected: false };
                memberData.activeMemberId = memberId; 
                return res.status(200).json({ success: true, data: memberData });
            }
        }

        res.status(200).json({ success: true, data: runner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. AUTO-ASSIGN (Assigns unique BIBs to individual group members)
exports.checkInRunner = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { tshirtIssued, kitIssued, isVerified, memberId } = req.body;

        const registration = await Registration.findById(registrationId);
        if (!registration) return res.status(404).json({ message: "Registration not found" });

        // 1. Identify Target (Member or Individual)
        let target;
        if (memberId && registration.registrationType === 'group') {
            target = registration.groupMembers.id(memberId);
            if (!target) return res.status(404).json({ message: "Member not found" });
        } else {
            target = registration;
        }

        // Check if already collected
        if (target.expoDetails?.bibCollected) {
            return res.status(400).json({ success: false, message: "Kit already collected!" });
        }

        // 2. GLOBAL BIB CALCULATION (Prevents Duplicates)
        const categoryKey = registration.raceCategory.toLowerCase();
        const config = BIB_RANGES[categoryKey] || BIB_RANGES["5k"];

        // Scan ALL registrations in this category to find the real Max
        const allRegs = await Registration.find({ raceCategory: registration.raceCategory });
        let currentMax = 0;

        allRegs.forEach(reg => {
            // Check main runner bib
            if (reg.expoDetails?.bibNumber) {
                const num = parseInt(reg.expoDetails.bibNumber.replace(/^\D+/g, ''));
                if (num > currentMax) currentMax = num;
            }
            // Check every member in the group
            reg.groupMembers?.forEach(m => {
                if (m.expoDetails?.bibNumber) {
                    const num = parseInt(m.expoDetails.bibNumber.replace(/^\D+/g, ''));
                    if (num > currentMax) currentMax = num;
                }
            });
        });

        const nextNumber = currentMax === 0 ? config.start : currentMax + 1;
        const finalBib = `${config.prefix || ""}${nextNumber}`;

        const expoUpdate = {
            bibNumber: finalBib,
            bibCollected: true,
            tshirtIssued,
            kitIssued,
            isVerified,
            collectedAt: new Date(),
            lastUpdatedBy: req.user.id
        };

        // 3. Update correct path
        if (memberId && registration.registrationType === 'group') {
            const member = registration.groupMembers.id(memberId);
            member.expoDetails = expoUpdate;
        } else {
            registration.expoDetails = expoUpdate;
        }

        await registration.save();
        res.status(200).json({ success: true, bibAssigned: finalBib });

    } catch (error) {
        console.error("Check-in Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};