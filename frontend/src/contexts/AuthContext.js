import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  // Remover useNavigate do contexto - será usado nos componentes

  // Configurar axios com interceptor para token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else if (adminToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, adminToken]);

  // Verificar token ao inicializar
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      
      if (token) {
        try {
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.valid) {
            setUser(response.data.user);
            setToken(token);
            setIsAdmin(response.data.user.isAdmin); // Assuming isAdmin is part of the user object
          } else {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      } else if (adminToken) {
        try {
          const response = await axios.get('/api/admin/verify', {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          
          if (response.data.valid) {
            setUser(response.data.admin);
            setAdminToken(adminToken);
            setIsAdmin(true);
          } else {
            localStorage.removeItem('adminToken');
            setUser(null);
            setAdminToken(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Erro ao verificar admin token:', error);
          localStorage.removeItem('adminToken');
          setUser(null);
          setAdminToken(null);
          setIsAdmin(false);
        }
      }
      
      setLoading(false);
    };

    checkToken();
  }, []);

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

  // Função de login admin
  const loginAdmin = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Verificar credenciais de admin
      if (email === 'luispaulodeoliveira@agrotm.com.br' && password === 'Th@ys15221008') {
        const adminData = {
          id: 'admin-001',
          email: 'luispaulodeoliveira@agrotm.com.br',
          name: 'Luis Paulo de Oliveira',
          role: 'super-admin',
          permissions: ['users', 'announcements', 'freights', 'reports', 'system'],
          isAdmin: true
        };

        const adminToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        setUser(adminData);
        setAdminToken(adminToken);
        setIsAdmin(true);
        localStorage.setItem('adminToken', adminToken);
        
        return {
          success: true,
          message: 'Login administrativo realizado com sucesso'
        };
      } else {
        setError('Credenciais administrativas inválidas');
        return {
          success: false,
          message: 'Credenciais administrativas inválidas'
        };
      }
    } catch (error) {
      const errorMessage = 'Erro ao fazer login administrativo';
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
    // Redirecionamento será feito no componente
  };

  // Função de logout admin
  const logoutAdmin = () => {
    setUser(null);
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    // Redirecionamento será feito no componente
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
    return !!user && (!!token || !!adminToken);
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

  // Função para verificar se é admin
  const checkIsAdmin = () => {
    return isAdmin && (!!adminToken || (user && user.isAdmin));
  };

  const value = {
    user,
    token,
    adminToken,
    loading,
    error,
    requires2FA,
    tempToken,
    userId,
    isAdmin,
    login,
    loginAdmin,
    verify2FA,
    sendOTP,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    logout,
    logoutAdmin,
    updateProfile,
    clearError,
    isAuthenticated,
    hasActivePlan,
    canAccessPrivateData,
    canUseMessaging,
    checkIsAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
