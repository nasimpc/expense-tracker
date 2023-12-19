
const express = require('express');


const passwordController = require('../controllers/resetpass');

const router = express.Router();

router.post('/forgotpassword', passwordController.requestresetpassword);

module.exports = router;
