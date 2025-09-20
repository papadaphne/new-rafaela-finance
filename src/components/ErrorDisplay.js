// File: src/components/ErrorDisplay.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

const ErrorDisplay = () => {
  const { error: authError, clearError: clearAuthError } = useAuth();
  const { error: firestoreError, clearError: clearFirestoreError } = useFirestore();
  
  const error = authError || firestoreError;
  
  if (!error) return null;
  
  const clearError = () => {
    if (authError) clearAuthError();
    if (firestoreError) clearFirestoreError();
  };
  
  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
        <button
          type="button"
          className="ml-4 text-red-900"
          onClick={clearError}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
