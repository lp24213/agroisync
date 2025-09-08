import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Erro ao fazer login')
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-8'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-md'>
        <div className='card-futuristic p-8'>
          <div className='mb-8 text-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-900'
            >
              <span className='text-2xl'>🌾</span>
            </motion.div>
            <h1 className='heading-2 mb-2 text-gray-900'>
              Bem-vindo de volta
            </h1>
            <p className='text-gray-600'>Faça login na sua conta AgroSync</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 flex items-center space-x-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4'
            >
              <AlertCircle className='h-5 w-5 flex-shrink-0 text-red-400' />
              <p className='text-sm text-red-400'>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>E-mail</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='input-futuristic w-full pl-10'
                  placeholder='seu@email.com'
                />
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Senha</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='input-futuristic w-full pl-10 pr-10'
                  placeholder='Sua senha'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white'
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-600 bg-transparent text-neon-blue focus:ring-2 focus:ring-neon-blue'
                />
                <span className='ml-2 text-sm text-gray-600'>Lembrar de mim</span>
              </label>
              <Link to='/forgot-password' className='text-sm text-gray-600 transition-colors hover:text-gray-900'>
                Esqueceu a senha?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
              className='btn-primary flex w-full items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading ? (
                <>
                  <div className='h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </motion.button>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-600'>
              Não tem uma conta?{' '}
              <Link to='/register' className='font-medium text-gray-900 transition-colors hover:text-gray-700'>
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
