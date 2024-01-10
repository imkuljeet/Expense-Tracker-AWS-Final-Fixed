const express = require('express');
const router = express.Router();

const Expense = require('../models/expenses');
const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth')

router.post('/addexpense', userauthentication.authenticate ,expenseController.addexpense )

router.get('/getexpenses',userauthentication.authenticate, expenseController.getexpenses )

router.delete('/deleteexpense/:expenseid',userauthentication.authenticate ,expenseController.deleteexpense)

module.exports = router;

