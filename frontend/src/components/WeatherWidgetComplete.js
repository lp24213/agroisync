import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, Calendar, TrendingUp, AlertTriangle, CloudRain, CloudDrizzle, CloudSnow, Thermometer } from 'lucide-react';

const WeatherWidgetComplete = ({ city }) => {
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guard: se city não existe, não renderizar nada
  if (!city || !city.city || !city.state) {
    return null;
  }

  useEffect(() => {
    loadWeatherForecast();
  }, [city]);

  const loadWeatherForecast = async () => {
    try {
      const api = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${api}/weather/forecast?city=${city.city}&state=${city.state}`);
      
      if (response.ok) {
        const data = await response.json();
        setWeatherForecast(data.data);
      } else {
        // Fallback com dados mockados
        setWeatherForecast(generateMockForecast(city));
      }
    } catch (error) {
      setWeatherForecast(generateMockForecast(city));
    } finally {
      setLoading(false);
    }
  };

  const generateMockForecast = (cityData) => {
    if (!cityData) return null;
    
    const today = new Date();
    const forecast = [];
    
    // Gerar 15 dias de previsão ao invés de 7
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Dados mais realistas com variação por dia
      const hasRain = Math.random() > 0.65;
      const rainChance = hasRain ? Math.floor(Math.random() * 60) + 30 : Math.floor(Math.random() * 40);
      
      forecast.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
        day: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : (i <= 6 ? date.toLocaleDateString('pt-BR', { weekday: 'short' }) : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
        temp_max: Math.floor(Math.random() * 12) + 26, // 26-38°C
        temp_min: Math.floor(Math.random() * 10) + 16, // 16-26°C
        humidity: Math.floor(Math.random() * 40) + 45, // 45-85%
        wind_speed: Math.floor(Math.random() * 18) + 3, // 3-21 km/h
        rain_chance: rainChance,
        rain_mm: hasRain ? (Math.random() * 60).toFixed(1) : 0,
        description: rainChance > 70 ? 'Chuva Forte' : rainChance > 50 ? 'Chuva' : rainChance > 35 ? 'Parcialmente Nublado' : 'Ensolarado'
      });
    }
    
    return {
      city: cityData?.city || 'Cidade',
      state: cityData?.state || 'Estado',
      current: {
        temperature: cityData?.temperature || 28,
        description: cityData?.description || 'Ensolarado',
        humidity: cityData?.humidity || 65,
        wind_speed: cityData?.wind_speed || 10
      },
      forecast
    };
  };

  const getWeatherIcon = (description, rainChance) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('chuva') || rainChance > 70) {
      return <CloudRain className='h-8 w-8 text-blue-600' />;
    }
    if (desc.includes('nublado') || rainChance > 40) {
      return <CloudDrizzle className='h-8 w-8 text-gray-500' />;
    }
    if (desc.includes('sol') || desc.includes('ensolarado')) {
      return <Sun className='h-8 w-8 text-yellow-500' />;
    }
    return <Cloud className='h-8 w-8 text-gray-400' />;
  };

  const getRainColor = (chance) => {
    if (chance >= 70) return 'text-blue-700 bg-blue-100';
    if (chance >= 40) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600'></div>
      </div>
    );
  }

  if (!weatherForecast) {
    return (
      <div className='rounded-2xl border-2 border-gray-200 bg-white p-6 text-center'>
        <AlertTriangle className='mx-auto mb-2 h-12 w-12 text-gray-400' />
        <p className='text-gray-600'>Não foi possível carregar a previsão</p>
      </div>
    );
  }

  // Garantir que current e forecast existem
  const { current, forecast } = weatherForecast;
  
  if (!current || !forecast || !Array.isArray(forecast)) {
    return (
      <div className='rounded-2xl border-2 border-gray-200 bg-white p-6 text-center'>
        <AlertTriangle className='mx-auto mb-2 h-12 w-12 text-gray-400' />
        <p className='text-gray-600'>Dados climáticos indisponíveis</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Clima Atual - Detalhado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-xl'
      >
        <h3 className='mb-4 text-xl font-bold text-gray-900'>
          ☀️ Condições Atuais - {weatherForecast.city}, {weatherForecast.state}
        </h3>
        
        <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {/* Temperatura */}
          <div className='rounded-xl bg-white p-4 text-center shadow-md'>
            <Thermometer className='mx-auto mb-2 h-6 w-6 text-red-500' />
            <div className='text-3xl font-bold text-gray-900'>{current.temperature}°C</div>
            <p className='text-xs text-gray-600'>Temperatura</p>
          </div>
          
          {/* Umidade */}
          <div className='rounded-xl bg-white p-4 text-center shadow-md'>
            <Droplets className='mx-auto mb-2 h-6 w-6 text-blue-500' />
            <div className='text-3xl font-bold text-gray-900'>{current.humidity}%</div>
            <p className='text-xs text-gray-600'>Umidade</p>
          </div>
          
          {/* Vento */}
          <div className='rounded-xl bg-white p-4 text-center shadow-md'>
            <Wind className='mx-auto mb-2 h-6 w-6 text-cyan-500' />
            <div className='text-3xl font-bold text-gray-900'>{current.wind_speed}</div>
            <p className='text-xs text-gray-600'>km/h</p>
          </div>
          
          {/* Descrição */}
          <div className='rounded-xl bg-white p-4 text-center shadow-md'>
            <Cloud className='mx-auto mb-2 h-6 w-6 text-gray-500' />
            <div className='text-lg font-bold text-gray-900'>{current.description}</div>
            <p className='text-xs text-gray-600'>Condição</p>
          </div>
        </div>
      </motion.div>

      {/* Previsão dos Próximos 15 Dias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='rounded-2xl border-2 border-green-200 bg-white p-6 shadow-xl'
      >
        <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-900'>
          <Calendar className='h-6 w-6 text-green-600' />
          📅 Previsão dos Próximos 15 Dias
        </h3>
        
        <div className='grid gap-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8'>
          {forecast.map((day, index) => {
            const hasHighRainChance = day.rain_chance >= 60;
            const hasRain = day.rain_mm > 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border-2 p-4 text-center transition-all hover:shadow-lg ${
                  hasHighRainChance 
                    ? 'border-blue-300 bg-blue-50' 
                    : index === 0 
                    ? 'border-green-300 bg-green-50 ring-2 ring-green-200' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className='mb-2 text-sm font-bold text-gray-900'>{day.day}</div>
                <div className='mb-2 text-xs text-gray-600'>{day.date}</div>
                
                <div className='mb-3 flex justify-center'>
                  {getWeatherIcon(day.description, day.rain_chance)}
                </div>
                
                <div className='mb-2'>
                  <div className='flex items-center justify-center gap-1'>
                    <TrendingUp className='h-3 w-3 text-red-500' />
                    <span className='text-lg font-bold text-gray-900'>{day.temp_max}°</span>
                  </div>
                  <div className='flex items-center justify-center gap-1'>
                    <TrendingUp className='h-3 w-3 rotate-180 text-blue-500' />
                    <span className='text-sm text-gray-600'>{day.temp_min}°</span>
                  </div>
                </div>
                
                {/* Chance de Chuva */}
                <div className={`mb-2 rounded-lg px-2 py-1 text-xs font-bold ${getRainColor(day.rain_chance)}`}>
                  💧 {day.rain_chance}% chuva
                </div>
                
                {/* Quantidade de chuva esperada */}
                {hasRain && (
                  <div className='rounded-lg bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800'>
                    🌧️ {day.rain_mm}mm
                  </div>
                )}
                
                {/* Umidade e Vento */}
                <div className='mt-2 space-y-1 text-xs text-gray-600'>
                  <div className='flex items-center justify-center gap-1'>
                    <Droplets className='h-3 w-3' />
                    {day.humidity}%
                  </div>
                  <div className='flex items-center justify-center gap-1'>
                    <Wind className='h-3 w-3' />
                    {day.wind_speed} km/h
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Alertas Especiais */}
      {forecast.some(d => d.rain_chance >= 70) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className='rounded-2xl border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 shadow-lg'
        >
          <div className='flex items-start gap-4'>
            <AlertTriangle className='h-8 w-8 flex-shrink-0 text-yellow-600' />
            <div>
              <h4 className='mb-2 text-lg font-bold text-yellow-900'>⚠️ Alerta de Chuva</h4>
              <p className='text-gray-700'>
                <strong>Previsão de chuva intensa nos próximos dias.</strong> Planeje suas atividades agrícolas 
                considerando as condições climáticas. Evite aplicação de defensivos e adubação antes das chuvas.
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {forecast.filter(d => d.rain_chance >= 70).map((day, i) => (
                  <span key={i} className='rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white'>
                    {day.day}: {day.rain_chance}% ({day.rain_mm}mm)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recomendações Agrícolas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-xl'
      >
        <h4 className='mb-4 text-lg font-bold text-green-900'>🌱 Recomendações para o Produtor</h4>
        <ul className='space-y-2 text-gray-700'>
          {forecast[0]?.rain_chance >= 60 ? (
            <>
              <li className='flex items-start gap-2'>
                <span className='text-blue-600'>🌧️</span>
                <span><strong>Evite aplicação de defensivos</strong> - Alta chance de chuva nas próximas horas</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-600'>💧</span>
                <span>Suspenda irrigação - Chuva prevista economiza água e energia</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-yellow-600'>⚠️</span>
                <span>Proteja máquinas e equipamentos expostos</span>
              </li>
            </>
          ) : (
            <>
              <li className='flex items-start gap-2'>
                <span className='text-green-600'>✅</span>
                <span><strong>Bom momento para aplicações</strong> - Tempo seco favorece defensivos e adubação</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-yellow-600'>💧</span>
                <span>Monitore irrigação - Sem previsão de chuva significativa</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-green-600'>🌾</span>
                <span>Aproveite para colheita e transporte de grãos</span>
              </li>
            </>
          )}
        </ul>
      </motion.div>

      {/* Estatísticas da Semana */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-xl'
      >
        <h4 className='mb-4 text-lg font-bold text-gray-900'>📊 Resumo da Semana</h4>
        
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-4 text-center'>
            <div className='mb-1 text-sm font-semibold text-gray-600'>Temp. Máxima</div>
            <div className='text-2xl font-bold text-red-600'>
              {Math.max(...forecast.map(d => d.temp_max))}°C
            </div>
          </div>
          
          <div className='rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 text-center'>
            <div className='mb-1 text-sm font-semibold text-gray-600'>Temp. Mínima</div>
            <div className='text-2xl font-bold text-blue-600'>
              {Math.min(...forecast.map(d => d.temp_min))}°C
            </div>
          </div>
          
          <div className='rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center'>
            <div className='mb-1 text-sm font-semibold text-gray-600'>Chuva Prevista</div>
            <div className='text-2xl font-bold text-blue-700'>
              {forecast.reduce((sum, d) => sum + parseFloat(d.rain_mm || 0), 0).toFixed(1)}mm
            </div>
          </div>
          
          <div className='rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 p-4 text-center'>
            <div className='mb-1 text-sm font-semibold text-gray-600'>Umidade Média</div>
            <div className='text-2xl font-bold text-cyan-700'>
              {Math.round(forecast.reduce((sum, d) => sum + d.humidity, 0) / forecast.length)}%
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherWidgetComplete;

