const accessKey = "qDPS6Xpg8ile2T-qeT4noCjFsleUxvmDBZSvS7hYNKY";
const destinationImg = document.querySelector("#destinations"); 
const places = ["Paris", "New York", "Italy", "Australia", "India", "Egypt", "Japan","Canada", "Brazil", "South Africa", "Thailand", "Spain","Germany", "Russia", "Mexico", "Turkey", "Greece", "Switzerland", "Netherlands", "Sweden","Norway","Finland", "Denmark", "Portugal", "Ireland", "Belgium", "Austria", "Poland", "Czech Republic", "Hungary", "Croatia", ];

function chooseDestination(){
   let destinations=new Set();
       while(destinations.size<7){
            let idx= Math.floor(Math.random()*31);
           destinations.add(places[idx]);
        }
        let a= Array.from(destinations);
        
        return a;
    
}

async function fetchImages() {
    try {

        destinationImg.innerHTML = "";
       let destinations=  chooseDestination();
        if(destinations.length===0){
            console.log("No destinations selected.");
            return;
        }
        const imageFetchPromises = destinations.map(async (destination) => {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${destination}&client_id=${accessKey}&per_page=1`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch image for ${destination}`);
            }

            const data = await response.json();
            const imgUrl = data.results[0]?.urls?.regular;

            return { destination, imgUrl };
        });

        
        const imagesData = await Promise.all(imageFetchPromises);

        
        imagesData.forEach(({ destination, imgUrl }) => {
            if (imgUrl) {
                const card = document.createElement("div");
                card.classList.add("card");

                card.innerHTML = `
                    <img src="${imgUrl}">
                    <h3>${destination}<h3>
                `;
                destinationImg.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
    }
}


fetchImages();

setInterval(fetchImages, 10000);

const loginBtn= document.querySelector("#login-btn");
const signUpBtn1 =document.querySelector("#sign-up-btn");
const signInBtn= document.querySelector("#sign-in");
const signUpBtn= document.querySelector("#sign-up");
function signInPage(){
    window.location.href= "sign-in-page-index.html";
}


signUpBtn1.addEventListener("click",signInPage);
loginBtn.addEventListener("click",signInPage);
signInBtn.addEventListener("click",signInPage);
signUpBtn.addEventListener("click",signInPage);