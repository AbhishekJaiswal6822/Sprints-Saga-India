

// Updated on Dec 26 for AWS Deployment - Tightened Layout & Fixed Encoding
const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

// 1. Configure the "Sender" (Your Gmail)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sprintsagaindia@gmail.com',
        pass: 'mstplrauewjyulsa' 
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendInvoiceEmail = async (userEmail, paymentData) => {
    return new Promise((resolve, reject) => {
        try {
            // A4 Page with standardized margins
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffers);
                const mailOptions = {
                    from: '"Sprints Saga India" <sprintssagaindia@gmail.com>',
                    to: userEmail,
                    subject: `Invoice - ${paymentData.invoiceNo}`,
                    text: `Hello ${paymentData.firstName}, your registration is confirmed! Attached is your invoice.`,
                    attachments: [{
                        filename: `Invoice_${paymentData.invoiceNo}.pdf`,
                        content: pdfBuffer
                    }]
                };
                await transporter.sendMail(mailOptions);
                resolve(true);
            });

            // --- LOGO SECTION ---
            // This pulls the logo from your backend/assets folder
            const logoPath = path.join(__dirname, '../assets/logo.jpg'); 
            doc.image(logoPath, 260, 35, { width: 75 }); 
            doc.moveDown(5); // Space for the logo

            // --- HEADER & TITLE ---
            doc.fillColor('#008080').fontSize(16).font('Helvetica-Bold').text('INVOICE – PAYMENT BREAKUP', { align: 'center' });
            doc.fillColor('#444444').fontSize(9).font('Helvetica').text('Sprints Saga India Official Receipt', { align: 'center' });

            // Decorative Teal Line below header
            doc.moveTo(40, doc.y + 10).lineTo(555, doc.y + 10).strokeColor('#008080').lineWidth(1).stroke();
            doc.moveDown(2);

            // --- RUNNER & EVENT INFO GRID ---
            const gridY = doc.y;
            doc.fillColor('#000000').fontSize(8.5);

            // Left Column
            doc.font('Helvetica-Bold').text('Event:', 50, gridY).font('Helvetica').text('LokRaja Marathon - Chapter Pune', 105, gridY);
            doc.font('Helvetica-Bold').text('Full Name:', 50, gridY + 12).font('Helvetica').text(paymentData.fullName, 105, gridY + 12);
            doc.font('Helvetica-Bold').text('Mobile:', 50, gridY + 24).font('Helvetica').text(paymentData.phone, 105, gridY + 24);
            doc.font('Helvetica-Bold').text('Email:', 50, gridY + 36).font('Helvetica').text(paymentData.email, 105, gridY + 36);

            // Right Column
            doc.font('Helvetica-Bold').text('Category:', 370, gridY).font('Helvetica').text(paymentData.raceCategory, 435, gridY);
            doc.font('Helvetica-Bold').text('Invoice:', 370, gridY + 12).font('Helvetica').text(paymentData.invoiceNo, 435, gridY + 12);
            doc.font('Helvetica-Bold').text('Mode:', 370, gridY + 24).font('Helvetica').text(paymentData.paymentMode || 'UPI', 435, gridY + 24);
            doc.font('Helvetica-Bold').text('Date:', 370, gridY + 36).font('Helvetica').text(new Date().toLocaleDateString(), 435, gridY + 36);

            // --- PAYMENT BREAKUP TABLE ---
            doc.moveDown(4);
            const tableTop = doc.y;

            // Table Header Bar
            doc.rect(40, tableTop, 515, 18).fill('#f8f8f8');
            doc.fillColor('#333333').font('Helvetica-Bold').text('Registration Fee Detail', 50, tableTop + 5);
            doc.text('Amount (INR)', 450, tableTop + 5, { width: 90, align: 'right' });

            let currentY = tableTop + 22;
            const drawItem = (label, value, isRed = false) => {
                doc.font('Helvetica').fillColor(isRed ? '#e60000' : '#333333').text(label, 50, currentY);
                
                // --- THE ULTIMATE TYPE SAFETY FIX ---
                let cleanValue = 0;
                if (typeof value === 'number') {
                    cleanValue = value;
                } else if (typeof value === 'string') {
                    cleanValue = parseFloat(value.replace(/[^-0-9.]/g, '')) || 0;
                } else if (value && value.toString) {
                    // This handles MongoDB Decimal objects correctly
                    cleanValue = parseFloat(value.toString()) || 0;
                }

                const amountText = Math.abs(cleanValue).toFixed(2);
                doc.text(`Rs. ${amountText}`, 450, currentY, { width: 90, align: 'right' });
                
                doc.moveTo(40, currentY + 12).lineTo(555, currentY + 12).strokeColor('#eeeeee').lineWidth(0.5).stroke();
                currentY += 18;
            };

            // Table Content Rows
            drawItem('Registration Fee', paymentData.rawRegistrationFee);
            drawItem('Discount', `-${paymentData.discountAmount}`, true);
            drawItem('Platform Fee', paymentData.platformFee);
            drawItem('Payment Gateway Fee', paymentData.pgFee);
            drawItem('GST @18% (on PG Fee only)', paymentData.gstAmount);

            // --- TOTAL PAID HIGHLIGHT ---
            doc.rect(40, currentY, 515, 22).fill('#f0f9f9'); // Light teal background
            doc.fillColor('#008080').font('Helvetica-Bold').fontSize(10).text('TOTAL PAID', 50, currentY + 6);
            
            // FIXED: Using "Rs." here as well
            const totalText = Number(paymentData.amount).toFixed(2);
            doc.text(`Rs. ${totalText}`, 450, currentY + 6, { width: 90, align: 'right' });

            // --- FOOTER SECTION (Tightened & Darkened) ---
            doc.moveDown(1.5); // Removed excess negative space

            // Darker text color (#444444 instead of #999999)
            doc.fillColor('#444444').fontSize(7.5).font('Helvetica-Oblique');
            
            // Sequential points with tighter vertical spacing (+7.5)
            doc.text('* GST is applicable only on the Payment Gateway Fee', 50, doc.y, { align: 'left' });
            doc.text('* No GST is charged on Registration or Platform Fee', 50, doc.y + 7.5, { align: 'left' });
            doc.text('* This is a system-generated invoice', 50, doc.y + 15, { align: 'left' });

            // Decorative Separator Line moved much closer (y + 24)
            doc.moveTo(40, doc.y + 24)
                .lineTo(555, doc.y + 24)
                .strokeColor('#dddddd')
                .lineWidth(0.5)
                .stroke();

            doc.moveDown(2); // Tightened space below line

            // Organization Name (Darkest color #111111)
            doc.fillColor('#111111')
                .fontSize(9)
                .font('Helvetica-Bold')
                .text('Sprints Saga India', 50, doc.y + 10, { align: 'left' });

            // Contact Details (Teal Color)
            doc.fillColor('#008080')
                .font('Helvetica')
                .text('info@sprintssagaindia.com | www.sprintssagaindia.com', 50, doc.y + 2, { align: 'left' });

            doc.end();
        } catch (error) {
            console.error('❌ PDF Design Error:', error);
            reject(error);
        }
    });
};

module.exports = { sendInvoiceEmail };