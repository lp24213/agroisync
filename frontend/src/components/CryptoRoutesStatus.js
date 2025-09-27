import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import cryptoService from '../services/cryptoService';

const CryptoRoutesStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkCryptoRoutesStatus();
  }, []);

  const checkCryptoRoutesStatus = async () => {
    try {
      setLoading(true);
      const result = await cryptoService.getCryptoRoutesStatus();
      
      if (result.success) {
        setStatus(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erro ao verificar status das rotas criptografadas');
    } finally {
      setLoading(false);
    }
  };

  const testCryptoOperations = async () => {
    try {
      setLoading(true);
      
      // Testar geração de chaves
      const keysResult = await cryptoService.generateKeys();
      console.log('Chaves geradas:', keysResult);
      
      // Testar criptografia
      const testData = { message: 'Teste de criptografia AgroSync', timestamp: Date.now() };
      const encryptResult = await cryptoService.encryptData(testData, keysResult.data.symmetricKey);
      console.log('Dados criptografados:', encryptResult);
      
      // Testar descriptografia
      const decryptResult = await cryptoService.decryptData(encryptResult.data, keysResult.data.symmetricKey);
      console.log('Dados descriptografados:', decryptResult);
      
      // Testar hash
      const hashResult = await cryptoService.generateHash(testData);
      console.log('Hash gerado:', hashResult);
      
      // Testar nonce
      const nonceResult = await cryptoService.generateNonce();
      console.log('Nonce gerado:', nonceResult);
      
      alert('Testes de criptografia executados com sucesso! Verifique o console para detalhes.');
    } catch (err) {
      console.error('Erro nos testes:', err);
      alert('Erro ao executar testes de criptografia');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando rotas criptografadas...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6 m-4"
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Erro nas Rotas Criptografadas</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={checkCryptoRoutesStatus}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 m-4 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-emerald-800">Rotas Criptografadas</h2>
            <p className="text-emerald-600">Sistema de segurança ativo</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 font-semibold">Online</span>
        </div>
      </div>

      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Status do Sistema</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">{status.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Algoritmos:</span>
                <span className="text-gray-800">{status.algorithms?.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="text-gray-800">
                  {new Date(status.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Endpoints Disponíveis</h3>
            <div className="space-y-1">
              {status.endpoints?.map((endpoint, index) => (
                <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                  {endpoint}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={testCryptoOperations}
          disabled={loading}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Testar Operações</span>
        </button>

        <button
          onClick={checkCryptoRoutesStatus}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Atualizar Status</span>
        </button>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Funcionalidades Disponíveis:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Criptografia AES-256-GCM para dados sensíveis</li>
          <li>• Geração de hash SHA-256 para integridade</li>
          <li>• Geração de nonces para segurança</li>
          <li>• Assinatura digital de documentos</li>
          <li>• Verificação de integridade de dados</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default CryptoRoutesStatus;
