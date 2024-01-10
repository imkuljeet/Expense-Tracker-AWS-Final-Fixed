async function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseamount: e.target.expenseAmount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };

  console.log(expenseDetails);

  try {
    const response = await axios.post("http://localhost:3000/expense/addexpense", expenseDetails);
    addNewExpensetoUI(response.data.expense);
  } catch (err) {
    console.log(err);
  }
}
 
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("http://localhost:3000/expense/getexpenses");
    const expenses = response.data.expenses;

    expenses.forEach((expense) => {
      addNewExpensetoUI(expense);
    });
  } catch (err) {
    console.log(err);
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
    await axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`);
    removeExpensefromUI(expenseId);
  } catch (err) {
    console.log(err);
  }
}
  
function removeExpensefromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

