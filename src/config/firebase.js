// File: src/config/firebase.js (diperbarui)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC57gZNXlJoGvTKnTCgCfspMC_qPgkLvtU",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "rafaela-finance.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "rafaela-finance",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "rafaela-finance.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "45081143872",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:45081143872:web:91d15b2732c24178ee0da5",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-XM0GEZY4PK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
export default app;
