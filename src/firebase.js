//   Code for \PriceWise\src\firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ2aWyoL_RA094gYEVcJoYc5qrCDQw2XY",
  authDomain: "pricewise-c294c.firebaseapp.com",
  projectId: "pricewise-c294c",
  storageBucket: "pricewise-c294c.appspot.com",
  messagingSenderId: "540758000850",
  appId: "1:540758000850:web:e1b514a1af2b8aa017990b",
  measurementId: "G-LEL6NFSHQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };