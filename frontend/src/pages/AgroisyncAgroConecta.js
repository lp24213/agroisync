import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Search,
  Calendar,
  Package,
  DollarSign
} from 'lucide-react';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';

const AgroisyncAgroConecta = () => {
  const [activeTab, setActiveTab] = useState('buscar');
  const [freteForm, setFreteForm] = useState({
    origem: '',
    destino: '',
    volume: '',
    data: '',
    tipoCarga: ''
  });

  // Dados de ofertas de frete
  const ofertasFrete = [
    {
      id: 1,
      transportador: 'Transportadora ABC',
      origem: 'São Paulo, SP',
      destino: 'Mato Grosso, MT',
      volume: '50 toneladas',
      preco: 'R$ 2.500,00',
      data: '15/12/2024',
      avaliacao: 4.8,
      veiculo: 'Caminhão Truck 6x2'
    },
    {
      id: 2,
      transportador: 'Logística XYZ',
      origem: 'Paraná, PR',
      destino: 'Goiás, GO',
      volume: '30 toneladas',
      preco: 'R$ 1.800,00',
      data: '18/12/2024',
      avaliacao: 4.6,
      veiculo: 'Caminhão Bitruck'
    },
    {
      id: 3,
      transportador: 'Frete Express',
      origem: 'Minas Gerais, MG',
      destino: 'Bahia, BA',
      volume: '25 toneladas',
      preco: 'R$ 2.200,00',
      data: '20/12/2024',
      avaliacao: 4.9,
      veiculo: 'Caminhão Truck 6x4'
    }
  ];

  const handleFreteSubmit = (e) => {
    e.preventDefault();
    console.log('Buscar frete:', freteForm);
    // Aqui seria feita a integração com a API
  };
  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Frete Inteligente',
      description: 'Conecte-se com transportadores confiáveis e otimize seus custos de frete',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <MapPin size={32} />,
      title: 'Rastreamento em Tempo Real',
      description: 'Acompanhe sua carga em tempo real com tecnologia GPS avançada',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Users size={32} />,
      title: 'Rede de Parceiros',
      description: 'Conecte-se com uma rede confiável de transportadores e produtores',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Zap size={32} />,
      title: 'IA para Logística',
      description: 'Algoritmos inteligentes para otimizar rotas e reduzir custos',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Shield size={32} />,
      title: 'Segurança Total',
      description: 'Proteção completa para sua carga com seguro e monitoramento',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Clock size={32} />,
      title: 'Entrega Rápida',
      description: 'Entregas mais rápidas com otimização de rotas e gestão eficiente',
      color: 'var(--txc-light-green)',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Cadastre sua Carga',
      description: 'Informe os detalhes da sua carga e destino',
      icon: <Truck size={24} />,
    },
    {
      number: '02',
      title: 'Encontre Transportadores',
      description: 'Receba propostas de transportadores qualificados',
      icon: <MapPin size={24} />,
    },
    {
      number: '03',
      title: 'Acompanhe a Entrega',
      description: 'Monitore sua carga em tempo real até o destino',
      icon: <CheckCircle size={24} />,
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div>
      {/* HERO COM IMAGEM 4K DE CAMINHÕES */}
      <AgroisyncHeroPrompt 
        title="AgroConecta"
        subtitle="Logística Inteligente para o Agronegócio"
        heroImage="/assets/agroconecta.png"
        showCTA={true}
      />

      {/* Features Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="agro-text-center"
          >
            <motion.h2 className="agro-section-title" variants={itemVariants}>
              Recursos Principais
            </motion.h2>
            <motion.p className="agro-section-subtitle" variants={itemVariants}>
              Tecnologia avançada para revolucionar a logística agro
            </motion.p>
          </motion.div>

          <div className="agro-cards-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="agro-card agro-fade-in agro-card-animated"
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

      {/* Formulários Funcionais */}
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
            <h2 className="agro-section-title">AgroConecta em Ação</h2>
            <p className="agro-section-subtitle">
              Busque fretes ou ofereça seus serviços de transporte
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '0.5rem',
              boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}
          >
            <button
              onClick={() => setActiveTab('buscar')}
              className="agro-btn-animated"
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: activeTab === 'buscar' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'buscar' ? 'white' : 'var(--muted)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Search size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Buscar Frete
            </button>
            <button
              onClick={() => setActiveTab('ofertas')}
              className="agro-btn-animated"
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: activeTab === 'ofertas' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'ofertas' ? 'white' : 'var(--muted)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Truck size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Ofertas Disponíveis
            </button>
          </motion.div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'buscar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--accent)' }}>
                Buscar Frete
              </h3>
              <form onSubmit={handleFreteSubmit}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <MapPin size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                      Origem
                    </label>
                    <input
                      type="text"
                      value={freteForm.origem}
                      onChange={(e) => setFreteForm({...freteForm, origem: e.target.value})}
                      placeholder="Cidade, Estado"
                      className="agro-btn-animated"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <MapPin size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                      Destino
                    </label>
                    <input
                      type="text"
                      value={freteForm.destino}
                      onChange={(e) => setFreteForm({...freteForm, destino: e.target.value})}
                      placeholder="Cidade, Estado"
                      className="agro-btn-animated"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <Package size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                      Volume
                    </label>
                    <input
                      type="text"
                      value={freteForm.volume}
                      onChange={(e) => setFreteForm({...freteForm, volume: e.target.value})}
                      placeholder="Ex: 50 toneladas"
                      className="agro-btn-animated"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                      Data de Coleta
                    </label>
                    <input
                      type="date"
                      value={freteForm.data}
                      onChange={(e) => setFreteForm({...freteForm, data: e.target.value})}
                      className="agro-btn-animated"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    className="btn agro-btn-animated"
                    style={{
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}
                  >
                    <Search size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
                    Buscar Transportadores
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'ofertas' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                maxWidth: '1000px',
                margin: '0 auto'
              }}
            >
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--accent)' }}>
                Ofertas de Frete Disponíveis
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {ofertasFrete.map((oferta, index) => (
                  <motion.div
                    key={oferta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card agro-card-animated"
                    style={{
                      padding: '1.5rem',
                      background: 'var(--card-bg)',
                      borderRadius: '12px',
                      boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
                      border: '1px solid rgba(42, 127, 79, 0.1)'
                    }}
                  >
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                        {oferta.transportador}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Star size={16} style={{ color: '#FFD700', marginRight: '0.25rem' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                          {oferta.avaliacao}/5.0
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <MapPin size={16} style={{ color: 'var(--accent)', marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.9rem' }}>
                          {oferta.origem} → {oferta.destino}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Package size={16} style={{ color: 'var(--accent)', marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.9rem' }}>{oferta.volume}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Calendar size={16} style={{ color: 'var(--accent)', marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.9rem' }}>{oferta.data}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Truck size={16} style={{ color: 'var(--accent)', marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '0.9rem' }}>{oferta.veiculo}</span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(42, 127, 79, 0.1)'
                    }}>
                      <div>
                        <DollarSign size={20} style={{ color: 'var(--accent)', display: 'inline', marginRight: '0.25rem' }} />
                        <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>
                          {oferta.preco}
                        </strong>
                      </div>
                      <button
                        className="btn small"
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        Contratar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
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
              <Star size={32} />
            </div>
            <h2 className="agro-section-title">Como Funciona</h2>
            <p className="agro-section-subtitle">
              Processo simples e eficiente em apenas 3 passos
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-xl)' 
          }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="agro-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ textAlign: 'center', position: 'relative' }}
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
                
                <div 
                  style={{ 
                    fontSize: '3rem',
                    marginBottom: 'var(--agro-space-lg)',
                    fontWeight: '900',
                    background: 'var(--agro-gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'var(--agro-font-secondary)'
                  }}
                >
                  {step.number}
                </div>
                
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto var(--agro-space-lg) auto',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-2xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  boxShadow: 'var(--agro-shadow-md)'
                }}>
                  {step.icon}
                </div>
                
                <h3 className="agro-card-title" style={{ marginBottom: 'var(--agro-space-md)' }}>
                  {step.title}
                </h3>
                <p className="agro-card-description">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Globe size={32} />
            </div>
            <h2 className="agro-section-title" style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Pronto para Conectar?
            </h2>
            <p className="agro-section-subtitle" style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Junte-se à maior rede de logística do agronegócio brasileiro
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--agro-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="agro-btn agro-btn-primary">
                Tenho Carga
                <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="agro-btn agro-btn-secondary">
                Sou Transportador
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncAgroConecta;
