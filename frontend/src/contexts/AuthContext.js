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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se há um token salvo
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      // Verificar token admin
      verifyAdminToken(adminToken);
    } else if (token) {
      // Verificar token de usuário normal
      verifyUserToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyUserToken = async (token) => {
    try {
      const userData = await authService.verifyToken(token);
      setUser(userData);
      setIsAdmin(false);
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminToken = async (token) => {
    try {
      // Decodificar token JWT para verificar se é admin
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.role === 'admin' && payload.isAdmin) {
        setUser({
          id: 'admin',
          email: payload.email,
          role: 'admin',
          isAdmin: true
        });
        setIsAdmin(true);
      } else {
        throw new Error('Token não é de admin');
      }
    } catch (error) {
      console.error('Token admin inválido:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAdmin(false);
        localStorage.setItem('token', response.token);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const loginAdmin = async (token) => {
    try {
      // Decodificar token JWT para verificar se é admin
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.role === 'admin' && payload.isAdmin) {
        const adminUser = {
          id: 'admin',
          email: payload.email,
          role: 'admin',
          isAdmin: true
        };
        
        setUser(adminUser);
        setIsAdmin(true);
        localStorage.setItem('adminToken', token);
        return { success: true };
      } else {
        throw new Error('Token não é de admin');
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      return { success: false, message: 'Token admin inválido' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.user);
        setIsAdmin(false);
        localStorage.setItem('token', response.token);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(prevUser => ({ ...prevUser, ...response.user }));
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
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
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
