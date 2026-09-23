const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');

router.get('/overview', debtController.getDebtOverview);
router.post('/payment', debtController.recordPayment);
router.post('/remind', debtController.sendDebtReminder);

module.exports = router;