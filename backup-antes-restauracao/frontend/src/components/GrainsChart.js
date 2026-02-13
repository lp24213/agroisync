import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, MapPin, RefreshCw } from 'lucide-react';
import cotacoesService from '../services/cotacoesService';
import weatherService from '../services/weatherService';

const GrainsChart = () => {
  const { t } = useTranslation();
  const [grainsData, setGrainsData] = useState([]);
  const [userLocation, setUserLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchGrainsData();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchGrainsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchGrainsData = async () => {
    try {
      // 1. DETECTAR LOCALIZAÇÃO DO USUÁRIO (GPS ou IP)
      let userRegion = 'Mato Grosso';
      let userCity = 'Sinop';
      let userState = 'MT';

      try {
        // Tentar detectar localização real
        const location = await weatherService.getUserLocation();
        if (location && location.city) {
          userCity = location.city;
          userState = location.state || userState;
          // Salvar no localStorage para cache
          localStorage.setItem('userLocation', JSON.stringify({
            city: userCity,
            state: userState,
            region: userRegion
          }));
        }
      } catch (err) {
        // Silenciar erro de geolocalização - usar fallback
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Erro ao obter localização:', err);
        }
        // Tentar pegar do localStorage como fallback
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          try {
            const loc = JSON.parse(savedLocation);
            userCity = loc.city || userCity;
            userState = loc.state || userState;
            userRegion = loc.region || userRegion;
          } catch (e) {
            // Ignorar erro de parse de localização
          }
        }
      }

      // 2. BUSCAR COTAÇÕES REAIS DA API (sem fallback)
      const result = await cotacoesService.getCotacoes(['soja', 'milho', 'cafe', 'trigo', 'boi-gordo', 'leite']);
      if (result.success && result.data && Object.keys(result.data).length > 0) {
        // Mapear dados da API para o formato do componente
        const produtos = [
          { id: 'soja', nome: 'Soja', icone: '🫘' },
          { id: 'milho', nome: 'Milho', icone: '🌽' },
          { id: 'cafe', nome: 'Café', icone: '☕' },
          { id: 'trigo', nome: 'Trigo', icone: '🌾' },
          { id: 'boi-gordo', nome: 'Boi Gordo', icone: '🐂' },
          { id: 'leite', nome: 'Leite', icone: '🥛' }
        ];

        const regionalData = produtos.map(prod => {
          const cotacao = result.data[prod.id];
          if (!cotacao) return null;

          return {
            grain: prod.nome,
            icone: prod.icone,
            price: cotacao.preco,
            change: cotacao.preco * (cotacao.variacao / 100), // Valor absoluto da mudança
            changePercent: cotacao.variacao,
            region: userRegion,
            unit: cotacao.unidade || 'saca',
            fonte: cotacao.fonte || 'CEPEA'
          };
        }).filter(Boolean); // Remover nulls

        setGrainsData(regionalData);
        setUserLocation(`${userCity}, ${userState}`);
        setLastUpdate(new Date());
        setLoading(false);
      } else {
        // Se não retornou dados, mostrar mensagem mas não usar fallback
        setGrainsData([]);
        setUserLocation(userLocation || 'Brasil');
        setLastUpdate(new Date());
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      // Não usar fallback, apenas dados reais
      setGrainsData([]);
      setUserLocation(userLocation || 'Brasil');
      setLastUpdate(new Date());
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='mb-6 rounded-2xl bg-white p-6 shadow-lg'>
        <div className='flex items-center justify-center gap-2'>
          <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300'></div>
          <span className='text-gray-600'>Carregando cotações reais...</span>
        </div>
      </div>
    );
  }

  if (grainsData.length === 0) {
    return (
      <div className='mb-6 rounded-2xl bg-white p-6 shadow-lg'>
        <div className='text-center'>
          <p className='text-gray-600 mb-2'>Não foi possível carregar cotações no momento.</p>
          <button
            onClick={fetchGrainsData}
            className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto'
          >
            <RefreshCw className='h-4 w-4' />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='grains-chart mb-6 rounded-2xl bg-white p-6 shadow-lg'
    >
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600'>
            <TrendingUp className='h-5 w-5 text-white' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900'>{t('grains.realTimeQuotes')}</h3>
            <div className='flex items-center gap-1 text-sm text-gray-600'>
              <MapPin className='h-4 w-4' />
              <span>{userLocation || 'Brasil'}</span>
            </div>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-xs text-gray-500'>
            {lastUpdate ? (
              <>{t('grains.updated')} {new Date(lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</>
            ) : (
              <>{t('grains.updatedNow')}</>
            )}
          </p>
          <p className='text-xs text-gray-400'>
            {t('grains.source')}: {grainsData[0]?.fonte?.toUpperCase() || 'CEPEA/Agrolink'}
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchGrainsData();
            }}
            className='text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1'
            aria-label={t('grains.refreshQuotes')}
          >
            <RefreshCw className='h-3 w-3' />
            {t('grains.refresh')}
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        {grainsData.map((grain, index) => (
          <motion.div
            key={grain.grain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className='flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 cursor-pointer'
            whileHover={{ scale: 1.02 }}
            onClick={() => window.location.href = `/marketplace?categoria=graos&produto=${grain.grain.toLowerCase()}`}
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm'>
                <span
                  className='text-2xl'
                  role='img'
                  aria-label={grain.grain}
                  title={grain.grain}
                >
                  {grain.icone}
                </span>
              </div>
              <div>
                <p className='font-semibold text-gray-900'>{grain.grain}</p>
                <p className='text-xs text-gray-500'>
                  {grain.region} • por {grain.unit}
                </p>
              </div>
            </div>

            <div className='text-right'>
              <p className='text-lg font-bold text-gray-900' suppressHydrationWarning>
                R$ {grain.price.toFixed(2)}
              </p>
              <div className='flex items-center gap-1 justify-end'>
                {grain.changePercent >= 0 ? (
                  <TrendingUp className='h-4 w-4 text-green-500' />
                ) : (
                  <TrendingDown className='h-4 w-4 text-red-500' />
                )}
                <span 
                  className={`text-sm font-medium ${grain.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                  suppressHydrationWarning
                >
                  {grain.changePercent >= 0 ? '+' : ''}
                  {grain.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className='mt-6 border-t border-gray-200 pt-4'>
        <p className='text-center text-xs text-gray-500'>
          {t('grains.realTimeUpdate')}
        </p>
        <p className='text-center text-xs text-gray-400 mt-1'>
          {t('grains.source')}: CEPEA/ESALQ • B3 • Agrolink
        </p>
      </div>
    </motion.div>
  );
};

export default GrainsChart;
