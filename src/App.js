import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FirestoreProvider, useFirestore } from './contexts/FirestoreContext';
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
  const [appError, setAppError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authError || firestoreError) {
      setAppError(authError || firestoreError);
    }
  }, [authError, firestoreError]);

  // Tampilkan splash screen selama loading atau selama 2.5 detik
  if (showSplash || authLoading) {
    return <SplashScreen />;
  }

  // Tampilkan error jika ada
  if (appError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-4">{appError}</p>
          <div className="space-y-2">
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            <button
              className="w-full bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setAppError('');
                window.location.href = '/login';
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
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
