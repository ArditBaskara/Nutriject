// src/firebase-config.js

// Import Firebase SDK yang diperlukan
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

// Firebase config yang Anda dapatkan dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBvXUx5zqDlGYcMlQHjluU8Y8VIVGoqEaE",
  authDomain: "nutriject-e7a57.firebaseapp.com",
  databaseURL: "https://nutriject-e7a57-default-rtdb.firebaseio.com",
  projectId: "nutriject-e7a57",
  storageBucket: "nutriject-e7a57.appspot.com",
  messagingSenderId: "360187236487",
  appId: "1:360187236487:web:72d1e6092b146411e82822"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, collection, addDoc};