import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle, User, Mail, FileText } from 'lucide-react'
import validationService from '../services/validationService'
import logger from '../services/logger'

const Register = () => {
  const [formData, setFormData] = useState({
    documentType: 'cpf',
    document: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    userType: 'producer',
    companyName: '',
    acceptTerms: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validar formulário
    const validation = validationService.validateForm(formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }))
      return
    }

    // Validar termos
    if (!formData.acceptTerms) {
      setErrors(prev => ({ ...prev, acceptTerms: 'Você deve aceitar os termos de uso' }))
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Aqui você integraria com a API de cadastro
      console.log('Dados do cadastro:', formData)

      // Sucesso
      alert('Cadastro realizado com sucesso!')
    } catch (error) {
      logger.error('Erro no cadastro', error, { formData: { ...formData, password: '[REDACTED]' } })
      setErrors({ submit: 'Erro ao realizar cadastro. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 dark:from-gray-900 dark:to-gray-800'>
      <div className='mx-auto max-w-4xl px-6'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 dark:text-white'>Criar Conta no AgroSync</h1>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            Junte-se à maior plataforma de agronegócio do Brasil
          </p>
        </div>

        {/* Formulário */}
        <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Campos básicos */}
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Nome Completo *
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-colors focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='Seu nome completo'
                  />
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>Email *</label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-colors focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='seu@email.com'
                  />
                </div>
                {errors.email && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.email}</p>}
              </div>
            </div>

            {/* Senhas */}
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>Senha *</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='Mínimo 8 caracteres'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  >
                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                </div>
                {errors.password && (
                  <div className='mt-1'>
                    {Array.isArray(errors.password) ? (
                      errors.password.map((error, index) => (
                        <p key={index} className='text-sm text-red-600 dark:text-red-400'>
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className='text-sm text-red-600 dark:text-red-400'>{errors.password}</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Confirmar Senha *
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    placeholder='Digite a senha novamente'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  >
                    {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Termos */}
            <div>
              <label className='flex items-start space-x-3'>
                <input
                  type='checkbox'
                  name='acceptTerms'
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className='mt-1 text-primary-600 focus:ring-primary-500'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Eu aceito os{' '}
                  <button
                    type='button'
                    className='text-primary-600 underline hover:text-primary-700 dark:text-primary-400'
                  >
                    Termos de Uso
                  </button>{' '}
                  e a{' '}
                  <button
                    type='button'
                    className='text-primary-600 underline hover:text-primary-700 dark:text-primary-400'
                  >
                    Política de Privacidade
                  </button>{' '}
                  do AgroSync *
                </span>
              </label>
              {errors.acceptTerms && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.acceptTerms}</p>
              )}
            </div>

            {/* Erro de submissão */}
            {errors.submit && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
                <div className='flex items-center space-x-2'>
                  <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
                  <p className='text-sm text-red-600 dark:text-red-400'>{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Botão de envio */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex w-full items-center justify-center space-x-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:bg-primary-400'
            >
              {isSubmitting ? (
                <>
                  <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <FileText className='h-5 w-5' />
                  <span>Criar Conta</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login */}
        <div className='mt-8 text-center'>
          <p className='text-gray-600 dark:text-gray-300'>
            Já tem uma conta?{' '}
            <a href='/login' className='font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400'>
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
