const Expense = require('../models/expenses');

const addexpense = async (req, res) => {
  try {
    const { expenseamount, description, category } = req.body;

    if (expenseamount == undefined || expenseamount.length === 0 || 
        description == undefined || description.length === 0 ||
        category == undefined || category.length === 0) {
      return res.status(400).json({ success: false, message: "Parameters missing" });
    }

    const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id });
    return res.status(201).json({ expense, success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
  
const getexpenses = async (req, res) => {
    try {
      const expenses = await Expense.findAll({ where : { userId: req.user.id}});
      return res.status(200).json({ expenses, success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err, success: false });
    }
};
  
const deleteexpense = async (req, res) => {
    try {
      const expenseid = req.params.expenseid;
  
      if (expenseid == undefined || expenseid.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid expense ID" });
      }
  
      const noOfRows = await Expense.destroy({ where: { id: expenseid, userId: req.user.id } });

      if (noOfRows === 0) {
          return res.status(404).json({ success: false, message: 'Expense doesn\'t belong to the user' });
      }

      return res.status(200).json({ success: true, message: 'Deleted Successfully' });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed' });
  }
};
  
module.exports = {
    addexpense,
    getexpenses,
    deleteexpense
}


