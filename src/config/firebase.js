// File: src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC57gZNXlJoGvTKnTCgCfspMC_qPgkLvtU",
  authDomain: "rafaela-finance.firebaseapp.com",
  projectId: "rafaela-finance",
  storageBucket: "rafaela-finance.firebasestorage.app",
  messagingSenderId: "45081143872",
  appId: "1:45081143872:web:91d15b2732c24178ee0da5",
  measurementId: "G-XM0GEZY4PK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
