const Expense = require('../models/expenses');

const addexpense = (req, res) => {
  const { expenseamount, description, category } = req.body;

  if (expenseamount == undefined || expenseamount.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Parameters missing" });
  }

  Expense.create({ expenseamount, description, category })
    .then((expense) => {
      return res.status(201).json({ expense, success: true });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

const getexpenses = (req, res) => {
  Expense.findAll()
    .then((expenses) => {
      return res.status(200).json({ expenses, success: true });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err, success: false });
    });
};

const deleteexpense = (req, res) => {
  const expenseid = req.params.expenseid;

  if (expenseid == undefined || expenseid.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid expense ID" });
  }

  Expense.destroy({ where: { id: expenseid } })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, message: "Deleted Successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete expense" });
    });
};

module.exports = {
    addexpense,
    getexpenses,
    deleteexpense
}