// C:\Users\abhis\OneDrive\Desktop\SOFTWARE_DEVELOPER_LEARNING\marathon_project\backend\services\emailService.js
const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sprintsagaindia@gmail.com',
        pass: 'mstplrauewjyulsa'
    },
    tls: { rejectUnauthorized: false }
});

// --- REUSABLE PDF DESIGN LOGIC ---
const generateInvoicePDF = (doc, paymentData) => {
    // --- LOGO SECTION ---
    const logoPath = path.join(__dirname, '../assets/logo.jpg');
    doc.image(logoPath, 260, 35, { width: 75 });
    doc.moveDown(5);

    // --- HEADER ---
    doc.fillColor('#008080').fontSize(16).font('Helvetica-Bold').text('INVOICE – PAYMENT BREAKUP', { align: 'center' });
    doc.fillColor('#444444').fontSize(9).font('Helvetica').text('Sprints Saga India Official Receipt', { align: 'center' });
    doc.moveTo(40, doc.y + 10).lineTo(555, doc.y + 10).strokeColor('#008080').lineWidth(1).stroke();
    doc.moveDown(2);

    const registrationTypeLabel =
        paymentData.registrationType === 'individual' ? 'Individual Registration' :
            paymentData.registrationType === 'group' ? 'Group Registration' :
                'Charity Registration';

    // --- INFO GRID ---
    const gridY = doc.y;
    doc.fillColor('#000000').fontSize(8.5);
    doc.font('Helvetica-Bold').text('Event:', 50, gridY).font('Helvetica').text('LokRaja Marathon - Chapter Pune', 105, gridY);
    doc.font('Helvetica-Bold').text('Full Name:', 50, gridY + 12).font('Helvetica').text(paymentData.fullName, 105, gridY + 12);
    doc.font('Helvetica-Bold').text('Mobile:', 50, gridY + 24).font('Helvetica').text(paymentData.phone, 105, gridY + 24);
    doc.font('Helvetica-Bold').text('Email:', 50, gridY + 36).font('Helvetica').text(paymentData.email, 105, gridY + 36);

    doc.font('Helvetica-Bold').text('Registration Type:', 370, gridY).font('Helvetica').text(registrationTypeLabel, 465, gridY);
    doc.font('Helvetica-Bold').text('Race Category:', 370, gridY + 12).font('Helvetica').text(paymentData.raceCategory, 465, gridY + 12);
    doc.font('Helvetica-Bold').text('Invoice:', 370, gridY + 24).font('Helvetica').text(paymentData.invoiceNo, 465, gridY + 24);
    doc.font('Helvetica-Bold').text('Mode:', 370, gridY + 36).font('Helvetica').text(paymentData.paymentMode || 'UPI', 465, gridY + 36);
    doc.font('Helvetica-Bold').text('Date:', 370, gridY + 48).font('Helvetica').text(new Date().toLocaleDateString(), 465, gridY + 48);

    // --- TABLE ---
    doc.moveDown(4);
    const tableTop = doc.y;
    doc.rect(40, tableTop, 515, 18).fill('#f8f8f8');
    doc.fillColor('#333333').font('Helvetica-Bold').text('Registration Fee Detail', 50, tableTop + 5);
    doc.text('Amount (INR)', 450, tableTop + 5, { width: 90, align: 'right' });

    let currentY = tableTop + 22;
    const drawItem = (label, value, isRed = false) => {
        doc.font('Helvetica').fillColor(isRed ? '#e60000' : '#333333').text(label, 50, currentY);
        let cleanValue = 0;
        if (typeof value === 'number') cleanValue = value;
        else if (typeof value === 'string') cleanValue = parseFloat(value.replace(/[^-0-9.]/g, '')) || 0;
        else if (value && value.toString) cleanValue = parseFloat(value.toString()) || 0;

        // doc.text(`Rs. ${Math.abs(cleanValue).toFixed(2)}`, 450, currentY, { width: 90, align: 'right' });
        doc.text(`${isRed ? '–' : ''} Rs. ${Math.abs(cleanValue).toFixed(2)}`, 450, currentY, { width: 90, align: 'right' });
        doc.moveTo(40, currentY + 12).lineTo(555, currentY + 12).strokeColor('#eeeeee').lineWidth(0.5).stroke();
        currentY += 18;
    };

    drawItem('Registration Fee', paymentData.rawRegistrationFee ?? paymentData.registrationFee);
    drawItem('Discount', `-${paymentData.discountAmount}`, true);
    drawItem('Platform Fee', paymentData.platformFee);
    drawItem('Payment Gateway Fee', paymentData.pgFee);
    drawItem('GST @18% (on PG Fee only)', paymentData.gstAmount);

    // --- TOTAL ---
    doc.rect(40, currentY, 515, 22).fill('#f0f9f9');
    doc.fillColor('#008080').font('Helvetica-Bold').fontSize(10).text('TOTAL PAID', 50, currentY + 6);
    const displayAmount = parseFloat(paymentData.amount) || 0;
    doc.text(`Rs. ${displayAmount.toFixed(2)}`, 450, currentY + 6, { width: 90, align: 'right' });

    // --- FOOTER NOTES ---
    doc.moveDown(2).fillColor('#444444').fontSize(7.5).font('Helvetica-Oblique');
    doc.text('* GST is applicable only on the Payment Gateway Fee', 50);
    doc.text('* No GST is charged on Registration or Platform Fee', 50);
    doc.text('* This is a system-generated invoice', 50);

    // --- QR CODE & APP PROMOTION ---
    const qrSectionY = doc.y + 15;
    const qrPath = path.join(__dirname, '../assets/Fitistan-App-Download-QR-Code.png');

    // QR Code on Left (Larger)
    doc.image(qrPath, 50, qrSectionY, { width: 50 });


    // App Content Text - X shifted to 112 (very close to QR) and Y offsets tightened
    doc.fillColor('#111111').fontSize(8).font('Helvetica-Bold').text('Fitistan-Community Fitness App', 112, qrSectionY + 2);
    doc.fontSize(7).font('Helvetica-Bold').text('About this app:', 112, qrSectionY + 12);
    doc.fontSize(7).font('Helvetica').text('Track your steps, conquer exciting challenges, and achieve your fitness goals!', 112, qrSectionY + 20, { width: 350 });
    doc.fontSize(6.5).font('Helvetica-Bold').fillColor('#008080').text('Scan QR code to download Fitistan-Community Fitness App', 112, qrSectionY + 38);
    
    // Reduced the gap below the QR section
    doc.y = qrSectionY + 60;

    const footerY = doc.y;
    doc.moveTo(40, footerY).lineTo(555, footerY).strokeColor('#dddddd').lineWidth(0.5).stroke();
    doc.fillColor('#111111').fontSize(9).font('Helvetica-Bold').text('Sprints Saga India', 50, footerY + 10);
    doc.fillColor('#008080').font('Helvetica').text('info@sprintssagaindia.com | www.sprintssagaindia.com', 50, footerY + 22);

    doc.end();
};

// --- INTEGRATED EXPORT FUNCTION ---
const sendInvoiceEmail = async (userEmail, paymentData, res = null) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    if (res) {
        // DOWNLOAD MODE (For User Dashboard)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice_${paymentData.invoiceNo}.pdf`);
        doc.pipe(res);
        generateInvoicePDF(doc, paymentData);
    } else {
        // EMAIL MODE (For Payment Success)
        return new Promise((resolve, reject) => {
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('error', reject);
            doc.on('end', async () => {
                try {
                    const pdfBuffer = Buffer.concat(buffers);
                    const mailOptions = {
                        from: '"Sprints Saga India" <sprintssagaindia@gmail.com>',
                        to: userEmail,
                        subject: `Invoice - ${paymentData.invoiceNo}`,
                        text: `Hello ${paymentData.firstName}, attached is your invoice.`,
                        attachments: [{ filename: `Invoice_${paymentData.invoiceNo}.pdf`, content: pdfBuffer }]
                    };
                    await transporter.sendMail(mailOptions);
                    resolve(true);
                } catch (err) { reject(err); }
            });
            generateInvoicePDF(doc, paymentData);
        });
    }
};

module.exports = { sendInvoiceEmail };