import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  DollarSign,
  Eye,
  MessageSquare,
  Bot,
  Download
} from 'lucide-react';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AgroisyncAgroConecta = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('buscar');
  const [freteForm, setFreteForm] = useState({
    origem: '',
    destino: '',
    volume: '',
    data: '',
    tipoCarga: ''
  });
  const [myOrders, setMyOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showAIClosureModal, setShowAIClosureModal] = useState(false);
  const [trackingUpdates, setTrackingUpdates] = useState([]);
  const [aiClosureData, setAiClosureData] = useState(null);

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

  // Dados mockados para pedidos do usuário
  const mockOrders = [
    {
      id: 'FR-001',
      orderNumber: 'FR-001',
      status: 'in_transit',
      origin: { city: 'São Paulo', state: 'SP' },
      destination: { city: 'Mato Grosso', state: 'MT' },
      pickupDate: '2024-01-15',
      deliveryDateEstimate: '2024-01-18',
      items: [{ name: 'Soja', quantity: 50, unit: 'toneladas' }],
      pricing: { totalPrice: 2500 },
      trackingEvents: [
        { timestamp: '2024-01-15T08:00:00Z', status: 'picked_up', location: { city: 'São Paulo', state: 'SP' } },
        { timestamp: '2024-01-16T14:30:00Z', status: 'in_transit', location: { city: 'Campinas', state: 'SP' } },
        { timestamp: '2024-01-17T10:15:00Z', status: 'in_transit', location: { city: 'Ribeirão Preto', state: 'SP' } }
      ]
    },
    {
      id: 'FR-002',
      orderNumber: 'FR-002',
      status: 'delivered',
      origin: { city: 'Paraná', state: 'PR' },
      destination: { city: 'Goiás', state: 'GO' },
      pickupDate: '2024-01-10',
      deliveryDateEstimate: '2024-01-13',
      deliveryDateActual: '2024-01-13',
      items: [{ name: 'Milho', quantity: 30, unit: 'toneladas' }],
      pricing: { totalPrice: 1800 },
      trackingEvents: [
        { timestamp: '2024-01-10T09:00:00Z', status: 'picked_up', location: { city: 'Paraná', state: 'PR' } },
        { timestamp: '2024-01-11T16:00:00Z', status: 'in_transit', location: { city: 'São Paulo', state: 'SP' } },
        { timestamp: '2024-01-13T11:30:00Z', status: 'delivered', location: { city: 'Goiás', state: 'GO' } }
      ]
    }
  ];

  const handleFreteSubmit = async (e) => {
    e.preventDefault();
    try {
      // Criar pedido de frete via API
      const freightOrderData = {
        sellerId: '507f1f77bcf86cd799439011', // Mock seller ID
        origin: {
          address: freteForm.origem,
          city: freteForm.origem.split(',')[0]?.trim() || '',
          state: freteForm.origem.split(',')[1]?.trim() || '',
          zipCode: '',
          contact: {
            name: 'Contato Origem',
            phone: '',
            email: ''
          }
        },
        destination: {
          address: freteForm.destino,
          city: freteForm.destino.split(',')[0]?.trim() || '',
          state: freteForm.destino.split(',')[1]?.trim() || '',
          zipCode: '',
          contact: {
            name: 'Contato Destino',
            phone: '',
            email: ''
          }
        },
        pickupDate: freteForm.data,
        deliveryDateEstimate: new Date(new Date(freteForm.data).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: [{
          name: freteForm.tipoCarga || 'Carga',
          description: 'Carga transportada',
          quantity: parseFloat(freteForm.volume) || 1,
          unit: 'toneladas',
          weight: parseFloat(freteForm.volume) || 1,
          category: 'other'
        }],
        pricing: {
          basePrice: 2000, // Preço base estimado
          currency: 'BRL'
        }
      };

      const response = await axios.post('/api/freight-orders', freightOrderData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Pedido de frete criado com sucesso!');
        setFreteForm({ origem: '', destino: '', volume: '', data: '', tipoCarga: '' });
        // Recarregar lista de pedidos
        loadMyOrders();
      }
    } catch (error) {
      console.error('Erro ao criar pedido de frete:', error);
      toast.error('Erro ao criar pedido de frete');
    }
  };

  const handleStartTracking = (orderId) => {
    const order = mockOrders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setTrackingUpdates(order.trackingEvents);
    setShowTrackingModal(true);
  };

  const loadMyOrders = async () => {
    try {
      const response = await axios.get('/api/freight-orders', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.data.success) {
        setMyOrders(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    }
  };

  const handleAIClosure = async (orderId) => {
    try {
      const order = myOrders.find(o => o.id === orderId);
      setSelectedOrder(order);
      
      // Chamar API para gerar análise de IA
      const response = await axios.post(`/api/freight-orders/${orderId}/ai-closure`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setAiClosureData(response.data.data.freightOrder.aiClosure);
        setShowAIClosureModal(true);
      }
    } catch (error) {
      console.error('Erro ao gerar análise de IA:', error);
      // Fallback para dados mockados
      const mockAIClosure = {
        summary: 'Pedido entregue dentro do prazo estimado. Performance excelente.',
        performanceMetrics: {
          onTimeDelivery: true,
          damageReport: 'Nenhum dano reportado',
          delayReason: null,
          overallScore: 5
        },
        suggestedMessage: 'Obrigado pela confiança! Pedido entregue com sucesso.',
        invoiceDraft: 'Fatura FR-002 - R$ 1.800,00 - Entregue em 13/01/2024'
      };
      
      setAiClosureData(mockAIClosure);
      setShowAIClosureModal(true);
    }
  };

  const handleCloseOrder = async () => {
    try {
      const response = await axios.post(`/api/freight-orders/${selectedOrder.id}/complete-closure`, {
        confirmClosure: true,
        rating: 5,
        comment: 'Excelente serviço!'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Pedido fechado com sucesso!');
        setShowAIClosureModal(false);
        setAiClosureData(null);
        // Recarregar lista de pedidos
        loadMyOrders();
      }
    } catch (error) {
      console.error('Erro ao fechar pedido:', error);
      toast.error('Erro ao fechar pedido');
    }
  };

  // Carregar pedidos quando a página carregar
  useEffect(() => {
    const loadMyOrders = async () => {
      try {
        const response = await axios.get('/api/freight-orders', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        if (response.data.success) {
          setMyOrders(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        toast.error('Erro ao carregar pedidos');
      }
    };
    
    loadMyOrders();
  }, [user?.token]);

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
    <div data-page="agroconecta">
      {/* HERO COM IMAGEM 4K DE CAMINHÕES */}
      <AgroisyncHeroPrompt 
        title="AgroConecta"
        subtitle="Logística Inteligente para o Agronegócio"
        heroImage="/assets/agroconecta.png"
        showCTA={true}
        primaryButton={{ text: "Explorar AgroConecta", link: "/agroconecta" }}
        secondaryButton={{ text: "Ver Transportadoras", link: "/agroconecta" }}
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
            <button
              onClick={() => setActiveTab('meus-pedidos')}
              className="agro-btn-animated"
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: activeTab === 'meus-pedidos' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'meus-pedidos' ? 'white' : 'var(--muted)',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Package size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Meus Pedidos
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

          {activeTab === 'meus-pedidos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(15, 15, 15, 0.05)',
                maxWidth: '1000px',
                margin: '0 auto'
              }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)', 
                  marginBottom: '1rem' 
                }}>
                  Meus Pedidos de Frete
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Acompanhe seus pedidos e use o chat para comunicação em tempo real
                </p>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h4 style={{ 
                          fontSize: '1.1rem', 
                          fontWeight: '600', 
                          color: 'var(--text-primary)',
                          marginBottom: '0.5rem'
                        }}>
                          Pedido {order.orderNumber}
                        </h4>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <span>📦 {order.origin.city}, {order.origin.state} → {order.destination.city}, {order.destination.state}</span>
                          <span>💰 R$ {order.pricing.totalPrice.toLocaleString()}</span>
                          <span>📅 {new Date(order.pickupDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: order.status === 'delivered' ? '#10b981' : 
                                   order.status === 'in_transit' ? '#3b82f6' : '#f59e0b',
                        color: 'white'
                      }}>
                        {order.status === 'delivered' ? 'Entregue' : 
                         order.status === 'in_transit' ? 'Em Trânsito' : 'Pendente'}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap',
                      marginTop: '1rem'
                    }}>
                      <button
                        onClick={() => handleStartTracking(order.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'var(--accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Eye size={16} />
                        Rastrear
                      </button>
                      
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'transparent',
                          color: 'var(--accent)',
                          border: '1px solid var(--accent)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <MessageSquare size={16} />
                        Chat
                      </button>

                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleAIClosure(order.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Bot size={16} />
                          AI Closure
                        </button>
                      )}

                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Download size={16} />
                        Fatura
                      </button>
                    </div>
                  </div>
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

      {/* Modal de Rastreamento */}
      {showTrackingModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Rastreamento - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>📦 {selectedOrder.origin.city}, {selectedOrder.origin.state} → {selectedOrder.destination.city}, {selectedOrder.destination.state}</span>
                <span>📅 {new Date(selectedOrder.pickupDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {trackingUpdates.map((event, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: event.status === 'delivered' ? '#10b981' : 
                               event.status === 'in_transit' ? '#3b82f6' : '#f59e0b'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {event.status === 'picked_up' ? 'Carga Coletada' :
                       event.status === 'in_transit' ? 'Em Trânsito' : 'Entregue'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {event.location.city}, {event.location.state}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(event.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'var(--accent)', 
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center'
            }}>
              <MessageSquare size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Use o chat para comunicação em tempo real com o transportador
            </div>
          </div>
        </div>
      )}

      {/* Modal de AI Closure */}
      {showAIClosureModal && selectedOrder && aiClosureData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                <Bot size={24} style={{ marginRight: '0.5rem', display: 'inline' }} />
                AI Closure - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShowAIClosureModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Resumo da Performance
              </h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {aiClosureData.summary}
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Entrega no Prazo</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: aiClosureData.performanceMetrics.onTimeDelivery ? '#10b981' : '#ef4444' }}>
                    {aiClosureData.performanceMetrics.onTimeDelivery ? 'Sim' : 'Não'}
                  </div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Avaliação Geral</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--accent)' }}>
                    {aiClosureData.performanceMetrics.overallScore}/5
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Mensagem Sugerida
              </h4>
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {aiClosureData.suggestedMessage}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Rascunho da Fatura
              </h4>
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {aiClosureData.invoiceDraft}
                </span>
                <button style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  <Download size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Baixar
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowAIClosureModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseOrder}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                Fechar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgroisyncAgroConecta;
