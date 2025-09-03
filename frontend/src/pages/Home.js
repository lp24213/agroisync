import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  DollarSign, Package, Truck, 
  Users, Shield, TrendingUp, TrendingDown,
  MapPin, MessageSquare, Leaf,
  Sun, Cloud, CloudRain, Thermometer, Droplets, Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';
import HomeGrains from '../components/HomeGrains';
import HomeNews from '../components/HomeNews';
import HomeWeather from '../components/HomeWeather';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isEnabled } = useFeatureFlags();
  
  // CAMADA 2: Dados reais da bolsa de valores via API Agrolink
  const [stockData, setStockData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // CAMADA 2: Obter localização do usuário via IP
  const getUserLocationByIP = async () => {
    try {
      // Simular detecção de localização (em produção seria uma API real)
      // const response = await fetch('https://ipapi.co/json/');
      
      // Dados simulados para demonstração
      const mockLocationData = {
        city: 'Sinop',
        region: 'MT',
        country: 'BR',
        latitude: -11.8647,
        longitude: -55.5036,
        ip: '192.168.1.1'
      };
      
      setUserLocation(mockLocationData);
      return mockLocationData;
      
    } catch (error) {
      console.error('Erro ao obter localização por IP:', error);
      // Fallback para localização padrão (Sinop, MT)
      const fallbackLocation = {
        city: 'Sinop',
        region: 'MT',
        country: 'BR',
        lat: -11.8647,
        lon: -55.5036,
        ip: 'fallback'
      };
      setUserLocation(fallbackLocation);
      return fallbackLocation;
    }
  };

  // CAMADA 2: Buscar dados da API Agrolink
  const fetchAgrolinkData = useCallback(async () => {
    try {
      if (!userLocation) {
        await getUserLocationByIP();
        return;
      }

      // Simular dados da API Agrolink (em produção seria uma API real)
      // const response = await fetch(`https://api.agrolink.com.br/v1/commodities?region=${userLocation.region}&country=${userLocation.country}`);
      
      // Dados simulados para demonstração
      const mockAgrolinkData = {
        stocks: [
          {
            symbol: 'SOJA3',
            name: 'Soja Futuro',
            current_price: 145.67 + (Math.random() - 0.5) * 10,
            price_change_percentage: 2.34 + (Math.random() - 0.5) * 2,
            volume: '1.2M',
            last_update: new Date().toISOString(),
            sector: 'Agropecuário',
            market_cap: 'R$ 45.2B'
          },
          {
            symbol: 'MILHO4',
            name: 'Milho Futuro',
            current_price: 89.45 + (Math.random() - 0.5) * 8,
            price_change_percentage: -1.23 + (Math.random() - 0.5) * 1.5,
            volume: '856K',
            last_update: new Date().toISOString(),
            sector: 'Agropecuário',
            market_cap: 'R$ 28.7B'
          },
          {
            symbol: 'BOI3',
            name: 'Boi Gordo',
            current_price: 234.12 + (Math.random() - 0.5) * 15,
            price_change_percentage: 3.45 + (Math.random() - 0.5) * 2,
            volume: '2.1M',
            last_update: new Date().toISOString(),
            sector: 'Agropecuário',
            market_cap: 'R$ 67.3B'
          },
          {
            symbol: 'CAFE3',
            name: 'Café Arábica',
            current_price: 567.89 + (Math.random() - 0.5) * 25,
            price_change_percentage: -0.87 + (Math.random() - 0.5) * 1.5,
            volume: '432K',
            last_update: new Date().toISOString(),
            sector: 'Agropecuário',
            market_cap: 'R$ 12.4B'
          },
          {
            symbol: 'ALGO3',
            name: 'Algodão',
            current_price: 78.34 + (Math.random() - 0.5) * 12,
            price_change_percentage: 1.56 + (Math.random() - 0.5) * 1.5,
            volume: '678K',
            last_update: new Date().toISOString(),
            sector: 'Agropecuário',
            market_cap: 'R$ 15.8B'
          },
          {
            symbol: 'TRIG3',
            name: 'Trigo',
            current_price: 123.45 + (Math.random() - 0.5) * 18,
            price_change_percentage: 0.78 + (Math.random() - 0.5) * 1.5,
            volume: '345K',
            last_update: new Date().toISOString(),
            sector: 'Agropecuário',
            market_cap: 'R$ 18.9B'
          }
        ]
      };
      
      // Formatar dados da bolsa de valores
      const formattedStockData = mockAgrolinkData.stocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.current_price,
        change: stock.price_change_percentage,
        volume: stock.volume,
        trend: stock.price_change_percentage >= 0 ? 'up' : 'down',
        lastUpdate: new Date(stock.last_update),
        sector: stock.sector,
        marketCap: stock.market_cap
      }));

      setStockData(formattedStockData);
      
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
          marketCap: 'R$ 18.9B'
        }
      ];

      setStockData(fallbackStockData);
    }
  }, [userLocation]);

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
  }, [userLocation, fetchAgrolinkData]);

  // CAMADA 2: Função para formatar mudança de preço com cores
  const formatChange = (change) => {
    const isPositive = change >= 0;
    const color = isPositive ? 'text-emerald-600' : 'text-red-600';
    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <span className={`${color} font-semibold flex items-center gap-1`}>
        <Icon className="w-4 h-4" /> {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  // CAMADA 2: Dados reais de clima via OpenWeather API
  // CAMADA 2: Buscar dados reais de clima
  const fetchWeatherData = useCallback(async (lat, lon) => {
    try {
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
        visibility: parseFloat(10 + (Math.random() - 0.5) * 1).toFixed(1) // metros para km
      };
      
      setWeatherData(fallbackWeather);
    }
  }, [userLocation]);

  // CAMADA 2: Obter localização do usuário e buscar clima
  const getUserLocation = useCallback(() => {
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
  }, [userLocation, fetchWeatherData]);

  // CAMADA 2: Atualizar clima quando localização mudar
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lon) {
      getUserLocation();
    }
  }, [userLocation, getUserLocation]);

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewsData = useCallback(async () => {
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
  }, []);

  // useEffect para carregar notícias e definir título da página
  useEffect(() => {
    document.title = `Agroisync - ${t('home.hero.title')}`;
    fetchNewsData();
  }, [t, fetchNewsData]);

  // useEffect para atualizar clima quando localização mudar
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lon) {
      fetchWeatherData(userLocation.lat, userLocation.lon);
    }
  }, [userLocation, fetchWeatherData]);

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
    <div className="min-h-screen bg-agro-bg-primary text-agro-text-primary pt-16">
      {/* Cotação da Bolsa */}
      {/* Seção de Grãos, Notícias e Clima */}
      {isEnabled('FEATURE_HOME_GRAINS') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <HomeGrains />
          <HomeNews />
          <HomeWeather />
        </div>
      )}
      
      {/* Hero Section - DESIGN PREMIUM AGROISYNC MAIORAL */}
      <section className="relative pt-24 pb-24 px-4 overflow-hidden header-premium">
        {/* Background Premium */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-agro-bg-secondary via-agro-bg-card to-agro-bg-primary">
            <div className="absolute inset-0 bg-agro-bg-primary opacity-95"></div>
          </div>
          {/* Linha gradiente sutil no topo */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-accent-emerald via-agro-accent-amber to-agro-accent-sky opacity-60"></div>
          {/* Elementos decorativos premium */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-agro-accent-emerald to-agro-accent-sky rounded-full opacity-10 blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-agro-accent-amber to-agro-accent-sky rounded-full opacity-10 blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-agro-accent-emerald/5 via-agro-accent-amber/5 to-agro-accent-sky/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Main Title - Premium com gradiente */}
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 title-premium"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          {/* Subtitle - Premium */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-agro-text-secondary max-w-4xl mx-auto mb-8"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          
          {/* Description - Premium */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-lg max-w-3xl mx-auto text-agro-text-tertiary mb-10"
          >
            {t('home.hero.description')}
          </motion.p>
          
          {/* CTA Buttons - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              onClick={() => navigate('/cadastro')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-10 py-5 text-lg relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-agro-accent-emerald-light via-agro-accent-amber-light to-agro-accent-sky-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{t('home.hero.cta.primary')}</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/sobre')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary px-10 py-5 text-lg relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-agro-accent-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative z-10">{t('home.hero.cta.secondary')}</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section - DESIGN PREMIUM */}
      <section className="section-premium header-premium relative overflow-hidden">
        {/* Linha gradiente sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold title-premium mb-6">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center group card-premium p-6 hover-lift"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
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
      <section className="section-premium-compact bg-gradient-to-r from-slate-50 to-slate-100 relative overflow-hidden">
        {/* Linha gradiente sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-40"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold title-premium mb-4">
              Estatísticas da Plataforma
            </h2>
            <p className="text-xl text-slate-600">
              Números que demonstram o crescimento e sucesso do Agroisync
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center card-premium p-6 hover-lift"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 shadow-lg flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-300 icon-premium">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gradient-premium mb-2">
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
      <section className="section-premium header-premium relative overflow-hidden">
        {/* Linha gradiente sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card-premium p-8 hover-lift"
            >
                                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold title-premium-small flex items-center gap-2">
                      <Sun className="w-6 h-6 text-agro-yellow-500" />
                      Clima em Tempo Real
                    </h3>
                    <MapPin className="w-6 h-6 text-slate-600" />
                  </div>
              
              {weatherData ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-slate-800 truncate">{weatherData.city}</h4>
                      <p className="text-slate-600 capitalize text-sm truncate">{weatherData.description}</p>
                    </div>
                    <div className="text-5xl font-bold text-gradient-premium ml-4 flex-shrink-0">
                      {weatherData.temperature}°C
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-slate-600 mb-6 group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getWeatherIcon(weatherData.icon)}
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                    <div className="text-center group">
                      <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Thermometer className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Sensação</p>
                      <p className="text-lg font-semibold text-gradient-premium">{weatherData.feelsLike}°C</p>
                    </div>
                    <div className="text-center group">
                      <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Droplets className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Umidade</p>
                      <p className="text-lg font-semibold text-gradient-premium">{weatherData.humidity}%</p>
                    </div>
                    <div className="text-center group">
                      <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                        <Wind className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-xs text-slate-600 mb-1">Vento</p>
                      <p className="text-lg font-semibold text-gradient-premium">{weatherData.windSpeed} km/h</p>
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
              className="card-premium p-8 hover-lift"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold title-premium-small">{t('home.highlights.marketIntelligence')}</h3>
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
                      className="border-b border-slate-200 pb-4 last:border-b-0 hover:bg-slate-50 p-2 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                          <Leaf className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 mb-1 overflow-hidden text-ellipsis whitespace-nowrap hover:text-emerald-700 transition-colors duration-200 cursor-pointer">
                            {news.title}
                          </h4>
                          <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                            {news.excerpt}
                          </p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="badge-accent-green">
                      {news.category}
                    </span>
                    <span className="text-slate-600">{news.source}</span>
                    <span className="text-slate-500">{news.date}</span>
                  </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium"
                  >
                    {t('common.view')} {t('common.all')} {t('common.news')}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-agro-green-600/20 via-agro-yellow-500/20 to-web3-neon-blue/20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            <motion.button
              onClick={() => navigate('/cadastro')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-yellow-500 to-blue-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:via-yellow-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{t('home.hero.cta.primary')}</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/contato')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-slate-700 transition-all duration-300"
            >
              {t('home.cta.secondary')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Linha gradiente sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-yellow-500 to-blue-500 opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-yellow-600 bg-clip-text text-transparent mb-4">
              {t('home.cta.title')}
            </h3>
            <p className="text-slate-600 mb-6">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/ajuda')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-medium rounded-lg hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
              >
                {/* Efeito de glow no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-yellow-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <span className="relative z-10">{t('nav.help')}</span>
              </motion.button>
              <motion.button
                onClick={() => navigate('/contato')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-transparent border border-gradient-to-r from-emerald-500 via-yellow-500 to-blue-500 text-slate-600 font-medium rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:via-yellow-50 hover:to-blue-50 hover:border-emerald-600 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Efeito de glow no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-yellow-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <span className="relative z-10">{t('nav.contact')}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
