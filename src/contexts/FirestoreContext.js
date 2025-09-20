// File: src/contexts/FirestoreContext.js
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
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

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

  // Load transactions
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
          setError('Failed to load transactions: ' + error.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up transactions listener:', error);
      setError('Failed to setup transactions: ' + error.message);
      setLoading(false);
    }
  }, []);

  // Load categories
  useEffect(() => {
    try {
      const q = query(collection(db, 'categories'));
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const categoriesData = [];
          querySnapshot.forEach((doc) => {
            categoriesData.push({ id: doc.id, ...doc.data() });
          });
          setCategories(categoriesData);
          setError('');
        },
        (error) => {
          console.error('Error loading categories:', error);
          setError('Failed to load categories: ' + error.message);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up categories listener:', error);
      setError('Failed to setup categories: ' + error.message);
    }
  }, []);

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      setError('');
      await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding transaction: ', error);
      setError('Failed to add transaction: ' + error.message);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      setError('');
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction: ', error);
      setError('Failed to delete transaction: ' + error.message);
      throw error;
    }
  };

  // Add category
  const addCategory = async (categoryData) => {
    try {
      setError('');
      await addDoc(collection(db, 'categories'), {
        ...categoryData,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding category: ', error);
      setError('Failed to add category: ' + error.message);
      throw error;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      setError('');
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category: ', error);
      setError('Failed to delete category: ' + error.message);
      throw error;
    }
  };

  // Calculate financial summaries
  const totalOrders = orders.length;
  
  const totalSales = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalHPP = transactions
    .filter(t => t.type === 'hpp')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const grossProfit = totalSales - totalHPP;
  
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'modal')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'operational' || t.type === 'hpp')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const netProfit = totalIncome - totalExpense;

  const clearError = () => {
    setError('');
  };

  const value = {
    transactions,
    categories,
    orders,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    totalOrders,
    totalSales,
    totalHPP,
    grossProfit,
    totalIncome,
    totalExpense,
    netProfit,
    clearError
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}
