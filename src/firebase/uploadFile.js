// src/utils/firebaseStorageUtils.js

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig"; // Adjust the path as necessary
import { ToastNotification, options } from "../utils/toastConfig";

export const uploadFile = async (file) => {
  if (!file) return null;

  // Create a reference to the file in the storage
  const storageRef = ref(storage, `files/${file.name}`);
  let url;
  try {
    // Upload the file
    await uploadBytes(storageRef, file);
    // Get the download URL
    url = await getDownloadURL(storageRef);
  } catch (error) {
    ToastNotification("error", error, options);
  }
  return url;
};
