const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/from-placement', invoiceController.createInvoiceFromPlacement);
router.put('/:id/cancel', invoiceController.cancelInvoice);

module.exports = router;