const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');
const loginButton = document.querySelector("#login-btn");
const registerButton = document.querySelector("#register-btn");
const switchToRegisterLink = signInForm.querySelector("a");
const switchToLoginLink = signUpForm.querySelector("a");

function showRegister(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
}

function showLogin(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
}

signUpButton.addEventListener('click',showRegister)
signInButton.addEventListener('click',showLogin )

loginButton.addEventListener("click", showLogin);
registerButton.addEventListener("click", showRegister);


switchToRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    showRegister();
});

switchToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
});


showLogin();







