import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Edit, TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import cryptoService from '../services/cryptoService';

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [formData, setFormData] = useState({
    cryptoId: '',
    condition: 'above', // 'above' or 'below'
    price: '',
    description: '',
    enabled: true
  });

  const popularCryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🟡' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' }
  ];

  useEffect(() => {
    loadAlerts();
    loadCryptoPrices();
    const interval = setInterval(loadCryptoPrices, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkAlerts();
  }, [cryptoPrices, alerts]);

  const loadAlerts = () => {
    // Em produção, buscar do backend
    const savedAlerts = JSON.parse(localStorage.getItem('cryptoPriceAlerts') || '[]');
    setAlerts(savedAlerts);
  };

  const loadCryptoPrices = useCallback(async () => {
    try {
      const symbols = popularCryptos.map(crypto => crypto.id);
      const result = await cryptoService.getCryptoPrices(symbols);
      if (result.success) {
        setCryptoPrices(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    }
  }, []);

  const checkAlerts = useCallback(() => {
    alerts.forEach(alert => {
      if (!alert.enabled) return;
      
      const currentPrice = cryptoPrices[alert.cryptoId];
      if (!currentPrice) return;

      const targetPrice = parseFloat(alert.price);
      const isTriggered = alert.condition === 'above' 
        ? currentPrice > targetPrice 
        : currentPrice < targetPrice;

      if (isTriggered && !alert.triggered) {
        triggerAlert(alert, currentPrice);
      }
    });
  }, [alerts, cryptoPrices]);

  const triggerAlert = (alert, currentPrice) => {
    // Atualizar alerta como disparado
    const updatedAlerts = alerts.map(a => 
      a.id === alert.id ? { ...a, triggered: true, triggeredAt: new Date() } : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));

    // Mostrar notificação
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Alerta de Preço - ${alert.cryptoId.toUpperCase()}`, {
        body: `${alert.cryptoId.toUpperCase()} ${alert.condition === 'above' ? 'subiu para' : 'desceu para'} $${currentPrice.toFixed(2)}`,
        icon: '/favicon.ico'
      });
    }

    // Em produção, enviar notificação via backend
    console.log(`Alerta disparado: ${alert.cryptoId} ${alert.condition} $${alert.price}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newAlert = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date(),
        triggered: false
      };

      const updatedAlerts = [...alerts, newAlert];
      setAlerts(updatedAlerts);
      localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));

      // Em produção, salvar no backend
      // await cryptoService.createPriceAlert(newAlert);

      setFormData({
        cryptoId: '',
        condition: 'above',
        price: '',
        description: '',
        enabled: true
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = (alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));
  };

  const toggleAlert = (alertId) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));
  };

  const getCryptoIcon = (cryptoId) => {
    const crypto = popularCryptos.find(c => c.id === cryptoId);
    return crypto ? crypto.icon : '₿';
  };

  const getCryptoName = (cryptoId) => {
    const crypto = popularCryptos.find(c => c.id === cryptoId);
    return crypto ? crypto.name : cryptoId;
  };

  const getPriceChange = (cryptoId) => {
    const price = cryptoPrices[cryptoId];
    if (!price) return null;
    
    // Simular mudança de preço (em produção, viria do backend)
    const change = (Math.random() - 0.5) * 0.1;
    return {
      value: change,
      percentage: (change * 100).toFixed(2),
      isPositive: change > 0
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alertas de Preço
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Configure alertas para monitorar mudanças de preço das criptomoedas
          </p>
        </div>

        {/* Preços Atuais */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {popularCryptos.map((crypto) => {
            const price = cryptoPrices[crypto.id];
            const change = getPriceChange(crypto.id);
            
            return (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{crypto.icon}</span>
                  {change && (
                    <div className={`flex items-center space-x-1 ${
                      change.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {change.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {change.percentage}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {crypto.name}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {price ? `$${price.toFixed(2)}` : 'Carregando...'}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lista de Alertas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Meus Alertas ({alerts.length})
              </h2>
              
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Alerta</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum alerta configurado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure alertas para ser notificado sobre mudanças de preço
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Primeiro Alerta
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const currentPrice = cryptoPrices[alert.cryptoId];
                  const change = getPriceChange(alert.cryptoId);
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        alert.triggered 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {getCryptoIcon(alert.cryptoId)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getCryptoName(alert.cryptoId)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'} ${alert.price}
                            </div>
                            {alert.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-500">
                                {alert.description}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {currentPrice ? `$${currentPrice.toFixed(2)}` : 'N/A'}
                            </div>
                            {change && (
                              <div className={`text-sm ${
                                change.isPositive ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {change.isPositive ? '+' : ''}{change.percentage}%
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {alert.triggered && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            
                            <button
                              onClick={() => toggleAlert(alert.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                alert.enabled
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}
                            >
                              {alert.enabled ? 'Ativo' : 'Inativo'}
                            </button>
                            
                            <button
                              onClick={() => deleteAlert(alert.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Novo Alerta */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.id ? 'Editar Alerta' : 'Novo Alerta de Preço'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Criptomoeda
                    </label>
                    <select
                      value={formData.cryptoId}
                      onChange={(e) => setFormData({ ...formData, cryptoId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="">Selecione uma cripto</option>
                      {popularCryptos.map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Condição
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="above">Acima de</option>
                      <option value="below">Abaixo de</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preço (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Ex: 50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Ex: Alerta para compra"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alerta'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PriceAlerts;