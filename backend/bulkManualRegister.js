// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\bulkManualRegister.js
const XLSX = require("xlsx");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// 1. Load Environment Variables
dotenv.config();

// 2. Import Models and Services
const Registration = require("./models/Registration");
const { sendInvoiceEmail } = require("./services/emailService");

// 3. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas..."))
    .catch(err => { console.error("DB Error:", err); process.exit(1); });

const convertAndRegister = async () => {
    try {
        // 4. Read the Excel File
        const workbook = XLSX.readFile("./demo-data.xlsx");
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Found ${rawData.length} records. Starting Import...`);

        // --- NEW: Array to collect data for the JSON backup file ---
        const finalJsonData = [];

        for (let [index, row] of rawData.entries()) {
            const getVal = (keyName) => {
                const actualKey = Object.keys(row).find(k => k.trim().replace(/\n/g, ' ').toLowerCase().includes(keyName.toLowerCase()));
                return actualKey ? row[actualKey] : null;
            };

            const formatDob = (val) => {
                if (typeof val === 'number') {
                    // Convert Excel serial date to JS Date
                    return new Date((val - 25569) * 86400 * 1000);
                }
                return val ? new Date(val) : null;
            };

            // --- PRICING LOGIC ---
            const rawCategory = getVal('Race Category') || (getVal('10 Km') ? "10K" : "5K");
            const category = rawCategory.toString().toUpperCase().trim();

            let regAmount = 0;
            // Use === for exact matches so "35K" doesn't trigger "5K"
            if (category === "5K") regAmount = 250;
            else if (category === "10K") regAmount = 300;
            else if (category === "21K") regAmount = 500;
            else if (category === "35K") regAmount = 650;
            else if (category === "42K") regAmount = 1000;
            else {
                // Fallback for unexpected values like "35 KM" or "35K "
                if (category.includes("42")) regAmount = 1000;
                else if (category.includes("35")) regAmount = 650;
                else if (category.includes("21")) regAmount = 500;
                else if (category.includes("10")) regAmount = 300;
                else regAmount = 250; 
            }

            const fullName = getVal('Name') || "Unknown User";
            const email = (getVal('Email id') || getVal('Email'))?.toString().toLowerCase().trim() || `offline_${index}@sprintssaga.com`;

            // 5. CONSTRUCTING DATA TO MATCH YOUR SCHEMA
            const registrationData = {
                user: "679cc7a522a440cc9115f216",
                registrationType: 'individual',
                raceCategory: category, 
                amount: regAmount,
                paymentStatus: 'paid',
                registrationStatus: 'Verified',
                registeredAt: new Date(),

                runnerDetails: {
                    firstName: fullName.split(' ')[0],
                    lastName: fullName.split(' ').slice(1).join(' ') || 'N/A',
                    email: email,
                    phone: getVal('Contact')?.toString() || "NA",
                    dob: formatDob(getVal('Date of Birth')),
                    gender: (getVal('Gender')?.toString().trim().toLowerCase() === 'male') ? 'Male' :
                        (getVal('Gender')?.toString().trim().toLowerCase() === 'female') ? 'Female' : 'Other',
                    bloodGroup: getVal('Blood') || "N/A",
                    tshirtSize: getVal('T-Shirt') || getVal('Size') || "NA",
                    nationality: 'Indian',
                    address: getVal('Address') || "N/A",
                    city: 'N/A',
                    state: 'N/A',
                    pincode: 'NA',
                },

                // For Email Pdf breakup
                registrationFee: regAmount,
                discountAmount: 0,
                platformFee: 0,
                pgFee: 0,
                gstAmount: 0,

                idProof: {
                    idType: 'Aadhaar Card',
                    idNumber: 'OFFLINE_ENTRY',
                    path: 'manual_upload_placeholder.pdf'
                },

                paymentDetails: {
                    orderId: `OFFLINE_ORDER_${Date.now()}_${index}`,
                    paymentId: `OFFLINE_PAY_${Date.now()}_${index}`,
                    status: 'success',
                    paidAt: new Date()
                }
            };

            // --- NEW: Add to the JSON backup list ---
            finalJsonData.push(registrationData);

            // 6. Save to Database
            const savedReg = await Registration.create(registrationData);
            console.log(`[${index + 1}/${rawData.length}] Registered: ${email} | ${category} | Rs.${regAmount}`);

            // 7. Send Invoice
            try {
                const regObj = savedReg.toObject();

                // Prepare the data structure your emailService.js needs for the PDF
                const paymentDataForEmail = {
                    firstName: regObj.runnerDetails.firstName,
                    fullName: `${regObj.runnerDetails.firstName} ${regObj.runnerDetails.lastName}`,
                    phone: regObj.runnerDetails.phone,
                    email: regObj.runnerDetails.email,
                    registrationType: regObj.registrationType,
                    raceCategory: regObj.raceCategory,
                    invoiceNo: regObj.paymentDetails.paymentId, // Using paymentId as the invoice number
                    paymentMode: 'Offline/Manual',
                    amount: regObj.amount || 0,
                    registrationFee: regObj.registrationFee || 0,
                    discountAmount: regObj.discountAmount || 0,
                    platformFee: regObj.platformFee || 0,
                    pgFee: regObj.pgFee || 0,
                    gstAmount: regObj.gstAmount || 0
                };

                // CRITICAL FIX: Send email and data as TWO separate arguments
                await sendInvoiceEmail(regObj.runnerDetails.email, paymentDataForEmail);

                console.log(`   📧 Invoice sent successfully to ${regObj.runnerDetails.email}`);
            } catch (mErr) {
                console.log(`   ⚠️ Email failed: ${mErr.message}`);
            }

            // 1 second delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 1000));
        }

        // --- NEW: Write the JSON file after the loop finishes ---
        fs.writeFileSync("final_registrations.json", JSON.stringify(finalJsonData, null, 2));
        console.log("📂 File Created: final_registrations.json");

        console.log("🏁 All 108 records processed!");
        process.exit(0);

    } catch (error) {
        console.error("Critical Error:", error);
        process.exit(1);
    }
};

convertAndRegister();