import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LoginRedirect = () => {
  const { user, checkIsAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      // Se for admin, redirecionar para painel admin
      if (checkIsAdmin()) {
        navigate('/admin/dashboard', { replace: true })
        return
      }

      // Redirecionar baseado no role do usuário
      switch (user.role) {
        case 'buyer':
          navigate('/dashboard/buyer', { replace: true })
          break
        case 'seller':
          navigate('/dashboard/seller', { replace: true })
          break
        case 'driver':
          navigate('/dashboard/driver', { replace: true })
          break
        case 'transport':
          navigate('/dashboard/transport', { replace: true })
          break
        default:
          // Role padrão ou não definido - redirecionar para dashboard geral
          navigate('/dashboard', { replace: true })
          break
      }
    } else {
      // Se não houver usuário, redirecionar para home
      navigate('/', { replace: true })
    }
  }, [user, navigate, checkIsAdmin])

  return (
    <div className='flex min-h-screen items-center justify-center bg-black text-white'>
      <div className='text-center'>
        <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500'></div>
        <p>Redirecionando...</p>
      </div>
    </div>
  )
}

export default LoginRedirect
