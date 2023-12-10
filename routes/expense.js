const path = require('path');
const express = require('express');

const router = express.Router();
const expensecontroller = require('../controllers/expense');
const userauthentication = require('../middleware/auth');

router.post('/add-expense', userauthentication.authenticate, expensecontroller.addExpense);

router.get('/get-expenses', userauthentication.authenticate, expensecontroller.getExpense);

router.delete('/delete-expense/:id', expensecontroller.deleteExpense);

// router.edit('/edit-user/:id', usercontroller.editUser);

module.exports = router;