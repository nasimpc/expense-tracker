// IMPORT EXPRESS 
const express = require('express');


//IMPORT CONTROLLERS 
const purchaseController = require('../controllers/purachase');
const authController = require('../middleware/auth');

//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR PURCHASINNG
router.get('/premiummembership', authController.authenticate, purchaseController.premiummembership);
router.put('/updatetransactionstatus', authController.authenticate, purchaseController.updatetransactionstatus);


module.exports = router;

