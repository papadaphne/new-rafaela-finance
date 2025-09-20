// File: src/contexts/FirestoreContext.js (diperbarui)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const FirestoreContext = createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
}

export function FirestoreProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load transactions dengan error handling
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'transactions'),
        orderBy('date', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const transactionsData = [];
          querySnapshot.forEach((doc) => {
            transactionsData.push({ id: doc.id, ...doc.data() });
          });
          setTransactions(transactionsData);
          setLoading(false);
          setError('');
        },
        (error) => {
          console.error('Error loading transactions:', error);
          if (error.code === 'permission-denied') {
            setError('Anda tidak memiliki izin untuk melihat transaksi. Silakan hubungi owner.');
          } else {
            setError('Gagal memuat transaksi: ' + error.message);
          }
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up transactions listener:', error);
      setError('Gagal mengatur pemantau transaksi: ' + error.message);
      setLoading(false);
    }
  }, []);

  // Fungsi untuk menambah transaksi dengan error handling
  const addTransaction = async (transactionData) => {
    try {
      setError('');
      await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser.uid
      });
    } catch (error) {
      console.error('Error adding transaction: ', error);
      if (error.code === 'permission-denied') {
        setError('Anda tidak memiliki izin untuk menambah transaksi.');
      } else {
        setError('Gagal menambah transaksi: ' + error.message);
      }
      throw error;
    }
  };

  // Fungsi untuk menghapus transaksi dengan error handling
  const deleteTransaction = async (id) => {
    try {
      setError('');
      // Periksa apakah pengguna adalah owner sebelum menghapus
      const { currentUser } = auth;
      if (currentUser.uid !== 'GAfTnHxYwgSoZL4YXvpw889B0Hj2') {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (!userDoc.exists() || userDoc.data().role !== 'owner') {
          throw new Error('Anda tidak memiliki izin untuk menghapus transaksi.');
        }
      }
      
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction: ', error);
      if (error.code === 'permission-denied' || error.message.includes('tidak memiliki izin')) {
        setError('Hanya owner yang dapat menghapus transaksi.');
      } else {
        setError('Gagal menghapus transaksi: ' + error.message);
      }
      throw error;
    }
  };

  // ... (fungsi lainnya dengan error handling serupa)

  const value = {
    transactions,
    categories,
    orders,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    // ... fungsi lainnya
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}
