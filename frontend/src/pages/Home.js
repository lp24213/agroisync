import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, TrendingDown, DollarSign, Package, Truck, 
  Users, Shield, Zap, Globe, BarChart3, ArrowRight,
  CheckCircle, Star, Award, Clock, MapPin, Phone,
  Mail, MessageSquare, Calendar, Target, Leaf,
  Sun, Cloud, CloudRain, Thermometer, Droplets, Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [stockData, setStockData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    document.title = 'Agroisync - Plataforma de Agronegócio';
    fetchStockData();
    getUserLocation();
    fetchNewsData();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchWeatherData();
    }
  }, [userLocation]);

  const getUserLocation = async () => {
    try {
      // Primeiro tentar obter localização via IP
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        setUserLocation({
          city: ipData.city,
          region: ipData.region,
          country: ipData.country,
          lat: ipData.latitude,
          lon: ipData.longitude
        });
      }
    } catch (error) {
      console.error('Erro ao obter localização via IP:', error);
      // Fallback para geolocalização do navegador
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            console.error('Erro na geolocalização:', error);
            // Usar localização padrão
            setUserLocation({
              city: 'São Paulo',
              region: 'SP',
              country: 'BR',
              lat: -23.5505,
              lon: -46.6333
            });
          }
        );
      }
    }
  };

  const fetchStockData = async () => {
    try {
      // Simular dados da bolsa agrícola em tempo real
      const mockStockData = [
        { symbol: 'SOJA3', name: 'Soja', price: 85.50, change: 2.34, volume: '2.1M', lastUpdate: new Date() },
        { symbol: 'MILH3', name: 'Milho', price: 67.80, change: -1.25, volume: '1.8M', lastUpdate: new Date() },
        { symbol: 'BOIA3', name: 'Boi Gordo', price: 245.90, change: 0.85, volume: '890K', lastUpdate: new Date() },
        { symbol: 'CAFE3', name: 'Café', price: 156.20, change: 3.12, volume: '1.2M', lastUpdate: new Date() },
        { symbol: 'ALGD3', name: 'Algodão', price: 89.75, change: -0.45, volume: '650K', lastUpdate: new Date() },
        { symbol: 'TRIG3', name: 'Trigo', price: 78.30, change: 1.67, volume: '450K', lastUpdate: new Date() }
      ];
      setStockData(mockStockData);

      // Atualizar dados a cada 30 segundos
      const interval = setInterval(() => {
        setStockData(prevData => 
          prevData.map(stock => ({
            ...stock,
            price: stock.price + (Math.random() - 0.5) * 2,
            change: stock.change + (Math.random() - 0.5) * 0.5,
            lastUpdate: new Date()
          }))
        );
      }, 30000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Erro ao buscar dados da bolsa:', error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      if (!userLocation?.lat || !userLocation?.lon) return;

      // Usar OpenWeather API (espelhada)
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || 'demo_key';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.lat}&lon=${userLocation.lon}&appid=${apiKey}&units=metric&lang=pt_br`
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherData({
          city: userLocation.city || data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6), // m/s para km/h
          icon: data.weather[0].icon,
          feelsLike: Math.round(data.main.feels_like)
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
      // Dados mock como fallback
      setWeatherData({
        city: userLocation?.city || 'São Paulo',
        temperature: 24,
        condition: 'Ensolarado',
        humidity: 65,
        wind: 12,
        icon: '01d',
        feelsLike: 26
      });
    }
  };

  const fetchNewsData = async () => {
    try {
      // Simular notícias reais do agronegócio
      const mockNewsData = [
        {
          id: 1,
          title: 'Safra de soja 2024/25 deve atingir recorde histórico de 160 milhões de toneladas',
          excerpt: 'Estimativas da Conab apontam para crescimento de 3,2% em relação à safra anterior',
          category: 'Soja',
          source: 'Globo Rural',
          date: '2024-01-15',
          url: '#',
          image: '/api/placeholder/300/200'
        },
        {
          id: 2,
          title: 'Tecnologia de irrigação inteligente aumenta produtividade em até 30%',
          excerpt: 'Sistemas automatizados reduzem desperdício de água e otimizam recursos hídricos',
          category: 'Tecnologia',
          source: 'Canal Rural',
          date: '2024-01-14',
          url: '#',
          image: '/api/placeholder/300/200'
        },
        {
          id: 3,
          title: 'Exportações de carne bovina crescem 15% em 2023, China lidera importações',
          excerpt: 'Setor registra recorde histórico com embarques de 2,2 milhões de toneladas',
          category: 'Pecuária',
          source: 'Notícias Agrícolas',
          date: '2024-01-13',
          url: '#',
          image: '/api/placeholder/300/200'
        },
        {
          id: 4,
          title: 'Preços do milho sobem 8% em janeiro devido à forte demanda interna',
          excerpt: 'Indústria de ração e produção de etanol impulsionam consumo do grão',
          category: 'Milho',
          source: 'Globo Rural',
          date: '2024-01-12',
          url: '#',
          image: '/api/placeholder/300/200'
        }
      ];
      setNewsData(mockNewsData);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <Sun className="w-8 h-8" />,
      '01n': <Sun className="w-8 h-8" />,
      '02d': <Cloud className="w-8 h-8" />,
      '02n': <Cloud className="w-8 h-8" />,
      '03d': <Cloud className="w-8 h-8" />,
      '03n': <Cloud className="w-8 h-8" />,
      '04d': <Cloud className="w-8 h-8" />,
      '04n': <Cloud className="w-8 h-8" />,
      '09d': <CloudRain className="w-8 h-8" />,
      '09n': <CloudRain className="w-8 h-8" />,
      '10d': <CloudRain className="w-8 h-8" />,
      '10n': <CloudRain className="w-8 h-8" />,
      '11d': <CloudRain className="w-8 h-8" />,
      '11n': <CloudRain className="w-8 h-8" />,
      '13d': <Cloud className="w-8 h-8" />,
      '13n': <Cloud className="w-8 h-8" />,
      '50d': <Cloud className="w-8 h-8" />,
      '50n': <Cloud className="w-8 h-8" />
    };
    return iconMap[iconCode] || <Sun className="w-8 h-8" />;
  };

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Marketplace',
      description: 'Compre e venda produtos agrícolas com segurança',
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'AgroConecta',
      description: 'Conecte-se com transportadores e anunciantes',
      color: 'from-slate-600 to-slate-700'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Pagamentos',
      description: 'Stripe e Metamask para transações seguras',
      color: 'from-slate-700 to-slate-800'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Segurança',
      description: 'Dados protegidos e transações verificadas',
      color: 'from-slate-800 to-slate-900'
    }
  ];

  const stats = [
    { label: 'Usuários Ativos', value: '15.2K', icon: <Users className="w-6 h-6" /> },
    { label: 'Produtos', value: '8.7K', icon: <Package className="w-6 h-6" /> },
    { label: 'Fretes', value: '3.4K', icon: <Truck className="w-6 h-6" /> },
    { label: 'Transações', value: '12.1K', icon: <DollarSign className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-slate-800"
          >
            Agroisync
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8"
          >
            A plataforma completa para o agronegócio brasileiro. 
            Conecte-se, negocie e cresça com segurança e eficiência.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/cadastro')}
              className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300"
            >
              Começar Agora
            </button>
            <button
              onClick={() => navigate('/sobre')}
              className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors duration-300"
            >
              Saiba Mais
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bolsa Agrícola Animada - Corrigida e abaixo do menu */}
      <section className="py-12 px-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Bolsa Agrícola em Tempo Real</h2>
            <p className="text-slate-600">Acompanhe as principais commodities do agronegócio brasileiro</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center overflow-x-auto"
          >
            <div className="flex items-center space-x-6 min-w-max">
              {stockData.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center space-y-2 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-lg font-bold text-slate-800">
                    {stock.symbol}
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {formatPrice(stock.price)}
                  </div>
                  <div className="text-sm">
                    {formatChange(stock.change)}
                  </div>
                  <div className="text-xs text-slate-600">
                    Vol: {stock.volume}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stock.lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Por que escolher o Agroisync?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Uma plataforma completa e segura para todas as suas necessidades no agronegócio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Números que impressionam
            </h2>
            <p className="text-xl text-slate-600">
              Milhares de usuários já confiam no Agroisync
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & News Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Clima em Tempo Real</h3>
                <MapPin className="w-6 h-6 text-slate-600" />
              </div>
              
              {weatherData ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">{weatherData.city}</h4>
                      <p className="text-slate-600 capitalize">{weatherData.condition}</p>
                    </div>
                    <div className="text-6xl font-bold text-slate-800">
                      {weatherData.temperature}°C
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-slate-600 mb-4">
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Thermometer className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-600">Sensação</p>
                      <p className="text-lg font-semibold text-slate-800">{weatherData.feelsLike}°C</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Droplets className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-600">Umidade</p>
                      <p className="text-lg font-semibold text-slate-800">{weatherData.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Wind className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-600">Vento</p>
                      <p className="text-lg font-semibold text-slate-800">{weatherData.wind} km/h</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Carregando dados do clima...</p>
                </div>
              )}
            </motion.div>

            {/* News Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Notícias do Agronegócio</h3>
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Carregando notícias...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {newsData.slice(0, 3).map((news, index) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="border-b border-slate-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-xs text-slate-600 mb-2">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span className="bg-slate-100 px-2 py-1 rounded">
                              {news.category}
                            </span>
                            <span>{news.source}</span>
                            <span>{news.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200">
                    Ver todas as notícias
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-600 to-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Pronto para transformar seu agronegócio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-200 mb-8"
          >
            Junte-se a milhares de produtores que já estão usando o Agroisync
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/cadastro')}
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors duration-300"
            >
              Criar Conta Grátis
            </button>
            <button
              onClick={() => navigate('/contato')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-slate-700 transition-colors duration-300"
            >
              Falar com Especialista
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Precisa de ajuda?
            </h3>
            <p className="text-slate-600 mb-6">
              Nossa equipe está pronta para ajudar você a aproveitar ao máximo a plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/ajuda')}
                className="px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-300"
              >
                Central de Ajuda
              </button>
              <button
                onClick={() => navigate('/contato')}
                className="px-6 py-3 bg-transparent border border-slate-600 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors duration-300"
              >
                Contato
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
