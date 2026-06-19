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

router.put('/:id/status', authorize('driver_coordinator', 'accounts'), updateBookingStatus);
router.put('/:id/assign-driver', authorize('driver_coordinator'), assignDriver);
router.delete('/:id', authorize('driver_coordinator'), deleteBooking);

module.exports = router;
