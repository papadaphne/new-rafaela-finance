// File: src/App.js (diperbarui)
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
import './App.css';

function AppContent() {
  const { currentUser, userRole, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (authLoading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      <ErrorDisplay />
      {currentUser && <Navigation />}
      <Routes>
        {/* ... rute lainnya */}
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
