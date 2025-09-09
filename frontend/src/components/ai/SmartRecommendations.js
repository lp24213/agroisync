import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Bookmark, Share2, BarChart3, Package, Truck, DollarSign, TrendingUp, TrendingDown, MapPin, RefreshCw, Filter, Heart, Star, Clock, Eye } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const SmartRecommendations = () => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState(new Set());
  const [viewedRecommendations, setViewedRecommendations] = useState(new Set());

  // Categorias de recomendações
  const categories = [
    { id: 'all', name: t('recommendations.all', 'Todas'), icon: BarChart3 },
    { id: 'products', name: t('recommendations.products', 'Produtos'), icon: Package },
    { id: 'freights', name: t('recommendations.freights', 'Fretes'), icon: Truck },
    { id: 'pricing', name: t('recommendations.pricing', 'Preços'), icon: DollarSign },
    { id: 'market', name: t('recommendations.market', 'Mercado'), icon: TrendingUp },
    { id: 'logistics', name: t('recommendations.logistics', 'Logística'), icon: MapPin }
  ];

  // Carregar recomendações
  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          category: selectedCategory,
          userPreferences: JSON.parse(localStorage.getItem('userPreferences') || '{}')
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
        
        analytics.trackEvent('recommendations_loaded', {
          category: selectedCategory,
          count: data.recommendations.length
        });
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
setIsLoading(false);
    }
  }, [selectedCategory, analytics]);

  // Carregar recomendações quando categoria mudar
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Salvar/remover recomendação
  const toggleSavedRecommendation = useCallback((recommendationId) => {
    const newSaved = new Set(savedRecommendations);
    if (newSaved.has(recommendationId)) {
      newSaved.delete(recommendationId);
    } else {
      newSaved.add(recommendationId);
    }
    setSavedRecommendations(newSaved);

    analytics.trackEvent('recommendation_saved', {
      recommendation_id: recommendationId,
      action: newSaved.has(recommendationId) ? 'saved' : 'unsaved'
    });
  }, [savedRecommendations, analytics]);

  // Marcar como visualizada
  const markAsViewed = useCallback((recommendationId) => {
    setViewedRecommendations(prev => new Set([...prev, recommendationId]));
    
    analytics.trackEvent('recommendation_viewed', {
      recommendation_id: recommendationId
    });
  }, [analytics]);

  // Compartilhar recomendação
  const shareRecommendation = useCallback(async (recommendation) => {
    const shareData = {
      title: t('recommendations.shareTitle', 'Recomendação AgroSync'),
      text: recommendation.title,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        analytics.trackEvent('recommendation_shared', {
          recommendation_id: recommendation.id
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert(t('recommendations.copied', 'Recomendação copiada para a área de transferência'));
    }
  }, [t, analytics]);

  // Obter ícone da categoria
  const getCategoryIcon = (category) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || BarChart3;
  };

  // Obter cor da categoria
  const getCategoryColor = (category) => {
    const colors = {
      products: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      freights: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pricing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      market: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      logistics: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  // Obter ícone de tendência
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filtrar recomendações
  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('recommendations.title', 'Recomendações Inteligentes')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('recommendations.subtitle', 'Sugestões personalizadas baseadas em IA')}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={loadRecommendations}
            disabled={isLoading}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors disabled:opacity-50"
            title={t('recommendations.refresh', 'Atualizar')}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
            title={t('recommendations.filters', 'Filtros')}
          >
            <Filter className="w-5 h-5" />
          </button>
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
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
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
              {t('recommendations.loading', 'Carregando recomendações...')}
            </p>
          </div>
        </div>
      )}

      {/* Recomendações */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => {
            const CategoryIcon = getCategoryIcon(recommendation.category);
            const isSaved = savedRecommendations.has(recommendation.id);
            const isViewed = viewedRecommendations.has(recommendation.id);

            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  isViewed ? 'opacity-75' : ''
                }`}
                onClick={() => markAsViewed(recommendation.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <CategoryIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(recommendation.category)}`}>
                      {categories.find(c => c.id === recommendation.category)?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavedRecommendation(recommendation.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        isSaved 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareRecommendation(recommendation);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {recommendation.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {recommendation.description}
                  </p>

                  {/* Métricas */}
                  {recommendation.metrics && (
                    <div className="flex items-center space-x-4 text-sm">
                      {recommendation.metrics.confidence && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {recommendation.metrics.confidence}%
                          </span>
                        </div>
                      )}
                      
                      {recommendation.metrics.trend && (
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(recommendation.metrics.trend)}
                          <span className="text-gray-600 dark:text-gray-400">
                            {t(`trends.${recommendation.metrics.trend}`, recommendation.metrics.trend)}
                          </span>
                        </div>
                      )}
                      
                      {recommendation.metrics.potential && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600 dark:text-gray-400">
                            +{recommendation.metrics.potential}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(recommendation.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {recommendation.actions?.map((action, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Implementar ação específica
                            analytics.trackEvent('recommendation_action', {
                              recommendation_id: recommendation.id,
                              action: action.type
                            });
                          }}
                          className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Estado vazio */}
      {!isLoading && filteredRecommendations.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('recommendations.noRecommendations', 'Nenhuma recomendação encontrada')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('recommendations.noRecommendationsDescription', 'Tente alterar os filtros ou aguarde novas recomendações')}
          </p>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('recommendations.total', 'Total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {recommendations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('recommendations.viewed', 'Visualizadas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewedRecommendations.size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('recommendations.saved', 'Salvas')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {savedRecommendations.size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('recommendations.accuracy', 'Precisão')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                87%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
