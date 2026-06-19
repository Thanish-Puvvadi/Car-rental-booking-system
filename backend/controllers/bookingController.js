const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { sendAutomatedMessages } = require('../utils/messagingService');

// Helper to calculate days between two dates
const calculateDays = (startDate, endDate) => {
  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Default to at least 1 day
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      email,
      vehicleId,
      pickupLocation,
      dropLocation,
      rentalDate,
      returnDate,
      passengers,
      tripType,
      specialInstructions,
    } = req.body;

    // Validate date inputs
    const start = new Date(rentalDate);
    const end = new Date(returnDate);
    if (start >= end) {
      return res.status(400).json({ success: false, message: 'Return date must be after pickup date' });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Check if vehicle is available during these dates
    const overlappingBookings = await Booking.find({
      vehicle: vehicleId,
      status: { $nin: ['Trip Completed'] },
      rentalDate: { $lte: end },
      returnDate: { $gte: start },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is already booked for the selected date range',
      });
    }

    // Calculate total cost
    const totalDays = calculateDays(start, end);
    const totalCost = totalDays * vehicle.dailyPrice;

    // Create booking
    const booking = await Booking.create({
      customerName,
      mobileNumber,
      email,
      user: req.user._id,
      vehicle: vehicleId,
      pickupLocation,
      dropLocation,
      rentalDate: start,
      returnDate: end,
      passengers,
      tripType,
      specialInstructions,
      totalDays,
      totalCost,
      status: 'Pending',
    });

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Request Received',
      body: `Your booking request for vehicle ${vehicle.brand} ${vehicle.model} (ID: ${booking._id}) has been filed and is awaiting review.`,
      type: 'info'
    });

    // Trigger Automated Email & WhatsApp Confirmation
    await sendAutomatedMessages(booking, 'Pending');

    // Create Audit Log
    await AuditLog.create({
      user: req.user._id,
      action: 'Create Booking',
      details: `Created booking ID ${booking._id} for vehicle ${vehicle.brand} ${vehicle.model} (Total: ₹${totalCost})`,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin, Coordinator, Accounts see all; Customers see their own)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // Customers can only see their own bookings
    if (req.user.role === 'customer') {
      query.user = req.user._id;
    }

    // Optional status filtering
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('vehicle')
      .populate('driver')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('driver')
      .populate('user', 'name email role');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership
    if (req.user.role === 'customer' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking workflow status
// @route   PUT /api/bookings/:id/status
// @access  Private (Staff roles only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicle').populate('driver');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const previousStatus = booking.status;

    // Validate workflow progression
    const validStatuses = ['Pending', 'Approved', 'Driver Assigned', 'Payment Completed', 'Trip Started', 'Trip Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    booking.status = status;

    // Side effects of status transitions
    if (status === 'Trip Completed') {
      // Free the driver and vehicle
      if (booking.driver) {
        await Driver.findByIdAndUpdate(booking.driver, { availabilityStatus: 'Available' });
      }
      if (booking.vehicle) {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { availabilityStatus: 'Available' });
      }
    } else if (status === 'Trip Started') {
      // Mark vehicle and driver as busy/rented
      if (booking.vehicle) {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { availabilityStatus: 'Rented' });
      }
      if (booking.driver) {
        await Driver.findByIdAndUpdate(booking.driver, { availabilityStatus: 'Busy' });
      }
    }

    await booking.save();

    // Create status notifications for user
    let title = 'Booking Status Updated';
    let body = `Your booking ID ${booking._id} has been moved to '${status}'.`;
    let type = 'info';

    if (status === 'Approved') {
      title = 'Booking Reservation Approved';
      body = `Great news! Your rental request for ${booking.vehicle.brand} ${booking.vehicle.model} has been approved. A driver coordinator is rostering your chauffeur now.`;
      type = 'success';
    } else if (status === 'Trip Started') {
      title = 'Trip Journey Started!';
      body = `Your rental trip from ${booking.pickupLocation} to ${booking.dropLocation} has commenced. Travel safely!`;
      type = 'success';
    } else if (status === 'Trip Completed') {
      title = 'Trip Concluded';
      body = `Thank you for choosing Manivtha Tours & Travels. Your booking ID ${booking._id} is complete.`;
      type = 'info';
    }

    await Notification.create({
      user: booking.user._id || booking.user,
      title,
      body,
      type
    });

    // Trigger Automated Email & WhatsApp Status Update
    const populatedBooking = await Booking.findById(booking._id).populate('vehicle').populate('driver');
    await sendAutomatedMessages(populatedBooking, status);

    // Log the action
    await AuditLog.create({
      user: req.user._id,
      action: 'Update Booking Status',
      details: `Updated booking ID ${booking._id} status from '${previousStatus}' to '${status}'`,
    });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a driver to a booking
// @route   PUT /api/bookings/:id/assign-driver
// @access  Private (Admin, Driver Coordinator)
exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify driver exists and is available (or off duty check)
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    // Release old driver if there was one
    if (booking.driver) {
      await Driver.findByIdAndUpdate(booking.driver, { availabilityStatus: 'Available' });
    }

    // Update booking
    booking.driver = driverId;
    booking.status = 'Driver Assigned'; // Progress workflow state
    await booking.save();

    // Keep driver available or change if trip is started?
    // According to booking workflow, driver status changes to Busy when trip starts,
    // but we can set them to Busy here or keep them Available until the trip actually starts.
    // Let's set driver availabilityStatus to 'Busy' when assigned so they don't get double assigned.
    driver.availabilityStatus = 'Busy';
    await driver.save();

    // Create Notification
    await Notification.create({
      user: booking.user,
      title: 'Chauffeur Rostered',
      body: `Driver ${driver.name} (Phone: ${driver.phoneNumber}) has been assigned to your booking.`,
      type: 'success'
    });

    // Trigger Automated Email & WhatsApp Driver Assignment
    const populatedBooking = await Booking.findById(booking._id).populate('vehicle').populate('driver');
    await sendAutomatedMessages(populatedBooking, 'Driver Assigned');

    await AuditLog.create({
      user: req.user._id,
      action: 'Assign Driver',
      details: `Assigned driver ${driver.name} to booking ID ${booking._id}`,
    });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete booking (Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Clean up driver status if active
    if (booking.driver && booking.status !== 'Trip Completed') {
      await Driver.findByIdAndUpdate(booking.driver, { availabilityStatus: 'Available' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    
    await AuditLog.create({
      user: req.user._id,
      action: 'Delete Booking',
      details: `Deleted booking ID ${req.params.id}`,
    });

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
