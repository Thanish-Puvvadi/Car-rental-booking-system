const MessageLog = require('../models/MessageLog');

/**
 * Automatically format and log outbound WhatsApp and Email dispatches to client
 * @param {Object} booking - Booking schema document
 * @param {string} trigger - Workflow trigger status
 */
exports.sendAutomatedMessages = async (booking, trigger) => {
  try {
    const customerName = booking.customerName;
    const phone = booking.mobileNumber;
    const email = booking.email;
    const bookingId = booking._id.toString();
    const shortId = bookingId.slice(-6).toUpperCase();
    const totalCost = booking.totalCost;

    let emailSubject = '';
    let emailBody = '';
    let whatsappBody = '';

    // Switch details by trigger
    switch (trigger) {
      case 'Pending':
        emailSubject = `Reservation Request Filed - Manivtha Travels (ID: #${shortId})`;
        emailBody = `Dear ${customerName},\n\nThank you for choosing Manivtha Tours & Travels. We have received your booking request for ${booking.pickupLocation} to ${booking.dropLocation}.\n\nTrip Details:\n- Total Fare: INR ${totalCost.toLocaleString()}\n- Status: Pending Review\n\nWe will verify vehicle capacity and driver availability shortly. You can track booking logs on http://localhost:5000/dashboard.\n\nBest Regards,\nManivtha Tours & Travels`;
        
        whatsappBody = `🟢 *Booking Request Filed* 🟢\n\nDear *${customerName}*,\nYour booking request *#${shortId}* is received. We are verifying vehicle availability.\n\n📍 *Route:* ${booking.pickupLocation} ➔ ${booking.dropLocation}\n💰 *Fare Estimate:* ₹${totalCost.toLocaleString()}\n\nTrack status in dashboard. Thank you!`;
        break;

      case 'Approved':
        emailSubject = `Booking Reservation Approved - Manivtha Travels (ID: #${shortId})`;
        emailBody = `Dear ${customerName},\n\nGood news! Your booking reservation #${shortId} has been approved by our administrators.\n\nOur coordinator is rostering an available chauffeur now. Once driver details are updated, you will be notified to clear the payment ledger.\n\nThank you,\nManivtha Tours & Travels`;

        whatsappBody = `✅ *Booking Reservation Approved* ✅\n\nDear *${customerName}*,\nYour booking request *#${shortId}* has been approved by the Admin team.\n\nOur coordinator is assigning a driver to your trip now. You will receive WhatsApp updates shortly. Thank you!`;
        break;

      case 'Driver Assigned':
        // Safe check for driver details
        const driverName = booking.driver?.name || 'Rostered Chauffeur';
        const driverPhone = booking.driver?.phoneNumber || 'N/A';
        const vehicleReg = booking.vehicle?.registrationNumber || 'N/A';
        const vehicleInfo = booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model}` : 'Vehicle';

        emailSubject = `Chauffeur Rostered for your Trip - Manivtha Travels (ID: #${shortId})`;
        emailBody = `Dear ${customerName},\n\nChauffeur rostered successfully for booking #${shortId}!\n\nDriver Details:\n- Name: ${driverName}\n- Contact: ${driverPhone}\n- Vehicle: ${vehicleInfo} (Reg: ${vehicleReg.toUpperCase()})\n\nPlease check invoice and verify payment options on http://localhost:5000/dashboard.\n\nSafe Travels,\nManivtha Tours & Travels`;

        whatsappBody = `🚖 *Chauffeur & Vehicle Assigned* 🚖\n\nDear *${customerName}*,\nDriver coordinates rostered for booking *#${shortId}*!\n\n👨‍✈️ *Chauffeur:* ${driverName}\n📞 *Contact:* ${driverPhone}\n🚗 *Vehicle:* ${vehicleInfo} (${vehicleReg.toUpperCase()})\n💰 *Total Fare:* ₹${totalCost.toLocaleString()}\n\nPlease verify billing and clear payment in dashboard. Thank you!`;
        break;

      case 'Payment Completed':
        emailSubject = `Invoice Receipt Confirmed - Manivtha Travels (ID: #${shortId})`;
        emailBody = `Dear ${customerName},\n\nWe have recorded payment confirmation for your booking #${shortId}.\n\nTotal Paid: INR ${totalCost.toLocaleString()}\nStatus: Payment Completed\n\nYour PDF transaction invoice is compiled and ready for download. Log in to http://localhost:5000/dashboard to print receipt.\n\nBest Regards,\nManivtha Tours & Travels`;

        whatsappBody = `💳 *Payment Confirmed & Invoice Issued* 💳\n\nDear *${customerName}*,\nWe received your payment of *₹${totalCost.toLocaleString()}* for booking *#${shortId}*.\n\nStatus: *Payment Completed* (Ready for Dispatch)\n\nPDF Invoice is ready for download in your dashboard logs. Thank you!`;
        break;

      case 'Trip Started':
        emailSubject = `Your Trip Has Started - Wish you a Safe Journey!`;
        emailBody = `Dear ${customerName},\n\nYour trip journey from ${booking.pickupLocation} to ${booking.dropLocation} has started successfully.\n\nHelp Desk Support: +91 98765 43210\n\nTravel safely,\nManivtha Tours & Travels`;

        whatsappBody = `🚀 *Trip Started successfully!* 🚀\n\nDear *${customerName}*,\nYour journey from *${booking.pickupLocation}* to *${booking.dropLocation}* has commenced. Have a comfortable ride!\n\n📞 Support Hotline: +91 98765 43210. Manivtha Travels.`;
        break;

      case 'Trip Completed':
        emailSubject = `Trip Concluded - Share your feedback (ID: #${shortId})`;
        emailBody = `Dear ${customerName},\n\nWe hope you had a pleasant travel experience with Manivtha Tours & Travels. Your booking #${shortId} is concluded.\n\nPlease share your valuable feedback to help us preserve standard service protocols.\n\nThank you,\nManivtha Tours & Travels`;

        whatsappBody = `🏁 *Trip Concluded* 🏁\n\nDear *${customerName}*,\nYour booking *#${shortId}* is completed. Thank you for traveling with us! Hope you had a pleasant ride.`;
        break;

      default:
        return;
    }

    // 1. Simulate Outbound Email
    console.log(`\n=================== [SIMULATED EMAIL DISPATCH] ===================`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body:\n${emailBody}`);
    console.log(`==================================================================\n`);

    // 2. Simulate Outbound WhatsApp Message
    console.log(`\n================== [SIMULATED WHATSAPP DISPATCH] ==================`);
    console.log(`To: ${phone}`);
    console.log(`Message:\n${whatsappBody}`);
    console.log(`==================================================================\n`);

    // 3. Save logs in MongoDB message log registry
    await MessageLog.create({
      booking: booking._id,
      recipient: email,
      channel: 'Email',
      subject: emailSubject,
      body: emailBody,
      status: 'Delivered'
    });

    await MessageLog.create({
      booking: booking._id,
      recipient: phone,
      channel: 'WhatsApp',
      body: whatsappBody,
      status: 'Delivered'
    });

  } catch (error) {
    console.error('Failed to trigger simulated dispatches:', error.message);
  }
};
