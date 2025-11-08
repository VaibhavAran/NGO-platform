// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBfU83wk5UtlFNxozanKLQd_zNVKDmntnc",
  authDomain: "ngo-healpify.firebaseapp.com",
  projectId: "ngo-healpify",
  storageBucket: "ngo-healpify.firebasestorage.app",
  messagingSenderId: "536267345634",
  appId: "1:536267345634:web:0207834b15a75bd2fb18bb",
  measurementId: "G-5357ML9TBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;