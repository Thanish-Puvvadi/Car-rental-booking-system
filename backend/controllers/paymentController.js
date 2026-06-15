const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const AuditLog = require('../models/AuditLog');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');

// @desc    Record a new payment and update booking status
// @route   POST /api/payments
// @access  Private (Accounts / Admin)
exports.recordPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, transactionId } = req.body;

    // Verify booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify booking isn't already paid (or completed)
    const existingPayment = await Payment.findOne({ booking: bookingId, paymentStatus: 'Completed' });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Payment already completed for this booking' });
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      amount,
      paymentMethod,
      transactionId,
      paymentStatus: 'Completed',
    });

    // Progress the booking workflow status
    booking.status = 'Payment Completed';
    await booking.save();

    // Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'Record Payment',
      details: `Recorded payment of ₹${amount} via ${paymentMethod} for booking ID ${bookingId}`,
    });

    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin, Accounts, Customers)
exports.getPayments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      // Find customer's bookings first
      const bookings = await Booking.find({ user: req.user._id }).select('_id');
      const bookingIds = bookings.map((b) => b._id);
      query.booking = { $in: bookingIds };
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'booking',
        populate: [
          { path: 'vehicle' },
          { path: 'driver' }
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate and stream PDF invoice
// @route   GET /api/payments/:id/invoice
// @access  Private
exports.getInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const booking = await Booking.findById(payment.booking)
      .populate('vehicle')
      .populate('driver');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Associated booking not found' });
    }

    // Verify ownership
    if (req.user.role === 'customer' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this invoice' });
    }

    // Set headers for PDF download/stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${payment._id}.pdf`);

    generateInvoicePDF(booking, payment, res);
  } catch (error) {
    console.error('Invoice PDF generation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate invoice PDF' });
  }
};
