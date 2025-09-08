import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, Trash, Edit, TrendingUp, TrendingDown,
  DollarSign, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import cryptoService from '../services/cryptoService';

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [formData, setFormData] = useState({
    cryptoId: '',
    condition: 'above',
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
    const interval = setInterval(loadCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkAlerts();
  }, [cryptoPrices, alerts]);

  const loadAlerts = () => {
    const savedAlerts = JSON.parse(localStorage.getItem('cryptoPriceAlerts') || '[]');
    setAlerts(savedAlerts);
  };

  const loadCryptoPrices = useCallback(async () => {
    try {
      const symbols = popularCryptos.map(crypto => crypto.id);
      const result = await cryptoService.getCryptoPrices(symbols);
      setCryptoPrices(result.prices || {});
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    }
  }, []);

  const checkAlerts = () => {
    alerts.forEach(alert => {
      if (!alert.enabled || !cryptoPrices[alert.cryptoId]) return;

      const currentPrice = cryptoPrices[alert.cryptoId].usd;
      const targetPrice = parseFloat(alert.price);
      let triggered = false;

      if (alert.condition === 'above' && currentPrice >= targetPrice) {
        triggered = true;
      } else if (alert.condition === 'below' && currentPrice <= targetPrice) {
        triggered = true;
      }

      if (triggered && !alert.triggered) {
        triggerAlert(alert, currentPrice);
      }
    });
  };

  const triggerAlert = (alert, currentPrice) => {
Marcar alerta como acionado
    const updatedAlerts = alerts.map(a => 
      a.id === alert.id ? { ...a, triggered: true, triggeredAt: Date.now() } : a
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));

Mostrar notificação
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Alerta de Preço', {
        body: `${alert.cryptoId.toUpperCase()} atingiu ${alert.condition === 'above' ? 'acima' : 'abaixo'} de $${alert.price}`,
        icon: '/favicon.ico'
      });
    }

Em produção, enviar notificação via email/SMS
    console.log(`ALERTA: ${alert.cryptoId} atingiu ${alert.condition === 'above' ? 'acima' : 'abaixo'} de $${alert.price}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cryptoId || !formData.price) return;

    const newAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      price: parseFloat(formData.price),
      createdAt: Date.now(),
      triggered: false
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));

Resetar formulário
    setFormData({
      cryptoId: '',
      condition: 'above',
      price: '',
      description: '',
      enabled: true
    });
    setShowForm(false);
  };

  const toggleAlert = (alertId) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));
  };

  const deleteAlert = (alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(updatedAlerts));
  };

  const editAlert = (alert) => {
    setFormData({
      cryptoId: alert.cryptoId,
      condition: alert.condition,
      price: alert.price.toString(),
      description: alert.description,
      enabled: alert.enabled
    });
    setShowForm(true);
  };

  const getCryptoIcon = (cryptoId) => {
    const crypto = popularCryptos.find(c => c.id === cryptoId);
    return crypto ? crypto.icon : cryptoId.toUpperCase().charAt(0);
  };

  const getCryptoName = (cryptoId) => {
    const crypto = popularCryptos.find(c => c.id === cryptoId);
    return crypto ? crypto.name : cryptoId;
  };

  const getCurrentPrice = (cryptoId) => {
    return cryptoPrices[cryptoId]?.usd || 'N/A';
  };

  const getPriceChange = (cryptoId) => {
    return cryptoPrices[cryptoId]?.change24h || 0;
  };

  const getPriceChangeColor = (change) => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPriceChangeIcon = (change) => {
    if (!change) return null;
    return change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value) return '0.00%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alertas de Preço
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure notificações para acompanhar movimentos de preço
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={requestNotificationPermission}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Permissões</span>
          </button>
          
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Alerta</span>
          </button>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preço (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    placeholder="Ex: Vender quando atingir este preço"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enabled" className="text-sm text-gray-700 dark:text-gray-300">
                  Alerta ativo
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {formData.id ? 'Atualizar' : 'Criar'} Alerta
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Alertas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seus Alertas ({alerts.length})
          </h3>
        </div>

        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Nenhum alerta configurado
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Crie seu primeiro alerta para começar a monitorar preços
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {getCryptoIcon(alert.cryptoId)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {getCryptoName(alert.cryptoId)}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.enabled 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {alert.enabled ? 'Ativo' : 'Inativo'}
                        </span>
                        {alert.triggered && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                            Acionado
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'} ${alert.price}
                        {alert.description && ` - ${alert.description}`}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Preço atual: {formatCurrency(getCurrentPrice(alert.cryptoId))}
                        </span>
                        <div className={`flex items-center space-x-1 ${getPriceChangeColor(getPriceChange(alert.cryptoId))}`}>
                          {getPriceChangeIcon(getPriceChange(alert.cryptoId))}
                          <span>{formatPercentage(getPriceChange(alert.cryptoId))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        alert.enabled
                          ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                          : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={alert.enabled ? 'Desativar' : 'Ativar'}
                    >
                      {alert.enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => editAlert(alert)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;
