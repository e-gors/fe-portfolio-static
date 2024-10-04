import { collection, addDoc as firestoreAddDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { db } from "./firebaseConfig";

// Function to add a document to a specified collection
export const addDocToCollection = async (collectionName, data) => {
  let error;
  let success = false;
  try {
    // Add the data to Firestore
    await firestoreAddDoc(collection(db, collectionName), data);
    success = true;
  } catch (err) {
    error = err;
  }

  return { error, success };
};

addDocToCollection.propTypes = {
  collectionName: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
