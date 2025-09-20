// File: src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Coba login dengan email/password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set user role berdasarkan UID khusus untuk owner
      if (user.uid === 'GAfTnHxYwgSoZL4YXvpw889B0Hj2') {
        setUserRole('owner');
      } else {
        // Cek role di Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          // Jika tidak ada di Firestore, set sebagai employee
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'employee',
            createdAt: new Date()
          });
          setUserRole('employee');
        }
      }
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError('Failed to log in: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setError('');
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Check if user is the special owner
          if (user.uid === 'GAfTnHxYwgSoZL4YXvpw889B0Hj2') {
            setCurrentUser(user);
            setUserRole('owner');
          } else {
            // Check user role in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            } else {
              // Default to employee if no role found
              setUserRole('employee');
            }
          }
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Authentication error: ' + error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const clearError = () => {
    setError('');
  };

  const value = {
    currentUser,
    userRole,
    login,
    logout,
    error,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
