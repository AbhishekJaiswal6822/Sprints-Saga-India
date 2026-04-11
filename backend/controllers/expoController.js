// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\controllers\expoController.js

const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const nodemailer = require('nodemailer'); 

// Initialize the transporter once at the top level
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true, 
    auth: {
        user: "info@sprintssagaindia.com",
        pass: "q7aVA1xBzCYh" 
    }
});


// 1. SEARCH RUNNER (Handles memberId for Groups)
exports.searchRunner = async (req, res) => {
    try {
        const { query } = req.params;
        const { memberId } = req.query; // Capture memberId from query string

        const runner = await Registration.findOne({
    $or: [
        { "runnerDetails.phone": query },
        { "runnerDetails.email": query.toLowerCase() },
        { "expoDetails.assignedBib": query }, // Added Assigned Bib search
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

        // --- BACKGROUND EMAIL NOTIFICATION ---
        const mailOptions = {
            from: '"Sprints Saga India" <info@sprintssagaindia.com>',
            to: target.runnerDetails.email,
            subject: `BIB Allocated: ${finalBib} - Sprints Saga India 2026`,
            html: `
                <div style="font-family: sans-serif; border: 1px solid #e2e8f0; padding: 20px; border-radius: 15px; max-width: 600px;">
                    <h2 style="color: #0d9488;">BIB Allocation Successful! 🏃‍♂️</h2>
                    <p>Hello <strong>${target.runnerDetails.firstName}</strong>,</p>
                    <p>Your bib verification has been successful. Here are your details:</p>
                    <div style="background: #f1f5f9; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Your BIB Number</span><br/>
                        <span style="font-size: 48px; font-weight: 900; color: #0f172a;">${finalBib}</span>
                    </div>
                    <p>Get excited to be a part of the <strong>LokRaja Marathon 2026 - Chapter Pune</strong>!</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #94a3b8;">For any queries, mail us at <a href="mailto:info@sprintssagaindia.com" style="color: #0d9488;">info@sprintssagaindia.com</a></p>
                </div>
            `
        };

        // Fire and forget (don't use await so the volunteer doesn't wait for the email to send)
        transporter.sendMail(mailOptions).catch(err => console.error("Email Error:", err));

        // Return the response immediately to the volunteer
        res.status(200).json({ 
            success: true, 
            bibAssigned: finalBib 
        });

    
       res.status(200).json({ 
            success: true, 
            bibAssigned: finalBib 
        });

    } catch (error) {
        console.error("Check-in Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 3. GET ALL RUNNERS (For Insights Tab)
exports.getAllRunners = async (req, res) => {
    try {
        const runners = await Registration.find({ paymentStatus: 'paid' })
            .select('runnerDetails raceCategory expoDetails registeredAt registrationType groupMembers idProof')
            .sort({ registeredAt: -1 });

        let flatList = [];

        runners.forEach(reg => {
            if (reg.registrationType === 'group') {
                reg.groupMembers.forEach((member, index) => {
                    // Convert to object to manipulate
                    const memberObj = member.toObject();
                    
                    // PERMANENT FIX: Ensure bibNumber is populated from assignedBib if empty
                    if (memberObj.expoDetails) {
                        memberObj.expoDetails.bibNumber = memberObj.expoDetails.bibNumber || memberObj.expoDetails.assignedBib;
                    }

                    flatList.push({
                        _id: member._id,
                        runnerDetails: {
                            firstName: member.firstName,
                            lastName: member.lastName,
                            email: member.email,
                            tshirtSize: member.tshirtSize 
                        },
                        idProof: member.idProof || reg.idProof, 
                        expoDetails: memberObj.expoDetails,
                        raceCategory: member.raceCategory || reg.raceCategory,
                        isGroup: true,
                        memberLabel: `Member ${index + 1}`
                    });
                });
            } else {
                const regObj = reg.toObject();
                
                // PERMANENT FIX: Ensure bibNumber is populated from assignedBib if empty
                if (regObj.expoDetails) {
                    regObj.expoDetails.bibNumber = regObj.expoDetails.bibNumber || regObj.expoDetails.assignedBib;
                }
                
                flatList.push(regObj);
            }
        });

        res.status(200).json({ success: true, data: flatList });
    } catch (error) {
        console.error("Fetch Insights Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching insights" });
    }
};