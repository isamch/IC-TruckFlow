import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook بسيط لاستخدام AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  // التحقق من أن الـ Hook يستخدم داخل Provider
  if (!context) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  }

  return context;
};
