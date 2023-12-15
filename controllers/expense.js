const Expense = require('../models/expense');
const User = require('../models/user');

exports.addExpense = async (req, res, next) => {
    try {

        const { amount, description, category } = req.body;
        const data = await Expense.create({ amount: amount, description: description, category: category, userId: req.user.id });
        res.status(201).json({ newExpenseDetails: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ allExpenses: expenses });
    }
    catch (error) {
        console.log('Get user is failing', JSON.stringify(error));
        res.status(500).json({ error: error });
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const eId = req.params.id;
        await Expense.destroy({ where: { id: eId } });
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}