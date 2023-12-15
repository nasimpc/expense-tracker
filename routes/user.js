const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/add-user', userController.addUser);
router.get('/loginPage', userController.getLoginPage);
router.get('/signupPage', userController.getSignupPage);
router.get('/mainPage', userController.getMainPage);
router.post('/login', userController.login);


module.exports = router;