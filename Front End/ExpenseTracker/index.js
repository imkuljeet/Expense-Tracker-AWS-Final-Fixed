async function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseamount: e.target.expenseAmount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };

  console.log(expenseDetails);

  try {
    const token  = localStorage.getItem('token')
    const response = await axios.post("http://localhost:3000/expense/addexpense", expenseDetails,  { headers: {"Authorization" : token} });
    addNewExpensetoUI(response.data.expense);
  } catch (err) {
    console.log(err);
    showError(err);
  }
}
 
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token  = localStorage.getItem('token')

    const response = await axios.get("http://localhost:3000/expense/getexpenses",{ headers: {"Authorization" : token} });
    const expenses = response.data.expenses;

    expenses.forEach((expense) => {
      addNewExpensetoUI(expense);
    });
  } catch (err) {
    console.log(err);
    showError(err);
  }
});
 
function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById("listOfExpenses");
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
          <li id=${expenseElemId}>
              ${expense.expenseamount} - ${expense.category} - ${expense.description}
              <button onclick='deleteExpense(event, ${expense.id})'>
                  Delete Expense
              </button>
          </li>`;
}
  
async function deleteExpense(event, expenseId) {
  console.log("Deleting expense with ID:", expenseId);

  try {
    const token = localStorage.getItem('token')

    await axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`, { headers: {"Authorization" : token} });
    removeExpensefromUI(expenseId);
  } catch (err) {
    console.log(err);
    showError(err);
  }
}
  
function removeExpensefromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

