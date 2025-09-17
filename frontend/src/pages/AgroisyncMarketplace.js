import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';
import ProductCard from '../components/ProductCard';

const AgroisyncMarketplace = () => {
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedState, setSelectedState] = useState('todos');

  // Dados de produtos do marketplace
  const products = [
    {
      id: 1,
      title: 'Sementes Híbridas de Soja',
      description: 'Sementes certificadas de alta produtividade para plantio direto',
      price: 'R$ 180,00/saca',
      image: '/assets/marketplace.png',
      category: 'insumos',
      location: 'Mato Grosso'
    },
    {
      id: 2,
      title: 'Trator John Deere 8584',
      description: 'Trator agrícola com 180cv, ideal para grandes propriedades',
      price: 'R$ 120.000,00',
      image: '/assets/marketplace.png',
      category: 'maquinas',
      location: 'São Paulo'
    },
    {
      id: 3,
      title: 'Fertilizante NPK 20-10-10',
      description: 'Fertilizante granulado para aplicação em pré-plantio',
      price: 'R$ 2.800,00/ton',
      image: '/assets/marketplace.png',
      category: 'insumos',
      location: 'Goiás'
    },
    {
      id: 4,
      title: 'Colheitadeira Case IH',
      description: 'Colheitadeira com capacidade de 12 toneladas por hora',
      price: 'R$ 850.000,00',
      image: '/assets/marketplace.png',
      category: 'maquinas',
      location: 'Paraná'
    },
    {
      id: 5,
      title: 'Gado Nelore Certificado',
      description: 'Lote de 50 cabeças de gado nelore com certificação',
      price: 'R$ 3.500,00/cabeça',
      image: '/assets/marketplace.png',
      category: 'pecuaria',
      location: 'Mato Grosso do Sul'
    },
    {
      id: 6,
      title: 'Serviço de Mapeamento com Drone',
      description: 'Mapeamento aéreo para análise de solo e plantio',
      price: 'R$ 150,00/hectare',
      image: '/assets/marketplace.png',
      category: 'servicos',
      location: 'Minas Gerais'
    }
  ];

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
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Users size={32} />,
      title: 'Rede de Produtores',
      description: 'Conecte-se com milhares de produtores e compradores confiáveis',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Shield size={32} />,
      title: 'Transações Seguras',
      description: 'Blockchain e criptografia para garantir a segurança de todas as transações',
      color: 'var(--txc-light-green)',
    },
  ];

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      text: 'Preços competitivos do mercado',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Transações instantâneas',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Suporte 24/7',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Relatórios detalhados',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Integração com sistemas existentes',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Certificação de qualidade',
    },
  ];

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };


  return (
    <div>
      {/* HERO COM IMAGEM 4K DE MARKETPLACE */}
      <AgroisyncHeroPrompt 
        title="Marketplace Agro"
        subtitle="Conecte-se com compradores e vendedores de commodities agrícolas"
        heroImage="/assets/marketplace.png"
        showCTA={true}
      />

      {/* Filtros e Produtos */}
      <section className="agro-section" style={{ background: 'var(--bg-gradient)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="agro-text-center"
            style={{ marginBottom: '2rem' }}
          >
            <h2 className="agro-section-title">Produtos Disponíveis</h2>
            <p className="agro-section-subtitle">
              Encontre os melhores produtos e serviços para seu agronegócio
            </p>
          </motion.div>

          {/* Filtros */}
          <motion.div
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }}>
              {/* Busca */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  <Search size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Buscar
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o produto..."
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  📍 Estado
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
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
              className="agro-text-center"
              style={{ padding: '3rem', color: 'var(--muted)' }}
            >
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros para encontrar o que você procura.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <div style={{
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
            }}>
              <Clock size={32} />
            </div>
            <h2 className="agro-section-title">Status do Marketplace</h2>
            <p className="agro-section-subtitle">
              Plataforma em desenvolvimento com tecnologia de ponta
            </p>
          </motion.div>

          <div className="agro-cards-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="agro-card agro-fade-in"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--agro-green-accent)',
                  borderRadius: 'var(--agro-radius-xl) var(--agro-radius-xl) 0 0'
                }} />
                
                <div className="agro-card-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="agro-card-title">
                  {feature.title}
                </h3>
                <p className="agro-card-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Benefícios do Marketplace</h2>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-lg)' 
          }}>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                className="agro-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-md)', padding: 'var(--agro-space-lg)' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  flexShrink: 0
                }}>
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
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{
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
            }}>
              <Star size={32} />
            </div>
            <h2 className="agro-section-title" style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Fique por Dentro
            </h2>
            <p className="agro-section-subtitle" style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Receba atualizações sobre o lançamento do marketplace
            </p>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 'var(--agro-space-md)', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
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
                type="submit"
                className="agro-btn agro-btn-primary"
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
    </div>
  );
};

export default AgroisyncMarketplace;
