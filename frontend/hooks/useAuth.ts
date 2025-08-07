'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { firebaseAuth, UserProfile } from '../lib/firebase/auth';

interface UseAuthReturn {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, password: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithMetamask: () => Promise<{ success: boolean; error?: string }>;
  sendSMSVerification: (phoneNumber: string, recaptchaToken: string) => Promise<{ success: boolean; error?: string }>;
  verifySMSCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await firebaseAuth.getCurrentUserProfile();
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load user profile');
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/Password Login
  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.loginWithEmail(email, password);
      
      if (result.success && result.user) {
        setUserProfile(result.user);
        return { success: true };
      } else {
        setError(result.error || 'Login failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Email/Password Registration
  const registerWithEmail = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.registerWithEmail(email, password, fullName, phone);
      
      if (result.success && result.user) {
        setUserProfile(result.user);
        return { success: true };
      } else {
        setError(result.error || 'Registration failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Metamask Login
  const loginWithMetamask = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if Metamask is installed
      if (typeof window.ethereum === 'undefined') {
        const errorMessage = 'Metamask is not installed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        const errorMessage = 'No accounts found in Metamask';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const walletAddress = accounts[0];

      // Create message to sign
      const message = `Login to AGROTM\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;

      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress]
      });

      // Authenticate with Firebase
      const result = await firebaseAuth.authenticateWithWallet(
        walletAddress,
        signature,
        message,
        'ethereum'
      );

      if (result.success && result.user) {
        setUserProfile(result.user);
        return { success: true };
      } else {
        setError(result.error || 'Metamask authentication failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Metamask authentication failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send SMS Verification
  const sendSMSVerification = useCallback(async (phoneNumber: string, recaptchaToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.sendSMSCode(phoneNumber, recaptchaToken);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error || 'Failed to send SMS verification');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send SMS verification';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify SMS Code
  const verifySMSCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.verifySMSCode(code);
      
      if (result.success && result.user) {
        setUserProfile(result.user);
        return { success: true };
      } else {
        setError(result.error || 'SMS verification failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SMS verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send Password Reset Email
  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.sendPasswordResetEmail(email);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error || 'Failed to send password reset email');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send password reset email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.logout();
      
      if (result.success) {
        setUser(null);
        setUserProfile(null);
        return { success: true };
      } else {
        setError(result.error || 'Logout failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update User Profile
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      const errorMessage = 'No user logged in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth.updateUserProfile(user.uid, updates);
      
      if (result.success) {
        // Update local user profile
        if (userProfile) {
          setUserProfile({ ...userProfile, ...updates });
        }
        return { success: true };
      } else {
        setError(result.error || 'Failed to update user profile');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, userProfile]);

  // Clear Error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    userProfile,
    loading,
    error,
    loginWithEmail,
    registerWithEmail,
    loginWithMetamask,
    sendSMSVerification,
    verifySMSCode,
    sendPasswordResetEmail,
    logout,
    updateUserProfile,
    clearError,
  };
};
