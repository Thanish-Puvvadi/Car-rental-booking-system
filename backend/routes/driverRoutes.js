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

router.get('/', authorize('driver_coordinator'), getDrivers);
router.get('/:id', authorize('driver_coordinator'), getDriverById);

router.post('/', authorize('driver_coordinator'), createDriver);
router.put('/:id', authorize('driver_coordinator'), updateDriver);
router.delete('/:id', authorize('driver_coordinator'), deleteDriver);

module.exports = router;
