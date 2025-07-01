const accessKey = "qDPS6Xpg8ile2T-qeT4noCjFsleUxvmDBZSvS7hYNKY";
const destinationimg= document.querySelector(".wishlist-container");
const place= document.querySelector("#search-bar");
const searchbtn= document.querySelector("#search-btn");





async function fetchImages(){
    try{
        
        let destinationname= place.value.trim();
        
        if(!destinationname){
            console.log("nothing added");
            return;
    }
   
        const response= await fetch(
        `https://api.unsplash.com/search/photos?query=${destinationname}&client_id=${accessKey}&per_page=1`
        );
        if(!response.ok){
            throw new Error(`Failed to fetch image`);
        }
        const data= await response.json();
        const imgUrl= data.results[0]?.urls?.regular;

     
            if (imgUrl) {
                const card = document.createElement("div");
                card.classList.add("card");
                
                    
                 
                localStorage.setItem(destinationname, JSON.stringify(imgUrl));
               
                card.innerHTML = `
                    <img src="${imgUrl}">
                    <h3>${destinationname}</h3>
                    <button class= "delete-btn" onClick="localStorage.removeItem('${destinationname}'); location.reload();">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                destinationimg.appendChild(card);
            }
            else{
                console.log("no image found");
            }
        }
    catch (error) {
        console.error("Error fetching images from Unsplash:", error);
    }

}
     
 if(localStorage.length>1){
    for(let idx=0;idx<localStorage.length; idx++){
        if(localStorage.key(idx)!="loggedInUserId"){
            const card = document.createElement("div");
                card.classList.add("card");
                  const url= JSON.parse(localStorage.getItem(localStorage.key(idx)));

                    card.innerHTML = `
                    <img src="${url}">
                    <h3>${localStorage.key(idx)}</h3>
                    <button class= "delete-btn" onClick="localStorage.removeItem('${localStorage.key(idx)}'); location.reload();">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                destinationimg.appendChild(card);
        }
             
                
                }
  }    
         
     searchbtn.addEventListener("click", ()=>{
    console.log(place.value);
    fetchImages();
    place.value="";
     }
)
               
   
    window.addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            console.log(place.value);
            fetchImages();
            place.value="";
        }
    })

   
