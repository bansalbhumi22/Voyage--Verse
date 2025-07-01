const accessKey = "qDPS6Xpg8ile2T-qeT4noCjFsleUxvmDBZSvS7hYNKY";
const galleryContainer= document.querySelector(".gallery-container");
const gallery= ["Snowy Escapes","Secluded Shores","Sunset Lover","Adventure Junkies"," Majestic Mountains"," Tropical Escapes","Temples and Traditions","City Lights","Wild Encounters","Water Adventures", "Starry Nights","Spring Blooms","Offbeat Trails"," Wander Alone","Romantic Getaways"," Autumn Trails"];

async function fetchImages(){
    try{
        const imageFetchPromises= gallery.map(async(destination)=>{
           const response= await fetch(
                `https://api.unsplash.com/search/photos?query=${destination}&client_id=${accessKey}&per_page=1`
            )
            if(!response.ok){
                console.log("Failed to fecth image");
                return;
            }
            const data= await response.json();
            const imgUrl= data.results[0]?.urls.regular;

            return{destination,imgUrl};
        });

        const imagesData= await Promise.all(imageFetchPromises);
        let idx=1;
        imagesData.forEach(({destination,imgUrl})=>{
            if(imgUrl){
                const card= document.createElement("div");
                card.classList.add("card");

                card.innerHTML= `
                    <img src="${imgUrl} alt="${destination} class="gallery-images" >
                    <h3 id="img${idx++}">${destination}</h3>`;

                    galleryContainer.appendChild(card);
            }
        });
    }
    catch(error){
        console.log("Error fetching images from Unsplash");
    }
}

fetchImages();