import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Zap, CheckCircle } from 'lucide-react'
import paymentService from '../services/paymentService'

const IntermediationSystem = () => {
  const [commissionData, setCommissionData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Calcular comissão para transação
  const calculateCommission = async (amount, type) => {
    setIsLoading(true)
    try {
      const result = await paymentService.calculateCommission(amount, type)
      if (result.success) {
        setCommissionData(result)
      }
    } catch (error) {
      console.error('Erro ao calcular comissão:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Processar comissão (função disponível para uso futuro)
  // const processCommission = async (transactionId, amount, paymentMethod, userWallet) => {
  //   setIsLoading(true)
  //   try {
  //     const result = await paymentService.processCommission(transactionId, amount, paymentMethod, userWallet)
  //     if (result.success) {
  //       alert('Comissão processada com sucesso!')
  //     }
  //   } catch (error) {
  //     console.error('Erro ao processar comissão:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-white'>Sistema de Intermediação AgroSync</h1>
          <p className='text-xl text-gray-300'>Plataforma profissional de intermediação com comissões automáticas</p>
        </motion.div>

        {/* Cards de Funcionalidades */}
        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg'
          >
            <Heart className='mb-4 h-12 w-12 text-blue-400' />
            <h3 className='mb-2 text-xl font-semibold text-white'>Intermediação de Produtos</h3>
            <p className='mb-4 text-gray-300'>Conecte produtores e compradores com comissão automática de 5%</p>
            <button
              onClick={() => calculateCommission(1000, 'product_sale')}
              className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
            >
              Calcular Comissão
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg'
          >
            <Users className='mb-4 h-12 w-12 text-green-400' />
            <h3 className='mb-2 text-xl font-semibold text-white'>Intermediação de Fretes</h3>
            <p className='mb-4 text-gray-300'>Conecte transportadores e clientes com comissão automática de 3%</p>
            <button
              onClick={() => calculateCommission(500, 'freight_service')}
              className='w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
            >
              Calcular Comissão
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg'
          >
            <Zap className='mb-4 h-12 w-12 text-yellow-400' />
            <h3 className='mb-2 text-xl font-semibold text-white'>Planos Premium</h3>
            <p className='mb-4 text-gray-300'>Planos de assinatura com comissão automática de 10%</p>
            <button
              onClick={() => calculateCommission(200, 'premium_plan')}
              className='w-full rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700'
            >
              Calcular Comissão
            </button>
          </motion.div>
        </div>

        {/* Resultado da Comissão */}
        {commissionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-8 rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg'
          >
            <h2 className='mb-6 text-center text-2xl font-bold text-white'>Cálculo de Comissão</h2>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg bg-white/5 p-4'>
                  <span className='text-gray-300'>Valor da Transação:</span>
                  <span className='font-semibold text-white'>R$ {commissionData.transactionAmount.toFixed(2)}</span>
                </div>

                <div className='flex items-center justify-between rounded-lg bg-white/5 p-4'>
                  <span className='text-gray-300'>Taxa de Comissão:</span>
                  <span className='font-semibold text-blue-400'>{commissionData.commissionRate}%</span>
                </div>

                <div className='flex items-center justify-between rounded-lg bg-white/5 p-4'>
                  <span className='text-gray-300'>Comissão AgroSync:</span>
                  <span className='font-semibold text-green-400'>R$ {commissionData.commission.toFixed(2)}</span>
                </div>

                <div className='flex items-center justify-between rounded-lg bg-white/5 p-4'>
                  <span className='text-gray-300'>Valor Líquido:</span>
                  <span className='font-semibold text-white'>R$ {commissionData.netAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='rounded-lg border border-blue-500/30 bg-blue-500/20 p-4'>
                  <h3 className='mb-2 font-semibold text-white'>Carteira do Proprietário</h3>
                  <p className='break-all text-sm text-blue-300'>{commissionData.ownerWallet}</p>
                </div>

                <div className='rounded-lg border border-green-500/30 bg-green-500/20 p-4'>
                  <CheckCircle className='mb-2 h-6 w-6 text-green-400' />
                  <h3 className='mb-2 font-semibold text-white'>Sistema Automático</h3>
                  <p className='text-sm text-green-300'>Comissões são processadas automaticamente para sua carteira</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Informações do Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg'
        >
          <h2 className='mb-6 text-center text-2xl font-bold text-white'>Como Funciona o Sistema</h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600'>
                <span className='text-2xl font-bold text-white'>1</span>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>Cliente Faz Transação</h3>
              <p className='text-sm text-gray-300'>Cliente realiza compra ou contrata serviço através da plataforma</p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600'>
                <span className='text-2xl font-bold text-white'>2</span>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>Comissão Calculada</h3>
              <p className='text-sm text-gray-300'>
                Sistema calcula automaticamente sua comissão baseada no tipo de transação
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600'>
                <span className='text-2xl font-bold text-white'>3</span>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>Pagamento Automático</h3>
              <p className='text-sm text-gray-300'>Comissão é enviada automaticamente para sua carteira cripto</p>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='flex items-center space-x-4 rounded-lg bg-white p-6'>
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
              <span className='text-gray-700'>Processando...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IntermediationSystem
