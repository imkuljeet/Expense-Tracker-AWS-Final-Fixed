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
    const decodeToken = parseJwt(token)
    console.log("Decode token is",decodeToken)

    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
      showPremiumuserMessage()
      showLeaderboard()
    }

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

function showPremiumuserMessage() {
  document.getElementById('rzp-button1').style.visibility = "hidden"
  document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

document.getElementById('rzp-button1').onclick = async function (e) {
  const token = localStorage.getItem('token')
  const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
  console.log(response);
  var options =
  {
   "key": response.data.key_id, 
   "order_id": response.data.order.id,
   "handler": async function (response) {
      const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"Authorization" : token} })

      console.log(res)
       alert('You are a Premium User Now')
       showPremiumuserMessage();
       localStorage.setItem('token', res.data.token)
       showLeaderboard()
   },
};
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
  console.log(response)
  alert('Something went wrong')
});
}

function showLeaderboard(){
  const inputElement = document.createElement("input")
  inputElement.type = "button"
  inputElement.value = 'Show Leaderboard'
  inputElement.onclick = async() => {
      const token = localStorage.getItem('token')
      const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
      console.log(userLeaderBoardArray)

      var leaderboardElem = document.getElementById('leaderboard')
      leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
      userLeaderBoardArray.data.forEach((userDetails) => {
        leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0} </li>`
      })
  }
  document.getElementById("message").appendChild(inputElement);

}

function download(){
  const token = localStorage.getItem('token');

  axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
  .then((response) => {
      if(response.status === 200){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileURl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }

  })
  .catch((err) => {
      showError(err)
  });
}