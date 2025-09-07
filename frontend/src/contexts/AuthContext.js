import React, { createContext, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import useStore from '../store/useStore';
import awsconfig from '../aws-exports';

// Configurar Amplify
Amplify.configure(awsconfig);

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  useEffect(() => {
    checkAuthState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (currentUser && session) {
        const userData = {
          id: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId,
          attributes: currentUser.signInDetails?.loginId ? { email: currentUser.signInDetails.loginId } : {},
          session: session
        };
        
        setUser(userData);
        setStoreUser(userData);
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
      setStoreUser(null);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn({
        username: email,
        password: password
      });
      
      if (result.isSignedIn) {
        await checkAuthState();
        return { success: true };
      } else if (result.nextStep) {
        return { 
          success: false, 
          requiresConfirmation: true,
          nextStep: result.nextStep
        };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, userAttributes = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            ...userAttributes
          }
        }
      });
      
      return { 
        success: true, 
        requiresConfirmation: true,
        userId: result.userId
      };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRegistration = async (email, confirmationCode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode
      });
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationCode = async (email) => {
    try {
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
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
      
      // Implementar reset de senha
      // TODO: Implementar lógica de reset de senha com AWS Amplify
      // Por enquanto, simula uma operação assíncrona
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const enable2FA = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Implementar 2FA
      // TODO: Implementar lógica de 2FA com AWS Amplify
      // Por enquanto, simula uma operação assíncrona
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
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
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};