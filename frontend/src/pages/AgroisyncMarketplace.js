import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// import RegistrationSystem from '../components/RegistrationSystem'; // Componente removido
import {
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Filter,
  Search,
  UserPlus
} from 'lucide-react';
// import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt'; // Componente removido
import ProductCard from '../components/ProductCard';
import CryptoHash from '../components/CryptoHash';
import { getApiUrl } from '../config/constants';
import logger from '../services/logger';
import { toast } from 'react-hot-toast';

const AgroisyncMarketplace = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  // const [publicRegistrations, setPublicRegistrations] = useState([]);
  const [selectedState, setSelectedState] = useState('todos');
  const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // setLoading(true);
        const response = await fetch(getApiUrl('/products'));
        
        if (response.ok) {
          const data = await response.json();
          const productsArray = data?.products || data?.data?.products || data?.data || [];
          setProducts(Array.isArray(productsArray) ? productsArray : []);
        } else {
          logger.error('Erro ao carregar produtos', null, { page: 'marketplace', status: response.status });
          setProducts([]);
          toast.error('Não foi possível carregar os produtos');
        }
      } catch (err) {
        logger.error('Erro ao buscar produtos', err, { page: 'marketplace' });
        setProducts([]);
        toast.error('Erro ao carregar produtos. Tente novamente.');
      } finally {
        // setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { value: 'todos', label: 'Todos' },
    { value: 'graos', label: '🌾 Grãos e Cereais' },
    { value: 'maquinas', label: '🚜 Máquinas e Equipamentos' },
    { value: 'insumos', label: '🌱 Insumos Agrícolas' },
    { value: 'terras', label: '🏞️ Terras e Propriedades' },
    { value: 'madeira', label: '🪵 Madeira e Derivados' },
    { value: 'pecuaria', label: '🐄 Pecuária' },
    { value: 'servicos', label: '⚙️ Serviços Agrícolas' }
  ];

  const states = [
    { value: 'todos', label: 'Todos os Estados' },
    { value: 'mt', label: 'Mato Grosso' },
    { value: 'sp', label: 'São Paulo' },
    { value: 'go', label: 'Goiás' },
    { value: 'pr', label: 'Paraná' },
    { value: 'ms', label: 'Mato Grosso do Sul' },
    { value: 'mg', label: 'Minas Gerais' }
  ];

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    if (!product || typeof product !== 'object') return false;
    
    const title = product.title || product.name || '';
    const description = product.description || '';
    const location = product.location || product.city || product.state || '';
    
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesState = selectedState === 'todos' || location.toLowerCase().includes(selectedState);

    return matchesSearch && matchesCategory && matchesState;
  });

  const features = [
    {
      icon: <TrendingUp size={48} />,
      title: t('marketplace.featureCommodities'),
      description: t('marketplace.featureCommoditiesDesc'),
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(34, 197, 94, 0.2)',
      emoji: '📈'
    },
    {
      icon: <Users size={48} />,
      title: t('marketplace.featureNetwork'),
      description: t('marketplace.featureNetworkDesc'),
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(59, 130, 246, 0.2)',
      emoji: '👥'
    },
    {
      icon: <Shield size={48} />,
      title: t('marketplace.featureSecurity'),
      description: t('marketplace.featureSecurityDesc'),
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(168, 85, 247, 0.2)',
      emoji: '🔒'
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      text: t('marketplace.benefit1')
    },
    {
      icon: <CheckCircle size={24} />,
      text: t('marketplace.benefit2')
    },
    {
      icon: <CheckCircle size={24} />,
      text: t('marketplace.benefit3')
    },
    {
      icon: <CheckCircle size={24} />,
      text: t('marketplace.benefit4')
    },
    {
      icon: <CheckCircle size={24} />,
      text: t('marketplace.benefit5')
    },
    {
      icon: <CheckCircle size={24} />,
      text: t('marketplace.benefit6')
    }
  ];

  // Função para buscar cadastros públicos
  // const fetchPublicRegistrations = async () => {
  //   try {
  //     const response = await fetch('/api/registration/marketplace/public');
  //     const data = await response.json();
  //     if (data.success) {
  //       setPublicRegistrations(data.data);
  //     }
  //   } catch (error) {
  //     console.error('Erro ao buscar cadastros públicos:', error);
  //   }
  // };

  useEffect(() => {
    // Buscar cadastros públicos
    // fetchPublicRegistrations();
  }, []);

  const handleEmailSubmit = e => {
    e.preventDefault();
    if (process.env.NODE_ENV !== 'production') {

      console.log('Email submitted:', email);

    }
  };

  return (
    <div data-page='marketplace'>
      {/* HERO COM IMAGEM DE PRODUTOS */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/1387913618/pt/foto/modern-interface-payments-online-shopping-and-icon-customer-network-connection.jpg?s=612x612&w=0&k=20&c=VZuOaJFJxBjZYtLygWCpgGrCg1Bu2kHEm-ufWlYeeb4=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-green-900/30'></div>
        <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              background: 'rgba(34, 197, 94, 0.15)',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e' }}>
              🛒 {t('marketplace.heroTitle')}
            </span>
          </motion.div>

          <motion.h1
            className='mb-6 text-7xl font-bold'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}
          >
            🌾 {t('marketplace.title')}
          </motion.h1>
          <motion.p
            className='mb-8 text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              maxWidth: '800px', 
              margin: '0 auto 2rem', 
              lineHeight: '1.8',
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)'
            }}
          >
            <strong>{t('marketplace.categories')}</strong>
            <br/><br/>
            {t('marketplace.heroSubtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('marketplace.verifiedSellers')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>💰</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('marketplace.competitivePrices')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('marketplace.secureTransactions')}</span>
            </div>
          </motion.div>

          <motion.div
            className='flex justify-center gap-4 flex-wrap'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                window.location.href = token ? '/user-dashboard' : '/signup/product';
              }}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {t('marketplace.registerProductFree')}
            </button>
            <button 
              style={{
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {t('marketplace.exploreCategories')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Filtros e Produtos */}
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
            <h2 className='agro-section-title'>{t('marketplace.productsServicesTitle')}</h2>
            <p className='agro-section-subtitle'>{t('marketplace.productsServicesSubtitle')}</p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            className='agro-card-animated'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'var(--card-bg)',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              borderRadius: '16px',
              boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
              marginBottom: '2rem',
              border: '2px solid rgba(42, 127, 79, 0.08)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: 'clamp(0.75rem, 2vw, 1rem)',
                alignItems: 'end'
              }}
            >
              {/* Busca */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  <Search size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Buscar
                </label>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder='Digite o produto...'
                  className='agro-btn-animated'
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid rgba(42, 127, 79, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'rgba(42, 127, 79, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* Categoria */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  <Filter size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className='agro-btn-animated'
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid rgba(42, 127, 79, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'rgba(42, 127, 79, 0.05)',
                    cursor: 'pointer'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>📍 Estado</label>
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className='agro-btn-animated'
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid rgba(42, 127, 79, 0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'rgba(42, 127, 79, 0.05)',
                    cursor: 'pointer'
                  }}
                >
                  {states.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Botão de Cadastro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem'
            }}
          >
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                window.location.href = token ? '/user-dashboard' : '/signup/product';
              }}
              className='agro-btn-animated'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(42, 127, 79, 0.3)'
              }}
            >
              <UserPlus size={20} />
              Cadastrar nos Produtos
            </button>
          </motion.div>

          {/* Grid de Produtos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(1rem, 2.5vw, 1.5rem)',
              width: '100%'
            }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className='agro-card-animated'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
                style={{
                  height: '100%',
                  display: 'flex'
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='agro-text-center'
              style={{ 
                padding: '3rem', 
                color: 'var(--muted)',
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '2px dashed rgba(42, 127, 79, 0.2)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros ou cadastrar um novo produto!</p>
            </motion.div>
          )}
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
              <Clock size={32} />
            </div>
            <h2 className='agro-section-title'>{t('marketplace.statusTitle')}</h2>
            <p className='agro-section-subtitle'>{t('marketplace.statusSubtitle')}</p>
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
                whileHover={{ y: -12, scale: 1.05 }}
                style={{ 
                  position: 'relative',
                  background: feature.gradient,
                  border: feature.border,
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                  {feature.emoji}
                </div>
                <div className='agro-card-icon' style={{ color: feature.color, marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 className='agro-card-title' style={{ fontSize: '1.4rem', fontWeight: 'bold', color: feature.color, marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p className='agro-card-description' style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>
                  {feature.description}
                </p>
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
            <h2 className='agro-section-title'>{t('marketplace.featuresTitle')}</h2>
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
              {t('marketplace.stayTuned')}
            </h2>
            <p className='agro-section-subtitle' style={{ marginBottom: 'var(--agro-space-xl)' }}>
              {t('marketplace.stayTunedDesc')}
            </p>

            <form
              onSubmit={handleEmailSubmit}
              style={{ display: 'flex', gap: 'var(--agro-space-md)', maxWidth: '500px', margin: '0 auto' }}
            >
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('marketplace.emailPlaceholder')}
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
                {t('marketplace.subscribe')}
                <ArrowRight size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Modal de Cadastro - REMOVIDO */}
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='marketplace' style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AgroisyncMarketplace;
