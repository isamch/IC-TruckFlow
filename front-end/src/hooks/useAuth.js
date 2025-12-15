import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Check that the Hook is used within Provider
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
