import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const RouteGuard = ({ children, requireAuth = false, requireAdmin = false }) => {
  const { isAuthenticated, checkIsAdmin, loading } = useAuth()
  const location = useLocation()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-16'>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 shadow-lg'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
          </div>
          <p className='text-slate-600'>Verificando permissões...</p>
        </motion.div>
      </div>
    )
  }

  // Verificar se requer autenticação
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // Verificar se requer admin
  if (requireAdmin && !checkIsAdmin()) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12 pt-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='w-full max-w-md text-center'
        >
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-red-700 shadow-lg'>
            <Shield className='h-10 w-10 text-white' />
          </div>

          <h2 className='mb-4 text-2xl font-bold text-slate-900'>Acesso Negado</h2>

          <p className='mb-6 text-slate-600'>
            Você não tem permissão para acessar esta área. Esta página é restrita apenas para administradores.
          </p>

          <div className='space-y-3'>
            <button
              onClick={() => window.history.back()}
              className='w-full rounded-lg bg-slate-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-slate-700'
            >
              Voltar
            </button>

            <button
              onClick={() => (window.location.href = '/admin-login')}
              className='w-full rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 text-white transition-all duration-200 hover:from-emerald-600 hover:to-blue-600'
            >
              Acessar como Admin
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Verificar se usuário comum está tentando acessar área admin
  if (location.pathname.startsWith('/admin') && !checkIsAdmin()) {
    return <Navigate to='/admin/login' state={{ from: location }} replace />
  }

  // Verificar se admin está tentando acessar área de usuário comum
  if (checkIsAdmin() && !location.pathname.startsWith('/admin') && requireAuth) {
    return <Navigate to='/admin/dashboard' replace />
  }

  // Renderizar conteúdo se todas as verificações passarem
  return children
}

export default RouteGuard
