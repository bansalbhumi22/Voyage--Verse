import { db, storage } from "./firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const form = document.querySelector(".review-form");

async function uploadPhoto(file) {
    const storageRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

async function submitReview(e) {
    e.preventDefault();

    const destination = document.getElementById("destination").value;
    const review = document.getElementById("review").value;
    const photo = document.getElementById("photo").files[0];

    if (!photo) {
        alert("Please select a photo.");
        return;
    }

    try {
        const photoURL = await uploadPhoto(photo);

        const reviewsRef = collection(db, "reviews");
        await addDoc(reviewsRef, { destination, review, photoURL });

        alert("Review submitted successfully!");
        form.reset();
        document.getElementById("photo").value = ""; 

    } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review.");
    }
}

form.addEventListener("submit", submitReview);

