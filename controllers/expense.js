const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {
    try {
        const { user } = req;
        const { amount, description, category, date } = req.body;
        const expense = new Expense({ userId: user, amount, description, category, date, })
        const data = await expense.save();
        await user.updateTotal();
        res.status(200).json({ message: 'Expense successfully added', newExpenseDetails: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred' });
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const page = req.query.page;
        const user = req.user;
        // const limit = Number(req.query.noitem);
        // const offset = (page - 1) * 5;
        const limit = 100;
        const offset = 0;
        const expenses = await Expense.find({ "userId": user._id }).skip(offset).limit(limit);
        res.status(200).json({
            allExpenses: expenses,
            hasMoreExpenses: expenses.length === limit,
            hasPreviousExpenses: page > 1
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred' });
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const eId = req.params.id;
        const { user } = req;
        await Expense.findByIdAndDelete(eId)
        await user.updateTotal();
        return res.status(200).json({ message: 'Succeffully deleted' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred' });
    }
}