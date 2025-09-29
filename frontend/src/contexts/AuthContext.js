import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useStore from '../store/useStore';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://agroisync.com/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setUser: setStoreUser, setLoading } = useStore();

  const checkAuthState = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        // Usar dados do localStorage diretamente após login
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setStoreUser(parsedUser);
        if (process.env.NODE_ENV !== 'production') {
          console.log('User loaded from localStorage:', parsedUser);
        }
      } else {
        setUser(null);
        setStoreUser(null);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Error loading user from localStorage:', error);
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setStoreUser(null);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [setStoreUser, setLoading]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const updateUserState = useCallback((userData, token) => {
    setUser(userData);
    setStoreUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (process.env.NODE_ENV !== 'production') {
      console.log('User state updated:', userData);
    }
  }, [setStoreUser]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        setUser(user);
        setStoreUser(user);
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, userAttributes = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        ...userAttributes
      });
      
      if (response.data.success) {
        return { 
          success: true, 
          requiresConfirmation: response.data.requiresConfirmation || false,
          userId: response.data.userId
        };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRegistration = async (email, confirmationCode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/auth/confirm`, {
        email,
        confirmationCode
      });
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-confirmation`, {
        email
      });
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Chamar endpoint de logout no backend (opcional)
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          // Ignorar erros de logout no backend
          console.log('Logout error:', error);
        }
      }
      
      localStorage.removeItem('authToken');
      setUser(null);
      setStoreUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email
      });
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const enable2FA = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/auth/enable-2fa`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        return { success: true, qrCode: response.data.qrCode };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    confirmRegistration,
    resendConfirmationCode,
    logout,
    resetPassword,
    enable2FA,
    checkAuthState,
    updateUserState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};