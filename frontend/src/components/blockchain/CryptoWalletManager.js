import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Wallet, Send, Receive, Loader2, Plus, AlertCircle, EyeOff, Eye, Copy } from 'lucide-react';

const CryptoWalletManager = ({ userId }) => {
  const { t } = useTranslation();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/wallets?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWallets(data.wallets);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('wallets.error', 'Erro ao carregar carteiras'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const createWallet = async (currency) => {
    try {
      const response = await fetch('/api/blockchain/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ currency, userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWallets([...wallets, data.wallet]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('wallets.createError', 'Erro ao criar carteira'));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('wallets.loading', 'Carregando carteiras...')}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Wallet className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('wallets.title', 'Carteiras Cripto')}
        </h2>
        
        <button
          onClick={() => createWallet('SOL')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('wallets.create', 'Criar Carteira')}</span>
        </button>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {wallets.length === 0 ? (
        <div className="text-center py-8">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('wallets.noWallets', 'Nenhuma carteira encontrada')}
          </p>
          <button
            onClick={() => createWallet('SOL')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            {t('wallets.createFirst', 'Criar Primeira Carteira')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {wallet.currency} Wallet
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPrivateKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    {t('wallets.address', 'Endereço')}:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={wallet.address}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(wallet.address)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {showPrivateKeys && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      {t('wallets.privateKey', 'Chave Privada')}:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={wallet.privateKey}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(wallet.privateKey)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('wallets.balance', 'Saldo')}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {wallet.balance} {wallet.currency}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                  <Receive className="w-4 h-4" />
                  <span>{t('wallets.receive', 'Receber')}</span>
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>{t('wallets.send', 'Enviar')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CryptoWalletManager;
