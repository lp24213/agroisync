import React, { createContext, useContext, useState, useEffect } from 'react';
import cognitoAuthService from '../services/cognitoAuthService';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await cognitoAuthService.checkAuthStatus();
      
      if (authStatus.isAuthenticated) {
        setUser(authStatus.user);
        setIsAdmin(authStatus.isAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const result = await cognitoAuthService.authenticateUser(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAdmin(result.isAdmin);
        
        // Redirecionar baseado no tipo de usuário
        if (result.isAdmin) {
          // Admin sempre vai para /admin
          navigate('/admin');
        } else {
          // Usuário comum vai para dashboard
          navigate('/dashboard');
        }
        
        return { success: true, isAdmin: result.isAdmin };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await cognitoAuthService.logout();
      setUser(null);
      setIsAdmin(false);
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      setIsAdmin(false);
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      await cognitoAuthService.refreshToken();
      // Verificar status novamente após refresh
      await checkAuthStatus();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Se falhar o refresh, fazer logout
      await logout();
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Chamar API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.userType,
          cpfCnpj: userData.cpf || userData.cnpj,
          ie: userData.inscricaoEstadual,
          phone: userData.phone,
          address: {
            cep: userData.zipCode,
            street: userData.address,
            number: userData.number,
            city: userData.city,
            state: userData.state
          },
          companyName: userData.companyName,
          businessType: userData.businessType,
          aceita_termos: true
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Login automático após registro bem-sucedido
        const loginResult = await login(userData.email, userData.password);
        
        if (loginResult.success) {
          // Redirecionar baseado no tipo de usuário
          if (userData.userType === 'anunciante') {
            navigate('/panel/loja');
          } else if (userData.userType === 'freteiro') {
            navigate('/panel/agroconecta');
          } else {
            navigate('/dashboard');
          }
          
          return { success: true, message: 'Registro realizado com sucesso!' };
        } else {
          return { success: false, message: 'Registro realizado, mas falha no login automático' };
        }
      } else {
        return { success: false, message: result.message || 'Erro no registro' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        message: error.message || 'Erro de conexão durante o registro' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Implementar atualização de perfil se necessário
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      // Implementar reset de senha se necessário
      return { success: true, message: 'Email de reset enviado' };
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      // Implementar reset de senha se necessário
      return { success: true, message: 'Senha alterada com sucesso' };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      // Implementar verificação de assinatura se necessário
      return { 
        ok: true, 
        subscriptions: {},
        hasActivePlan: false
      };
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  };

  // Verificar se o usuário é admin
  const isUserAdmin = () => {
    return user && user.isAdmin === true;
  };

  // Verificar se o usuário está em um grupo específico
  const isUserInGroup = (groupName) => {
    return user && user.groups && user.groups.includes(groupName);
  };

  // Obter grupos do usuário
  const getUserGroups = () => {
    return user ? user.groups || [] : [];
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    checkSubscriptionStatus,
    refreshToken,
    isUserAdmin,
    isUserInGroup,
    getUserGroups,
    checkAuthStatus,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
