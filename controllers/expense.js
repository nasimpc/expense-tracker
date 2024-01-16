const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.addExpense = async (req, res, next) => {
    let transaction;//pcm
    try {
        transaction = await sequelize.transaction();
        const { amount, description, category } = req.body;
        const data = await Expense.create({ amount: amount, description: description, category: category, userId: req.user.id }, { transaction });
        const totalExpenses = await Expense.sum('amount', { where: { UserId: req.user.id } });
        totalExpenses = Number(totalExpenses);
        totalExpenses += Number(amount);
        await req.user.update({ totalExpenses: totalExpenses }, { transaction });
        await transaction.commit();
        res.status(201).json({ newExpenseDetails: data });
    }
    catch (err) {
        console.log(err, 'nasim');
        if (transaction) {
            await transaction.rollback();
        }
        res.status(500).json({ message: 'An error occurred' });
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ allExpenses: expenses });
    }
    catch (err) {
        console.log('Get user is failing', JSON.stringify(err));
        res.status(500).json({ error: err });
    }
}

exports.deleteExpense = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const eId = req.params.id;
        await Expense.destroy({ where: { id: eId } }, { transaction });
        const totalExpenses = await Expense.sum('amount', { where: { UserId: req.user.id } });
        await req.user.update({ totalExpenses: totalExpenses }, { transaction });
        await transaction.commit();
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        if (transaction) {
            await transaction.rollback();
        }
        res.status(500).json(err);
    }
}