const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const XLSX = require('xlsx');
require('dotenv').config();

const exportData = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const regs = await Registration.find({ paymentStatus: 'paid' });
    
    let rows = [];

    regs.forEach(r => {
        if (r.registrationType === 'group') {
            r.groupMembers.forEach(m => {
                rows.push({
                    "Unique_ID": m._id.toString(),
                    "First_Name": m.firstName,
                    "Last_Name": m.lastName,
                    "Email": m.email,
                    "BIB_Number": "" // Leave this empty for you to fill
                });
            });
        } else {
            rows.push({
                "Unique_ID": r._id.toString(),
                "First_Name": r.runnerDetails.firstName,
                "Last_Name": r.runnerDetails.lastName,
                "Email": r.runnerDetails.email,
                "BIB_Number": ""
            });
        }
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BIB_Assignment");
    XLSX.writeFile(wb, "Assign_BIBs_Here.xlsx");
    console.log("File generated: Assign_BIBs_Here.xlsx. Fill the BIBs and save as JSON.");
    process.exit();
};
exportData();