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


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');
// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     }
//     ,
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     },
//     totalExpenses: {
//         type: Sequelize.FLOAT(),
//         defaultValue: 0.00
//     },
//     password: Sequelize.STRING,
//     ispremiumuser: Sequelize.BOOLEAN,
// })

// module.exports = User;