const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  exportBookingsCSV,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/dashboard-stats', authorize('admin', 'driver_coordinator', 'accounts'), getDashboardStats);
router.get('/export-bookings', authorize('admin', 'accounts'), exportBookingsCSV);

module.exports = router;
