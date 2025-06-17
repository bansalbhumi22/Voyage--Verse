
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDc9Wef0Eu168bbDzdpRW4_8v3Ve76pTo8",
    authDomain: "voyageverse-123.firebaseapp.com",
    projectId: "voyageverse-123",
    storageBucket: "voyageverse-123.firebasestorage.app",
    messagingSenderId: "531060819035",
    appId: "1:531060819035:web:d4da230992500d175a2b7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const accessKey = "qDPS6Xpg8ile2T-qeT4noCjFsleUxvmDBZSvS7hYNKY";


async function fetchImage(destination) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${destination}&client_id=${accessKey}&per_page=1`
        );
        const data = await response.json();
        return data.results[0]?.urls?.small || 'default-image-url';
    } catch (error) {
        console.error("Error fetching image:", error);
        return 'default-image-url';
    }
}


async function addToWishlist() {
    const destinationInput = document.getElementById("destination-name");
    const destination = destinationInput.value.trim();
    
    if (!destination) {
        alert("Please enter a destination");
        return;
    }

    try {
        const imageUrl = await fetchImage(destination);
        await addDoc(collection(db, "wishlist"), {
            name: destination,
            imageUrl: imageUrl,
            timestamp: new Date().toISOString()
        });
        
        console.log("Destination added successfully");
        destinationInput.value = "";
        await renderWishlist();
    } catch (error) {
        console.error("Error adding destination:", error);
        alert("Failed to add destination");
    }
}


async function getWishlist() {
    try {
        const querySnapshot = await getDocs(collection(db, "wishlist"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
}


async function renderWishlist() {
    const wishlistContainer = document.getElementById("wishlist");
    wishlistContainer.innerHTML = "";

    const items = await getWishlist();
    
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "wishlist-card";
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='default-image-url'">
            <h3>${item.name}</h3>
            <button onclick="removeFromWishlist('${item.id}')">Remove</button>
        `;
        wishlistContainer.appendChild(card);
    });
}


async function removeFromWishlist(id) {
    try {
        await deleteDoc(doc(db, "wishlist", id));
        console.log("Destination removed successfully");
        await renderWishlist();
    } catch (error) {
        console.error("Error removing destination:", error);
        alert("Failed to remove destination");
    }
}


document.getElementById("add-btn").addEventListener("click", addToWishlist);
document.getElementById("destination-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addToWishlist();
    }
});


window.removeFromWishlist = removeFromWishlist;


renderWishlist();