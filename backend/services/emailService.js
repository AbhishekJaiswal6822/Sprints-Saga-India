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

    // Left Column
    doc.font('Helvetica-Bold').text('Event: ', 50, gridY, { continued: true })
        .font('Helvetica').text('LokRaja Marathon - Chapter Pune');

    doc.font('Helvetica-Bold').text('Full Name: ', 50, gridY + 12, { continued: true })
        .font('Helvetica').text(paymentData.fullName);

    doc.font('Helvetica-Bold').text('Mobile: ', 50, gridY + 24, { continued: true })
        .font('Helvetica').text(paymentData.phone);

    doc.font('Helvetica-Bold').text('Email: ', 50, gridY + 36, { continued: true })
        .font('Helvetica').text(paymentData.email);

    // Right Column
    const rightX = 350; // Using 350 for better alignment

    doc.font('Helvetica-Bold').text('Registration Type: ', rightX, gridY, { continued: true })
        .font('Helvetica').text(registrationTypeLabel);

    doc.font('Helvetica-Bold').text('Race Category: ', rightX, gridY + 14, { continued: true })
        .font('Helvetica').text(paymentData.raceCategory);

    doc.font('Helvetica-Bold').text('Invoice Id: ', rightX, gridY + 28, { continued: true })
        .font('Helvetica').fontSize(7.5).text(paymentData.invoiceNo).fontSize(8.5);

    doc.font('Helvetica-Bold').text('Payment Mode: ', rightX, gridY + 42, { continued: true })
        .font('Helvetica').text(paymentData.paymentMode || 'Offline/Manual');

    doc.font('Helvetica-Bold').text('Date: ', rightX, gridY + 56, { continued: true })
        .font('Helvetica').text(new Date().toLocaleDateString());

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

    const regFee = parseFloat(paymentData.rawRegistrationFee ?? paymentData.registrationFee);
    const discAmt = parseFloat(paymentData.discountAmount || 0);

    drawItem('Registration Fee', regFee);

    if (discAmt > 0) {
        drawItem('Discount', discAmt, true);

        // ADDED: Net Registration Fee (Calculated directly for 100% accuracy)
        const netFee = regFee - discAmt;
        doc.font('Helvetica-Bold').fillColor('#333333').text('Net Registration Fee', 50, currentY);
        doc.text(`Rs. ${netFee.toFixed(2)}`, 450, currentY, { width: 90, align: 'right' });
        doc.moveTo(40, currentY + 12).lineTo(555, currentY + 12).strokeColor('#eeeeee').lineWidth(0.5).stroke();
        currentY += 18;
    }
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
                        subject: `Registration Confirmed: LokRaja Marathon - Invoice #${paymentData.invoiceNo}`,
                        html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #008080; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Registration Confirmed!</h1>
            </div>
            <div style="padding: 30px; color: #333333; line-height: 1.6;">
                <p style="font-size: 18px;">Hello <strong>${paymentData.firstName}</strong>,</p>
                <p>Thank you for registering for the <strong>LokRaja Marathon - Chapter Pune</strong>. We are thrilled to have you join our community of runners!</p>
                
                <p>Please find your official payment receipt attached to this email. We recommend keeping a copy for your records and for bib collection.</p>
                
                <p>Get ready to hit the pavement! Follow us on our social handles for training tips and event updates.</p>
                
                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #888888; text-align: center;">
                    This is an automated receipt. For any queries, please reach out to <a href="mailto:info@sprintssagaindia.com" style="color: #008080;">info@sprintssagaindia.com</a>.
                </p>
            </div>
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
                <strong>Sprints Saga India</strong><br>
                <a href="http://www.sprintssagaindia.com" style="color: #666666; text-decoration: none;">www.sprintssagaindia.com</a>
                
                <div style="background-color: #ffffff; padding: 15px; border: 1px solid #e0e0e0; border-radius: 6px; margin: 15px auto 0 auto; max-width: 80%; text-align: left;">
                    <p style="margin: 0; color: #333333;"><strong>Race Category:</strong> ${paymentData.raceCategory}</p>
                    <p style="margin: 5px 0 0 0; color: #333333;"><strong>Invoice ID:</strong> ${paymentData.invoiceNo}</p>
                </div>
            </div>
        </div>
    `,
                        attachments: [{
                            filename: `Invoice_${paymentData.invoiceNo}.pdf`,
                            content: pdfBuffer
                        }]
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