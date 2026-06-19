const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiry } = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', createEnquiry);
router.get('/', protect, authorize('driver_coordinator', 'accounts'), getEnquiries);
router.put('/:id', protect, authorize('driver_coordinator', 'accounts'), updateEnquiry);

module.exports = router;
