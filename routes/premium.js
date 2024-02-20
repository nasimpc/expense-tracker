const express = require('express');
const premiumController = require('../controllers/premium');
const userauthentication = require('../middleware/authentication');
const router = express.Router();

router.get('/leaderborddata', premiumController.getLeaderboardExpenses);
router.get('/download', userauthentication.authenticate, premiumController.getDownloadURL);
router.get('/downloadhistory', userauthentication.authenticate, premiumController.getDownloadhistory);

module.exports = router;