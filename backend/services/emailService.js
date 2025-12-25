// Updated on Dec 26 for AWS Deployment
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
// const html_pdf = require('html-pdf-node');
const generateInvoiceHTML = require('../templates/invoiceTemplate');

// 1. Configure the "Sender" (Your Gmail)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sprintsagaindia@gmail.com',
        pass: 'mstplrauewjyulsa' // We will get this in Step 3
    },
    tls: {
        rejectUnauthorized: false
    }
});

// const sendInvoiceEmail = async (userEmail, paymentData) => {
//     try {
//         // 2. Convert Template to HTML
//         const htmlContent = generateInvoiceHTML(paymentData);

//         // 3. Convert HTML to PDF Buffer
//         let options = { format: 'A4', margin: { top: '20px', bottom: '20px' } };
//         let file = { content: htmlContent };
//         const pdfBuffer = await html_pdf.generatePdf(file, options);

//         // 4. Set up the Email
//         const mailOptions = {
//             from: '"Sprints Saga India" <sprintssagaindia@gmail.com>',
//             to: userEmail,
//             subject: `Invoice: LokRaja Marathon Registration - ${paymentData.invoiceNo}`,
//             text: `Hello ${paymentData.firstName}, your registration for Sprints Saga India is confirmed. Please find your invoice attached.`,
//             attachments: [
//                 {
//                     filename: `Invoice_${paymentData.invoiceNo}.pdf`,
//                     content: pdfBuffer
//                 }
//             ]
//         };

//         // 5. Send it
//         await transporter.sendMail(mailOptions);
//         console.log('✅ Invoice email sent successfully to:', userEmail);
//         return true;
//     } catch (error) {
//         console.error('❌ Email Error:', error);
//         return false; // Returns false instead of crashing the site
//     }
// };

const sendInvoiceEmail = async (userEmail, paymentData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffers);

                const mailOptions = {
                    from: '"Sprints Saga India" <sprintssagaindia@gmail.com>',
                    to: userEmail,
                    subject: `Registration Invoice - ${paymentData.registrationId}`,
                    text: `Hello, thank you for registering for the LokRaja Marathon! Please find your invoice attached.`,
                    attachments: [{
                        filename: `Invoice-${paymentData.registrationId}.pdf`,
                        content: pdfBuffer
                    }]
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Invoice email sent successfully to ${userEmail}`);
                resolve(true);
            });

            // --- PDF CONTENT GENERATION (No browser needed!) ---
            doc.fontSize(25).text('OFFICIAL INVOICE', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`);
            doc.text(`Registration ID: ${paymentData.registrationId}`);
            doc.moveDown();
            doc.fontSize(16).text('Runner Details:', { underline: true });
            doc.fontSize(12).text(`Category: ${paymentData.raceCategory}`);
            doc.text(`Total Paid: ₹${paymentData.amount}`);
            doc.moveDown();
            doc.text('Thank you for running with Sprints Saga India!', { align: 'center', italic: true });
            
            doc.end();

        } catch (error) {
            console.error('❌ PDF/Email Error:', error);
            reject(error);
        }
    });
};

module.exports = { sendInvoiceEmail };
