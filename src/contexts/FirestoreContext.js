import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
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
        setError('Failed to load transactions. Please check your connection and try again.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Load categories
  useEffect(() => {
    const q = query(collection(db, 'categories'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() });
        });
        setCategories(categoriesData);
      },
      (error) => {
        console.error('Error loading categories:', error);
        setError('Failed to load categories.');
      }
    );

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
      setError('Failed to add transaction: ' + error.message);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
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
    netProfit
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}
