const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');

// @desc    Get dashboard metrics & chart data
// @route   GET /api/reports/dashboard-stats
// @access  Private (Admin, Driver Coordinator, Accounts)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. High level counters
    const totalVehicles = await Vehicle.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalDrivers = await Driver.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'Approved' });
    const driverAssignedBookings = await Booking.countDocuments({ status: 'Driver Assigned' });
    const paymentCompletedBookings = await Booking.countDocuments({ status: 'Payment Completed' });
    const activeTrips = await Booking.countDocuments({ status: 'Trip Started' });
    const completedTrips = await Booking.countDocuments({ status: 'Trip Completed' });

    // Calculate total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 2. Booking Trends Chart (last 6 months)
    const bookingTrends = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          bookingsCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 6 }
    ]);

    // 3. Revenue Chart (last 6 months)
    const revenueTrends = await Payment.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 6 }
    ]);

    // 4. Vehicle Utilization Chart
    const availableCars = await Vehicle.countDocuments({ availabilityStatus: 'Available' });
    const rentedCars = await Vehicle.countDocuments({ availabilityStatus: 'Rented' });
    const maintenanceCars = await Vehicle.countDocuments({ availabilityStatus: 'Maintenance' });

    const vehicleUtilization = [
      { name: 'Available', value: availableCars },
      { name: 'Rented', value: rentedCars },
      { name: 'Maintenance', value: maintenanceCars }
    ];

    // 5. Trip Type Distribution Chart
    const tripTypes = await Booking.aggregate([
      {
        $group: {
          _id: '$tripType',
          value: { $sum: 1 }
        }
      }
    ]);
    const tripTypeDistribution = tripTypes.map((t) => ({ name: t._id, value: t.value }));

    // 6. Recent Audit Logs (Admin only)
    let recentLogs = [];
    if (req.user.role === 'admin') {
      recentLogs = await AuditLog.find({})
        .populate('user', 'name role')
        .sort({ timestamp: -1 })
        .limit(10);
    }

    res.json({
      success: true,
      stats: {
        totalVehicles,
        totalCustomers,
        totalDrivers,
        totalBookings,
        pendingBookings,
        confirmedBookings: approvedBookings + driverAssignedBookings + paymentCompletedBookings,
        completedTrips,
        activeTrips,
        totalRevenue,
      },
      charts: {
        bookingTrends: bookingTrends.map(t => ({ month: t._id, bookings: t.bookingsCount })),
        revenueTrends: revenueTrends.map(r => ({ month: r._id, revenue: r.revenue })),
        vehicleUtilization,
        tripTypeDistribution
      },
      recentLogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export bookings report to CSV
// @route   GET /api/reports/export-bookings
// @access  Private (Admin, Accounts)
exports.exportBookingsCSV = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('vehicle', 'brand model registrationNumber')
      .populate('driver', 'name')
      .sort({ createdAt: -1 });

    // Form CSV header and contents
    let csv = 'Booking ID,Customer Name,Email,Mobile,Vehicle,Driver,Pickup,Drop,Rental Date,Return Date,Passengers,Trip Type,Status,Days,Total Cost\n';

    bookings.forEach((b) => {
      const vehicleName = b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'N/A';
      const driverName = b.driver ? b.driver.name : 'N/A';
      const row = [
        b._id,
        `"${b.customerName.replace(/"/g, '""')}"`,
        b.email,
        b.mobileNumber,
        `"${vehicleName}"`,
        `"${driverName}"`,
        `"${b.pickupLocation.replace(/"/g, '""')}"`,
        `"${b.dropLocation.replace(/"/g, '""')}"`,
        new Date(b.rentalDate).toLocaleDateString(),
        new Date(b.returnDate).toLocaleDateString(),
        b.passengers,
        b.tripType,
        b.status,
        b.totalDays,
        b.totalCost
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=manivtha_bookings_report.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
