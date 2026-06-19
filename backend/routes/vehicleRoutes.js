const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  checkVehicleAvailability,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.get('/:id/availability', checkVehicleAvailability);

router.post('/', protect, authorize('driver_coordinator'), createVehicle);
router.put('/:id', protect, authorize('driver_coordinator'), updateVehicle);
router.delete('/:id', protect, authorize('driver_coordinator'), deleteVehicle);

module.exports = router;
