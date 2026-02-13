import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import cotacoesService from '../services/cotacoesService';
import useAnalytics from '../hooks/useAnalytics';

const AgriculturalQuotesWidget = () => {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { trackQuoteView } = useAnalytics();

  // Produtos agrícolas principais
  const mainProducts = [
    { key: 'soja', name: 'Soja', unit: 'sc/60kg' },
    { key: 'milho', name: 'Milho', unit: 'sc/60kg' },
    { key: 'cafe', name: 'Café', unit: 'sc/60kg' },
    { key: 'algodao', name: 'Algodão', unit: 'lb' },
    { key: 'arroz', name: 'Arroz', unit: 'sc/50kg' },
    { key: 'trigo', name: 'Trigo', unit: 'sc/60kg' }
  ];

  useEffect(() => {
    loadQuotes();

    // Atualizar automaticamente a cada 5 minutos
    const interval = setInterval(() => {
      loadQuotes(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadQuotes = async (silent = false) => {
    if (!silent) setLoading(true);
    if (silent) setUpdating(true);

    try {
      // Usar dados frescos sempre
      const result = await cotacoesService.getCotacoesFresh(mainProducts.map(p => p.key));

      if (result.success) {
        setQuotes(result.data);
        setLastUpdate(new Date());

        // Rastrear visualização de cotações
        Object.entries(result.data).forEach(([productKey, productData]) => {
          if (productData && productData.price) {
            trackQuoteView(productKey, productData.price, 'widget_home');
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar cotações:', error);
      // Não usar fallback, mostrar erro
      setQuotes({});
      setLastUpdate(null);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPriceChange = (productKey) => {
    const product = quotes[productKey];
    if (!product || !product.previousPrice) return null;

    const change = product.price - product.previousPrice;
    const changePercent = ((change / product.previousPrice) * 100);

    return {
      value: change,
      percent: changePercent,
      isPositive: change >= 0
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign size={20} />
            Cotações Agrícolas
          </h3>
          <div className="animate-spin">
            <RefreshCw size={16} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mainProducts.map((product) => (
            <div key={product.key} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <DollarSign size={20} />
          Cotações Agrícolas
        </h3>
        <div className="flex items-center gap-2">
          {updating && (
            <div className="animate-spin">
              <RefreshCw size={14} className="text-blue-500" />
            </div>
          )}
          <button
            onClick={() => loadQuotes()}
            disabled={updating}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Atualizar
          </button>
        </div>
      </div>

      {lastUpdate && (
        <p className="text-xs text-gray-500 mb-4">
          Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mainProducts.map((product) => {
          const quote = quotes[product.key];
          const change = getPriceChange(product.key);

          return (
            <motion.div
              key={product.key}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {product.name}
                </span>
                {change && (
                  <div className={`flex items-center gap-1 text-xs ${
                    change.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change.isPositive ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {change.percent > 0 ? '+' : ''}{change.percent.toFixed(2)}%
                  </div>
                )}
              </div>

              <div className="text-lg font-bold text-gray-900">
                {quote ? formatPrice(quote.price) : '--'}
              </div>

              <div className="text-xs text-gray-500">
                {product.unit}
              </div>

              {change && (
                <div className={`text-xs mt-1 ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change.isPositive ? '+' : ''}{formatPrice(change.value)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Dados atualizados automaticamente • Fonte: CEPEA e Agrolink
        </p>
      </div>
    </motion.div>
  );
};

export default AgriculturalQuotesWidget;