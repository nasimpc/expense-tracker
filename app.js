const express = require('express');
const fs = require('fs');
var cors = require('cors');
require('dotenv').config();
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT;

const User = require('./models/user');
const Forgotpasswords = require('./models/forgotpasswords');
const Order = require('./models/orders');
const Expense = require('./models/expense');
const Downloads = require('./models/downloads');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/user');
const premiumRouter = require('./routes/premium');
const purchaseRouter = require('./routes/purchase');
const expenseRoutes = require('./routes/expense');
const passwordRoutes = require('./routes/resetpass');

//const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const app = express();
app.use(cors());
//app.use(helmet());
//app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

Forgotpasswords.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Forgotpasswords);

Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);

Downloads.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Downloads);

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRouter);
app.use('/premium', premiumRouter);
app.use('/user', userRoutes);
app.use('/password', passwordRoutes);

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