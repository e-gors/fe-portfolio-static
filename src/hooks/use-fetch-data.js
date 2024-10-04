// src/firebase/firestoreUtils.js

import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../firebase/firebaseConfig"; // Adjust the path as necessary

export const fetchFirestoreData = async (collectionName) => {
  let data = [];
  let error = "";

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      // Assuming each document has an id and you want to keep the document data
      data.push({ id: doc.id, ...doc.data() });
    });
  } catch (err) {
    error = err.message;
  }

  return { data, error };
};
