import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  List, 
  Filter, 
  Search, 
  Truck, 
  Clock, 
  MapPin, 
  Navigation,
  Eye,
  EyeOff,
  Layers,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import InteractiveFreightMap from './InteractiveFreightMap';

const FreightMapDashboard = () => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [viewMode, setViewMode] = useState('map'); // 'map' ou 'list'
  const [selectedFreight, setSelectedFreight] = useState(null);
  const [freights, setFreights] = useState([]);
  const [filteredFreights, setFilteredFreights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Carregar fretes
  useEffect(() => {
    loadFreights();
  }, []);

  // Filtros
  useEffect(() => {
    applyFilters();
  }, [freights, searchTerm, statusFilter]);

  // Auto refresh
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadFreights();
      }, 30000); // Atualizar a cada 30 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadFreights = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simular dados de fretes (em produção, viria da API)
      const mockFreights = [
        {
          id: '1',
          origin: 'São Paulo, SP',
          destination: 'Rio de Janeiro, RJ',
          driver: {
            id: 'driver1',
            name: 'João Silva',
            phone: '(11) 99999-9999',
            vehicle: 'Scania R450',
            plate: 'ABC-1234'
          },
          status: 'in_transit',
          progress: 65,
          estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000),
          cargo: 'Soja',
          weight: '25 ton',
          value: 15000,
          coordinates: {
            origin: { lat: -23.5505, lng: -46.6333 },
            destination: { lat: -22.9068, lng: -43.1729 },
            current: { lat: -22.8000, lng: -44.0000 }
          }
        },
        {
          id: '2',
          origin: 'Brasília, DF',
          destination: 'Belo Horizonte, MG',
          driver: {
            id: 'driver2',
            name: 'Maria Santos',
            phone: '(11) 88888-8888',
            vehicle: 'Volvo FH',
            plate: 'DEF-5678'
          },
          status: 'loading',
          progress: 0,
          estimatedArrival: new Date(Date.now() + 6 * 60 * 60 * 1000),
          cargo: 'Milho',
          weight: '30 ton',
          value: 18000,
          coordinates: {
            origin: { lat: -15.7801, lng: -47.9292 },
            destination: { lat: -19.9167, lng: -43.9345 },
            current: { lat: -15.7801, lng: -47.9292 }
          }
        },
        {
          id: '3',
          origin: 'Curitiba, PR',
          destination: 'Porto Alegre, RS',
          driver: {
            id: 'driver3',
            name: 'Pedro Oliveira',
            phone: '(11) 77777-7777',
            vehicle: 'Mercedes Actros',
            plate: 'GHI-9012'
          },
          status: 'delivered',
          progress: 100,
          estimatedArrival: new Date(Date.now() - 2 * 60 * 60 * 1000),
          cargo: 'Trigo',
          weight: '20 ton',
          value: 12000,
          coordinates: {
            origin: { lat: -25.4244, lng: -49.2654 },
            destination: { lat: -30.0346, lng: -51.2177 },
            current: { lat: -30.0346, lng: -51.2177 }
          }
        }
      ];

      setFreights(mockFreights);
      analytics.trackEvent('freights_loaded', { count: mockFreights.length });

    } catch (error) {
      console.error('Error loading freights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [analytics]);

  const applyFilters = useCallback(() => {
    let filtered = freights;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(freight => 
        freight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.cargo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(freight => freight.status === statusFilter);
    }

    setFilteredFreights(filtered);
  }, [freights, searchTerm, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loading':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_transit':
        return <Navigation className="w-4 h-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'loading':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'loading':
        return t('freight.status.loading', 'Carregando');
      case 'in_transit':
        return t('freight.status.inTransit', 'Em trânsito');
      case 'delivered':
        return t('freight.status.delivered', 'Entregue');
      case 'cancelled':
        return t('freight.status.cancelled', 'Cancelado');
      default:
        return t('freight.status.unknown', 'Desconhecido');
    }
  };

  const selectFreight = (freight) => {
    setSelectedFreight(freight);
    setViewMode('map');
    analytics.trackEvent('freight_selected', { freight_id: freight.id });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
    analytics.trackEvent('view_mode_changed', { mode: viewMode === 'map' ? 'list' : 'map' });
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    analytics.trackEvent('auto_refresh_toggled', { enabled: !autoRefresh });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-agro-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            {t('map.loadingFreights', 'Carregando fretes...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('map.dashboard', 'Dashboard de Fretes')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('map.dashboardSubtitle', 'Acompanhe seus fretes em tempo real')}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={toggleAutoRefresh}
            className={`p-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            title={autoRefresh ? t('map.disableAutoRefresh', 'Desativar atualização automática') : t('map.enableAutoRefresh', 'Ativar atualização automática')}
          >
            <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
            title={t('map.filters', 'Filtros')}
          >
            <Filter className="w-5 h-5" />
          </button>

          <button
            onClick={toggleViewMode}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
            title={viewMode === 'map' ? t('map.showList', 'Mostrar lista') : t('map.showMap', 'Mostrar mapa')}
          >
            {viewMode === 'map' ? <List className="w-5 h-5" /> : <Map className="w-5 h-5" />}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('map.search', 'Buscar')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('map.searchPlaceholder', 'Buscar por origem, destino, motorista...')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('map.status', 'Status')}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">{t('map.allStatuses', 'Todos os status')}</option>
                  <option value="loading">{t('freight.status.loading', 'Carregando')}</option>
                  <option value="in_transit">{t('freight.status.inTransit', 'Em trânsito')}</option>
                  <option value="delivered">{t('freight.status.delivered', 'Entregue')}</option>
                  <option value="cancelled">{t('freight.status.cancelled', 'Cancelado')}</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  {t('map.clearFilters', 'Limpar filtros')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          {/* Mapa */}
          {selectedFreight ? (
            <InteractiveFreightMap
              freightId={selectedFreight.id}
              driverId={selectedFreight.driver.id}
              origin={selectedFreight.origin}
              destination={selectedFreight.destination}
              isRealTime={true}
              height="600px"
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('map.selectFreight', 'Selecione um frete')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('map.selectFreightDescription', 'Escolha um frete da lista para visualizar no mapa')}
              </p>
            </div>
          )}

          {/* Lista de fretes para seleção */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('map.freightsList', 'Lista de Fretes')}
              </h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFreights.map((freight) => (
                <motion.div
                  key={freight.id}
                  whileHover={{ backgroundColor: 'rgba(0, 255, 191, 0.05)' }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedFreight?.id === freight.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => selectFreight(freight)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Truck className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {freight.origin} → {freight.destination}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(freight.status)}`}>
                          {getStatusText(freight.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{freight.driver.name}</span>
                        <span>{freight.vehicle}</span>
                        <span>{freight.cargo}</span>
                        <span>R$ {freight.value.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {freight.progress}% {t('map.complete', 'concluído')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {freight.estimatedArrival.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Lista de fretes */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreights.map((freight) => (
            <motion.div
              key={freight.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => selectFreight(freight)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(freight.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(freight.status)}`}>
                    {getStatusText(freight.status)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{freight.id}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{t('map.route', 'Rota')}</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {freight.origin} → {freight.destination}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Truck className="w-4 h-4" />
                    <span>{t('map.driver', 'Motorista')}</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {freight.driver.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {freight.vehicle} - {freight.plate}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>{t('map.cargo', 'Carga')}</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {freight.cargo} - {freight.weight}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('map.value', 'Valor')}
                    </span>
                    <span className="font-bold text-green-600">
                      R$ {freight.value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('map.totalFreights', 'Total de Fretes')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {freights.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('map.delivered', 'Entregues')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {freights.filter(f => f.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Navigation className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('map.inTransit', 'Em Trânsito')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {freights.filter(f => f.status === 'in_transit').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('map.loading', 'Carregando')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {freights.filter(f => f.status === 'loading').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightMapDashboard;
