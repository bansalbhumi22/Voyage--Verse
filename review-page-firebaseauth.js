
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDc9Wef0Eu168bbDzdpRW4_8v3Ve76pTo8",
    authDomain: "voyageverse-123.firebaseapp.com",
    projectId: "voyageverse-123",
    storageBucket: "voyageverse-123.firebasestorage.app",
    messagingSenderId: "531060819035",
    appId: "1:531060819035:web:d4da230992500d175a2b7e"
};


const app = initializeApp(firebaseConfig);
const auth= getAuth(app);

const profileBtn= document.querySelector(".profile-btn");
const menu= document.querySelector("#menu");
const email= document.querySelector("#email");




profileBtn.addEventListener("click", ()=>{
    menu.style.display= menu.style.display=== "none"? "block": "none" ;
});

auth.onAuthStateChanged((user) => {
    if (user) {
      
      
      const displayEmail= user.email || "No Email";

      
      email.textContent= `${displayEmail}`
    }else{
        window.location.href= "sign-in-page-index.html";
       
    }
});



  


