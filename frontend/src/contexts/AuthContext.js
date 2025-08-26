import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  // Configurar axios com interceptor para token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar token ao inicializar
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/profile');
          if (response.data.success) {
            setUser(response.data.data.user);
            setIsAdmin(response.data.data.user.isAdmin);
          } else {
            // Token inválido, limpar
            logout();
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Função de login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        if (response.data.data.requires2FA) {
          // 2FA necessário
          setRequires2FA(true);
          setTempToken(response.data.data.tempToken);
          setUserId(response.data.data.userId);
          return {
            success: true,
            requires2FA: true,
            message: '2FA necessário'
          };
        } else {
          // Login direto
          const { user: userData, token: userToken } = response.data.data;
          setUser(userData);
          setToken(userToken);
          setIsAdmin(userData.isAdmin);
          localStorage.setItem('token', userToken);
          setRequires2FA(false);
          setTempToken(null);
          setUserId(null);
          
          return {
            success: true,
            requires2FA: false,
            message: 'Login realizado com sucesso'
          };
        }
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de verificação 2FA
  const verify2FA = async (otpCode) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/verify-otp', {
        userId,
        otpCode
      });

      if (response.data.success) {
        const { user: userData, token: userToken } = response.data.data;
        setUser(userData);
        setToken(userToken);
        setIsAdmin(userData.isAdmin);
        localStorage.setItem('token', userToken);
        setRequires2FA(false);
        setTempToken(null);
        setUserId(null);
        
        return {
          success: true,
          message: '2FA verificado com sucesso'
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao verificar 2FA';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de envio de OTP
  const sendOTP = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/send-otp', {
        userId
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao enviar OTP';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/register', userData);

      if (response.data.success) {
        const { user: newUser, token: userToken } = response.data.data;
        setUser(newUser);
        setToken(userToken);
        setIsAdmin(newUser.isAdmin);
        localStorage.setItem('token', userToken);
        
        return {
          success: true,
          message: response.data.message,
          requiresEmailVerification: response.data.data.requiresEmailVerification
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao registrar usuário';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de recuperação de senha
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/forgot-password', { email });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao solicitar recuperação de senha';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de redefinição de senha
  const resetPassword = async (token, password, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/reset-password', {
        token,
        password,
        confirmPassword
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao redefinir senha';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de verificação de email
  const verifyEmail = async (token) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/verify-email', { token });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao verificar email';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de reenvio de verificação
  const resendVerification = async (email) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/resend-verification', { email });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao reenviar verificação';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    setRequires2FA(false);
    setTempToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  // Função de atualização de perfil
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.put('/api/auth/profile', profileData);

      if (response.data.success) {
        setUser(response.data.data.user);
        return {
          success: true,
          message: response.data.message
        };
      } else {
        setError(response.data.message);
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar erro
  const clearError = () => {
    setError(null);
  };

  // Função para verificar se usuário está autenticado
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Função para verificar se usuário tem plano ativo
  const hasActivePlan = () => {
    return user && user.isPaid && user.planActive;
  };

  // Função para verificar se usuário pode acessar dados privados
  const canAccessPrivateData = () => {
    return hasActivePlan();
  };

  // Função para verificar se usuário pode usar mensageria
  const canUseMessaging = () => {
    return hasActivePlan();
  };

  const value = {
    user,
    token,
    loading,
    error,
    requires2FA,
    tempToken,
    userId,
    isAdmin,
    login,
    verify2FA,
    sendOTP,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    logout,
    updateProfile,
    clearError,
    isAuthenticated,
    hasActivePlan,
    canAccessPrivateData,
    canUseMessaging
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
