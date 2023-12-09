const path = require('path');
const express = require('express');

const router = express.Router();
const expensecontroller = require('../controllers/expense');

router.post('/add-expense', expensecontroller.addExpense);

router.get('/get-expenses', expensecontroller.getExpense);

router.delete('/delete-expense/:id', expensecontroller.deleteExpense);

// router.edit('/edit-user/:id', usercontroller.editUser);

module.exports = router;