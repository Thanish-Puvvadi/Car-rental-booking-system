const PDFDocument = require('pdfkit');

/**
 * Generates a styled PDF invoice for a booking and payment
 * @param {Object} booking - Booking mongoose model document
 * @param {Object} payment - Payment mongoose model document
 * @param {Stream} res - Express Response object to pipe PDF binary to
 */
const generateInvoicePDF = (booking, payment, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe to response
  doc.pipe(res);

  // Colors
  const primaryColor = '#1e1b4b'; // Indigo 950
  const secondaryColor = '#b45309'; // Amber 700
  const textColor = '#374151'; // Gray 700
  const labelColor = '#4b5563'; // Gray 600

  // 1. HEADER SECTION
  doc
    .fillColor(primaryColor)
    .fontSize(22)
    .text('MANIVTHA TOURS & TRAVELS', 50, 45, { bold: true })
    .fontSize(10)
    .fillColor(labelColor)
    .text('Premium Car Rental Booking System', 50, 70)
    .text('Phone: +91 98765 43210 | Email: bookings@manivtha.com', 50, 85)
    .text('Address: Main Road, near Metro, City, India', 50, 100);

  // Invoice label
  doc
    .fillColor(secondaryColor)
    .fontSize(28)
    .text('INVOICE', 380, 45, { align: 'right' })
    .fontSize(10)
    .fillColor(textColor)
    .text(`Invoice No: INV-${payment._id.toString().slice(-6).toUpperCase()}`, 380, 80, { align: 'right' })
    .text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 380, 95, { align: 'right' });

  // Horizontal line
  doc.moveTo(50, 125).lineTo(550, 125).strokeColor('#e5e7eb').stroke();

  // 2. CLIENT & TRIP INFORMATION
  doc
    .fillColor(primaryColor)
    .fontSize(14)
    .text('Billing Details', 50, 145, { underline: true })
    .fontSize(10)
    .fillColor(textColor)
    .text(`Name: ${booking.customerName}`, 50, 165)
    .text(`Email: ${booking.email}`, 50, 180)
    .text(`Phone: ${booking.mobileNumber}`, 50, 195);

  const vehicleName = booking.vehicle
    ? `${booking.vehicle.brand} ${booking.vehicle.model} (${booking.vehicle.registrationNumber})`
    : 'Selected Car';

  doc
    .fillColor(primaryColor)
    .fontSize(14)
    .text('Trip Details', 300, 145, { underline: true })
    .fontSize(10)
    .fillColor(textColor)
    .text(`Vehicle: ${vehicleName}`, 300, 165)
    .text(`Trip Type: ${booking.tripType}`, 300, 180)
    .text(`Route: ${booking.pickupLocation} to ${booking.dropLocation}`, 300, 195)
    .text(`Dates: ${new Date(booking.rentalDate).toLocaleDateString()} to ${new Date(booking.returnDate).toLocaleDateString()} (${booking.totalDays} Days)`, 300, 210);

  // Horizontal line
  doc.moveTo(50, 240).lineTo(550, 240).strokeColor('#e5e7eb').stroke();

  // 3. TABLE HEADERS
  const itemY = 260;
  doc
    .fillColor(primaryColor)
    .fontSize(11)
    .text('Description', 50, itemY, { bold: true })
    .text('Rate (per day)', 250, itemY, { align: 'right', bold: true })
    .text('Days', 370, itemY, { align: 'right', bold: true })
    .text('Amount', 480, itemY, { align: 'right', bold: true });

  doc.moveTo(50, 275).lineTo(550, 275).strokeColor('#d1d5db').stroke();

  // 4. TABLE CONTENT
  const contentY = 290;
  const baseRate = booking.vehicle ? booking.dailyPrice || booking.vehicle.dailyPrice : (booking.totalCost / booking.totalDays);
  
  doc
    .fillColor(textColor)
    .fontSize(10)
    .text(`Car Rental Services - ${booking.vehicle ? booking.vehicle.name : 'Vehicle'}`, 50, contentY)
    .text(`₹${baseRate.toFixed(2)}`, 250, contentY, { align: 'right' })
    .text(`${booking.totalDays}`, 370, contentY, { align: 'right' })
    .text(`₹${(baseRate * booking.totalDays).toFixed(2)}`, 480, contentY, { align: 'right' });

  // Fees line
  const driverFee = booking.driver ? 500 * booking.totalDays : 0; // Simulate driver allowance
  if (booking.driver) {
    doc
      .text('Driver Allowance / Fee', 50, contentY + 20)
      .text('₹500.00', 250, contentY + 20, { align: 'right' })
      .text(`${booking.totalDays}`, 370, contentY + 20, { align: 'right' })
      .text(`₹${driverFee.toFixed(2)}`, 480, contentY + 20, { align: 'right' });
  }

  // Horizontal line
  const totalsStartY = contentY + 60;
  doc.moveTo(300, totalsStartY).lineTo(550, totalsStartY).strokeColor('#d1d5db').stroke();

  // 5. TOTALS SECTION
  const subTotal = (baseRate * booking.totalDays) + driverFee;
  const cgst = subTotal * 0.09; // 9% CGST
  const sgst = subTotal * 0.09; // 9% SGST
  const netTotal = subTotal + cgst + sgst;

  let currentTotalY = totalsStartY + 15;
  doc
    .fontSize(10)
    .text('Subtotal:', 300, currentTotalY)
    .text(`₹${subTotal.toFixed(2)}`, 480, currentTotalY, { align: 'right' });

  doc
    .text('CGST (9%):', 300, currentTotalY + 15)
    .text(`₹${cgst.toFixed(2)}`, 480, currentTotalY + 15, { align: 'right' });

  doc
    .text('SGST (9%):', 300, currentTotalY + 30)
    .text(`₹${sgst.toFixed(2)}`, 480, currentTotalY + 30, { align: 'right' });

  doc.moveTo(300, currentTotalY + 45).lineTo(550, currentTotalY + 45).strokeColor('#9ca3af').stroke();

  doc
    .fontSize(12)
    .fillColor(primaryColor)
    .text('Grand Total:', 300, currentTotalY + 55, { bold: true })
    .text(`₹${netTotal.toFixed(2)}`, 480, currentTotalY + 55, { align: 'right', bold: true });

  // 6. PAYMENT METADATA
  doc
    .fillColor(textColor)
    .fontSize(10)
    .text('Payment Method:', 50, totalsStartY + 15)
    .fillColor(secondaryColor)
    .text(`${payment.paymentMethod}`, 150, totalsStartY + 15, { bold: true })
    .fillColor(textColor)
    .text('Transaction ID:', 50, totalsStartY + 30)
    .text(`${payment.transactionId}`, 150, totalsStartY + 30)
    .text('Payment Status:', 50, totalsStartY + 45)
    .fillColor('green')
    .text(`${payment.paymentStatus}`, 150, totalsStartY + 45, { bold: true });

  // Footer note
  doc
    .fillColor('#9ca3af')
    .fontSize(9)
    .text('Thank you for booking with Manivtha Tours & Travels!', 50, 500, { align: 'center', italic: true })
    .text('This is a computer-generated invoice and does not require a physical signature.', 50, 515, { align: 'center' });

  // End stream
  doc.end();
};

module.exports = { generateInvoicePDF };
