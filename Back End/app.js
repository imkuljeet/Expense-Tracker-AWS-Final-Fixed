const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const userController = require('./controllers/user');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();

app.use(cors());

app.use(express.json());  

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);


sequelize
.sync()
.then((result)=>{
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
})