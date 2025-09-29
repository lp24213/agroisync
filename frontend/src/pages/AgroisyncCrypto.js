import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Coins,
  Wallet,
  Star,
  CheckCircle,
  RefreshCw,
  TrendingDown,
  Activity
} from 'lucide-react';
// import CryptoChart from '../components/CryptoChart'; // Componente removido
// import '../styles/crypto-dashboard.css'; // Arquivo removido
import CryptoHash from '../components/CryptoHash';

const AgroisyncCrypto = () => {
  const [email, setEmail] = useState('');
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Função para buscar dados reais de criptomoedas
  const fetchCryptoData = useCallback(async () => {
    try {
      setLoading(true);

      // Simular dados reais de criptomoedas (em produção, usar APIs como CoinGecko, CoinMarketCap)
      const mockCryptoData = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 43250.5 + (Math.random() - 0.5) * 1000,
          change24h: (Math.random() - 0.5) * 10,
          volume: 28500000000 + (Math.random() - 0.5) * 5000000000,
          marketCap: 850000000000 + (Math.random() - 0.5) * 50000000000,
          chartData: generateChartData(43250.5, 0.02),
          lastUpdate: new Date()
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          price: 2650.3 + (Math.random() - 0.5) * 200,
          change24h: (Math.random() - 0.5) * 8,
          volume: 15000000000 + (Math.random() - 0.5) * 3000000000,
          marketCap: 320000000000 + (Math.random() - 0.5) * 30000000000,
          chartData: generateChartData(2650.3, 0.03),
          lastUpdate: new Date()
        },
        {
          id: 'cardano',
          name: 'Cardano',
          symbol: 'ADA',
          price: 0.45 + (Math.random() - 0.5) * 0.05,
          change24h: (Math.random() - 0.5) * 12,
          volume: 850000000 + (Math.random() - 0.5) * 200000000,
          marketCap: 15000000000 + (Math.random() - 0.5) * 2000000000,
          chartData: generateChartData(0.45, 0.08),
          lastUpdate: new Date()
        }
      ];

      setCryptoData(mockCryptoData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao buscar dados de criptomoedas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para gerar dados de gráfico
  const generateChartData = (basePrice, volatility) => {
    const data = [];
    const points = 30;

    for (let i = 0; i < points; i++) {
      const time = new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000);
      const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
      data.push({
        time: time.getTime(),
        price: Math.max(price, basePrice * 0.8) // Prevenir preços muito baixos
      });
    }

    return data;
  };

  // Atualizar dados a cada 30 segundos
  useEffect(() => {
    fetchCryptoData();

    const interval = setInterval(() => {
      fetchCryptoData();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const features = [
    {
      icon: <Coins size={32} />,
      title: 'Crypto Agro Token',
      description: 'Token digital exclusivo para transações no agronegócio com valorização garantida',
      color: 'var(--agro-green)'
    },
    {
      icon: <Shield size={32} />,
      title: 'Blockchain Seguro',
      description: 'Tecnologia blockchain para garantir transparência e segurança em todas as operações',
      color: 'var(--agro-green)'
    },
    {
      icon: <Wallet size={32} />,
      title: 'Wallet Integrado',
      description: 'Carteira digital integrada para gerenciar seus tokens e fazer transações',
      color: 'var(--agro-green)'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Staking Rewards',
      description: 'Ganhe recompensas ao manter seus tokens bloqueados na plataforma',
      color: 'var(--agro-green)'
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      text: 'Transações instantâneas'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Taxas reduzidas'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Transparência total'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Segurança máxima'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Liquidez garantida'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Suporte 24/7'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Tokens Emitidos', color: 'var(--agro-green-accent)' },
    { number: '50K+', label: 'Transações', color: 'var(--agro-green-accent)' },
    { number: '$5M+', label: 'Volume', color: 'var(--agro-green-accent)' },
    { number: '99.9%', label: 'Uptime', color: 'var(--agro-green-accent)' }
  ];

  const handleEmailSubmit = e => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div data-page='crypto'>
      {/* Hero Section Clean */}
      <section
        className='agro-hero-section'
        style={{
          background:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1639825752750-5061ded5503b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R1JBRklDTyUyMENSSVBUT01PRURBfGVufDB8fDB8fHww")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4rem 0'
        }}
      >
        <div className='agro-hero-content'>
          <motion.div variants={heroVariants} initial='hidden' animate='visible'>
            <motion.div variants={itemVariants} style={{ marginBottom: 'var(--agro-space-xl)' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-3xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  boxShadow: 'var(--agro-shadow-lg)'
                }}
              >
                <Coins size={48} />
              </div>
            </motion.div>

            <motion.h1
              className='agro-hero-title'
              variants={itemVariants}
              style={{ color: '#FFFFFF', textAlign: 'center' }}
            >
              CRYPTO AGRO
            </motion.h1>

            <motion.p
              className='agro-hero-subtitle'
              variants={itemVariants}
              style={{ color: '#FFFFFF', textAlign: 'center' }}
            >
              Em construção: A primeira criptomoeda do agronegócio do planeta
            </motion.p>

            <motion.div
              style={{
                display: 'flex',
                gap: 'var(--agro-space-lg)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: 'var(--agro-space-xl)'
              }}
              variants={itemVariants}
            >
              <Link
                to='/register'
                className='agro-btn-primary'
                style={{
                  background: '#4CAF50',
                  color: '#FFFFFF',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link
                to='/marketplace'
                className='agro-btn-secondary'
                style={{
                  background: 'transparent',
                  color: '#4CAF50',
                  border: '2px solid #4CAF50',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Explorar
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='agro-section' style={{ background: 'var(--agro-light-beige)' }}>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
          >
            <h2 className='agro-section-title'>Números que Impressionam</h2>
            <p className='agro-section-subtitle'>Resultados reais da nossa plataforma blockchain</p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--agro-space-xl)'
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className='agro-text-center'
              >
                <div
                  style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: stat.color,
                    marginBottom: 'var(--agro-space-sm)',
                    fontFamily: 'var(--agro-font-secondary)'
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Dashboard Section */}
      <section className='agro-section' style={{ background: 'var(--bg-gradient)' }}>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='agro-text-center'
            style={{ marginBottom: '2rem' }}
          >
            <h2 className='agro-section-title'>Dashboard Crypto Agroisync</h2>
            <p className='agro-section-subtitle'>Sua blockchain própria • Controle total • Pagamentos diretos</p>
          </motion.div>

          {/* Gráficos de Criptomoedas em Tempo Real */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {cryptoData.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
                  border: '1px solid rgba(42, 127, 79, 0.1)'
                }}
              >
                {/* Header do Card */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background:
                          crypto.symbol === 'BTC'
                            ? '#f7931a'
                            : crypto.symbol === 'ETH'
                              ? '#627eea'
                              : 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      {crypto.symbol}
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {crypto.name}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {crypto.symbol}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: 'var(--text-primary)'
                        }}
                      >
                        $
                        {crypto.price.toLocaleString('en-US', {
                          minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                          maximumFractionDigits: crypto.price < 1 ? 4 : 2
                        })}
                      </span>
                      {crypto.change24h >= 0 ? (
                        <TrendingUp size={20} style={{ color: '#22c55e' }} />
                      ) : (
                        <TrendingDown size={20} style={{ color: '#ef4444' }} />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        color: crypto.change24h >= 0 ? '#22c55e' : '#ef4444',
                        fontWeight: '600'
                      }}
                    >
                      {crypto.change24h >= 0 ? '+' : ''}
                      {crypto.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Gráfico */}
                <div style={{ marginBottom: '1rem' }}>
                  <div className='py-8 text-center'>
                    <h3 className='text-xl font-semibold text-gray-600'>Gráfico de Criptomoedas em Desenvolvimento</h3>
                    <p className='mt-2 text-gray-500'>Em breve teremos gráficos interativos disponíveis!</p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Volume 24h:</span>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      ${(crypto.volume / 1000000000).toFixed(2)}B
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Market Cap:</span>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      ${(crypto.marketCap / 1000000000).toFixed(2)}B
                    </div>
                  </div>
                </div>

                {/* Botão de ação */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Wallet size={16} />
                  {crypto.symbol === 'AGRO' ? 'Comprar AGRO Token' : 'Ver Detalhes'}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Status de Atualização */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              background: 'rgba(42, 127, 79, 0.1)',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className='animate-spin' />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Atualizando dados...</span>
              </>
            ) : (
              <>
                <Activity size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='agro-section'>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
          >
            <h2 className='agro-section-title'>Recursos Principais</h2>
            <p className='agro-section-subtitle'>Tecnologia blockchain avançada para o agronegócio</p>
          </motion.div>

          <div className='agro-cards-grid'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className='agro-card agro-fade-in'
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'var(--agro-green-accent)',
                    borderRadius: 'var(--agro-radius-xl) var(--agro-radius-xl) 0 0'
                  }}
                />

                <div className='agro-card-icon' style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className='agro-card-title'>{feature.title}</h3>
                <p className='agro-card-description'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='agro-section' style={{ background: 'var(--agro-light-beige)' }}>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
          >
            <h2 className='agro-section-title'>Benefícios do Crypto Agro</h2>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--agro-space-lg)'
            }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                className='agro-card'
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--agro-space-md)',
                  padding: 'var(--agro-space-lg)'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--agro-gradient-accent)',
                    borderRadius: 'var(--agro-radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--agro-dark-green)',
                    flexShrink: 0
                  }}
                >
                  {benefit.icon}
                </div>
                <span style={{ fontWeight: '500', fontSize: '1.125rem', color: 'var(--agro-text-dark)' }}>
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='agro-section'>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto var(--agro-space-lg) auto',
                background: 'var(--agro-gradient-accent)',
                borderRadius: 'var(--agro-radius-2xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--agro-dark-green)',
                boxShadow: 'var(--agro-shadow-lg)'
              }}
            >
              <Star size={32} />
            </div>
            <h2 className='agro-section-title' style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Fique por Dentro
            </h2>
            <p className='agro-section-subtitle' style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Receba atualizações sobre o lançamento do Crypto Agro
            </p>

            <form
              onSubmit={handleEmailSubmit}
              style={{ display: 'flex', gap: 'var(--agro-space-md)', maxWidth: '500px', margin: '0 auto' }}
            >
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Seu melhor email'
                style={{
                  flex: 1,
                  padding: 'var(--agro-space-md)',
                  border: '2px solid rgba(57, 255, 20, 0.2)',
                  borderRadius: 'var(--agro-radius-lg)',
                  fontSize: '1rem',
                  background: 'rgba(57, 255, 20, 0.1)',
                  color: 'var(--agro-text-dark)',
                  transition: 'all var(--agro-transition-normal)',
                  backdropFilter: 'blur(10px)'
                }}
                required
              />
              <motion.button
                type='submit'
                className='agro-btn agro-btn-primary'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: 'var(--agro-space-md) var(--agro-space-lg)' }}
              >
                Inscrever
                <ArrowRight size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        /* Animação de rotação */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='crypto' style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AgroisyncCrypto;
