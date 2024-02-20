const express = require('express');
var cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const PORT = process.env.PORT;

const mongoose = require('mongoose');
const url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9b4haud.mongodb.net/expense-tracker?retryWrites=true&w=majority`;

const userRoutes = require('./routes/user');
const premiumRouter = require('./routes/premium');
const purchaseRouter = require('./routes/purchase');
const expenseRoutes = require('./routes/expense');
const passwordRoutes = require('./routes/resetpass');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRouter);
app.use('/premium', premiumRouter);
app.use('/user', userRoutes);
app.use('/password', passwordRoutes);

async function initiate() {
    try {
        await mongoose.connect(url)
        app.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
}
initiate();