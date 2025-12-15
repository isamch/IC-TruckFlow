import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// Create authentication context
export const AuthContext = createContext();

// Authentication provider
export const AuthProvider = ({ children }) => {
  // States
  const [user, setUser] = useState(null); // User information
  const [loading, setLoading] = useState(true); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Is user logged in?

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check authentication
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        // Fetch user information from API
        const response = await api.get('/auth/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check error:', error);
        // Clear tokens if invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    setLoading(false);
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Send login request
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Send logout request to API
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Values to share with the rest of the app
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
