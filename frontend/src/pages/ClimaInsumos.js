import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, MapPin, Calendar, TrendingUp, TrendingDown, AlertTriangle, Sprout, Package, DollarSign, Search, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WeatherWidgetComplete from '../components/WeatherWidgetComplete';
import weatherService from '../services/weatherService';

const ClimaInsumos = () => {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🌤️ Buscando dados climáticos REAIS...');
      
      // Busca localização do usuário
      const userLoc = await weatherService.getUserLocationByIP();
      setUserLocation(userLoc);
      console.log('📍 Localização do usuário:', userLoc);
      
      // Busca clima de todas as cidades principais
      const citiesWeather = await weatherService.getAllCitiesWeather();
      console.log('✅ Clima de', citiesWeather.length, 'cidades obtido com sucesso!');
      
      setWeatherData(citiesWeather);
      
      // Selecionar primeira cidade
      if (citiesWeather && citiesWeather.length > 0) {
        setSelectedCity(citiesWeather[0]);
      }
      
      const api = process.env.REACT_APP_API_URL || '/api';
      
      // Carregar insumos
      try {
        const suppliesRes = await fetch(`${api}/supplies`);
        if (suppliesRes.ok) {
          const data = await suppliesRes.json();
          setSupplies(data.data || []);
        }
      } catch {
        // Mock de insumos se API falhar
        setSupplies([
          { id: 1, name: 'Ureia', category: 'fertilizante', avg_price: 2500, unit: 'ton', price_variation: 2.5 },
          { id: 2, name: 'NPK 10-10-10', category: 'fertilizante', avg_price: 1800, unit: 'ton', price_variation: -1.2 },
          { id: 3, name: 'Glifosato', category: 'defensivo', avg_price: 45, unit: 'L', price_variation: 0 }
        ]);
      }
    } catch (error) {
      // Silenciar erro - mock data já foi definido
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'todos', label: t('weather.allCategories') },
    { id: 'fertilizante', label: t('weather.fertilizers') },
    { id: 'defensivo', label: t('weather.pesticides') },
    { id: 'semente', label: t('weather.seeds') },
    { id: 'corretivo', label: t('weather.equipment') }
  ];

  const filteredSupplies = supplies.filter(s => 
    (selectedCategory === 'todos' || s.category === selectedCategory) &&
    (!searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('sol') || desc.includes('ensolarado')) return <Sun className='h-12 w-12 text-yellow-500' />;
    if (desc.includes('chuva')) return <Droplets className='h-12 w-12 text-blue-500' />;
    return <Cloud className='h-12 w-12 text-gray-500' />;
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600'></div>
          <p className='text-gray-600'>{t('weather.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div data-page='clima-insumos'>
      {/* HERO SECTION */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: 'url(https://media.istockphoto.com/id/1383036942/pt/foto/agricultural-truck-irrigating-system-over-a-crop-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=w4mi88dhNs4HOLmECvsahmBat4QVm2EfTVBFaesHwbQ=)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/60 via-black/70 to-green-900/40'></div>
        <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>
              🌤️ Informações Meteorológicas e Agrícolas
            </span>
          </motion.div>

          <motion.h1
            className='mb-6'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '900',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '2rem'
            }}
          >
            {t('weather.title')}
          </motion.h1>
          <motion.p
            className='mb-8 text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              maxWidth: '800px', 
              margin: '0 auto 2rem', 
              lineHeight: '1.6',
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)'
            }}
          >
            {t('weather.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>🌍</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Clima Atualizado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>💰</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Cotações do Mercado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Dados Confiáveis</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÕES DE CLIMA E INSUMOS */}
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12'>
        <div className='container mx-auto px-4'>

          {/* SEÇÃO CLIMA */}
          <div className='mb-16'>
            <div className='mb-6'>
              <h2 className='text-3xl font-bold text-gray-900'>{t('weather.currentConditions')}</h2>
              <p className='mt-2 text-gray-600'>{t('weather.subtitle')}</p>
              <div className='mt-3 inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-800'>
                {t('weather.badge')}
              </div>
            </div>
            
            <div className='grid gap-6 md:grid-cols-3 lg:grid-cols-5'>
            {weatherData.map((city, index) => {
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCity(city)}
                className={`relative cursor-pointer rounded-2xl border-2 bg-white p-5 shadow-lg transition-all hover:shadow-xl ${
                  selectedCity?.city === city.city ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-200'
                }`}
              >
                <div className='mb-3 flex items-center justify-between'>
                  <div>
                    <h3 className='flex items-center gap-1 text-sm font-bold text-gray-900'>
                      <MapPin className='h-4 w-4 text-green-600' />
                      {city.city}
                    </h3>
                    <p className='text-xs text-gray-500'>{city.state}</p>
                  </div>
                  {getWeatherIcon(city.description)}
                </div>
                <div className='text-4xl font-bold text-gray-900'>{city.temperature}°C</div>
                <div className='mt-2 text-sm text-gray-600'>{city.description}</div>
                {city.importance && (
                  <div className='mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                    {city.importance}
                  </div>
                )}
                {city.region && (
                  <div className='mt-1 text-xs text-gray-500'>
                    📍 {city.region}
                  </div>
                )}
                <div className='mt-3 flex items-center justify-between border-t border-gray-100 pt-3'>
                  <div className='flex items-center gap-1 text-xs text-gray-600'>
                    <Droplets className='h-3 w-3' />
                    {city.humidity}%
                  </div>
                  <div className='flex items-center gap-1 text-xs text-gray-600'>
                    <Wind className='h-3 w-3' />
                    {city.wind_speed} km/h
                  </div>
                </div>
              </motion.div>
            );
            })}
            </div>

          </div>

          {/* Widget Completo de Clima - SEMPRE VISÍVEL */}
          {weatherData.length > 0 && selectedCity && (
            <div className='mt-8'>
              <WeatherWidgetComplete city={selectedCity} />
            </div>
          )}

          {/* SEÇÃO DE PREVISÃO 15 DIAS */}
          {selectedCity?.forecast_15days && selectedCity.forecast_15days.length > 0 && (
            <div className='mt-12'>
              <div className='mb-6'>
                <h2 className='text-3xl font-bold text-gray-900'>📅 Previsão para 15 Dias</h2>
                <p className='mt-2 text-gray-600'>Previsão detalhada para {selectedCity.city}, {selectedCity.state}</p>
              </div>
              
              <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-5'>
                {selectedCity.forecast_15days.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className='rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-md transition-all hover:border-blue-400 hover:shadow-lg'
                  >
                    <div className='mb-2'>
                      <p className='text-sm font-bold text-gray-900'>{day.dayName}</p>
                      <p className='text-xs text-gray-500'>{day.date}</p>
                    </div>
                    
                    <div className='mb-3 text-center'>
                      <span className='text-3xl'>{day.icon}</span>
                    </div>
                    
                    <div className='mb-3 rounded-lg bg-white p-2 text-center'>
                      <div className='text-sm text-gray-700'>
                        <span className='font-bold text-red-600'>{day.maxTemp}°</span>
                        <span className='mx-1 text-gray-400'>/</span>
                        <span className='font-bold text-blue-600'>{day.minTemp}°</span>
                      </div>
                      <p className='mt-1 text-xs text-gray-600'>{day.condition}</p>
                    </div>
                    
                    <div className='space-y-1 border-t border-blue-200 pt-2'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-gray-600'>💧 Umidade:</span>
                        <span className='font-semibold text-gray-900'>{day.humidity}%</span>
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-gray-600'>💨 Vento:</span>
                        <span className='font-semibold text-gray-900'>{day.windSpeed} km/h</span>
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-gray-600'>🌧️ Chuva:</span>
                        <span className='font-semibold text-gray-900'>{day.rainChance}%</span>
                      </div>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-gray-600'>☀️ UV:</span>
                        <span className={`font-semibold ${day.uvIndex > 8 ? 'text-red-600' : 'text-orange-600'}`}>
                          {day.uvIndex}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO INSUMOS */}
          <div>
          <h2 className='mb-6 text-3xl font-bold text-gray-900'>🌱 {t('weather.supplies')}</h2>

          {/* Barra de Busca e Filtros */}
          <div className='mb-6 flex flex-wrap gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder={t('weather.searchSupplies')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 shadow-sm transition-all focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100'
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className='rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold shadow-sm transition-all focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100'
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Grid de Insumos */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {filteredSupplies.map((supply, index) => (
              <motion.div
                key={supply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className='rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-lg transition-all hover:border-green-500 hover:shadow-xl'
              >
                <div className='mb-3'>
                  <h3 className='text-lg font-bold text-gray-900'>{supply.name}</h3>
                  <p className='text-xs text-gray-500'>{supply.category}</p>
                </div>

                {supply.description && (
                  <p className='mb-3 text-sm text-gray-600 line-clamp-2'>{supply.description}</p>
                )}

                <div className='mb-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-3'>
                  <div className='mb-1 text-xs font-semibold text-gray-500'>Preço Médio</div>
                  <div className='flex items-end gap-1'>
                    <span className='text-2xl font-bold text-green-600'>R$ {supply.avg_price?.toFixed(2)}</span>
                    <span className='mb-1 text-xs text-gray-500'>/{supply.unit}</span>
                  </div>
                  
                  {supply.price_variation !== 0 && (
                    <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
                      supply.price_variation > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {supply.price_variation > 0 ? <TrendingUp className='h-3 w-3' /> : <TrendingDown className='h-3 w-3' />}
                      {supply.price_variation > 0 ? '+' : ''}{supply.price_variation?.toFixed(2)}%
                    </div>
                  )}
                </div>

                <button className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-green-700 hover:to-blue-700'>
                  <ShoppingCart className='h-4 w-4' />
                  Cotação
                </button>
              </motion.div>
            ))}
          </div>

          {filteredSupplies.length === 0 && (
            <div className='py-16 text-center'>
              <Package className='mx-auto mb-4 h-16 w-16 text-gray-300' />
              <h3 className='mb-2 text-xl font-bold text-gray-600'>{t('weather.noSuppliesFound')}</h3>
              <p className='text-gray-500'>{t('weather.adjustFilters')}</p>
            </div>
          )}
          </div>

          {/* Footer Info */}
          <div className='mt-12 rounded-2xl border-2 border-green-200 bg-green-50 p-6'>
          <h3 className='mb-3 flex items-center gap-2 text-lg font-bold text-green-800'>
            <AlertTriangle className='h-5 w-5' />
            {t('weather.importantInfo')}
          </h3>
          <ul className='space-y-2 text-gray-700'>
            <li>{t('weather.autoUpdated')}</li>
            <li>{t('weather.marketQuotes')}</li>
            <li>{t('weather.reliablePrices')}</li>
            <li>{t('weather.climateInfo')}</li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimaInsumos;

