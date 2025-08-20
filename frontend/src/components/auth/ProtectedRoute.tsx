import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  fallback = null 
}: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // Se não requer autenticação, mostrar conteúdo
  if (!requireAuth) {
    return <>{children}</>
  }

  // Se requer autenticação mas usuário não está logado
  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }
    router.push('/')
    return null
  }

  // Se requer admin mas usuário não é admin
  if (requireAdmin && !isAdmin) {
    if (fallback) {
      return <>{fallback}</>
    }
    router.push('/')
    return null
  }

  // Usuário autenticado e com permissões adequadas
  return <>{children}</>
}
