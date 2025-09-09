import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Zap,
  CheckCircle
} from 'lucide-react';
import paymentService from '../services/paymentService';

const IntermediationSystem = () => {
  const [commissionData, setCommissionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular comissão para transação
  const calculateCommission = async (amount, type) => {
    setIsLoading(true);
    try {
      const result = await paymentService.calculateCommission(amount, type);
      if (result.success) {
        setCommissionData(result);
      }
    } catch (error) {
      console.error('Erro ao calcular comissão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Processar comissão (função disponível para uso futuro)
  // const processCommission = async (transactionId, amount, paymentMethod, userWallet) => {
  //   setIsLoading(true);
  //   try {
  //     const result = await paymentService.processCommission(transactionId, amount, paymentMethod, userWallet);
  //     if (result.success) {
  //       alert('Comissão processada com sucesso!');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao processar comissão:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Sistema de Intermediação AGROISYNC
          </h1>
          <p className="text-xl text-gray-300">
            Plataforma profissional de intermediação com comissões automáticas
          </p>
        </motion.div>

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <Heart className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Intermediação de Produtos
            </h3>
            <p className="text-gray-300 mb-4">
              Conecte produtores e compradores com comissão automática de 5%
            </p>
            <button
              onClick={() => calculateCommission(1000, 'product_sale')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Calcular Comissão
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <Users className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Intermediação de Fretes
            </h3>
            <p className="text-gray-300 mb-4">
              Conecte transportadores e clientes com comissão automática de 3%
            </p>
            <button
              onClick={() => calculateCommission(500, 'freight_service')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Calcular Comissão
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Planos Premium
            </h3>
            <p className="text-gray-300 mb-4">
              Planos de assinatura com comissão automática de 10%
            </p>
            <button
              onClick={() => calculateCommission(200, 'premium_plan')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors"
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
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Cálculo de Comissão
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Valor da Transação:</span>
                  <span className="text-white font-semibold">
                    R$ {commissionData.transactionAmount.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Taxa de Comissão:</span>
                  <span className="text-blue-400 font-semibold">
                    {commissionData.commissionRate}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Comissão AGROISYNC:</span>
                  <span className="text-green-400 font-semibold">
                    R$ {commissionData.commission.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Valor Líquido:</span>
                  <span className="text-white font-semibold">
                    R$ {commissionData.netAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <h3 className="text-white font-semibold mb-2">Carteira do Proprietário</h3>
                  <p className="text-blue-300 text-sm break-all">
                    {commissionData.ownerWallet}
                  </p>
                </div>
                
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
                  <h3 className="text-white font-semibold mb-2">Sistema Automático</h3>
                  <p className="text-green-300 text-sm">
                    Comissões são processadas automaticamente para sua carteira
                  </p>
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
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Como Funciona o Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Cliente Faz Transação
              </h3>
              <p className="text-gray-300 text-sm">
                Cliente realiza compra ou contrata serviço através da plataforma
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Comissão Calculada
              </h3>
              <p className="text-gray-300 text-sm">
                Sistema calcula automaticamente sua comissão baseada no tipo de transação
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Pagamento Automático
              </h3>
              <p className="text-gray-300 text-sm">
                Comissão é enviada automaticamente para sua carteira cripto
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processando...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntermediationSystem;
