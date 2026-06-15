const express = require('express');
const router = express.Router();
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Protect all routes
router.use(protect);

router.get('/', authorize('admin', 'driver_coordinator'), getDrivers);
router.get('/:id', authorize('admin', 'driver_coordinator'), getDriverById);

router.post('/', authorize('admin'), createDriver);
router.put('/:id', authorize('admin', 'driver_coordinator'), updateDriver);
router.delete('/:id', authorize('admin'), deleteDriver);

module.exports = router;
