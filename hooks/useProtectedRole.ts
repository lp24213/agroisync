'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  isActive: boolean;
}

interface ProtectedRoleState {
  userRole: UserRole | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function useProtectedRole() {
  const { isConnected, publicKey } = useWeb3();
  const [state, setState] = useState<ProtectedRoleState>({
    userRole: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  const fetchUserRole = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setState(prev => ({
        ...prev,
        userRole: null,
        isAuthenticated: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulação de busca de role do usuário
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock de role baseado no endereço da carteira
      const mockRole: UserRole = {
        id: '1',
        name: 'user',
        permissions: ['read', 'stake', 'unstake', 'claim'],
        isActive: true,
      };

      // Se o endereço terminar com números pares, dar role de admin
      const lastChar = publicKey.slice(-1);
      if (parseInt(lastChar, 16) % 2 === 0) {
        mockRole.name = 'admin';
        mockRole.permissions.push('admin', 'manage_pools', 'view_analytics');
      }

      setState({
        userRole: mockRole,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao buscar role do usuário',
        isAuthenticated: false,
      }));
    }
  }, [isConnected, publicKey]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!state.userRole || !state.userRole.isActive) {
        return false;
      }

      return state.userRole.permissions.includes(permission);
    },
    [state.userRole]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const isAdmin = useCallback((): boolean => {
    return hasPermission('admin');
  }, [hasPermission]);

  const isUser = useCallback((): boolean => {
    return state.isAuthenticated && !isAdmin();
  }, [state.isAuthenticated, isAdmin]);

  const refreshRole = useCallback(async () => {
    await fetchUserRole();
  }, [fetchUserRole]);

  // Auto-fetch role quando conectar carteira
  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  return {
    ...state,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isUser,
    refreshRole,
  };
} 