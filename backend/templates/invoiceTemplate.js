

// backend/templates/invoiceTemplate.js
const generateInvoiceHTML = (paymentData) => {
  const pgFee = parseFloat(paymentData.pgFee).toFixed(2);
  const gstOnPg = parseFloat(paymentData.gstAmount).toFixed(2);
  const total = parseFloat(paymentData.amount).toFixed(2);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 10px;">
      
      ${paymentData.logo ? `
      <div style="text-align: center; margin-bottom: 5px;">
        <img src="${paymentData.logo}" alt="Logo" style="width: 120px; height: auto;">
      </div>` : ''}
      
      <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">
        <h2 style="color: #0d9488; margin: 0; font-size: 20px;">INVOICE – PAYMENT BREAKUP</h2>
        <p style="font-size: 12px; color: #666; margin: 2px 0;">Sprints Saga India Official Receipt</p>
      </div>

      <div style="margin-top: 10px; line-height: 1.4; font-family: Arial, sans-serif; color: #333; font-size: 13px;">
        <p style="margin: 2px 0;"><strong>Event:</strong> LokRaja Marathon - Chapter Pune</p>
        <p style="margin: 2px 0;"><strong>Runner Name:</strong> ${paymentData.fullName}</p>
        <p style="margin: 2px 0;"><strong>Mobile Number:</strong> ${paymentData.phone}</p>
        <p style="margin: 2px 0;"><strong>Email:</strong> ${paymentData.email}</p>
        <p style="margin: 2px 0;"><strong>Race Category:</strong> ${paymentData.raceCategory}</p>
        <p style="margin: 2px 0;"><strong>Invoice No:</strong> ${paymentData.invoiceNo}</p>
        <p style="margin: 2px 0;"><strong>Payment Mode:</strong> ${paymentData.paymentMode}</p>
        <p style="margin: 2px 0;"><strong>Invoice Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
        <tr>
          <td style="padding: 4px 0;">Registration Fee</td>
          <td style="text-align: right;">₹${parseFloat(paymentData.rawRegistrationFee).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Discount</td>
          <td style="text-align: right; color: red;">–₹${parseFloat(paymentData.discountAmount).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Platform Fee</td>
          <td style="text-align: right;">₹${parseFloat(paymentData.platformFee).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Payment Gateway Fee</td>
          <td style="text-align: right;">₹${pgFee}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 4px 0;">GST @18% (on PG Fee)</td>
          <td style="text-align: right;">₹${gstOnPg}</td>
        </tr>
        <tr style="font-weight: bold; font-size: 16px; color: #0d9488;">
          <td style="padding: 10px 0;">TOTAL PAYABLE AMOUNT</td>
          <td style="text-align: right; padding: 10px 0;">₹${total}</td>
        </tr>
      </table>

      <div style="margin-top: 50px; font-size: 11px; background: #f9f9f9; padding: 8px; border-radius: 5px;">
        <p style="margin: 2px 0;">* GST is applicable only on the Payment Gateway Fee.</p>
        <p style="margin: 2px 0;">* No GST is charged on Registration or Platform Fee.</p>
        <p style="margin: 2px 0;">* This is a system-generated invoice.</p>
      </div>

      <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px; font-size: 12px;">
        <p style="margin: 1px 0;"><strong>Organiser Details:</strong></p>
        <p style="margin: 1px 0;">Organised By: Sprints Saga India </p>
        <p style="margin: 1px 0;">Email: info@sprintssagaindia.com | Web: www.sprintssagaindia.com</p>
      </div>
    </div>
  `;
};

module.exports = generateInvoiceHTML;