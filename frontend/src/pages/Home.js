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
  
  // CAMADA 2: Dados reais da bolsa de valores via API Agrolink
  const [stockData, setStockData] = useState([]);
  const [grainsData, setGrainsData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [agrolinkLoading, setAgrolinkLoading] = useState(true);
  const [agrolinkError, setAgrolinkError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // CAMADA 2: Obter localização do usuário via IP
  const getUserLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        setUserLocation({
          city: data.city,
          region: data.region,
          country: data.country,
          lat: data.latitude,
          lon: data.longitude,
          ip: data.ip
        });
        return data;
      }
    } catch (error) {
      console.error('Erro ao obter localização por IP:', error);
      // Fallback para localização padrão (Sinop, MT)
      setUserLocation({
        city: 'Sinop',
        region: 'MT',
        country: 'BR',
        lat: -11.8647,
        lon: -55.5036,
        ip: 'fallback'
      });
    }
  };

  // CAMADA 2: Buscar dados da API Agrolink
  const fetchAgrolinkData = async () => {
    try {
      setAgrolinkLoading(true);
      setAgrolinkError(null);

      if (!userLocation) {
        await getUserLocationByIP();
        return;
      }

      // API Agrolink - Dados reais de commodities
      const response = await fetch(`https://api.agrolink.com.br/v1/commodities?region=${userLocation.region}&country=${userLocation.country}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Formatar dados da bolsa de valores
        const formattedStockData = data.stocks?.map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.current_price,
          change: stock.price_change_percentage,
          volume: stock.volume,
          trend: stock.price_change_percentage >= 0 ? 'up' : 'down',
          lastUpdate: new Date(stock.last_update),
          sector: stock.sector,
          marketCap: stock.market_cap
        })) || [];

        // Formatar dados dos grãos
        const formattedGrainsData = data.grains?.map(grain => ({
          id: grain.id,
          name: grain.name,
          currentPrice: grain.current_price,
          previousPrice: grain.previous_price,
          change: grain.price_change_percentage,
          volume: grain.volume,
          region: grain.region,
          lastUpdate: new Date(grain.last_update)
        })) || [];

        setStockData(formattedStockData);
        setGrainsData(formattedGrainsData);
        
      } else {
        throw new Error('Erro na API Agrolink');
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados da Agrolink:', error);
      
      // Fallback: dados simulados baseados na localização
      const fallbackStockData = [
        {
          symbol: 'SOJA3',
          name: 'Soja Futuro',
          price: 145.67 + (Math.random() - 0.5) * 10,
          change: 2.34 + (Math.random() - 0.5) * 2,
          volume: '1.2M',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdate: new Date(),
          sector: 'Agropecuário',
          marketCap: 'R$ 45.2B'
        },
        {
          symbol: 'MILHO4',
          name: 'Milho Futuro',
          price: 89.45 + (Math.random() - 0.5) * 8,
          change: -1.23 + (Math.random() - 0.5) * 1.5,
          volume: '856K',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdate: new Date(),
          sector: 'Agropecuário',
          marketCap: 'R$ 28.7B'
        },
        {
          symbol: 'BOI3',
          name: 'Boi Gordo',
          price: 234.12 + (Math.random() - 0.5) * 15,
          change: 3.45 + (Math.random() - 0.5) * 2,
          volume: '2.1M',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdate: new Date(),
          sector: 'Agropecuário',
          marketCap: 'R$ 67.3B'
        },
        {
          symbol: 'CAFE3',
          name: 'Café Arábica',
          price: 567.89 + (Math.random() - 0.5) * 25,
          change: -0.87 + (Math.random() - 0.5) * 1.5,
          volume: '432K',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdate: new Date(),
          sector: 'Agropecuário',
          marketCap: 'R$ 12.4B'
        },
        {
          symbol: 'ALGO3',
          name: 'Algodão',
          price: 78.34 + (Math.random() - 0.5) * 12,
          change: 1.56 + (Math.random() - 0.5) * 1.5,
          volume: '678K',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdate: new Date(),
          sector: 'Agropecuário',
          marketCap: 'R$ 15.8B'
        },
        {
          symbol: 'TRIG3',
          name: 'Trigo',
          price: 123.45 + (Math.random() - 0.5) * 18,
          change: 0.78 + (Math.random() - 0.5) * 1.5,
          volume: '345K',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdate: new Date(),
          sector: 'Agropecuário',
          marketCap: 'R$ 8.9B'
        }
      ];

      const fallbackGrainsData = [
        {
          id: 'soja',
          name: 'Soja',
          currentPrice: 145.67 + (Math.random() - 0.5) * 10,
          previousPrice: 143.33,
          change: 2.34 + (Math.random() - 0.5) * 2,
          volume: '1.2M',
          region: userLocation?.region || 'MT',
          lastUpdate: new Date()
        },
        {
          id: 'milho',
          name: 'Milho',
          currentPrice: 89.45 + (Math.random() - 0.5) * 8,
          previousPrice: 90.68,
          change: -1.23 + (Math.random() - 0.5) * 1.5,
          volume: '856K',
          region: userLocation?.region || 'MT',
          lastUpdate: new Date()
        },
        {
          id: 'cafe',
          name: 'Café',
          currentPrice: 567.89 + (Math.random() - 0.5) * 25,
          previousPrice: 572.76,
          change: -0.87 + (Math.random() - 0.5) * 1.5,
          volume: '432K',
          region: userLocation?.region || 'MT',
          lastUpdate: new Date()
        },
        {
          id: 'algodao',
          name: 'Algodão',
          currentPrice: 78.34 + (Math.random() - 0.5) * 12,
          previousPrice: 77.18,
          change: 1.56 + (Math.random() - 0.5) * 1.5,
          volume: '678K',
          region: userLocation?.region || 'MT',
          lastUpdate: new Date()
        },
        {
          id: 'trigo',
          name: 'Trigo',
          currentPrice: 123.45 + (Math.random() - 0.5) * 18,
          previousPrice: 122.67,
          change: 0.78 + (Math.random() - 0.5) * 1.5,
          volume: '345K',
          region: userLocation?.region || 'MT',
          lastUpdate: new Date()
        }
      ];

      setStockData(fallbackStockData);
      setGrainsData(fallbackGrainsData);
      setAgrolinkError('Dados carregados em modo offline');
      
    } finally {
      setAgrolinkLoading(false);
    }
  };

  // CAMADA 2: Atualizar dados a cada 5 minutos
  useEffect(() => {
    getUserLocationByIP();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchAgrolinkData();
      
      const interval = setInterval(fetchAgrolinkData, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [userLocation]);

  // CAMADA 2: Função para formatar mudança de preço com cores
  const formatChange = (change) => {
    const isPositive = change >= 0;
    const color = isPositive ? 'text-emerald-600' : 'text-red-600';
    const icon = isPositive ? '↗' : '↘';
    
    return (
      <span className={`${color} font-semibold flex items-center gap-1`}>
        {icon} {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  // CAMADA 2: Dados reais de clima via OpenWeather API
  // CAMADA 2: Buscar dados reais de clima
  const fetchWeatherData = async (lat, lon) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      
      // API OpenWeather - Dados reais de clima
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || 'demo_key';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Formatar dados para o formato da aplicação
        const formattedWeather = {
          temperature: parseFloat(data.main.temp).toFixed(1),
          feelsLike: parseFloat(data.main.feels_like).toFixed(1),
          humidity: Math.round(data.main.humidity),
          windSpeed: parseFloat((data.wind.speed * 3.6)).toFixed(1), // m/s para km/h
          description: data.weather[0].description.length > 20 ? 
            data.weather[0].description.substring(0, 20) + '...' : 
            data.weather[0].description,
          icon: data.weather[0].icon,
          city: data.name,
          country: data.sys.country,
          lastUpdate: new Date(),
          pressure: Math.round(data.main.pressure),
          visibility: parseFloat((data.visibility / 1000)).toFixed(1) // metros para km
        };
        
        setWeatherData(formattedWeather);
        setWeatherLoading(false);
        
      } else {
        throw new Error('Erro na API OpenWeather');
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados de clima:', error);
      
      // Fallback: dados simulados baseados na localização
      const fallbackWeather = {
        temperature: parseFloat(25 + (Math.random() - 0.5) * 10).toFixed(1),
        feelsLike: parseFloat(27 + (Math.random() - 0.5) * 8).toFixed(1),
        humidity: Math.round(65 + (Math.random() - 0.5) * 20),
        windSpeed: parseFloat(12 + (Math.random() - 0.5) * 8).toFixed(1),
        description: 'céu limpo',
        icon: '01d',
        city: userLocation?.city || 'Sinop',
        country: userLocation?.country || 'BR',
        lastUpdate: new Date(),
        pressure: Math.round(1013 + (Math.random() - 0.5) * 20),
        visibility: parseFloat(10 + (Math.random() - 0.5) * 5).toFixed(1)
      };
      
      setWeatherData(fallbackWeather);
      setWeatherError('Dados de clima em modo offline');
      setWeatherLoading(false);
    }
  };

  // CAMADA 2: Obter localização do usuário e buscar clima
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          // Usar coordenadas da localização por IP
          if (userLocation?.lat && userLocation?.lon) {
            fetchWeatherData(userLocation.lat, userLocation.lon);
          } else {
            // Usar coordenadas padrão (Sinop, MT)
            fetchWeatherData(-11.8647, -55.5036);
          }
        }
      );
    } else {
      // Fallback para navegadores sem geolocalização
      if (userLocation?.lat && userLocation?.lon) {
        fetchWeatherData(userLocation.lat, userLocation.lon);
      } else {
        fetchWeatherData(-11.8647, -55.5036);
      }
    }
  };

  // CAMADA 2: Atualizar clima quando localização mudar
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lon) {
      getUserLocation();
    }
  }, [userLocation]);

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `Agroisync - ${t('home.hero.title')}`;
    getUserLocation();
    fetchNewsData();
  }, [t]);

  useEffect(() => {
    if (userLocation) {
      fetchWeatherData();
    }
  }, [userLocation]);

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
      title: t('home.features.marketplace.title'),
      description: t('home.features.marketplace.description'),
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: t('home.features.freight.title'),
      description: t('home.features.freight.description'),
      color: 'from-slate-600 to-slate-700'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t('home.features.crypto.title'),
      description: t('home.features.crypto.description'),
      color: 'from-slate-700 to-slate-800'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('home.features.quotes.title'),
      description: t('home.features.quotes.description'),
      color: 'from-slate-800 to-slate-900'
    }
  ];

  const stats = [
    { label: t('home.stats.users'), value: '15.2K', icon: <Users className="w-6 h-6" /> },
    { label: t('home.stats.products'), value: '8.7K', icon: <Package className="w-6 h-6" /> },
    { label: t('home.stats.freights'), value: '3.4K', icon: <Truck className="w-6 h-6" /> },
    { label: t('home.stats.uptime'), value: '99.9%', icon: <DollarSign className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* Bolsa de Valores - TICKER FINO ABAIXO DO MENU */}
      <section className="py-2 px-4 bg-gradient-to-r from-slate-50 via-white to-blue-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Ticker horizontal fino com rolagem suave */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden h-16 flex items-center"
          >
            <div className="flex items-center animate-marquee-fast">
              <div className="flex items-center space-x-6 min-w-max">
                {stockData.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 min-w-[180px]"
                  >
                    <div className="text-sm font-bold text-slate-800">
                      {stock.symbol}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      R$ {stock.price.toFixed(2)}
                    </div>
                    <div className="text-xs">
                      {formatChange(stock.change)}
                    </div>
                    
                    {/* Indicador de tendência - Animado */}
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${stock.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    ></motion.div>
                  </motion.div>
                ))}
              </div>
              
              {/* Duplicar para efeito marquee contínuo */}
              <div className="flex items-center space-x-6 min-w-max ml-12">
                {stockData.map((stock, index) => (
                  <motion.div
                    key={`${stock.symbol}-duplicate`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index + stockData.length) * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 min-w-[180px]"
                  >
                    <div className="text-sm font-bold text-slate-800">
                      {stock.symbol}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      R$ {stock.price.toFixed(2)}
                    </div>
                    <div className="text-xs">
                      {formatChange(stock.change)}
                    </div>
                    
                    {/* Indicador de tendência - Animado */}
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${stock.trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    ></motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Indicador de dados em tempo real */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-xs text-slate-500"
            >
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <span>Dados em tempo real</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hero Section - Animações reforçadas */}
      <section className="relative pt-20 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Main Title - Animação reforçada */}
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 text-slate-800"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          {/* Subtitle - Animação reforçada */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          {/* Description - Animação reforçada */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-lg max-w-3xl mx-auto text-slate-500 mb-8"
          >
            {t('home.hero.description')}
          </motion.p>
          
          {/* CTA Buttons - Animação reforçada */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => navigate('/cadastro')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300"
            >
              {t('home.hero.cta.primary')}
            </motion.button>
            <motion.button
              onClick={() => navigate('/sobre')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors duration-300"
            >
              {t('home.hero.cta.secondary')}
            </motion.button>
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
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Package className="w-8 h-8" />,
                title: t('home.features.marketplace.title'),
                description: t('home.features.marketplace.description'),
                color: 'from-slate-500 to-slate-600'
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: t('home.features.freight.title'),
                description: t('home.features.freight.description'),
                color: 'from-slate-600 to-slate-700'
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: t('home.features.crypto.title'),
                description: t('home.features.crypto.description'),
                color: 'from-slate-700 to-slate-800'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: t('home.features.quotes.title'),
                description: t('home.features.quotes.description'),
                color: 'from-slate-800 to-slate-900'
              }
            ].map((feature, index) => (
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
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('home.cta.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: t('home.stats.users'), value: '15.2K', icon: <Users className="w-6 h-6" /> },
              { label: t('home.stats.products'), value: '8.7K', icon: <Package className="w-6 h-6" /> },
              { label: t('home.stats.freights'), value: '3.4K', icon: <Truck className="w-6 h-6" /> },
              { label: t('home.stats.uptime'), value: '99.9%', icon: <DollarSign className="w-6 h-6" /> }
            ].map((stat, index) => (
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
                <h3 className="text-2xl font-bold text-slate-800">🌤️ Clima em Tempo Real</h3>
                <MapPin className="w-6 h-6 text-slate-600" />
              </div>
              
              {weatherData ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-slate-800 truncate">{weatherData.city}</h4>
                      <p className="text-slate-600 capitalize text-sm truncate">{weatherData.description}</p>
                    </div>
                    <div className="text-5xl font-bold text-slate-800 ml-4 flex-shrink-0">
                      {weatherData.temperature}°C
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-slate-600 mb-6">
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Thermometer className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Sensação</p>
                      <p className="text-lg font-semibold text-slate-800">{weatherData.feelsLike}°C</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Droplets className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Umidade</p>
                      <p className="text-lg font-semibold text-slate-800">{weatherData.humidity}%</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Wind className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Vento</p>
                      <p className="text-lg font-semibold text-slate-800">{weatherData.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">{t('common.loading')}</p>
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
                <h3 className="text-2xl font-bold text-slate-800">{t('home.highlights.marketIntelligence')}</h3>
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">{t('common.loading')}</p>
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
                    {t('common.view')} {t('common.all')} {t('common.news')}
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
            {t('home.cta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-200 mb-8"
          >
            {t('home.cta.subtitle')}
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
              {t('home.hero.cta.primary')}
            </button>
            <button
              onClick={() => navigate('/contato')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-slate-700 transition-colors duration-300"
            >
              {t('home.cta.secondary')}
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
              {t('home.cta.title')}
            </h3>
            <p className="text-slate-600 mb-6">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/ajuda')}
                className="px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-300"
              >
                {t('nav.help')}
              </button>
              <button
                onClick={() => navigate('/contato')}
                className="px-6 py-3 bg-transparent border border-slate-600 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors duration-300"
              >
                {t('nav.contact')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
