const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try{
        const users = await User.findAll({
            attributes: ['id','name']
           });
           const userAgrregatedExpenses = await Expense.findAll({
            attributes: ['userId',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
            group: ['userId']
           });

           console.log("user agrre expenses is ---->",userAgrregatedExpenses);


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



