const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  assignDriver,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);

router.put('/:id/status', authorize('admin', 'driver_coordinator', 'accounts'), updateBookingStatus);
router.put('/:id/assign-driver', authorize('admin', 'driver_coordinator'), assignDriver);
router.delete('/:id', authorize('admin'), deleteBooking);

module.exports = router;
