// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbqw4GojHf6_LhSpAUbRynjU38TwRKwkY",
  authDomain: "crescent-support.firebaseapp.com",
  projectId: "crescent-support",
  storageBucket: "crescent-support.firebasestorage.app",
  messagingSenderId: "730070407628",
  appId: "1:730070407628:web:395a6229851179c9e2e569",
  measurementId: "G-HXXR5G7HWS"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
