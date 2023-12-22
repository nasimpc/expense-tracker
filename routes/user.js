const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const authController = require('../middleware/auth');

router.post('/add-user', userController.addUser);
router.get('/intro', userController.getIntroPage);
router.get('/mainPage', userController.getMainPage);
router.get('/proPage', userController.getProPage);
router.post('/login', userController.login);
router.get('/currentuser', authController.authenticate, userController.getcurrentuser);


module.exports = router;