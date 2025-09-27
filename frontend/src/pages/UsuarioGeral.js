import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UsuarioGeral = () => {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [planLimits, setPlanLimits] = useState({
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-green-800 mb-4"
            >
              👤 Usuário Geral
            </motion.h1>
            <p className="text-lg text-gray-600">
              Plano Básico - R$ 15,00/mês
            </p>
          </div>

          {/* Status do Plano */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Status do Plano</h2>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Ativo
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Produtos: {productCount}/{planLimits.maxProducts}</span>
                {canAddProduct ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">Imagens por produto: {planLimits.maxImages}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">Descrição: {planLimits.maxDescription} caracteres</span>
              </div>
            </div>
          </motion.div>

          {/* Limitações do Plano */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitações do Plano</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">💳 Pagamentos em Criptomoedas</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">💬 Sistema de Mensagens</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">📊 Analytics Avançados</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">📦 1 Produto</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">🖼️ 3 Imagens por produto</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Ações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações Disponíveis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canAddProduct}
                className={`p-4 rounded-lg border-2 transition-all ${
                  canAddProduct
                    ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Package className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Adicionar Produto</div>
                <div className="text-sm opacity-75">
                  {canAddProduct ? 'Disponível' : 'Limite atingido'}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <Star className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Upgrade do Plano</div>
                <div className="text-sm opacity-75">Desbloquear mais recursos</div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UsuarioGeral;
