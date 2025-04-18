// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getFirestore } from "firebase/firestore"; // Import getFirestore for database (if you use it)
// import { getAnalytics } from "firebase/analytics"; // You can keep this if you need analytics

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWPC93sSb_EYqxw5LEjzZy5YQFhnc5XTE",
  authDomain: "note-app-a43f5.firebaseapp.com",
  projectId: "note-app-a43f5",
  storageBucket: "note-app-a43f5.firebasestorage.app",
  messagingSenderId: "55394497402",
  appId: "1:55394497402:web:c88a9f87fa75e0ba959cc3",
  measurementId: "G-DPYWHVWN3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Cloud Firestore (if you need it)
// const analytics = getAnalytics(app); // Keep this if you need analytics

// Export auth and db (if you're using it elsewhere)
export { auth, db };