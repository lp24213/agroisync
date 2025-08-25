import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn as amplifySignIn, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import apiService from '../services/api';

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
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        await handleUserLogin(currentUser);
      }
    } catch (error) {
      console.log('Usuário não autenticado');
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async (cognitoUser) => {
    try {
      const session = await fetchAuthSession();
      const token = session.getIdToken().getJwtToken();
      
      // Decodificar token para obter informações do usuário
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || '',
        cognitoUser,
        token
      };

      setUser(userData);

      // Verificar se é admin com credenciais específicas
      const adminCheck = payload.email === 'luispaulodeoliveira@agrotm.com.br';
      setIsAdmin(adminCheck);

      // Buscar perfil do usuário no backend
      try {
        const profile = await apiService.getProducts(token, { owner: 'me' });
        setUserProfile(profile);
      } catch (error) {
        console.log('Usuário ainda não tem perfil no backend');
        // Tentar fazer bootstrap do usuário
        try {
          await apiService.bootstrapUser(token);
          console.log('Usuário bootstrapado com sucesso');
        } catch (bootstrapError) {
          console.error('Erro no bootstrap:', bootstrapError);
        }
      }

    } catch (error) {
      console.error('Erro ao processar login:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      // Verificação especial para admin
      if (email === 'luispaulodeoliveira@agrotm.com.br' && password === 'Th@ys15221008') {
        // Login direto como admin (bypass do Cognito para desenvolvimento)
        const adminUser = {
          id: 'admin-001',
          email: 'luispaulodeoliveira@agrotm.com.br',
          name: 'Luis Paulo de Oliveira',
          role: 'admin',
          token: 'admin-token-' + Date.now()
        };
        
        setUser(adminUser);
        setIsAdmin(true);
        return { success: true };
      }
      
      const cognitoUser = await amplifySignIn(email, password);
      await handleUserLogin(cognitoUser);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      let message = 'Erro no login';
      
      if (error.code === 'UserNotConfirmedException') {
        message = 'Usuário não confirmado. Verifique seu e-mail.';
      } else if (error.code === 'NotAuthorizedException') {
        message = 'Credenciais inválidas.';
      } else if (error.code === 'UserNotFoundException') {
        message = 'Usuário não encontrado.';
      } else if (error.code === 'LimitExceededException') {
        message = 'Muitas tentativas de login. Tente novamente mais tarde.';
      }
      
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      await Amplify.signUp({
        username: email,
        password,
        attributes: {
          email,
          name
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      let message = 'Erro no cadastro';
      
      if (error.code === 'UsernameExistsException') {
        message = 'Usuário já existe.';
      } else if (error.code === 'InvalidPasswordException') {
        message = 'Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números.';
      } else if (error.code === 'InvalidParameterException') {
        message = 'Parâmetros inválidos.';
      }
      
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email, code) => {
    try {
      setLoading(true);
      await Amplify.confirmSignUp(email, code);
      return { success: true };
    } catch (error) {
      console.error('Erro na confirmação:', error);
      let message = 'Erro na confirmação';
      
      if (error.code === 'CodeMismatchException') {
        message = 'Código de confirmação inválido.';
      } else if (error.code === 'ExpiredCodeException') {
        message = 'Código de confirmação expirado.';
      }
      
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      setLoading(true);
      await Amplify.resendSignUp(email);
      return { success: true };
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      return { success: false, error: 'Erro ao reenviar código de confirmação.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await Amplify.signOut();
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await Amplify.forgotPassword(email);
      return { success: true };
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      return { success: false, error: 'Erro ao solicitar reset de senha.' };
    } finally {
      setLoading(false);
    }
  };

  const confirmNewPassword = async (email, code, newPassword) => {
    try {
      setLoading(true);
      await Amplify.forgotPasswordSubmit(email, code, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Erro ao confirmar nova senha:', error);
      let message = 'Erro ao confirmar nova senha';
      
      if (error.code === 'CodeMismatchException') {
        message = 'Código de confirmação inválido.';
      } else if (error.code === 'ExpiredCodeException') {
        message = 'Código de confirmação expirado.';
      } else if (error.code === 'InvalidPasswordException') {
        message = 'Nova senha inválida.';
      }
      
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user?.token) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setLoading(true);
      const result = await apiService.updateProfile(user.token, profileData);
      setUserProfile(result.user);
      return { success: true, data: result };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.token) return;

    try {
      const profile = await apiService.getProducts(user.token, { owner: 'me' });
      setUserProfile(profile);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const value = {
    user,
    userProfile,
    isAdmin,
    loading,
    signIn,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
    signOut,
    forgotPassword,
    confirmNewPassword,
    updateProfile,
    refreshUserProfile,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
