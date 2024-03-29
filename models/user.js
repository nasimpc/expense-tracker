const Expense = require('./expense');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    totalExpenses: {
        type: Number,
        default: 0
    },
    ispremiumuser: {
        type: Boolean,
        default: false
    },
    downloadUrl: [{
        url: {
            type: String
        },
        createdAt: {
            type: Date,
        }
    }],
    forgotPassword: [{
        isActive: {
            type: Boolean,
        },
        createdAt: {
            type: Date,
        }
    }],
    order: [{
        order_id: {
            type: String
        },
        status: {
            type: String
        },
        payment_id: {
            type: String
        },
        createdAt: {
            type: Date
        }
    }]

});
userSchema.methods.updateTotal = async function () {

    const expenses = await Expense.find({ userId: this._id }, 'amount -_id');
    let total = expenses.reduce((accumulator, item) => accumulator + item.amount, 0);
    this.totalExpenses = total;
    return this.save();
}

module.exports = mongoose.model('User', userSchema);


