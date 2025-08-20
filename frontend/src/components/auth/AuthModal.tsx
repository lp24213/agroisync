import React, { useState, useEffect } from 'react'
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import { useI18n } from '../../i18n/I18nProvider'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { t } = useI18n()
  const { login, register, resetPassword, loading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [error, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')

    try {
      if (mode === 'login') {
        await login(email, password)
        setSuccess('Login realizado com sucesso!')
        onClose()
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setSuccess('As senhas não coincidem')
          return
        }
        await register(email, password)
        setSuccess('Conta criada com sucesso!')
        onClose()
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error)
      // O erro já é tratado pelo hook useAuth
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setSuccess('Digite seu email para redefinir a senha')
      return
    }

    try {
      await resetPassword(email)
      setSuccess('Email de redefinição enviado! Verifique sua caixa de entrada.')
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error)
      // O erro já é tratado pelo hook useAuth
    }
  }

  const handleDemoLogin = async () => {
    try {
      // Login com credenciais de demonstração
      await login('demo@agroisync.com', 'demo123456')
      setSuccess('Login de demonstração realizado!')
      onClose()
    } catch (error: any) {
      console.error('Erro no login de demonstração:', error)
      // O erro já é tratado pelo hook useAuth
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {mode === 'login' 
                ? 'Acesse sua conta AgroSync' 
                : 'Junte-se à plataforma AgroSync'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                mode === 'login' ? 'Entrar' : 'Criar Conta'
              )}
            </button>

            {/* Demo Login Button */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Login de Demonstração
              </button>
            )}

            {/* Password Reset */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={loading}
                className="w-full text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                Esqueceu sua senha?
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={() => window.location.reload()}
                className="ml-1 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                {mode === 'login' ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          </div>

          {/* Terms */}
          {mode === 'register' && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Ao criar uma conta, você concorda com nossos{' '}
                <a href="/terms" className="text-green-600 hover:text-green-700">Termos de Uso</a>
                {' '}e{' '}
                <a href="/privacy" className="text-green-600 hover:text-green-700">Política de Privacidade</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
