async function login(e){
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const loginDetails = {
            email : e.target.email.value,
            password : e.target.password.value
        }

        console.log(loginDetails);

        const response = await axios.post('http://localhost:3000/user/login',loginDetails)
            alert("User Logged in Successfully")
            
            localStorage.setItem('token', response.data.token);
            window.location.href = "../ExpenseTracker/index.html";


    }catch(err){
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style = "color:red;">${err}</div>`;
    }
}

function forgotpassword() {
    window.location.href = "../ForgotPassword/index.html"
  }


