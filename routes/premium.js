const express = require('express');

const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/leaderborddata', premiumController.getLeaderboardExpenses);

module.exports = router;