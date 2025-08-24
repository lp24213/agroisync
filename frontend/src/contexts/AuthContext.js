import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const userData = await authService.getCurrentUser();
        setUser(userData.data);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      setUser(response.data);
      
      // Redirect based on last destination or default
      const lastDestination = localStorage.getItem('lastDestination');
      if (lastDestination) {
        localStorage.removeItem('lastDestination');
        window.location.href = lastDestination;
      } else {
        window.location.href = '/';
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      setUser(response.data);
      
      // Redirect based on module selected during registration
      if (userData.modules?.store) {
        window.location.href = '/loja';
      } else if (userData.modules?.freight) {
        window.location.href = '/agroconecta';
      } else if (userData.modules?.crypto) {
        window.location.href = '/cripto';
      } else {
        window.location.href = '/';
      }
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setUser(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const hasActivePlan = (module) => {
    if (!user) return false;
    const plan = user.plans[module];
    return plan && plan.status === 'active';
  };

  const hasModule = (module) => {
    if (!user) return false;
    return user.modules[module] === true;
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    hasActivePlan,
    hasModule,
    isAuthenticated,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
