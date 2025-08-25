import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');

      if (adminToken) {
        await verifyAdminToken(adminToken);
      } else if (token) {
        await verifyToken(token);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const result = await authService.verifyToken(token);
      if (result.ok) {
        setUser(result.user);
        setIsAdmin(false);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAdmin(false);
    }
  };

  const verifyAdminToken = async (adminToken) => {
    try {
      const result = await authService.verifyAdminToken(adminToken);
      if (result.ok) {
        setUser({ ...result.user, isAdmin: true });
        setIsAdmin(true);
      } else {
        localStorage.removeItem('adminToken');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao verificar token admin:', error);
      localStorage.removeItem('adminToken');
      setUser(null);
      setIsAdmin(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Verificar se é ADMIN primeiro
      if (email === 'luispaulodeoliveira@agrotm.com.br') {
        // Tentar login admin
        const adminResult = await authService.loginAdmin(email, password);
        if (adminResult.ok) {
          localStorage.setItem('adminToken', adminResult.adminToken);
          setUser({ ...adminResult.user, isAdmin: true });
          setIsAdmin(true);
          return { success: true, isAdmin: true };
        }
      }
      
      // Login normal de usuário
      const result = await authService.login(email, password);
      if (result.ok) {
        localStorage.setItem('token', result.token);
        setUser(result.user);
        setIsAdmin(false);
        return { success: true, isAdmin: false };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const loginAdmin = async (adminToken) => {
    try {
      const result = await authService.verifyAdminToken(adminToken);
      if (result.ok) {
        localStorage.setItem('adminToken', adminToken);
        setUser({ ...result.user, isAdmin: true });
        setIsAdmin(true);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.ok) {
        localStorage.setItem('token', result.token);
        setUser(result.user);
        setIsAdmin(false);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      if (result.ok) {
        setUser(prev => ({ ...prev, ...result.user }));
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const result = await authService.resetPassword(token, newPassword);
      return result;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const result = await authService.checkSubscriptionStatus();
      return result;
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    loginAdmin,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    checkSubscriptionStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
