// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\expoController.js
const mongoose = require('mongoose');
const Registration = require('../models/Registration');


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
        const { tshirtIssued, kitIssued, memberId } = req.body;

        const registration = await Registration.findById(registrationId);
        if (!registration) return res.status(404).json({ message: "Registration not found" });

        let target;
        if (memberId && registration.registrationType === 'group') {
            target = registration.groupMembers.id(memberId);
        } else {
            target = registration;
        }

        // --- NECESSARY CHANGE 1: STRICT EXCEL CHECK ---
        // Block check-in if no BIB was pre-assigned via Excel sync
        if (!target?.expoDetails?.assignedBib) {
            return res.status(400).json({ 
                success: false, 
                message: "STRICT ERROR: Runner not in Excel Master List. Update Excel and Sync first." 
            });
        }

        // --- NECESSARY CHANGE 2: PREVENT DUPLICATE COLLECTION ---
        if (target.expoDetails.bibCollected) {
            return res.status(400).json({ success: false, message: "Kit already collected!" });
        }

        const finalBib = target.expoDetails.assignedBib;

        const expoUpdate = {
            bibNumber: finalBib,
            isVerifiedByScan: true,
            bibCollected: true,
            tshirtIssued,
            kitIssued,
            collectedAt: new Date(),
            lastUpdatedBy: req.user.id
        };

        // --- NECESSARY CHANGE 3: CLEAN DATA PERSISTENCE ---
        if (memberId && registration.registrationType === 'group') {
            const member = registration.groupMembers.id(memberId);
            // Use .toObject() to avoid Mongoose proxy issues when spreading
            member.expoDetails = { ...member.expoDetails.toObject(), ...expoUpdate };
        } else {
            registration.expoDetails = { ...registration.expoDetails.toObject(), ...expoUpdate };
        }

        await registration.save();
        res.status(200).json({ success: true, bibAssigned: finalBib });

    } catch (error) {
        console.error("Check-in Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 3. GET ALL RUNNERS (For Insights Tab)
exports.getAllRunners = async (req, res) => {
    try {
        // --- FIX 1: Added 'idProof' to the select string ---
        const runners = await Registration.find({ paymentStatus: 'paid' })
            .select('runnerDetails raceCategory expoDetails registeredAt registrationType groupMembers idProof')
            .sort({ registeredAt: -1 });

        let flatList = [];

        runners.forEach(reg => {
            if (reg.registrationType === 'group') {
                reg.groupMembers.forEach((member, index) => {
                    flatList.push({
                        _id: member._id,
                        runnerDetails: {
                            firstName: member.firstName,
                            lastName: member.lastName,
                            email: member.email,
                            // --- FIX 2: Added tshirtSize here so it shows in the table ---
                            tshirtSize: member.tshirtSize 
                        },
                        // FALLBACK: Use member ID if exists, otherwise group leader's ID
                        idProof: member.idProof || reg.idProof, 
                        
                        expoDetails: member.expoDetails,
                        raceCategory: member.raceCategory || reg.raceCategory,
                        isGroup: true,
                        memberLabel: `Member ${index + 1}`
                    });
                });
            } else {
                flatList.push(reg);
            }
        });

        res.status(200).json({ success: true, data: flatList });
    } catch (error) {
        console.error("Fetch Insights Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching insights" });
    }
};