const express = require('express');
const router = express.Router();
const {
  recordPayment,
  getPayments,
  getInvoice,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('admin', 'accounts'), recordPayment);
router.get('/', getPayments);
router.get('/:id/invoice', getInvoice);

module.exports = router;
