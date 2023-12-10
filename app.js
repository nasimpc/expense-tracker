const express = require('express');

const bodyParser = require('body-parser');

const User = require('./models/user');
const Expense = require('./models/expense');

const sequelize = require('./util/database');

var cors = require('cors');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
//const { HasMany } = require('sequelize');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));



app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

sequelize
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

