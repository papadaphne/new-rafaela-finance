// File: src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Pastikan konfigurasi ini sesuai dengan project Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyC57gZNXlJoGvTKnTCgCfspMC_qPgkLvtU",
  authDomain: "rafaela-finance.firebaseapp.com",
  projectId: "rafaela-finance",
  storageBucket: "rafaela-finance.firebasestorage.app",
  messagingSenderId: "45081143872",
  appId: "1:45081143872:web:91d15b2732c24178ee0da5",
  measurementId: "G-XM0GEZY4PK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
export default app;
