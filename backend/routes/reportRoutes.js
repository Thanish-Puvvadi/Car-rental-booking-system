const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  exportBookingsCSV,
  getMessageLogs,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/dashboard-stats', authorize('driver_coordinator', 'accounts'), getDashboardStats);
router.get('/export-bookings', authorize('accounts'), exportBookingsCSV);
router.get('/message-logs', authorize('driver_coordinator', 'accounts'), getMessageLogs);

module.exports = router;
