const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const Registration = require('../models/Registration'); 

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const syncBibsFromExcel = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("Connected to Sprints Saga India DB...");

        const excelPath = path.join(__dirname, '../Assign_BIBs_Here.xlsx');
        const workbook = XLSX.readFile(excelPath);
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        if (data.length === 0) {
            console.log("❌ Excel file is empty!");
            process.exit(0);
        }

        console.log("--- Header Names Found in your Excel ---");
        console.log(Object.keys(data[0])); 
        console.log("----------------------------------------\n");

        let successCount = 0;

        for (const row of data) {
            const idStr = (row["Id"] || row.Unique_ID || row["Unique ID"] || row["_id"])?.toString().trim();
            const bibValue = (row["Bib No"] || row.BIB_Number || row["BIB Number"] || row["BIB"])?.toString().trim();

            if (!idStr || !bibValue) {
                console.log(`⏭️ Skipping row: Missing Id[${idStr || 'EMPTY'}] or Bib No[${bibValue || 'EMPTY'}]`);
                continue;
            }

            const targetId = new mongoose.Types.ObjectId(idStr);

            // --- PRE-ASSIGNMENT LOGIC START ---
            // We save to assignedBib and set isVerifiedByScan to false
            const updateFields = { 
                "expoDetails.assignedBib": bibValue, 
                "expoDetails.isVerifiedByScan": false 
            };

            // 1. Update Individual Registration
            const resInd = await Registration.updateOne(
                { _id: targetId }, 
                { $set: updateFields }
            );

            // 2. Update Group Member
            const resGrp = await Registration.updateOne(
                { "groupMembers._id": targetId },
                { $set: { 
                    "groupMembers.$.expoDetails.assignedBib": bibValue,
                    "groupMembers.$.expoDetails.isVerifiedByScan": false 
                } }
            );
            // --- PRE-ASSIGNMENT LOGIC END ---

            if (resInd.matchedCount > 0 || resGrp.matchedCount > 0) {
                console.log(`✅ [PRE-ASSIGNED] ${row["First Name"] || 'Runner'}: BIB ${bibValue} (Locked)`);
                successCount++;
            } else {
                console.log(`❌ [NOT FOUND] ID ${idStr} does not exist in Database.`);
            }
        }

        console.log(`\n--- FINAL SYNC REPORT ---`);
        console.log(`Successfully Pre-Assigned: ${successCount} (BIBs are hidden from users)`);
        process.exit(0);
    } catch (error) {
        console.error("Critical Sync Error:", error.message);
        process.exit(1);
    }
};

syncBibsFromExcel();