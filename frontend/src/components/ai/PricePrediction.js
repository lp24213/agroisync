import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Filter, Download, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const PricePrediction = () => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [predictions, setPredictions] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [confidence, setConfidence] = useState(0);

  // Produtos disponíveis
  const products = React.useMemo(() => [
    { id: 'soja', name: 'Soja', unit: 'sc' },
    { id: 'milho', name: 'Milho', unit: 'sc' },
    { id: 'trigo', name: 'Trigo', unit: 'sc' },
    { id: 'cafe', name: 'Café', unit: 'sc' },
    { id: 'algodao', name: 'Algodão', unit: 'kg' },
    { id: 'acucar', name: 'Açúcar', unit: 'kg' }
  ], []);

  // Regiões disponíveis
  const regions = React.useMemo(() => [
    { id: 'sp', name: 'São Paulo' },
    { id: 'pr', name: 'Paraná' },
    { id: 'rs', name: 'Rio Grande do Sul' },
    { id: 'mg', name: 'Minas Gerais' },
    { id: 'mt', name: 'Mato Grosso' },
    { id: 'go', name: 'Goiás' }
  ], []);

  // Períodos disponíveis
  const periods = React.useMemo(() => [
    { id: '7', name: '7 dias' },
    { id: '30', name: '30 dias' },
    { id: '90', name: '90 dias' },
    { id: '180', name: '180 dias' },
    { id: '365', name: '1 ano' }
  ], []);

  // Carregar previsões
  const loadPredictions = useCallback(async () => {
    if (!selectedProduct || !selectedRegion) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/price-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          product: selectedProduct,
          region: selectedRegion,
          period: parseInt(selectedPeriod)
        })
      });

      const data = await response.json();

      if (data.success) {
        setPredictions(data.predictions);
        setHistoricalData(data.historicalData);
        setConfidence(data.confidence);
        
        analytics.trackEvent('price_prediction_generated', {
          product: selectedProduct,
          region: selectedRegion,
          period: selectedPeriod,
          confidence: data.confidence
        });
      } else {
        setError(data.message || t('ai.predictionError', 'Erro ao gerar previsão'));
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
      setError(t('ai.networkError', 'Erro de conexão'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, selectedRegion, selectedPeriod, analytics, t]);

  // Carregar previsões quando parâmetros mudarem
  useEffect(() => {
    if (selectedProduct && selectedRegion) {
      loadPredictions();
    }
  }, [selectedProduct, selectedRegion, selectedPeriod, loadPredictions]);

  // Exportar dados
  const exportData = useCallback(() => {
    if (!predictions) return;

    const data = {
      product: products.find(p => p.id === selectedProduct)?.name,
      region: regions.find(r => r.id === selectedRegion)?.name,
      period: periods.find(p => p.id === selectedPeriod)?.name,
      predictions: predictions,
      historicalData: historicalData,
      confidence: confidence,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-prediction-${selectedProduct}-${selectedRegion}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    analytics.trackEvent('price_prediction_exported', {
      product: selectedProduct,
      region: selectedRegion
    });
  }, [predictions, historicalData, confidence, selectedProduct, selectedRegion, selectedPeriod, products, regions, periods, analytics]);

  // Compartilhar previsão
  const sharePrediction = useCallback(async () => {
    if (!predictions) return;

    const shareData = {
      title: t('ai.shareTitle', 'Previsão de Preços - AgroSync'),
      text: t('ai.shareText', 'Confira a previsão de preços para {product} em {region}', {
        product: products.find(p => p.id === selectedProduct)?.name,
        region: regions.find(r => r.id === selectedRegion)?.name
      }),
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        analytics.trackEvent('price_prediction_shared', {
          product: selectedProduct,
          region: selectedRegion
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(shareData.url);
      alert(t('ai.linkCopied', 'Link copiado para a área de transferência'));
    }
  }, [predictions, selectedProduct, selectedRegion, products, regions, t, analytics]);


  // Calcular cor da confiança
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('ai.pricePrediction', 'Previsão de Preços')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('ai.pricePredictionSubtitle', 'Análise inteligente de tendências de preços')}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
            title={t('ai.filters', 'Filtros')}
          >
            <Filter className="w-5 h-5" />
          </button>

          {predictions && (
            <>
              <button
                onClick={exportData}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                title={t('ai.export', 'Exportar')}
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={sharePrediction}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                title={t('ai.share', 'Compartilhar')}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ai.product', 'Produto')}
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('ai.selectProduct', 'Selecione um produto')}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ai.region', 'Região')}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t('ai.selectRegion', 'Selecione uma região')}</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('ai.period', 'Período')}
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-agro-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              {t('ai.generatingPrediction', 'Gerando previsão...')}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Previsões */}
      {predictions && !isLoading && (
        <div className="space-y-6">
          {/* Resumo da previsão */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('ai.predictionSummary', 'Resumo da Previsão')}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('ai.confidence', 'Confiança')}:
                </span>
                <span className={`font-medium ${getConfidenceColor(confidence)}`}>
                  {confidence}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  R$ {predictions.currentPrice?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('ai.currentPrice', 'Preço Atual')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  R$ {predictions.predictedPrice?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('ai.predictedPrice', 'Preço Previsto')}
                </div>
              </div>

              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  predictions.change > 0 ? 'text-green-600' : 
                  predictions.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {predictions.change > 0 ? '+' : ''}{predictions.change.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('ai.expectedChange', 'Mudança Esperada')}
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de tendências */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('ai.priceTrend', 'Tendência de Preços')}
            </h3>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {historicalData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(data.price / Math.max(...historicalData.map(d => d.price))) * 200}px` }}
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {new Date(data.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">
                    R$ {data.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Análise detalhada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('ai.factors', 'Fatores de Influência')}
              </h3>
              <div className="space-y-3">
                {predictions.factors?.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {factor.name}
                    </span>
                    <span className={`text-sm font-medium ${
                      factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('ai.recommendations', 'Recomendações')}
              </h3>
              <div className="space-y-3">
                {predictions.recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aviso de responsabilidade */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  {t('ai.disclaimer', 'Aviso de Responsabilidade')}
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {t('ai.disclaimerText', 'As previsões são baseadas em análise de dados históricos e fatores de mercado. Não constituem garantia de preços futuros. Sempre consulte fontes adicionais antes de tomar decisões de investimento.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado inicial */}
      {!selectedProduct || !selectedRegion ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('ai.selectFilters', 'Selecione os filtros')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('ai.selectFiltersDescription', 'Escolha um produto e uma região para gerar a previsão de preços')}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default PricePrediction;
