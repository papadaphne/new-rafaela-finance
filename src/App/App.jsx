import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FirestoreProvider, useFirestore } from './contexts/FirestoreContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import ErrorDisplay from './components/Common/ErrorDisplay';
import SplashScreen from './components/SplashScreen';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Navigation from './components/Common/Navigation';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';
import './styles/App.css';

function AppContent() {
  const { currentUser, loading: authLoading, error: authError } = useAuth();
  const { loading: firestoreLoading, error: firestoreError } = useFirestore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Tampilkan splash screen selama loading
  if (showSplash || authLoading) {
    return <SplashScreen />;
  }

  // Tampilkan loading spinner jika firestore masih loading
  if (firestoreLoading) {
    return <LoadingSpinner message="Memuat data..." />;
  }

  return (
    <div className="App">
      <ErrorDisplay />
      {currentUser && <Navigation />}
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
