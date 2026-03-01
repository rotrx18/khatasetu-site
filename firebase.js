import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDM-ZF9JamYYucsPRSB6RONZqInWkCMNuo",
  authDomain: "khatasetuweb-prod.firebaseapp.com",
  projectId: "khatasetuweb-prod",
  storageBucket: "khatasetuweb-prod.firebasestorage.app",
  messagingSenderId: "277723560245",
  appId: "1:277723560245:web:d1c27ea6606ae82315f47c",
  measurementId: "G-WBY9BLLSHM"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "messages"), {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
    timestamp: new Date()
  });

  document.getElementById("formStatus").innerText = "Message Sent Successfully!";
});