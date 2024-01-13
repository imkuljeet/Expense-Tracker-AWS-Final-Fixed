const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');

const addexpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { expenseamount, description, category } = req.body;

    if (expenseamount == undefined || expenseamount.length === 0 || 
        description == undefined || description.length === 0 ||
        category == undefined || category.length === 0) {
      return res.status(400).json({ success: false, message: "Parameters missing" });
    }

    const expense = await Expense.create({
      expenseamount,
      description,
      category,
      userId: req.user.id
  },{transaction: t});

    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
    console.log('total Expense amt is', totalExpense);

    await User.update({
      totalExpenses: totalExpense
    }, {
      where: { id: req.user.id },
      transaction: t
    });
    await t.commit();
    res.status(201).json({ expense, success: true });
 
  } catch (err) {
    await t.rollback();
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
  const t = await sequelize.transaction();
  try {
    const expenseid = req.params.expenseid;

    if (expenseid == undefined || expenseid.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid expense ID" });
    }

    const expense = await Expense.findByPk(expenseid);

    if (!expense) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const updatedUser = await User.update(
      { totalExpenses: req.user.totalExpenses - expense.expenseamount },
      { where: { id: req.user.id }, transaction: t }
    );

    // Check if the update operation affected any rows
    if (updatedUser[0] === 0) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Expense doesn\'t belong to the user' });
    }

    await Expense.destroy({ where: { id: expenseid, userId: req.user.id }, transaction: t });

    await t.commit();
    return res.status(200).json({ success: true, message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    await t.rollback();
    return res.status(500).json({ success: false, message: 'Failed' });
  }
};

function uploadTos3(data, filename){
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

      let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
      // Bucket: BUCKET_NAME
      })

      var params = {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: data,
          ACL: 'public-read'
      }

      return new Promise((resolve,reject)=>{
          s3bucket.upload(params, (err, s3response)=>{
              if(err){
                  console.log("Something went wrong",err)
                  // reject(err);
              }else{
                  console.log("success",s3response);
                  resolve(s3response.Location);
              }
          })
      })

      
  }

const downloadExpenses = async (req, res) => {
  try {
    // Assuming req.user is the current user object
    const expenses = await req.user.getExpenses();
    console.log(expenses);

    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    //It should depend upon userid
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURl = await uploadTos3(stringifiedExpenses,filename);
    console.log(fileURl);
    res.status(200).json({ fileURl, success: true })
  

    // Add logic to send expenses data as a downloadable file
  } catch (error) {
    console.error('Error downloading expenses:', error);
    return res.status(500).json({ success: false, error: 'Failed to download expenses' });
  }
};

  
module.exports = {
    addexpense,
    getexpenses,
    deleteexpense,
    downloadExpenses
}


