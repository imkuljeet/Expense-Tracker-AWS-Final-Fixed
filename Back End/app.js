const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const sequelize = require('./util/database');

const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const DownloadHistory = require('./models/downloadhistory');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword')

const app = express();

const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags: 'a'});

app.use(cors());

app.use(express.json());  
app.use(morgan('combined',{stream: accessLogStream}));
app.use(express.static('public'));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

app.use('/login', (req, res) => {
    console.log('Middleware for /home route');

    res.sendFile('login.html',{root:'views'});
    
});

app.use('/signup', (req, res) => {
    console.log('Middleware for /signup route');

    res.sendFile('signup.html', { root: 'views' });
});

app.use('/forgotpasswordss', (req, res) => {
    console.log('Middleware for /forgotpassword route');

    res.sendFile('forgotpassword.html', { root: 'views' });
});

app.use('/expensetracker', (req, res) => {
    console.log('Middleware for /expensetracker route');

    res.sendFile('expensetracker.html', { root: 'views' });
});



app.use(helmet());

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadHistory);
DownloadHistory.belongsTo(User);



sequelize
.sync()
.then((result)=>{
    app.listen(process.env.PORT);
    console.log("SERVER is running at",process.env.PORT);
})
.catch((err)=>{
    console.log(err);
})