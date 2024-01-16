const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.addExpense = async (req, res, next) => {
    let transaction;//pcm
    try {
        transaction = await sequelize.transaction();
        //const user = req.user;
        const { amount, description, category } = req.body;
        const data = await Expense.create({ amount: amount, description: description, category: category, userId: req.user.id }, { transaction });
        // const data = await user.createExpense({ amount: amount, description: description, category: category }, { transaction });
        var totalExpenses = await Expense.sum('amount', { where: { UserId: req.user.id } });
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
        const page = req.query.page;
        const user = req.user;
        const limit = Number(req.query.noitem);
        const offset = (page - 1) * 5;
        const expenses = await user.getExpenses({
            offset: offset,
            limit: limit
        });
        res.status(200).json({
            allExpenses: expenses,
            hasMoreExpenses: expenses.length === limit,
            hasPreviousExpenses: page > 1
        });
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