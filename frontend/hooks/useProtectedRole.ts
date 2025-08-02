'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  level: number;
}

interface ProtectedRoleConfig {
  requiredRole?: string;
  requiredLevel?: number;
  requiredPermissions?: string[];
  fallbackComponent?: React.ReactNode;
  redirectTo?: string;
}

export const useProtectedRole = (config: ProtectedRoleConfig = {}) => {
  const { isConnected, publicKey } = useWeb3();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  const fetchUserRole = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setUserRole(null);
      setHasAccess(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock user role data
      const mockRole: UserRole = {
        id: '1',
        name: 'Premium User',
        permissions: ['read', 'write', 'admin'],
        level: 3
      };

      setUserRole(mockRole);

      // Check access based on config
      let access = true;

      if (config.requiredRole && mockRole.name !== config.requiredRole) {
        access = false;
      }

      if (config.requiredLevel && mockRole.level < config.requiredLevel) {
        access = false;
      }

      if (config.requiredPermissions) {
        const hasAllPermissions = config.requiredPermissions.every(permission =>
          mockRole.permissions.includes(permission)
        );
        if (!hasAllPermissions) {
          access = false;
        }
      }

      setHasAccess(access);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user role';
      setError(errorMessage);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey, config]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const checkPermission = useCallback((permission: string): boolean => {
    if (!userRole) return false;
    return userRole.permissions.includes(permission);
  }, [userRole]);

  const checkLevel = useCallback((level: number): boolean => {
    if (!userRole) return false;
    return userRole.level >= level;
  }, [userRole]);

  return {
    userRole,
    hasAccess,
    loading,
    error,
    checkPermission,
    checkLevel,
    refetch: fetchUserRole
  };
}; 