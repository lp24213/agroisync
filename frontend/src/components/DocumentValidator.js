import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, RefreshCw } from 'lucide-react'
import receitaService, { DOCUMENT_TYPES, VALIDATION_STATUS, BRAZILIAN_STATES } from '../services/receitaService'

const DocumentValidator = ({ onValidationComplete, className = '', showAdvanced = false, autoValidate = false }) => {
  const [documents, setDocuments] = useState({
    cpf: '',
    cnpj: '',
    ie: '',
    state: ''
  })

  const [validationResults, setValidationResults] = useState({})
  const [isValidating, setIsValidating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [validationHistory, setValidationHistory] = useState([])

  // Inicializar serviço
  useEffect(() => {
    receitaService.initialize()
  }, [])

  // Validação automática se habilitada
  // useEffect será movido para após as funções

  // Atualizar documentos
  const handleDocumentChange = (field, value) => {
    setDocuments(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpar resultado anterior
    if (validationResults[field]) {
      setValidationResults(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  // Aplicar máscara aos documentos
  const applyMask = (value, type) => {
    if (!value) return ''

    const cleanValue = value.replace(/\D/g, '')

    switch (type) {
      case 'CPF':
        return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      case 'CNPJ':
        return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      case 'IE':
        return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4')
      default:
        return cleanValue
    }
  }

  // Validar CPF
  const handleValidateCPF = useCallback(async () => {
    if (!documents.cpf || documents.cpf.replace(/\D/g, '').length !== 11) {
      return
    }

    setIsValidating(true)
    try {
      const result = await receitaService.validateCPF(documents.cpf)

      setValidationResults(prev => ({
        ...prev,
        cpf: result
      }))

      // Adicionar ao histórico
      addToHistory('CPF', result)

      // Notificar componente pai
      if (onValidationComplete) {
        onValidationComplete({ cpf: result })
      }
    } catch (error) {
      console.error('Erro na validação de CPF:', error)
      setValidationResults(prev => ({
        ...prev,
        cpf: {
          valid: false,
          status: 'ERROR',
          error: 'Erro na validação',
          document: documents.cpf,
          type: 'CPF'
        }
      }))
    } finally {
      setIsValidating(false)
      setShowResults(true)
    }
  }, [documents.cpf, onValidationComplete])

  // Validar CNPJ
  const handleValidateCNPJ = useCallback(async () => {
    if (!documents.cnpj || documents.cnpj.replace(/\D/g, '').length !== 14) {
      return
    }

    setIsValidating(true)
    try {
      const result = await receitaService.validateCNPJ(documents.cnpj)

      setValidationResults(prev => ({
        ...prev,
        cnpj: result
      }))

      // Adicionar ao histórico
      addToHistory('CNPJ', result)

      // Notificar componente pai
      if (onValidationComplete) {
        onValidationComplete({ cnpj: result })
      }
    } catch (error) {
      console.error('Erro na validação de CNPJ:', error)
      setValidationResults(prev => ({
        ...prev,
        cnpj: {
          valid: false,
          status: 'ERROR',
          error: 'Erro na validação',
          document: documents.cnpj,
          type: 'CNPJ'
        }
      }))
    } finally {
      setIsValidating(false)
      setShowResults(true)
    }
  }, [documents.cnpj, onValidationComplete])

  // Validação automática se habilitada
  useEffect(() => {
    if (autoValidate && documents.cpf && documents.cpf.length === 11) {
      handleValidateCPF()
    }
    if (autoValidate && documents.cnpj && documents.cnpj.length === 14) {
      handleValidateCNPJ()
    }
  }, [documents.cpf, documents.cnpj, autoValidate, handleValidateCPF, handleValidateCNPJ])

  // Validar IE
  const handleValidateIE = async () => {
    if (!documents.ie || !documents.state) {
      return
    }

    setIsValidating(true)
    try {
      const result = await receitaService.validateIE(documents.ie, documents.state)

      setValidationResults(prev => ({
        ...prev,
        ie: result
      }))

      // Adicionar ao histórico
      addToHistory('IE', result)

      // Notificar componente pai
      if (onValidationComplete) {
        onValidationComplete({ ie: result })
      }
    } catch (error) {
      console.error('Erro na validação de IE:', error)
      setValidationResults(prev => ({
        ...prev,
        ie: {
          valid: false,
          status: 'ERROR',
          error: 'Erro na validação',
          document: documents.ie,
          type: 'IE',
          state: documents.state
        }
      }))
    } finally {
      setIsValidating(false)
      setShowResults(true)
    }
  }

  // Validar todos os documentos
  const handleValidateAll = async () => {
    setIsValidating(true)
    try {
      const result = await receitaService.validateDocuments(documents)

      setValidationResults(result.results)
      setShowResults(true)

      // Adicionar ao histórico
      Object.entries(result.results).forEach(([type, validation]) => {
        addToHistory(type.toUpperCase(), validation)
      })

      // Notificar componente pai
      if (onValidationComplete) {
        onValidationComplete(result)
      }
    } catch (error) {
      console.error('Erro na validação de documentos:', error)
    } finally {
      setIsValidating(false)
    }
  }

  // Adicionar ao histórico
  const addToHistory = (type, result) => {
    const historyItem = {
      id: Date.now(),
      type,
      result,
      timestamp: new Date().toISOString()
    }

    setValidationHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Manter apenas os últimos 10
  }

  // Limpar resultados
  const clearResults = () => {
    setValidationResults({})
    setShowResults(false)
  }

  // Obter ícone de status
  const getStatusIcon = status => {
    switch (status) {
      case 'VALID':
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case 'INVALID':
        return <XCircle className='h-5 w-5 text-red-600' />
      case 'PENDING':
        return <Clock className='h-5 w-5 text-yellow-600' />
      case 'ERROR':
        return <AlertTriangle className='h-5 w-5 text-red-600' />
      default:
        return <FileText className='h-5 w-5 text-gray-600' />
    }
  }

  // Obter cor de status
  const getStatusColor = status => {
    return VALIDATION_STATUS[status]?.color || 'bg-gray-100 text-gray-800'
  }

  // Verificar se pode validar
  const canValidate = () => {
    return documents.cpf || documents.cnpj || (documents.ie && documents.state)
  }

  // Verificar se todos os documentos são válidos
  const allValid = () => {
    const results = Object.values(validationResults)
    return results.length > 0 && results.every(result => result?.valid)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='text-center'>
        <h3 className='mb-2 text-xl font-semibold text-gray-800'>Validador de Documentos</h3>
        <p className='text-gray-600'>Valide CPF, CNPJ e Inscrição Estadual com a Receita Federal</p>
      </div>

      {/* Formulário de documentos */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* CPF */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>CPF</label>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={applyMask(documents.cpf, 'CPF')}
              onChange={e => handleDocumentChange('cpf', e.target.value)}
              placeholder='000.000.000-00'
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              maxLength={14}
            />
            <button
              onClick={handleValidateCPF}
              disabled={!documents.cpf || documents.cpf.replace(/\D/g, '').length !== 11 || isValidating}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isValidating ? <RefreshCw className='h-4 w-4 animate-spin' /> : 'Validar'}
            </button>
          </div>
        </div>

        {/* CNPJ */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>CNPJ</label>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={applyMask(documents.cnpj, 'CNPJ')}
              onChange={e => handleDocumentChange('cnpj', e.target.value)}
              placeholder='00.000.000/0000-00'
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              maxLength={18}
            />
            <button
              onClick={handleValidateCNPJ}
              disabled={!documents.cnpj || documents.cnpj.replace(/\D/g, '').length !== 14 || isValidating}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isValidating ? <RefreshCw className='h-4 w-4 animate-spin' /> : 'Validar'}
            </button>
          </div>
        </div>

        {/* IE e Estado */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>Inscrição Estadual</label>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={applyMask(documents.ie, 'IE')}
              onChange={e => handleDocumentChange('ie', e.target.value)}
              placeholder='000.000.000.000'
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              maxLength={15}
            />
            <select
              value={documents.state}
              onChange={e => handleDocumentChange('state', e.target.value)}
              className='rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Estado</option>
              {Object.entries(BRAZILIAN_STATES).map(([code, state]) => (
                <option key={code} value={code}>
                  {code} - {state.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleValidateIE}
              disabled={!documents.ie || !documents.state || isValidating}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isValidating ? <RefreshCw className='h-4 w-4 animate-spin' /> : 'Validar'}
            </button>
          </div>
        </div>

        {/* Botão validar todos */}
        <div className='flex items-end'>
          <button
            onClick={handleValidateAll}
            disabled={!canValidate() || isValidating}
            className='flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isValidating ? (
              <>
                <RefreshCw className='h-4 w-4 animate-spin' />
                <span>Validando...</span>
              </>
            ) : (
              <>
                <CheckCircle className='h-4 w-4' />
                <span>Validar Todos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resultados da validação */}
      <AnimatePresence>
        {showResults && Object.keys(validationResults).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='space-y-4'
          >
            {/* Header dos resultados */}
            <div className='flex items-center justify-between'>
              <h4 className='text-lg font-semibold text-gray-800'>Resultados da Validação</h4>
              <div className='flex items-center space-x-2'>
                {allValid() && (
                  <div className='flex items-center space-x-2 text-green-600'>
                    <CheckCircle className='h-5 w-5' />
                    <span className='text-sm font-medium'>Todos válidos!</span>
                  </div>
                )}
                <button
                  onClick={clearResults}
                  className='rounded px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800'
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Lista de resultados */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {Object.entries(validationResults).map(([type, result]) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
                >
                  {/* Header do resultado */}
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      {getStatusIcon(result.status)}
                      <span className='font-medium text-gray-800'>{DOCUMENT_TYPES[type]?.name || type}</span>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(result.status)}`}>
                      {VALIDATION_STATUS[result.status]?.name || result.status}
                    </span>
                  </div>

                  {/* Documento */}
                  <div className='mb-3'>
                    <p className='mb-1 text-sm text-gray-600'>Documento:</p>
                    <p className='rounded bg-gray-50 px-2 py-1 font-mono text-sm'>{result.document}</p>
                  </div>

                  {/* Status */}
                  {result.valid ? (
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2 text-green-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span className='text-sm font-medium'>Documento válido</span>
                      </div>
                      {result.details && (
                        <div className='text-xs text-gray-600'>
                          <p>Situação: {result.details.situation}</p>
                          {result.details.lastUpdate && (
                            <p>Última atualização: {new Date(result.details.lastUpdate).toLocaleDateString('pt-BR')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2 text-red-600'>
                        <XCircle className='h-4 w-4' />
                        <span className='text-sm font-medium'>Documento inválido</span>
                      </div>
                      {result.error && <p className='text-xs text-red-600'>{result.error}</p>}
                    </div>
                  )}

                  {/* Fonte */}
                  <div className='mt-3 border-t border-gray-100 pt-2'>
                    <p className='text-xs text-gray-500'>Fonte: {result.source || 'Receita Federal'}</p>
                    {result.validatedAt && (
                      <p className='text-xs text-gray-500'>
                        Validado em: {new Date(result.validatedAt).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Histórico de validações (avançado) */}
      {showAdvanced && validationHistory.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-4'>
          <h4 className='text-lg font-semibold text-gray-800'>Histórico de Validações</h4>

          <div className='max-h-60 space-y-2 overflow-y-auto'>
            {validationHistory.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
              >
                <div className='flex items-center space-x-3'>
                  {getStatusIcon(item.result.status)}
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{DOCUMENT_TYPES[item.type]?.name || item.type}</p>
                    <p className='text-xs text-gray-600'>{item.result.document}</p>
                  </div>
                </div>

                <div className='text-right'>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.result.status)}`}>
                    {VALIDATION_STATUS[item.result.status]?.name || item.result.status}
                  </span>
                  <p className='mt-1 text-xs text-gray-500'>{new Date(item.timestamp).toLocaleString('pt-BR')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DocumentValidator
