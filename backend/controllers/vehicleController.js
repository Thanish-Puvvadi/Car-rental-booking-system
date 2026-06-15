const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Get all vehicles with optional filters
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res) => {
  try {
    const { brand, fuelType, seatingCapacity, minPrice, maxPrice, availabilityStatus } = req.query;
    let query = {};

    if (brand) query.brand = new RegExp(brand, 'i');
    if (fuelType) query.fuelType = fuelType;
    if (seatingCapacity) query.seatingCapacity = { $gte: Number(seatingCapacity) };
    if (availabilityStatus) query.availabilityStatus = availabilityStatus;
    
    if (minPrice || maxPrice) {
      query.dailyPrice = {};
      if (minPrice) query.dailyPrice.$gte = Number(minPrice);
      if (maxPrice) query.dailyPrice.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(query).sort({ dailyPrice: 1 });
    res.json({ success: true, count: vehicles.length, vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single vehicle details
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new vehicle (Admin only)
// @route   POST /api/vehicles
// @access  Private/Admin
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vehicle details (Admin only)
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
exports.updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vehicle (Admin only)
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check vehicle availability for a date range
// @route   GET /api/vehicles/:id/availability
// @access  Public
exports.checkVehicleAvailability = async (req, res) => {
  try {
    const { rentalDate, returnDate } = req.query;
    if (!rentalDate || !returnDate) {
      return res.status(400).json({ success: false, message: 'Please provide rentalDate and returnDate' });
    }

    const start = new Date(rentalDate);
    const end = new Date(returnDate);

    // Overlapping bookings exist if: (booking.rentalDate <= end) AND (booking.returnDate >= start)
    // Exclude completed or cancelled bookings (for demo, let's say status != 'Trip Completed')
    const overlappingBookings = await Booking.find({
      vehicle: req.params.id,
      status: { $nin: ['Trip Completed'] }, // Active bookings
      rentalDate: { $lte: end },
      returnDate: { $gte: start },
    });

    const isAvailable = overlappingBookings.length === 0;

    res.json({
      success: true,
      isAvailable,
      conflicts: overlappingBookings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
