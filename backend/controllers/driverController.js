const Driver = require('../models/Driver');

// @desc    Get all drivers with filters
// @route   GET /api/drivers
// @access  Private (Admin, Driver Coordinator)
exports.getDrivers = async (req, res) => {
  try {
    const { availabilityStatus } = req.query;
    let query = {};

    if (availabilityStatus) {
      query.availabilityStatus = availabilityStatus;
    }

    const drivers = await Driver.find(query).sort({ name: 1 });
    res.json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single driver details
// @route   GET /api/drivers/:id
// @access  Private (Admin, Driver Coordinator)
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new driver (Admin only)
// @route   POST /api/drivers
// @access  Private/Admin
exports.createDriver = async (req, res) => {
  try {
    const { name, phoneNumber, licenseNumber, experience, availabilityStatus } = req.body;
    
    // Check if license already exists
    const driverExists = await Driver.findOne({ licenseNumber });
    if (driverExists) {
      return res.status(400).json({ success: false, message: 'Driver with this license number already exists' });
    }

    const driver = await Driver.create({
      name,
      phoneNumber,
      licenseNumber,
      experience,
      availabilityStatus: availabilityStatus || 'Available',
    });

    res.status(201).json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update driver details (Admin, Driver Coordinator)
// @route   PUT /api/drivers/:id
// @access  Private
exports.updateDriver = async (req, res) => {
  try {
    let driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete driver (Admin only)
// @route   DELETE /api/drivers/:id
// @access  Private/Admin
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    await Driver.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
