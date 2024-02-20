const mongoose = require('mongoose');
const { NUMBER } = require('sequelize');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    date: {
        type: String,
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
