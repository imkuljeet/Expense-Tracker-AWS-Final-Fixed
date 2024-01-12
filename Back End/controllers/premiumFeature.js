const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try{
       const users = await User.findAll();
       const expenses = await Expense.findAll();
       const userAgrregatedExpenses = {};

       expenses.forEach((expense)=>{
        if(userAgrregatedExpenses[expense.userId]){
            userAgrregatedExpenses[expense.userId] = userAgrregatedExpenses[expense.userId]+expense.expenseamount;
        }else{
            userAgrregatedExpenses[expense.userId] = expense.expenseamount;
        }
       })
       var userLeaderboardDetails = [];
       users.forEach((user)=>{
        userLeaderboardDetails.push({ name: user.name, total_cost: userAgrregatedExpenses[user.id] || 0})
       })
       console.log(userLeaderboardDetails);
      
       userLeaderboardDetails.sort((a, b) => b.total_cost - a.total_cost);   //NOT WORKING


       res.status(200).json(userLeaderboardDetails);
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}

