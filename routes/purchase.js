const express = require('express');
const purchaseController = require('../controllers/purachase');
const authController = require('../middleware/authentication');
const router = express.Router();

router.get('/premiummembership', authController.authenticate, purchaseController.premiumMembership);
router.put('/updatetransactionstatus', authController.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;

