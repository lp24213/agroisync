import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UsuarioGeral = () => {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [planLimits] = useState({
    maxProducts: 1,
    maxImages: 3,
    maxDescription: 200,
    canUseCrypto: false,
    canUseMessaging: false,
    canUseAnalytics: false
  });

  useEffect(() => {
    // Simular contagem de produtos do usuário
    setProductCount(0);
  }, [user]);

  const canAddProduct = productCount < planLimits.maxProducts;

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8'>
      <div className='container mx-auto px-4'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mx-auto max-w-4xl'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className='mb-4 text-4xl font-bold text-green-800'
            >
              👤 Usuário Geral
            </motion.h1>
            <p className='text-lg text-gray-600'>Plano Básico - R$ 15,00/mês</p>
          </div>

          {/* Status do Plano */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='mb-6 rounded-xl bg-white p-6 shadow-lg'
          >
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-gray-800'>Status do Plano</h2>
              <div className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800'>Ativo</div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center space-x-3'>
                <Package className='h-5 w-5 text-blue-600' />
                <span className='text-gray-700'>
                  Produtos: {productCount}/{planLimits.maxProducts}
                </span>
                {canAddProduct ? (
                  <CheckCircle className='h-4 w-4 text-green-500' />
                ) : (
                  <XCircle className='h-4 w-4 text-red-500' />
                )}
              </div>

              <div className='flex items-center space-x-3'>
                <Star className='h-5 w-5 text-yellow-600' />
                <span className='text-gray-700'>Imagens por produto: {planLimits.maxImages}</span>
              </div>

              <div className='flex items-center space-x-3'>
                <AlertCircle className='h-5 w-5 text-orange-600' />
                <span className='text-gray-700'>Descrição: {planLimits.maxDescription} caracteres</span>
              </div>
            </div>
          </motion.div>

          {/* Limitações do Plano */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='mb-6 rounded-xl bg-white p-6 shadow-lg'
          >
            <h2 className='mb-4 text-2xl font-bold text-gray-800'>Limitações do Plano</h2>

            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                <span className='text-gray-700'>💳 Pagamentos em Criptomoedas</span>
                <XCircle className='h-5 w-5 text-red-500' />
              </div>

              <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                <span className='text-gray-700'>💬 Sistema de Mensagens</span>
                <XCircle className='h-5 w-5 text-red-500' />
              </div>

              <div className='flex items-center justify-between rounded-lg bg-gray-50 p-3'>
                <span className='text-gray-700'>📊 Analytics Avançados</span>
                <XCircle className='h-5 w-5 text-red-500' />
              </div>

              <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                <span className='text-gray-700'>📦 1 Produto</span>
                <CheckCircle className='h-5 w-5 text-green-500' />
              </div>

              <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
                <span className='text-gray-700'>🖼️ 3 Imagens por produto</span>
                <CheckCircle className='h-5 w-5 text-green-500' />
              </div>
            </div>
          </motion.div>

          {/* Ações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='rounded-xl bg-white p-6 shadow-lg'
          >
            <h2 className='mb-4 text-2xl font-bold text-gray-800'>Ações Disponíveis</h2>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canAddProduct}
                className={`rounded-lg border-2 p-4 transition-all ${
                  canAddProduct
                    ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
                }`}
              >
                <Package className='mx-auto mb-2 h-6 w-6' />
                <div className='font-medium'>Adicionar Produto</div>
                <div className='text-sm opacity-75'>{canAddProduct ? 'Disponível' : 'Limite atingido'}</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='rounded-lg border-2 border-blue-500 bg-blue-50 p-4 text-blue-700 hover:bg-blue-100'
              >
                <Star className='mx-auto mb-2 h-6 w-6' />
                <div className='font-medium'>Upgrade do Plano</div>
                <div className='text-sm opacity-75'>Desbloquear mais recursos</div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UsuarioGeral;
