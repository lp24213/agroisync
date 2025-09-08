import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Smartphone, Key, CheckCircle, RefreshCw, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import authService from '../services/authService'

const PasswordRecovery = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState('request'); // request, verify, reset, complete
  const [method, setMethod] = useState('EMAIL'); // EMAIL, SMS
  const [identifier, setIdentifier] = useState(''); // email ou telefone
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRequestRecovery = async () => {
    if (!identifier.trim()) {
      setError('Digite seu e-mail ou telefone')
      return
    }

    // Validar formato
    if (method === 'EMAIL' && !authService.validateEmail(identifier)) {
      setError('Digite um e-mail válido')
      return
    }

    if (method === 'SMS' && !authService.validatePhone(identifier)) {
      setError('Digite um telefone válido')
      return
    }

    setLoading(true)
    setError('')

    try {
      let result

      if (method === 'EMAIL') {
        result = await authService.forgotPassword(identifier)
      } else if (method === 'SMS') {
        result = await authService.generateSMSOTP(identifier)
      }

      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => {
          setStep('verify')
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Erro ao enviar código de recuperação')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Digite o código de verificação')
      return
    }

    setLoading(true)
    setError('')

    try {
      let result

      if (method === 'EMAIL') {
        // Para email, o código vem no link, então vamos simular verificação
        result = { success: true, message: 'Código verificado' }
      } else if (method === 'SMS') {
        result = await authService.verifyOTP(identifier, verificationCode, 'SMS')
      }

      if (result.success) {
        setSuccess('Código verificado com sucesso!')
        setTimeout(() => {
          setStep('reset')
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setError('Digite a nova senha')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    const passwordStrength = authService.validatePasswordStrength(newPassword)
    if (!passwordStrength.isValid) {
      setError(`Senha muito fraca. ${passwordStrength.strength}`)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Em produção, usar o token real do email
      const mockToken = 'mock_reset_token'
      const result = await authService.resetPassword(mockToken, newPassword)

      if (result.success) {
        setSuccess('Senha alterada com sucesso!')
        setTimeout(() => {
          setStep('complete')
        }, 1500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Erro ao resetar senha')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const renderRequestStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='text-center'>
        <Lock className='mx-auto mb-4 h-16 w-16 text-emerald-600' />
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Recuperar Senha</h2>
        <p className='text-gray-600'>Escolha como receber o código de recuperação</p>
      </div>

      {/* Seleção de Método */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <button
          onClick={() => handleMethodChange('EMAIL')}
          className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
            method === 'EMAIL'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Mail className='mx-auto mb-2 h-8 w-8' />
          <div className='font-medium'>E-mail</div>
          <div className='text-sm text-gray-500'>Link de recuperação</div>
        </button>

        <button
          onClick={() => handleMethodChange('SMS')}
          className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
            method === 'SMS'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Smartphone className='mx-auto mb-2 h-8 w-8' />
          <div className='font-medium'>SMS</div>
          <div className='text-sm text-gray-500'>Código via celular</div>
        </button>
      </div>

      {/* Input do Identificador */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          {method === 'EMAIL' ? 'E-mail' : 'Telefone'}
        </label>
        <input
          type={method === 'EMAIL' ? 'email' : 'tel'}
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          placeholder={method === 'EMAIL' ? 'seu@email.com' : '(11) 99999-9999'}
          className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
        />
      </div>

      {/* Mensagens */}
      {error && <div className='rounded-lg bg-red-50 p-3 text-center text-red-600'>{error}</div>}

      {success && <div className='rounded-lg bg-emerald-50 p-3 text-center text-emerald-600'>{success}</div>}

      {/* Botões de Ação */}
      <div className='flex justify-end space-x-3'>
        <button
          onClick={onCancel}
          className='rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50'
        >
          Cancelar
        </button>
        <button
          onClick={handleRequestRecovery}
          disabled={loading || !identifier.trim()}
          className='rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {loading ? <RefreshCw className='h-4 w-4 animate-spin' /> : 'Enviar Código'}
        </button>
      </div>
    </motion.div>
  )

  const renderVerifyStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='text-center'>
        <Key className='mx-auto mb-4 h-16 w-16 text-emerald-600' />
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Verificar Código</h2>
        <p className='text-gray-600'>
          {method === 'EMAIL'
            ? 'Verifique seu e-mail e clique no link de recuperação'
            : 'Digite o código de 6 dígitos enviado via SMS'}
        </p>
      </div>

      {method === 'SMS' && (
        <div className='mx-auto max-w-xs'>
          <input
            type='text'
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder='000000'
            className='w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-mono text-2xl tracking-widest focus:border-transparent focus:ring-2 focus:ring-emerald-500'
            maxLength={6}
          />
        </div>
      )}

      {method === 'EMAIL' && (
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
          <h4 className='mb-2 font-medium text-blue-900'>📧 Verifique seu e-mail</h4>
          <p className='text-sm text-blue-800'>
            Enviamos um link de recuperação para <strong>{identifier}</strong>. Clique no link para continuar.
          </p>
        </div>
      )}

      {/* Mensagens */}
      {error && <div className='rounded-lg bg-red-50 p-3 text-center text-red-600'>{error}</div>}

      {success && <div className='rounded-lg bg-emerald-50 p-3 text-center text-emerald-600'>{success}</div>}

      {/* Botões de Ação */}
      <div className='flex justify-center space-x-3'>
        <button
          onClick={() => setStep('request')}
          className='rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50'
        >
          <ArrowLeft className='mr-2 inline h-4 w-4' />
          Voltar
        </button>
        {method === 'SMS' && (
          <button
            onClick={handleVerifyCode}
            disabled={loading || !verificationCode.trim()}
            className='rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? <RefreshCw className='h-4 w-4 animate-spin' /> : 'Verificar'}
          </button>
        )}
      </div>
    </motion.div>
  )

  const renderResetStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='text-center'>
        <Lock className='mx-auto mb-4 h-16 w-16 text-emerald-600' />
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Nova Senha</h2>
        <p className='text-gray-600'>Digite sua nova senha</p>
      </div>

      {/* Nova Senha */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>Nova Senha</label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder='Digite sua nova senha'
            className='w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3'
          >
            {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
          </button>
        </div>

        {/* Indicador de Força da Senha */}
        {newPassword && (
          <div className='mt-2'>
            <PasswordStrengthIndicator password={newPassword} />
          </div>
        )}
      </div>

      {/* Confirmar Senha */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>Confirmar Senha</label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder='Confirme sua nova senha'
            className='w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute inset-y-0 right-0 flex items-center pr-3'
          >
            {showConfirmPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400' />
            )}
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {error && <div className='rounded-lg bg-red-50 p-3 text-center text-red-600'>{error}</div>}

      {success && <div className='rounded-lg bg-emerald-50 p-3 text-center text-emerald-600'>{success}</div>}

      {/* Botões de Ação */}
      <div className='flex justify-center space-x-3'>
        <button
          onClick={() => setStep('verify')}
          className='rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50'
        >
          <ArrowLeft className='mr-2 inline h-4 w-4' />
          Voltar
        </button>
        <button
          onClick={handleResetPassword}
          disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
          className='rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {loading ? <RefreshCw className='h-4 w-4 animate-spin' /> : 'Alterar Senha'}
        </button>
      </div>
    </motion.div>
  )

  const renderCompleteStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6 text-center'>
      <CheckCircle className='mx-auto h-20 w-20 text-emerald-600' />
      <h2 className='text-2xl font-bold text-gray-900'>Senha Alterada!</h2>
      <p className='text-gray-600'>Sua senha foi alterada com sucesso. Agora você pode fazer login com a nova senha.</p>

      <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-4'>
        <h4 className='mb-2 font-medium text-emerald-900'>Próximos passos:</h4>
        <ul className='list-inside list-disc space-y-1 text-sm text-emerald-800'>
          <li>Faça login com sua nova senha</li>
          <li>Considere ativar a autenticação em duas etapas</li>
          <li>Mantenha sua senha segura</li>
        </ul>
      </div>

      <button
        onClick={handleComplete}
        className='rounded-lg bg-emerald-600 px-8 py-3 text-white transition-colors hover:bg-emerald-700'
      >
        Fazer Login
      </button>
    </motion.div>
  )

  const handleMethodChange = newMethod => {
    setMethod(newMethod)
    setIdentifier('')
    setError('')
  }

  return (
    <div className='mx-auto max-w-md'>
      <AnimatePresence mode='wait'>
        {step === 'request' && renderRequestStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'reset' && renderResetStep()}
        {step === 'complete' && renderCompleteStep()}
      </AnimatePresence>
    </div>
  )
}

// Componente auxiliar para indicar força da senha
const PasswordStrengthIndicator = ({ password }) => {
  const strength = authService.validatePasswordStrength(password)

  const getStrengthColor = score => {
    if (score <= 1) return 'bg-red-500'
    if (score <= 2) return 'bg-orange-500'
    if (score <= 3) return 'bg-yellow-500'
    if (score <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = score => {
    if (score <= 1) return 'Muito Fraca'
    if (score <= 2) return 'Fraca'
    if (score <= 3) return 'Média'
    if (score <= 4) return 'Forte'
    return 'Excelente'
  }

  return (
    <div className='space-y-2'>
      <div className='flex justify-between text-sm'>
        <span className='text-gray-600'>Força da senha:</span>
        <span
          className={`font-medium ${
            strength.score <= 2
              ? 'text-red-600'
              : strength.score <= 3
                ? 'text-yellow-600'
                : strength.score <= 4
                  ? 'text-blue-600'
                  : 'text-green-600'
          }`}
        >
          {getStrengthText(strength.score)}
        </span>
      </div>

      <div className='h-2 w-full rounded-full bg-gray-200'>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>

      <div className='text-xs text-gray-500'>
        <ul className='space-y-1'>
          {!strength.details.minLength && <li>• Mínimo 8 caracteres</li>}
          {!strength.details.hasUpperCase && <li>• Pelo menos uma maiúscula</li>}
          {!strength.details.hasLowerCase && <li>• Pelo menos uma minúscula</li>}
          {!strength.details.hasNumbers && <li>• Pelo menos um número</li>}
          {!strength.details.hasSpecialChar && <li>• Pelo menos um caractere especial</li>}
        </ul>
      </div>
    </div>
  )
}

export default PasswordRecovery
