const accessKey = "qDPS6Xpg8ile2T-qeT4noCjFsleUxvmDBZSvS7hYNKY";
const backgroundImg= document.querySelector("#background-img");
const searchBtn= document.querySelector("#search-btn");
const destinations= {
    Italy:{
        about: "Italy is a country in Southern Europe known for its rich history, culture, and landscapes.",
        attractions: ["Leaning Tower of Pisa", "Venice: City of Water", "Earth Pyramids"],
        weather: "The majority of Italy follows a Mediterranean climate with hot summers and mild winters."
    },
    Paris: {
        about: "Paris is the capital of France and is known for its beauty, culture, and history",
        attractions: ["Eiffel Tower", "Louvre Museum", "French Riviera"],
        weather: "Paris has a typical oceanic climate (Köppen climate classification: Cfb), affected by the North Atlantic Current"
    },
    Spain: {
        about: "Spain, officially the Kingdom of Spain, is a country in Southwestern Europe with territories in North Africa.",
        attractions: ["Sagrada Familia", "Alhambra", "Park Güell"],
        weather: "Spain generally enjoys a warm Mediterranean climate, especially along its coastal regions."
    },

    Australia:{
        about: "Australia, the smallest continent and one of the largest countries on Earth, lying between the Pacific and Indian oceans in the Southern Hemisphere.",
        attractions: ["Opera House", "Harbour Bridge", "Royal Botanic Garden Sydney"],
        weather:"Australia's seasons are at opposite times to those in the northern hemisphere. December to February is summer; March to May is autumn"
    },

    India:{
        about: "India is a land of various cultures and a rich heritage. It is the seventh-largest country by area",
        attractions: ["Taj Mahal", "Humayun Tomb", "Golden-Temple"],
        weather:"India experiences a predominantly tropical monsoon climate with hot summers, mild winters, and heavy rainfall during the monsoon season.",
    },

    Egypt:{
        about: "Egypt is a North African country, renowned for its ancient civilization along the Nile River, most notably the pyramids and Sphinx",
        attractions: ["Giza Necropolis", "Karnak", "Valley of the Kings"],
        weather:"Egypt essentially has a hot desert climate (Köppen climate classification BWh). The climate is generally extremely dry all over the country.",
    },

    Japan:{
        about: "Japan is a constitutional monarchy with a bicameral legislature, the National Diet.",
        attractions: ["Kiyomizu-Dera", "Fushimi Inari Taisha", "Meiji Jingu"],
        weather: "Japan experiences four distinct seasons with hot, humid summers, mild to cold winters",
    },
}
const destinationName =document.querySelector("#destination-name");
const imageLine = document.querySelector("#image-line");
const aboutDestination = document.querySelector("#about-destination");

const destinationWeather= document.querySelector("#destination-weather");
const attractionList = document.querySelector("#attraction-list");
const reviews= document.querySelector("#review")
async function fetchImage(query){
    const response= await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=1`
    );
    const data = await response.json();
    const imgUrl = data.results[0]?.urls?.regular;

    if (imgUrl){
        backgroundImg.src= imgUrl;
    } else {
        console.error("No image found");
       
    }
};

fetchImage("Italy");

function updateDetails(destination){
    const details = destinations[destination];

    if(details){
      destinationName.textContent = destination;
      imageLine.textContent = `Explore ${destination}!`;
      aboutDestination.textContent= details.about;

      
      attractionList.innerHTML = "";
      details.attractions.forEach((attraction)=>{
        const li = document.createElement("li");
        li.textContent = attraction;
        attractionList.appendChild(li);
      });

       destinationWeather.textContent =details.weather;
       reviews.textContent= `Visiting ${destination} was a dream comes true!`
    }else{
        alert("Details not found for this destination.")
    }
}

updateDetails("Italy");

searchBtn.addEventListener("click", async () => {
    const searchInput = document.querySelector(".search-bar").value.trim();

    if (searchInput) {
        await fetchImage(searchInput);
        updateDetails(searchInput);
    } else {
        alert("Please enter a destination name.");
    }
});


