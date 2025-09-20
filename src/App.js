import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FirestoreProvider } from './contexts/FirestoreContext';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorDisplay from './components/ErrorDisplay';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function AppContent() {
  const { currentUser, userRole, loading: authLoading, error: authError } = useAuth();
  const { loading: firestoreLoading, error: firestoreError } = useFirestore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Tampilkan splash screen selama 3 detik atau sampai loading selesai
  if (showSplash || authLoading) {
    return <SplashScreen />;
  }

  // Jika ada error, tampilkan error
  const error = authError || firestoreError;

  return (
    <div className="App">
      {error && <ErrorDisplay message={error} />}
      {currentUser && <Navigation />}
      {(authLoading || firestoreLoading) && <LoadingSpinner />}
      <Routes>
        <Route 
          path="/login" 
          element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <FirestoreProvider>
            <AppContent />
          </FirestoreProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
