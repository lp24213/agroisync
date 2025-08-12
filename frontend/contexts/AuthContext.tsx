'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { FirebaseAuthService, UserProfile } from '../lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = FirebaseAuthService.getInstance();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await authService.getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      if (result.success && result.user) {
        setUserProfile(result.user);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const result = await authService.registerWithEmail(email, password, fullName, phone);
      if (result.success && result.user) {
        setUserProfile(result.user);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Erro ao criar conta' };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      return await authService.sendPasswordResetEmail(email);
    } catch (error) {
      return { success: false, error: 'Erro ao enviar email de recuperação' };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const result = await authService.updateUserProfile(user.uid, updates);
      if (result.success) {
        const updatedProfile = await authService.getCurrentUserProfile();
        setUserProfile(updatedProfile);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 