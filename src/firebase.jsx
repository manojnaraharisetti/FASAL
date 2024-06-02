// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCL94Y9Kyb4-7DKM8xKFhxuMUDdZKuv0vc",
  authDomain: "movies-library-application.firebaseapp.com",
  projectId: "movies-library-application",
  storageBucket: "movies-library-application.appspot.com",
  messagingSenderId: "38072222104",
  appId: "1:38072222104:web:124682522a226d4ee5abed",
  measurementId: "G-HYH0JTE5F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };