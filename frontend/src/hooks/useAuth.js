import { useState, useEffect } from 'react';
import { authAPI, setAuthToken, getAuthToken, handleAPIError } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const isAuthenticatedFlag = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticatedFlag === 'true' && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (err) {
        // Invalid saved user data
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      const { user: userData } = response.data;
      
      // Store user data (token is in httpOnly cookies)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (err) {
      const error = handleAPIError(err);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      const { user: newUser } = response.data;
      
      // Don't automatically log in after registration
      // User should login manually with their credentials
      
      return { success: true, user: newUser };
    } catch (err) {
      const error = handleAPIError(err);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API (optional, for server-side cleanup)
      await authAPI.logout();
    } catch (err) {
      // Ignore logout API errors, still clear local state
      console.warn('Logout API call failed:', err);
    } finally {
      // Clear local storage and state
      setAuthToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };
};

export default useAuth;