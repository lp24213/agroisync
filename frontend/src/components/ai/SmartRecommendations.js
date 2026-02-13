import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Share2,
  BarChart3,
  Package,
  Truck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MapPin,
  RefreshCw,
  Filter,
  Heart,
  Star,
  Clock,
  Eye
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getApiUrl } from '../../config/constants';

const defaultAnalytics = {
  trackEvent: () => {},
  trackPageView: () => {},
  trackConversion: () => {},
  trackError: () => {},
  trackPerformance: () => {},
  trackUserInteraction: () => {},
  trackFunnelStep: () => {}
};

const SmartRecommendations = () => {
  const { t } = useTranslation();
  const analyticsFromHook = useAnalytics();
  const analytics = useMemo(
    () => analyticsFromHook || defaultAnalytics,
    [analyticsFromHook]
  );
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // INICIALIZAÇÃO SEGURA: Criar Sets imediatamente com valores válidos
  // Usar useRef para evitar problemas de serialização do React
  const savedRecommendationsRef = useRef(new Set());
  const viewedRecommendationsRef = useRef(new Set());
  const isMountedRef = useRef(false);
  const [, forceUpdate] = useState(0);

  // Função helper para garantir que sempre retornamos um Set válido
  const getSavedSet = useCallback(() => {
    // GUARD CLAUSE: Se não existe ou não é Set, criar novo
    if (!savedRecommendationsRef.current || !(savedRecommendationsRef.current instanceof Set)) {
      savedRecommendationsRef.current = new Set();
    }
    return savedRecommendationsRef.current;
  }, []);

  const getViewedSet = useCallback(() => {
    // GUARD CLAUSE: Se não existe ou não é Set, criar novo
    if (!viewedRecommendationsRef.current || !(viewedRecommendationsRef.current instanceof Set)) {
      viewedRecommendationsRef.current = new Set();
    }
    return viewedRecommendationsRef.current;
  }, []);

  // Função para forçar re-render quando Sets mudarem
  const triggerUpdate = useCallback(() => {
    if (isMountedRef.current) {
      forceUpdate(prev => prev + 1);
    }
  }, []);

  // Inicializar após montagem - garantir que Sets estão válidos
  useEffect(() => {
    isMountedRef.current = true;
    // Garantir que os Sets estão inicializados ANTES de qualquer uso
    if (!savedRecommendationsRef.current || !(savedRecommendationsRef.current instanceof Set)) {
      savedRecommendationsRef.current = new Set();
    }
    if (!viewedRecommendationsRef.current || !(viewedRecommendationsRef.current instanceof Set)) {
      viewedRecommendationsRef.current = new Set();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
      const response = await fetch(getApiUrl('/ai/recommendations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          category: selectedCategory,
          userPreferences: JSON.parse(localStorage.getItem('userPreferences') || '{}')
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations || []);

        if (analytics && analytics.trackEvent) {
          analytics.trackEvent('recommendations_loaded', {
            category: selectedCategory,
            count: (data.recommendations || []).length
          });
        }
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, analytics]);

  // Carregar recomendações quando categoria mudar
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Salvar/remover recomendação
  const toggleSavedRecommendation = useCallback(
    recommendationId => {
      try {
        // Proteção máxima: nunca permitir que savedRecommendationsRef.current seja undefined ou inválido
        if (!savedRecommendationsRef.current || typeof savedRecommendationsRef.current.add !== 'function') {
          savedRecommendationsRef.current = new Set();
        }
        let safeSet = savedRecommendationsRef.current;
        // fallback redundante
        if (!safeSet || typeof safeSet.add !== 'function') {
          safeSet = new Set();
          savedRecommendationsRef.current = safeSet;
        }
        if (!safeSet.has || !safeSet.delete) {
          safeSet = new Set();
          savedRecommendationsRef.current = safeSet;
        }
        const wasSaved = safeSet.has(recommendationId);
        if (wasSaved) {
          safeSet.delete(recommendationId);
        } else {
          safeSet.add(recommendationId);
        }
        triggerUpdate();
        if (analytics && analytics.trackEvent) {
          analytics.trackEvent('recommendation_saved', {
            recommendation_id: recommendationId,
            action: safeSet.has(recommendationId) ? 'saved' : 'unsaved'
          });
        }
      } catch (error) {
        console.error('Erro ao salvar recomendação:', error);
      }
    },
    [analytics, triggerUpdate]
  );

  // Marcar como visualizada
  const markAsViewed = useCallback(
    recommendationId => {
      try {
        // Proteção máxima: nunca permitir que viewedRecommendationsRef.current seja undefined ou inválido
        if (!viewedRecommendationsRef.current || typeof viewedRecommendationsRef.current.add !== 'function') {
          viewedRecommendationsRef.current = new Set();
        }
        let safeViewedSet = viewedRecommendationsRef.current;
        // fallback redundante
        if (!safeViewedSet || typeof safeViewedSet.add !== 'function') {
          safeViewedSet = new Set();
          viewedRecommendationsRef.current = safeViewedSet;
        }
        if (!safeViewedSet.has || !safeViewedSet.add) {
          safeViewedSet = new Set();
          viewedRecommendationsRef.current = safeViewedSet;
        }
        if (!safeViewedSet.has(recommendationId)) {
          safeViewedSet.add(recommendationId);
          triggerUpdate();
        }
        if (analytics && analytics.trackEvent) {
          analytics.trackEvent('recommendation_viewed', {
            recommendation_id: recommendationId
          });
        }
      } catch (error) {
        console.error('Erro ao marcar como visualizada:', error);
      }
    },
    [analytics, triggerUpdate]
  );

  // Compartilhar recomendação
  const shareRecommendation = useCallback(
    async recommendation => {
      const shareData = {
        title: t('recommendations.shareTitle', 'Recomendação AGROISYNC'),
        text: recommendation.title,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          if (analytics && analytics.trackEvent) {
            analytics.trackEvent('recommendation_shared', {
              recommendation_id: recommendation.id
            });
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        navigator.clipboard.writeText(shareData.text);
        alert(t('recommendations.copied', 'Recomendação copiada para a área de transferência'));
      }
    },
    [t, analytics]
  );

  // Obter ícone da categoria
  const getCategoryIcon = category => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || BarChart3;
  };

  // Obter cor da categoria
  const getCategoryColor = category => {
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
  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className='h-4 w-4 text-green-600' />;
      case 'down':
        return <TrendingDown className='h-4 w-4 text-red-600' />;
      default:
        return <BarChart3 className='h-4 w-4 text-gray-600' />;
    }
  };

  // Filtrar recomendações
  const filteredRecommendations = (recommendations || []).filter(
    rec => selectedCategory === 'all' || rec.category === selectedCategory
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {t('recommendations.title', 'Recomendações Inteligentes')}
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            {t('recommendations.subtitle', 'Sugestões personalizadas baseadas em IA')}
          </p>
        </div>

        <div className='mt-4 flex items-center space-x-3 sm:mt-0'>
          <button
            onClick={loadRecommendations}
            disabled={isLoading}
            className='rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            title={t('recommendations.refresh', 'Atualizar')}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className='rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            title={t('recommendations.filters', 'Filtros')}
          >
            <Filter className='h-5 w-5' />
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
            className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
          >
            <div className='flex flex-wrap gap-2'>
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
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
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='bg-agro-emerald mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg'>
              <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
            </div>
            <p className='text-xl text-gray-600 dark:text-gray-300'>
              {t('recommendations.loading', 'Carregando recomendações...')}
            </p>
          </div>
        </div>
      )}

      {/* Recomendações */}
      {!isLoading && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredRecommendations.map(recommendation => {
            const CategoryIcon = getCategoryIcon(recommendation.category);
            // GUARD CLAUSE: Garantir que Sets são válidos antes de usar .has()
            const savedSet = getSavedSet();
            const viewedSet = getViewedSet();
            const isSaved = savedSet && savedSet instanceof Set ? savedSet.has(recommendation.id) : false;
            const isViewed = viewedSet && viewedSet instanceof Set ? viewedSet.has(recommendation.id) : false;

            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className={`cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 ${
                  isViewed ? 'opacity-75' : ''
                }`}
                onClick={() => markAsViewed(recommendation.id)}
              >
                {/* Header */}
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex items-center space-x-2'>
                    <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900'>
                      <CategoryIcon className='h-4 w-4 text-blue-600' />
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(recommendation.category)}`}
                    >
                      {categories.find(c => c.id === recommendation.category)?.name}
                    </span>
                  </div>

                  <div className='flex items-center space-x-1'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSavedRecommendation(recommendation.id);
                      }}
                      className={`rounded p-1 transition-colors ${
                        isSaved ? 'text-red-600 hover:text-red-700' : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        shareRecommendation(recommendation);
                      }}
                      className='rounded p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300'
                    >
                      <Share2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className='space-y-3'>
                  <h3 className='line-clamp-2 font-semibold text-gray-900 dark:text-white'>{recommendation.title}</h3>

                  <p className='line-clamp-3 text-sm text-gray-600 dark:text-gray-400'>{recommendation.description}</p>

                  {/* Métricas */}
                  {recommendation.metrics && (
                    <div className='flex items-center space-x-4 text-sm'>
                      {recommendation.metrics.confidence && (
                        <div className='flex items-center space-x-1'>
                          <Star className='h-4 w-4 text-yellow-500' />
                          <span className='text-gray-600 dark:text-gray-400'>{recommendation.metrics.confidence}%</span>
                        </div>
                      )}

                      {recommendation.metrics.trend && (
                        <div className='flex items-center space-x-1'>
                          {getTrendIcon(recommendation.metrics.trend)}
                          <span className='text-gray-600 dark:text-gray-400'>
                            {t(`trends.${recommendation.metrics.trend}`, recommendation.metrics.trend)}
                          </span>
                        </div>
                      )}

                      {recommendation.metrics.potential && (
                        <div className='flex items-center space-x-1'>
                          <DollarSign className='h-4 w-4 text-green-600' />
                          <span className='text-gray-600 dark:text-gray-400'>+{recommendation.metrics.potential}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className='flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700'>
                    <div className='flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500'>
                      <Clock className='h-3 w-3' />
                      <span>{new Date(recommendation.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <div className='flex items-center space-x-2'>
                      {recommendation.actions?.map((action, index) => (
                        <button
                          key={index}
                          onClick={e => {
                            e.stopPropagation();
                            if (analytics && analytics.trackEvent) {
                              analytics.trackEvent('recommendation_action', {
                                recommendation_id: recommendation.id,
                                action: action.type
                              });
                            }
                          }}
                          className='rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
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
        <div className='rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800'>
          <Lightbulb className='mx-auto mb-4 h-16 w-16 text-gray-400' />
          <h3 className='mb-2 text-lg font-medium text-gray-900 dark:text-white'>
            {t('recommendations.noRecommendations', 'Nenhuma recomendação encontrada')}
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            {t(
              'recommendations.noRecommendationsDescription',
              'Tente alterar os filtros ou aguarde novas recomendações'
            )}
          </p>
        </div>
      )}

      {/* Estatísticas */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900'>
              <Lightbulb className='h-5 w-5 text-blue-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {t('recommendations.total', 'Total')}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>{recommendations.length}</p>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-green-100 p-2 dark:bg-green-900'>
              <Eye className='h-5 w-5 text-green-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {t('recommendations.viewed', 'Visualizadas')}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {(() => {
                  const set = getViewedSet();
                  return set && set instanceof Set ? set.size : 0;
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-red-100 p-2 dark:bg-red-900'>
              <Heart className='h-5 w-5 text-red-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {t('recommendations.saved', 'Salvas')}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {(() => {
                  const set = getSavedSet();
                  return set && set instanceof Set ? set.size : 0;
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-purple-100 p-2 dark:bg-purple-900'>
              <TrendingUp className='h-5 w-5 text-purple-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {t('recommendations.accuracy', 'Precisão')}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>87%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
