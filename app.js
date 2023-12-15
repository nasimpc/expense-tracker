const express = require('express');
var cors = require('cors');
require('dotenv').config();
const sequelize = require('./util/database');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;

const User = require('./models/user');
const Expense = require('./models/expense');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
//const { HasMany } = require('sequelize');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);

async function initiate() {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
initiate();