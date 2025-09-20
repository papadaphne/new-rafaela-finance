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

  // Load transactions
  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load categories
  useEffect(() => {
    const q = query(collection(db, 'categories'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({ id: doc.id, ...doc.data() });
      });
      setCategories(categoriesData);
    });

    return unsubscribe;
  }, []);

  // Add transaction
  const addTransaction = async (transactionData) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding transaction: ', error);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction: ', error);
      throw error;
    }
  };

  // Add category
  const addCategory = async (categoryData) => {
    try {
      await addDoc(collection(db, 'categories'), {
        ...categoryData,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding category: ', error);
      throw error;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error deleting category: ', error);
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

  const value = {
    transactions,
    categories,
    orders,
    loading,
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
    netProfit
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}
