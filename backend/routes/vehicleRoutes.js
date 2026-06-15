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

router.post('/', protect, authorize('admin'), createVehicle);
router.put('/:id', protect, authorize('admin'), updateVehicle);
router.delete('/:id', protect, authorize('admin'), deleteVehicle);

module.exports = router;
