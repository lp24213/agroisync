import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const AgroisyncMarketplace = () => {
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  // const [publicRegistrations, setPublicRegistrations] = useState([]);
  const [selectedState, setSelectedState] = useState('todos');

  // Dados de produtos do marketplace - VAZIO até usuários cadastrarem
  const products = [];

  const categories = [
    { value: 'todos', label: 'Todos' },
    { value: 'insumos', label: 'Insumos' },
    { value: 'maquinas', label: 'Máquinas' },
    { value: 'pecuaria', label: 'Pecuária' },
    { value: 'servicos', label: 'Serviços' }
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
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesState = selectedState === 'todos' || product.location.toLowerCase().includes(selectedState);

    return matchesSearch && matchesCategory && matchesState;
  });

  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Commodities em Tempo Real',
      description: 'Acompanhe cotações de soja, milho, café e outras commodities em tempo real',
      color: 'var(--agro-green)'
    },
    {
      icon: <Users size={32} />,
      title: 'Rede de Produtores',
      description: 'Conecte-se com milhares de produtores e compradores confiáveis',
      color: 'var(--agro-green)'
    },
    {
      icon: <Shield size={32} />,
      title: 'Transações Seguras',
      description: 'Blockchain e criptografia para garantir a segurança de todas as transações',
      color: 'var(--agro-green)'
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      text: 'Preços competitivos do mercado'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Transações instantâneas'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Suporte 24/7'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Relatórios detalhados'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Integração com sistemas existentes'
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Certificação de qualidade'
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
    console.log('Email submitted:', email);
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
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center'>
          <motion.h1
            className='mb-6 text-6xl font-bold text-white'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PRODUTOS
          </motion.h1>
          <motion.p
            className='mb-8 text-2xl text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Conectando produtores e compradores do agronegócio
          </motion.p>
          <motion.div
            className='flex justify-center gap-4'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={() => setShowRegistrationModal(true)}
              className='rounded-lg bg-green-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-green-700'
            >
              Cadastrar Produto
            </button>
            <button className='rounded-lg bg-white px-8 py-4 font-semibold text-green-600 transition-colors hover:bg-gray-100'>
              Explorar Categorias
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
            <h2 className='agro-section-title'>Produtos Disponíveis</h2>
            <p className='agro-section-subtitle'>Encontre os melhores produtos e serviços para seu agronegócio</p>
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
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className='agro-card-animated'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
              style={{ padding: '3rem', color: 'var(--muted)' }}
            >
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros para encontrar o que você procura.</p>
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
            <h2 className='agro-section-title'>Status dos Produtos</h2>
            <p className='agro-section-subtitle'>Plataforma em desenvolvimento com tecnologia de ponta</p>
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
            <h2 className='agro-section-title'>Benefícios dos Produtos</h2>
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
              Receba atualizações sobre o lançamento do marketplace
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

      {/* Modal de Cadastro */}
      {showRegistrationModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 max-w-md rounded-lg bg-white p-8'>
            <h3 className='text-xl font-semibold text-gray-600'>Sistema de Registro em Desenvolvimento</h3>
            <p className='mt-2 text-gray-500'>Em breve teremos sistema de registro disponível!</p>
            <button
              onClick={() => setShowRegistrationModal(false)}
              className='mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='marketplace' style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AgroisyncMarketplace;
