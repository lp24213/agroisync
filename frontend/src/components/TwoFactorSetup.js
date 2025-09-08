import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Smartphone, Mail, QrCode, Key, CheckCircle, RefreshCw, Download, Copy, XCircle, AlertCircle } from 'lucide-react'
import authService from '../services/authService'

const TwoFactorSetup = ({ userId, onComplete, onCancel }) => {
  const [step, setStep] = useState('setup') // setup, verify, backup, complete
  const [method, setMethod] = useState('2FA_APP') // 2FA_APP, SMS, EMAIL
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const initialize2FA = useCallback(async () => {
    setLoading(true)
    try {
      const result = await authService.setup2FA(userId)
      if (result.success) {
        setQrCodeUrl(result.qrCodeUrl)
        setSecret(result.secret)
        setBackupCodes(result.backupCodes)
      }
    } catch (error) {
      setError('Erro ao configurar 2FA')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (step === 'setup') {
      initialize2FA()
    }
  }, [step, initialize2FA])

  const handleMethodChange = newMethod => {
    setMethod(newMethod)
    setVerificationCode('')
    setError('')
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
      if (method === '2FA_APP') {
        result = await authService.verify2FA(userId, verificationCode)
      } else if (method === 'SMS') {
        result = await authService.verifySMS(userId, verificationCode)
      } else if (method === 'EMAIL') {
        result = await authService.verifyEmail(userId, verificationCode)
      }

      if (result.success) {
        setStep('backup')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        method,
        secret,
        backupCodes
      })
    }
  }

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
    setSuccess('Copiado para a área de transferência!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup AgroSync\n\n${backupCodes.join('\n')}\n\nGuarde estes códigos em local seguro.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agrosync-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderSetupStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='text-center'>
        <Shield className='mx-auto mb-4 h-16 w-16 text-emerald-600' />
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Configurar Autenticação em Duas Etapas</h2>
        <p className='text-gray-600'>Escolha um método de verificação para sua conta</p>
      </div>

      {/* Seleção de Método */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <button
          onClick={() => handleMethodChange('2FA_APP')}
          className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
            method === '2FA_APP'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Smartphone className='mx-auto mb-2 h-8 w-8' />
          <div className='font-medium'>App 2FA</div>
          <div className='text-sm text-gray-500'>Google Authenticator</div>
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
          <div className='text-sm text-gray-500'>Código por SMS</div>
        </button>

        <button
          onClick={() => handleMethodChange('EMAIL')}
          className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
            method === 'EMAIL'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Mail className='mx-auto mb-2 h-8 w-8' />
          <div className='font-medium'>Email</div>
          <div className='text-sm text-gray-500'>Código por email</div>
        </button>
      </div>

      {/* Configuração do Método */}
      {method === '2FA_APP' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='bg-gray-50 rounded-lg p-6'
        >
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Configurar App 2FA</h3>
          
          {loading ? (
            <div className='text-center py-8'>
              <RefreshCw className='mx-auto mb-4 h-8 w-8 animate-spin text-emerald-600' />
              <p className='text-gray-600'>Gerando configuração...</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='text-center'>
                <div className='inline-block p-4 bg-white rounded-lg border-2 border-gray-200'>
                  <QrCode className='h-32 w-32 text-gray-400' />
                </div>
                <p className='mt-2 text-sm text-gray-600'>
                  Escaneie o QR Code com seu app 2FA
                </p>
              </div>

              <div className='bg-white rounded-lg p-4 border border-gray-200'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700'>Chave Secreta:</span>
                  <button
                    onClick={() => copyToClipboard(secret)}
                    className='flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700'
                  >
                    <Copy className='h-4 w-4' />
                    <span>Copiar</span>
                  </button>
                </div>
                <div className='font-mono text-sm bg-gray-100 p-2 rounded break-all'>
                  {secret}
                </div>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h4 className='font-medium text-blue-900 mb-2'>Instruções:</h4>
                <ol className='text-sm text-blue-800 space-y-1'>
                  <li>1. Instale o Google Authenticator ou similar</li>
                  <li>2. Escaneie o QR Code ou digite a chave secreta</li>
                  <li>3. Digite o código de 6 dígitos gerado</li>
                </ol>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {method === 'SMS' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='bg-gray-50 rounded-lg p-6'
        >
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Configurar SMS</h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Número de Telefone
              </label>
              <input
                type='tel'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                placeholder='+55 11 99999-9999'
              />
            </div>
            <button className='w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'>
              Enviar Código de Verificação
            </button>
          </div>
        </motion.div>
      )}

      {method === 'EMAIL' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className='bg-gray-50 rounded-lg p-6'
        >
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Configurar Email</h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Endereço de Email
              </label>
              <input
                type='email'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                placeholder='seu@email.com'
              />
            </div>
            <button className='w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'>
              Enviar Código de Verificação
            </button>
          </div>
        </motion.div>
      )}

      {/* Botões de Ação */}
      <div className='flex justify-between pt-6'>
        <button
          onClick={onCancel}
          className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Cancelar
        </button>
        <button
          onClick={() => setStep('verify')}
          disabled={loading || (method === '2FA_APP' && !secret)}
          className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          Continuar
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
          Digite o código de 6 dígitos do seu {method === '2FA_APP' ? 'app 2FA' : method === 'SMS' ? 'SMS' : 'email'}
        </p>
      </div>

      <div className='max-w-md mx-auto'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Código de Verificação
          </label>
          <input
            type='text'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className='w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            placeholder='000000'
            maxLength='6'
          />
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-800'>{error}</p>
          </div>
        )}

        <div className='flex justify-between'>
          <button
            onClick={() => setStep('setup')}
            className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Voltar
          </button>
          <button
            onClick={handleVerifyCode}
            disabled={loading || verificationCode.length !== 6}
            className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderBackupStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='text-center'>
        <Shield className='mx-auto mb-4 h-16 w-16 text-emerald-600' />
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Códigos de Backup</h2>
        <p className='text-gray-600'>
          Guarde estes códigos em local seguro. Use-os caso perca acesso ao seu dispositivo.
        </p>
      </div>

      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
        <div className='flex items-start space-x-3'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5' />
          <div>
            <h4 className='font-medium text-yellow-900'>Importante</h4>
            <p className='text-sm text-yellow-800 mt-1'>
              Estes códigos só são mostrados uma vez. Guarde-os em local seguro e não compartilhe com ninguém.
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Códigos de Backup</h3>
          <div className='flex space-x-2'>
            <button
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
              className='flex items-center space-x-1 px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50'
            >
              <Copy className='h-4 w-4' />
              <span>Copiar</span>
            </button>
            <button
              onClick={downloadBackupCodes}
              className='flex items-center space-x-1 px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50'
            >
              <Download className='h-4 w-4' />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className='p-3 bg-gray-50 rounded-lg font-mono text-sm text-center'
            >
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between'>
        <button
          onClick={() => setStep('verify')}
          className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Voltar
        </button>
        <button
          onClick={handleComplete}
          className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
        >
          Concluir Configuração
        </button>
      </div>
    </motion.div>
  )

  const renderCompleteStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center space-y-6'>
      <CheckCircle className='mx-auto h-16 w-16 text-emerald-600' />
      <h2 className='text-2xl font-bold text-gray-900'>2FA Configurado com Sucesso!</h2>
      <p className='text-gray-600'>
        Sua conta agora está protegida com autenticação em duas etapas.
      </p>
      <button
        onClick={onComplete}
        className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
      >
        Finalizar
      </button>
    </motion.div>
  )

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
      >
        <div className='p-6'>
          <AnimatePresence mode='wait'>
            {step === 'setup' && renderSetupStep()}
            {step === 'verify' && renderVerifyStep()}
            {step === 'backup' && renderBackupStep()}
            {step === 'complete' && renderCompleteStep()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default TwoFactorSetup