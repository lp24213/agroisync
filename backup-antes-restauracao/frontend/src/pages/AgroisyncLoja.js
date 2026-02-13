import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import productService from '../services/productService';
import {
  Star,
  Heart,
  Filter,
  Search,
  Truck,
  Shield,
  Package,
  UserPlus,
  MapPin,
  Eye,
  X
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';
import logger from '../services/logger';

const AgroisyncLoja = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('relevancia');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);

  // Carregar produtos reais do backend
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // setLoading(true);
      const productsData = await productService.getProducts();
      const productsArray = productsData?.products || productsData?.data || productsData || [];
      setProducts(Array.isArray(productsArray) ? productsArray : []);
    } catch (error) {
      logger.error('Erro ao carregar produtos', error, { page: 'loja' });
      setProducts([]);
    } finally {
      // setLoading(false);
    }
  };

  const categories = [
    { value: 'todos', label: 'Todos os Produtos' },
    { value: 'maquinas', label: 'Máquinas Agrícolas' },
    { value: 'insumos', label: 'Insumos Agrícolas' },
    { value: 'defensivos', label: 'Defensivos' },
    { value: 'ferramentas', label: 'Ferramentas' }
  ];

  const sortOptions = [
    { value: 'relevancia', label: 'Mais Relevantes' },
    { value: 'preco-menor', label: 'Menor Preço' },
    { value: 'preco-maior', label: 'Maior Preço' },
    { value: 'avaliacao', label: 'Melhor Avaliação' },
    { value: 'novidade', label: 'Mais Novos' }
  ];

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    if (!product || typeof product !== 'object') return false;
    
    const name = product.name || product.title || '';
    const description = product.description || '';
    
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const features = [
    {
      icon: <Shield size={48} />,
      title: 'Pagamento 100% Seguro',
      description: 'Receba seu dinheiro garantido com proteção contra fraudes e chargebacks. Integração com PIX, boleto e cartões',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(34, 197, 94, 0.2)',
      emoji: '💳'
    },
    {
      icon: <Truck size={48} />,
      title: 'Frete Automático Integrado',
      description: 'Calcule frete automaticamente com nossa rede de transportadoras. Rastreio em tempo real para seu cliente',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(59, 130, 246, 0.2)',
      emoji: '🚚'
    },
    {
      icon: <Package size={48} />,
      title: 'Gestão Completa de Estoque',
      description: 'Controle total de produtos, variações, estoque e vendas. Dashboard com relatórios e análises em tempo real',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(168, 85, 247, 0.2)',
      emoji: '📦'
    },
    {
      icon: <Star size={48} />,
      title: 'Loja Personalizada',
      description: 'Escolha cores, logo e layout. Domínio próprio disponível. Sua marca, seu jeito!',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(249, 115, 22, 0.2)',
      emoji: '🎨'
    }
  ];

  // Função para buscar cadastros públicos
  // const fetchPublicRegistrations = async () => {
  //   try {
  //     const response = await fetch('/api/registration/loja/public');
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

  return (
    <>
      <Helmet>
        <title>Loja Virtual para Agronegócio | AGROISYNC</title>
        <meta name="description" content="Crie sua loja virtual para o agronegócio em minutos. Venda sem comissão, pagamento garantido e frete integrado. Pronta para começar a vender!" />
        <meta name="keywords" content="loja virtual agronegócio, e-commerce agrícola, vender produtos agrícolas online" />
        <meta property="og:title" content="Loja Virtual para Agronegócio | AGROISYNC" />
        <meta property="og:description" content="Crie sua loja virtual em minutos. Venda sem comissão e com pagamento garantido." />
        <link rel="canonical" href="https://agroisync.com/loja" />
      </Helmet>
      <div className='agro-loja-container' data-page='loja'>
      {/* Hero Section */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/2235929731/pt/foto/e-commerce-business-with-digital-shopping-cart-icons-for-online-store-digital-marketing-and.jpg?s=612x612&w=0&k=20&c=PuPwyebMsSW7UFTurrlronetuOOwQBbcB_zT8Jki7VM=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-orange-900/50 via-black/70 to-yellow-900/30'></div>
        <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              background: 'rgba(249, 115, 22, 0.15)',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(249, 115, 22, 0.3)',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f97316' }}>
              🛍️ E-commerce Premium do Agronegócio
            </span>
          </motion.div>

          <motion.h1
            className='mb-6'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              background: 'linear-gradient(135deg, #ffffff 0%, #f97316 50%, #eab308 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            🏪 {t('store.heroTitle')}
          </motion.h1>
          <motion.p
            className='mb-8 text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              maxWidth: '700px', 
              margin: '0 auto 2rem', 
              lineHeight: '1.6',
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)'
            }}
          >
            {t('store.heroSubtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>🎁</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>0% Comissão</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>💳</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Pagamento Garantido</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>🚚</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Frete Integrado</span>
            </div>
          </motion.div>

          <motion.div
            className='flex justify-center gap-4 flex-wrap'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              to='/register'
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4)',
                border: 'none',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚀 Abrir Minha Loja Grátis
            </Link>
            <Link
              to='/marketplace'
              style={{
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
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
              🛒 Ver Produtos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section - AGORA PRIMEIRO! */}
      <section className='agro-products-section' style={{ background: 'var(--bg-gradient)' }}>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='agro-text-center'
            style={{ marginBottom: '2rem' }}
          >
            <h2 className='agro-section-title'>{t('store.successStores')}</h2>
            <p className='agro-section-subtitle'>{t('store.successStoresSubtitle')}</p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            className='agro-filters-container agro-card-animated'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='agro-filters-grid'>
              {/* Busca */}
              <div className='agro-filter-group'>
                <label className='agro-filter-label'>
                  <Search size={16} />
                  Buscar Lojas
                </label>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder='Digite o nome da loja ou vendedor...'
                  className='agro-btn-animated'
                />
              </div>

              {/* Categoria */}
              <div className='agro-filter-group'>
                <label className='agro-filter-label'>
                  <Filter size={16} />
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className='agro-btn-animated'
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div className='agro-filter-group'>
                <label className='agro-filter-label'>
                  <Package size={16} />
                  Ordenar por
                </label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className='agro-btn-animated'>
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => setShowRegistrationModal(true)}
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
              Cadastrar como Vendedor
            </button>

            <button
              onClick={() => setShowPlansModal(true)}
              className='agro-btn-animated'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Star size={20} />
              Ver Planos Premium
            </button>
          </motion.div>

          {/* Grid de Produtos */}
          <motion.div
            className='agro-products-grid'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Badge de Destaque */}
                {product.featured && (
                  <div className='absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1'>
                    <Star size={12} fill='white' />
                    Destaque
                  </div>
                )}

                {/* Imagem do Produto */}
                <div className='relative h-48 bg-gray-100 overflow-hidden'>
                  <img
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    loading='lazy'
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center'>
                    <div className='opacity-0 hover:opacity-100 transition-opacity duration-300 flex gap-2'>
                      <button className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-50'>
                        <Eye size={18} className='text-gray-700' />
                      </button>
                      <button className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-50'>
                        <Heart size={18} className='text-gray-700' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className='p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
                      {product.category || 'Produto'}
                    </span>
                    <div className='flex items-center gap-1'>
                      <Star size={14} className='text-yellow-400 fill-current' />
                      <span className='text-sm text-gray-600'>
                        {product.rating || 4.5} ({product.reviews || 0})
                      </span>
                    </div>
                  </div>

                  <h3 className='text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors'>
                    {product.name}
                  </h3>

                  <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                    {product.description}
                  </p>

                  {/* Localização */}
                  <div className='flex items-center gap-1 text-sm text-gray-500 mb-3'>
                    <MapPin size={14} />
                    <span>{product.location || 'Localização não informada'}</span>
                  </div>

                  {/* Preços */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex flex-col'>
                      <span className='text-2xl font-bold text-green-600'>
                        {product.price || 'R$ 0,00'}
                      </span>
                      {product.originalPrice && (
                        <span className='text-sm text-gray-500 line-through'>
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <div className='bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold'>
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className='flex gap-2'>
                    <button
                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2'
                      onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                    >
                      <Eye size={16} />
                      Ver Detalhes
                    </button>
                    <button
                      className='bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors duration-200'
                      onClick={() => {/* TODO: Implementar contato */}}
                    >
                      <Package size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='agro-text-center'
              style={{ padding: '3rem', color: 'var(--muted)' }}
            >
              <h3>Nenhuma loja encontrada</h3>
              <p>Tente ajustar os filtros ou seja o primeiro a criar sua loja na Agroisync!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section - AGORA DEPOIS DA LISTAGEM! */}
      <section className='agro-features-section'>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='agro-text-center'
            style={{ marginBottom: '3rem' }}
          >
            <h2 className='agro-section-title'>{t('store.whyCreateStore')}</h2>
            <p className='agro-section-subtitle'>{t('store.whyCreateStoreSubtitle')}</p>
          </motion.div>

          <div className='agro-features-grid'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className='agro-feature-card agro-card-animated'
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.05 }}
                style={{ 
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
                <div className='agro-feature-icon' style={{ color: feature.color, marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 className='agro-feature-title' style={{ fontSize: '1.4rem', fontWeight: 'bold', color: feature.color, marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p className='agro-feature-description' style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='agro-cta-section'>
        <div className='agro-container'>
          <motion.div
            className='agro-cta-content agro-card-animated'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>{t('store.needHelp')}</h2>
            <p>
              Nossa equipe está pronta para ajudar você a criar e gerenciar sua loja online de forma simples e rápida.
            </p>
            <div className='agro-cta-buttons'>
              <button
                onClick={() => {
                  // Primeiro tenta abrir o chatbot IA
                  const chatbotButton = document.querySelector('[data-chatbot], .chatbot-trigger, #chatbot-button');
                  if (chatbotButton) {
                    chatbotButton.click();
                  } else {
                    // Se não encontrar IA, vai direto para WhatsApp
                    window.open('https://wa.me/5566992362830?text=Olá! Preciso de ajuda para criar minha loja na Agroisync.', '_blank');
                  }
                }}
                className='agro-btn-primary agro-btn-animated'
                style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
              >
                <Shield size={20} />
                💬 Falar com IA ou Agente
              </button>
              <Link to='/produtos' className='agro-btn-secondary agro-btn-animated'>
                <Package size={20} />
                Ver Produtos e Serviços
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .agro-loja-container {
          background: #ffffff;
          min-height: 100vh;
        }

        .agro-features-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .agro-feature-card {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(76, 175, 80, 0.1);
          transition: all 0.3s ease;
        }

        .agro-feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem auto;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .agro-feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .agro-feature-description {
          color: #6c757d;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .agro-products-section {
          padding: 4rem 0;
        }

        .agro-filters-container {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 3rem;
          border: 1px solid rgba(76, 175, 80, 0.1);
        }

        .agro-filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          align-items: end;
        }

        .agro-filter-group {
          display: flex;
          flex-direction: column;
        }

        .agro-filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .agro-filter-group input,
        .agro-filter-group select {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid rgba(76, 175, 80, 0.2);
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(76, 175, 80, 0.05);
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .agro-filter-group input:focus,
        .agro-filter-group select:focus {
          outline: none;
          border-color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .agro-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .agro-product-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.1);
          transition: all 0.3s ease;
          position: relative;
        }

        .agro-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .agro-product-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          z-index: 2;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .agro-product-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .agro-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .agro-product-card:hover .agro-product-image img {
          transform: scale(1.05);
        }

        .agro-product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .agro-product-card:hover .agro-product-overlay {
          opacity: 1;
        }

        .agro-product-quick-view,
        .agro-product-favorite {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #2c3e50;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .agro-product-quick-view:hover,
        .agro-product-favorite:hover {
          background: #4caf50;
          color: #ffffff;
          transform: scale(1.1);
        }

        .agro-product-info {
          padding: 1.5rem;
        }

        .agro-product-category {
          color: #4caf50;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .agro-product-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }

        .agro-product-description {
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .agro-product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .agro-stars {
          display: flex;
          gap: 2px;
        }

        .agro-rating-text {
          color: #6c757d;
          font-size: 0.85rem;
        }

        .agro-product-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6c757d;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .agro-product-pricing {
          margin-bottom: 1.5rem;
        }

        .agro-price-current {
          font-size: 1.4rem;
          font-weight: 700;
          color: #4caf50;
          font-family: 'Inter', sans-serif;
        }

        .agro-price-original {
          font-size: 1rem;
          color: #6c757d;
          text-decoration: line-through;
          margin-top: 0.25rem;
        }

        .agro-discount-badge {
          display: inline-block;
          background: #ff6b35;
          color: #ffffff;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .agro-product-actions {
          display: flex;
          gap: 0.75rem;
        }

        .agro-btn-primary,
        .agro-btn-secondary {
          flex: 1;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .agro-btn-primary {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #ffffff;
        }

        .agro-btn-primary:hover {
          background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .agro-btn-secondary {
          background: transparent;
          color: #4caf50;
          border: 2px solid #4caf50;
        }

        .agro-btn-secondary:hover {
          background: #4caf50;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .agro-cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        }

        .agro-cta-content {
          background: rgba(255, 255, 255, 0.95);
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .agro-cta-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .agro-cta-content p {
          font-size: 1.2rem;
          color: #6c757d;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .agro-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .agro-cta-buttons .agro-btn-primary,
        .agro-cta-buttons .agro-btn-secondary {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .agro-features-grid {
            grid-template-columns: 1fr;
          }

          .agro-products-grid {
            grid-template-columns: 1fr;
          }

          .agro-filters-grid {
            grid-template-columns: 1fr;
          }

          .agro-product-actions {
            flex-direction: column;
          }

          .agro-cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .agro-cta-content h2 {
            font-size: 2rem;
          }

          .agro-cta-content p {
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Modal de Cadastro - REMOVIDO */}

      {/* Modal de Planos */}
      {showPlansModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-800'>Planos Premium - Loja</h2>
                <button onClick={() => setShowPlansModal(false)} className='text-gray-500 hover:text-gray-700'>
                  <X size={24} />
                </button>
              </div>
              <div className='py-8'>
                {/* Conteúdo dos planos será mostrado aqui */}
                <iframe 
                  src="/plans" 
                  className="w-full h-[600px] border-0"
                  title="Planos AgroSync"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='loja' style={{ display: 'none' }} />
      </div>

      {/* Botão Flutuante para Anunciar Produto */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link
          to="/produtos/sell"
          className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Package size={24} />
          <span className="font-semibold">Anunciar Produto</span>
        </Link>
      </motion.div>
    </div>
    </>
  );
};

export default AgroisyncLoja;
