import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, limit, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAH20P1rbpDQTXzGwT_nKF4d0D6mL-uAMY",
  authDomain: "nutriject-db.firebaseapp.com",
  projectId: "nutriject-db",
  storageBucket: "nutriject-db.firebasestorage.app",
  messagingSenderId: "69466134978",
  appId: "1:69466134978:web:cdd7d44d2d086eea469e5b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, limit, orderBy };