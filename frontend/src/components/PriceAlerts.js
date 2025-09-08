import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, Trash, CheckCircle, XCircle
} from 'lucide-react';
import cryptoService from '../services/cryptoService';

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [formData, setFormData] = useState({
    cryptoId: '',
    condition: 'above',
    price: '',
    description: '',
    enabled: true
  });

  const popularCryptos = useMemo(() => [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🟡' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '●' }
  ], []);

  const loadAlerts = () => {
    const savedAlerts = JSON.parse(localStorage.getItem('cryptoPriceAlerts') || '[]');
    setAlerts(savedAlerts);
  };

  const triggerAlert = useCallback((alert, currentPrice) => {
    // Marcar como acionado
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
  }, [alerts]);

  const checkAlerts = useCallback(() => {
    alerts.forEach(alert => {
      if (!alert.enabled) return;
      
      const currentPrice = cryptoPrices[alert.cryptoId];
      if (!currentPrice) return;

      const shouldTrigger = alert.condition === 'above' 
        ? currentPrice >= parseFloat(alert.price)
        : currentPrice <= parseFloat(alert.price);

      if (shouldTrigger && !alert.triggered) {
        triggerAlert(alert, currentPrice);
      }
    });
  }, [alerts, cryptoPrices, triggerAlert]);

  const loadCryptoPrices = useCallback(async () => {
    try {
      const symbols = popularCryptos.map(crypto => crypto.id);
      const result = await cryptoService.getCryptoPrices(symbols);
      setCryptoPrices(result.prices || {});
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    }
  }, [popularCryptos]);

  useEffect(() => {
    loadAlerts();
    loadCryptoPrices();
    const interval = setInterval(loadCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, [loadCryptoPrices]);

  useEffect(() => {
    checkAlerts();
  }, [cryptoPrices, alerts, checkAlerts]);

  const saveAlert = () => {
    if (!formData.cryptoId || !formData.price) return;

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
    
    setFormData({
      cryptoId: '',
      condition: 'above',
      price: '',
      description: '',
      enabled: true
    });
    setShowForm(false);
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(new Date(date));
  };

  const getCryptoInfo = (cryptoId) => {
    return popularCryptos.find(crypto => crypto.id === cryptoId);
  };

  const getAlertStatus = (alert) => {
    const currentPrice = cryptoPrices[alert.cryptoId];
    if (!currentPrice) return 'loading';
    
    if (alert.triggered) return 'triggered';
    
    const shouldTrigger = alert.condition === 'above' 
      ? currentPrice >= alert.price
      : currentPrice <= alert.price;
    
    return shouldTrigger ? 'active' : 'waiting';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 p-2 rounded-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Alertas de Preço</h2>
            <p className="text-gray-600">Monitore preços de criptomoedas</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Alerta
        </button>
      </div>

      {/* Formulário de Novo Alerta */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Novo Alerta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criptomoeda
                </label>
                <select
                  value={formData.cryptoId}
                  onChange={(e) => setFormData({ ...formData, cryptoId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Selecione uma criptomoeda</option>
                  {popularCryptos.map(crypto => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.icon} {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condição
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="above">Acima de</option>
                  <option value="below">Abaixo de</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Ex: 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Ex: Bitcoin acima de 50k"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">Ativo</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveAlert}
                disabled={!formData.cryptoId || !formData.price}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Criar Alerta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum alerta criado</h3>
            <p className="text-gray-600">Crie seu primeiro alerta para monitorar preços de criptomoedas.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const cryptoInfo = getCryptoInfo(alert.cryptoId);
            const currentPrice = cryptoPrices[alert.cryptoId];
            const status = getAlertStatus(alert);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cryptoInfo?.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {cryptoInfo?.name} ({cryptoInfo?.symbol})
                        </h4>
                        <p className="text-sm text-gray-600">
                          {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'} {formatPrice(alert.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'loading' && (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                      )}
                      {status === 'waiting' && (
                        <div className="w-4 h-4 bg-gray-300 rounded-full" />
                      )}
                      {status === 'active' && (
                        <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                      )}
                      {status === 'triggered' && (
                        <div className="w-4 h-4 bg-green-500 rounded-full" />
                      )}
                      
                      <span className={`text-sm font-medium ${
                        status === 'triggered' ? 'text-green-600' :
                        status === 'active' ? 'text-yellow-600' :
                        status === 'waiting' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {status === 'triggered' ? 'Acionado' :
                         status === 'active' ? 'Ativo' :
                         status === 'waiting' ? 'Aguardando' : 'Carregando'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentPrice && (
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(currentPrice)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Preço atual
                        </p>
                      </div>
                    )}

                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          alert.enabled 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {alert.enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {alert.description && (
                  <p className="text-sm text-gray-600 mt-2">{alert.description}</p>
                )}

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Criado em {formatTime(alert.createdAt)}</span>
                  {alert.triggeredAt && (
                    <span>Acionado em {formatTime(alert.triggeredAt)}</span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;