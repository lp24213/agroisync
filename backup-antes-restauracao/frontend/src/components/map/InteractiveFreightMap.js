import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck, Navigation, Clock, Eye, EyeOff, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useTheme } from '../../contexts/ThemeContext';

const InteractiveFreightMap = ({
  freightId,
  driverId,
  origin,
  destination,
  isRealTime = true,
  showControls = true,
  height = '500px'
}) => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const { isDark } = useTheme();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTracking, setIsTracking] = useState(isRealTime);
  const [driverLocation, setDriverLocation] = useState(null);
  const [, setRoutePolyline] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const initializeMap = useCallback(async () => {
    try {
      // Carregar Leaflet dinamicamente
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      // Configurar ícones padrão
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
      });

      // Criar mapa
      const mapInstance = L.map(mapRef.current, {
        center: [-15.7801, -47.9292], // Brasília como centro padrão
        zoom: 6,
        zoomControl: false,
        attributionControl: false
      });

      // Adicionar camadas de mapa
      const lightTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });

      const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO'
      });

      // Adicionar camada base
      if (isDark) {
        darkTileLayer.addTo(mapInstance);
      } else {
        lightTileLayer.addTo(mapInstance);
      }

      // Controles de zoom
      L.control
        .zoom({
          position: 'topright'
        })
        .addTo(mapInstance);

      // Controle de atribuição
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false
        })
        .addTo(mapInstance);

      setMap(mapInstance);
      setIsLoading(false);

      analytics.trackEvent('map_initialized', {
        freight_id: freightId,
        is_dark_mode: isDark
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Erro ao carregar o mapa');
      setIsLoading(false);
    }
  }, [isDark, freightId, analytics]);

  const addMarkersToMap = useCallback(
    async freightData => {
      if (!map) return;

      // Carregar Leaflet dinamicamente
      const L = await import('leaflet');

      // Limpar marcadores existentes
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Marcador de origem
      const originIcon = L.divIcon({
        className: 'custom-marker origin-marker',
        html: '<div class="marker-content"><MapPin className="w-5 h-5" /></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const originMarker = L.marker([freightData.origin.lat, freightData.origin.lng], {
        icon: originIcon
      }).addTo(map);

      originMarker.bindPopup(`
      <div class="marker-popup">
        <h3>Origem</h3>
        <p>${freightData.origin.address}</p>
      </div>
    `);

      // Marcador de destino
      const destinationIcon = L.divIcon({
        className: 'custom-marker destination-marker',
        html: '<div class="marker-content"><MapPin className="w-5 h-5" /></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      const destinationMarker = L.marker([freightData.destination.lat, freightData.destination.lng], {
        icon: destinationIcon
      }).addTo(map);

      destinationMarker.bindPopup(`
      <div class="marker-popup">
        <h3>Destino</h3>
        <p>${freightData.destination.address}</p>
      </div>
    `);

      // Ajustar visualização para mostrar ambos os marcadores
      const group = new L.featureGroup([originMarker, destinationMarker]);
      map.fitBounds(group.getBounds().pad(0.1));
    },
    [map]
  );

  const calculateRoute = useCallback(
    async (origin, destination) => {
      try {
        // Carregar Leaflet dinamicamente
        const L = await import('leaflet');

        // Simular cálculo de rota (em produção, usar serviço de roteamento)
        const routeCoordinates = [
          [origin.lat, origin.lng],
          [-23.2, -46.5],
          [-22.8, -45.0],
          [-22.5, -44.0],
          [destination.lat, destination.lng]
        ];

        const routePolyline = L.polyline(routeCoordinates, {
          color: '#00ffbf',
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        setRoutePolyline(routePolyline);

        analytics.trackEvent('route_calculated', {
          freight_id: freightId,
          route_points: routeCoordinates.length
        });
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    },
    [map, freightId, analytics]
  );

  const updateEstimatedArrival = useCallback(
    location => {
      if (!estimatedArrival) return;

      // Simular recálculo do tempo estimado
      const remainingDistance = Math.random() * 100; // km
      const averageSpeed = 60; // km/h
      const remainingTime = (remainingDistance / averageSpeed) * 60; // minutos

      const newArrival = new Date(Date.now() + remainingTime * 60 * 1000);
      setEstimatedArrival(newArrival);
    },
    [estimatedArrival]
  );

  const updateDriverLocation = useCallback(async () => {
    try {
      // Carregar Leaflet dinamicamente
      const L = await import('leaflet');

      // Simular atualização de localização (em produção, viria da API)
      const newLocation = {
        lat: -22.9068 + (Math.random() - 0.5) * 0.01,
        lng: -43.1729 + (Math.random() - 0.5) * 0.01,
        timestamp: new Date(),
        speed: Math.floor(Math.random() * 80) + 20,
        heading: Math.floor(Math.random() * 360)
      };

      setDriverLocation(newLocation);

      if (map) {
        // Remover marcador anterior do motorista
        map.eachLayer(layer => {
          if (layer.options && layer.options.className === 'driver-marker') {
            map.removeLayer(layer);
          }
        });

        // Adicionar novo marcador do motorista
        const driverIcon = L.divIcon({
          className: 'custom-marker driver-marker',
          html: `
            <div class="marker-content driver">
              <Truck className="w-5 h-5" />
              <div class="pulse-ring"></div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });

        const driverMarker = L.marker([newLocation.lat, newLocation.lng], {
          icon: driverIcon
        }).addTo(map);

        driverMarker.bindPopup(`
          <div class="marker-popup driver">
            <h3>Motorista</h3>
            <p><strong>Nome:</strong> ${driverInfo?.name || 'N/A'}</p>
            <p><strong>Veículo:</strong> ${driverInfo?.vehicle || 'N/A'}</p>
            <p><strong>Velocidade:</strong> ${newLocation.speed} km/h</p>
            <p><strong>Última atualização:</strong> ${newLocation.timestamp.toLocaleTimeString()}</p>
          </div>
        `);

        // Atualizar rota estimada
        updateEstimatedArrival(newLocation);
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  }, [map, driverInfo, updateEstimatedArrival]);

  const loadFreightData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Simular dados do frete (em produção, viria da API)
      const freightData = {
        id: freightId,
        origin: {
          lat: -23.5505,
          lng: -46.6333,
          address: 'São Paulo, SP'
        },
        destination: {
          lat: -22.9068,
          lng: -43.1729,
          address: 'Rio de Janeiro, RJ'
        },
        driver: {
          id: driverId,
          name: 'João Silva',
          phone: '(11) 99999-9999',
          vehicle: 'Scania R450',
          plate: 'ABC-1234'
        },
        status: 'in_transit',
        estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 horas
      };

      setDriverInfo(freightData.driver);
      setEstimatedArrival(freightData.estimatedArrival);

      // Adicionar marcadores ao mapa
      if (map) {
        addMarkersToMap(freightData);
        calculateRoute(freightData.origin, freightData.destination);
      }

      analytics.trackEvent('freight_data_loaded', {
        freight_id: freightId,
        origin: freightData.origin.address,
        destination: freightData.destination.address
      });
    } catch (error) {
      console.error('Error loading freight data:', error);
      setError('Erro ao carregar dados do frete');
    } finally {
      setIsLoading(false);
    }
  }, [freightId, driverId, map, analytics, addMarkersToMap, calculateRoute]);

  // Inicializar mapa
  useEffect(() => {
    if (mapRef.current && !map) {
      initializeMap();
    }
  }, [map, initializeMap]);

  // Carregar dados do frete
  useEffect(() => {
    if (freightId) {
      loadFreightData();
    }
  }, [freightId, loadFreightData]);

  // Rastreamento em tempo real
  useEffect(() => {
    let interval;
    if (isTracking && driverId) {
      interval = setInterval(updateDriverLocation, 5000); // Atualizar a cada 5 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, driverId, updateDriverLocation]);

  const toggleTracking = useCallback(() => {
    setIsTracking(!isTracking);
    analytics.trackEvent('tracking_toggled', {
      freight_id: freightId,
      is_tracking: !isTracking
    });
  }, [isTracking, freightId, analytics]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    analytics.trackEvent('map_fullscreen_toggled', {
      freight_id: freightId,
      is_fullscreen: !isFullscreen
    });
  }, [isFullscreen, freightId, analytics]);

  const refreshLocation = useCallback(() => {
    if (isTracking) {
      updateDriverLocation();
      analytics.trackEvent('location_refreshed', { freight_id: freightId });
    }
  }, [isTracking, updateDriverLocation, freightId, analytics]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center' style={{ height }}>
        <div className='text-center'>
          <div className='bg-agro-emerald mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
          </div>
          <p className='text-xl text-gray-600 dark:text-gray-300'>{t('map.loading', 'Carregando mapa...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center' style={{ height }}>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100'>
            <MapPin className='h-8 w-8 text-red-600' />
          </div>
          <p className='text-xl text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Controles do mapa */}
      {showControls && (
        <div className='absolute right-4 top-4 z-10 flex flex-col space-y-2'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTracking}
            className={`rounded-lg p-3 shadow-lg transition-colors ${
              isTracking
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            title={
              isTracking ? t('map.stopTracking', 'Parar rastreamento') : t('map.startTracking', 'Iniciar rastreamento')
            }
          >
            {isTracking ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshLocation}
            className='rounded-lg bg-white p-3 text-gray-700 shadow-lg transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            title={t('map.refresh', 'Atualizar localização')}
          >
            <RefreshCw className='h-5 w-5' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className='rounded-lg bg-white p-3 text-gray-700 shadow-lg transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            title={isFullscreen ? t('map.exitFullscreen', 'Sair da tela cheia') : t('map.fullscreen', 'Tela cheia')}
          >
            {isFullscreen ? <Minimize2 className='h-5 w-5' /> : <Maximize2 className='h-5 w-5' />}
          </motion.button>
        </div>
      )}

      {/* Informações do frete */}
      <div className='absolute left-4 top-4 z-10 max-w-sm rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800'>
        <div className='mb-3 flex items-center'>
          <Truck className='mr-2 h-5 w-5 text-blue-600' />
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            {t('map.freightInfo', 'Informações do Frete')}
          </h3>
        </div>

        {driverInfo && (
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600 dark:text-gray-400'>{t('map.driver', 'Motorista')}:</span>
              <span className='text-gray-900 dark:text-white'>{driverInfo.name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 dark:text-gray-400'>{t('map.vehicle', 'Veículo')}:</span>
              <span className='text-gray-900 dark:text-white'>{driverInfo.vehicle}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600 dark:text-gray-400'>{t('map.plate', 'Placa')}:</span>
              <span className='text-gray-900 dark:text-white'>{driverInfo.plate}</span>
            </div>
          </div>
        )}

        {driverLocation && (
          <div className='mt-3 border-t border-gray-200 pt-3 dark:border-gray-700'>
            <div className='mb-2 flex items-center'>
              <Navigation className='mr-2 h-4 w-4 text-green-600' />
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {t('map.currentLocation', 'Localização Atual')}
              </span>
            </div>
            <div className='space-y-1 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-400'>{t('map.speed', 'Velocidade')}:</span>
                <span className='text-gray-900 dark:text-white'>{driverLocation.speed} km/h</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 dark:text-gray-400'>{t('map.lastUpdate', 'Última atualização')}:</span>
                <span className='text-gray-900 dark:text-white'>{driverLocation.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {estimatedArrival && (
          <div className='mt-3 border-t border-gray-200 pt-3 dark:border-gray-700'>
            <div className='mb-2 flex items-center'>
              <Clock className='mr-2 h-4 w-4 text-orange-600' />
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {t('map.estimatedArrival', 'Chegada Estimada')}
              </span>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{estimatedArrival.toLocaleString('pt-BR')}</p>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div ref={mapRef} className='w-full rounded-lg shadow-lg' style={{ height: isFullscreen ? '100vh' : height }} />

      {/* Status de rastreamento */}
      <AnimatePresence>
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='absolute bottom-4 left-4 z-10 flex items-center rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg'
          >
            <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-white'></div>
            <span className='text-sm font-medium'>{t('map.trackingActive', 'Rastreamento ativo')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS para marcadores */}
      <style jsx>{`
        .custom-marker {
          background: transparent;
          border: none;
        }

        .marker-content {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .origin-marker .marker-content {
          background: #3b82f6;
        }

        .destination-marker .marker-content {
          background: #ef4444;
        }

        .driver-marker .marker-content {
          background: #10b981;
          position: relative;
        }

        .driver-marker .pulse-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .marker-popup {
          min-width: 200px;
        }

        .marker-popup h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .marker-popup p {
          margin: 4px 0;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default InteractiveFreightMap;
