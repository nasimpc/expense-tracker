const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();

router.get('/reset/:id', passwordController.resetPasswordForm);
router.post('/reset', passwordController.resetPassword);
router.post('/forgotpassword', passwordController.requestResetPassword);

module.exports = router;
