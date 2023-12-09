const express = require('express');

const router = express.Router();

const usercontroller = require('../controllers/user');

router.post('/add-user', usercontroller.addUser);

module.exports = router;