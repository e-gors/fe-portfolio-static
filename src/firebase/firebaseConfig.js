// src/firebase/firebaseConfig.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage

const env = process.env.REACT_APP;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${env}_API_KEY`,
  authDomain: `${env}_AUTH_DOMAIN`,
  projectId: `${env}_PROJECT_ID`,
  storageBucket: `${env}_STORAGE_BUCKET`,
  messagingSenderId: `${env}_MESSAGING_SENDER_ID`,
  appId: `${env}_APP_ID`,
  measurementId: `${env}_MEASUREMENT_ID`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// Export the db and storage objects
export { db, storage };
