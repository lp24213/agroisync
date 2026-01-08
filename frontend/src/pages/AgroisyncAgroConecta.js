import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../config/constants';
import {
  MapPin,
  Search,
  Calendar,
  Package,
  Eye,
  MessageSquare,
  Bot,
  Download,
  UserPlus,
  Truck,
  X
} from 'lucide-react';
import CloudflareTurnstile from '../components/CloudflareTurnstile';
import FreightCard from '../components/FreightCard';
import CryptoHash from '../components/CryptoHash';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AgroisyncAgroConecta = () => {
  const { t } = useTranslation();
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  // const [publicRegistrations, setPublicRegistrations] = useState([]);

  // Ofertas de frete - buscar da API
  const [ofertasFrete, setOfertasFrete] = useState([]);
  const [loadingFreights, setLoadingFreights] = useState(true);

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

  const handleFreteSubmit = async e => {
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
        items: [
          {
            name: freteForm.tipoCarga || 'Carga',
            description: 'Carga transportada',
            quantity: parseFloat(freteForm.volume) || 1,
            unit: 'toneladas',
            weight: parseFloat(freteForm.volume) || 1,
            category: 'other'
          }
        ],
        pricing: {
          basePrice: 2000, // Preço base estimado
          currency: 'BRL'
        }
      };

      // Incluir o token do Turnstile na requisição
      const response = await axios.post('/api/freight-orders', 
        { 
          ...freightOrderData,
          turnstileToken: turnstileToken 
        }, 
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });

      if (response.data.success) {
        toast.success('Pedido de frete criado com sucesso!');
        setFreteForm({ origem: '', destino: '', volume: '', data: '', tipoCarga: '' });
        // Recarregar lista de pedidos
        loadMyOrders();
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // Erro ao criar pedido de frete
      }
      toast.error('Erro ao criar pedido de frete');
    }
  };

  const handleStartTracking = orderId => {
    const order = myOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setTrackingUpdates(order.trackingEvents || []);
      setShowTrackingModal(true);
    }
  };

  const loadMyOrders = async () => {
    try {
      const response = await axios.get('/api/freight-orders', {
        headers: {
          Authorization: `Bearer ${user?.token || getAuthToken()}`
        }
      });

      if (response.data.success) {
        setMyOrders(response.data.data);
      }
    } catch (error) {
      // Silenciar erro ao carregar pedidos
      // Não mostrar toast de erro para não poluir a interface
    }
  };

  const handleAIClosure = async orderId => {
    try {
      const order = myOrders.find(o => o.id === orderId);
      setSelectedOrder(order);

      // Chamar API para gerar análise de IA
      const response = await axios.post(
        `/api/freight-orders/${orderId}/ai-closure`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );

      if (response.data.success) {
        setAiClosureData(response.data.data.freightOrder.aiClosure);
        setShowAIClosureModal(true);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // Erro ao gerar análise de IA
      }
      toast.error('Erro ao gerar análise. Tente novamente.');
    }
  };

  const handleCloseOrder = async () => {
    try {
      const response = await axios.post(
        `/api/freight-orders/${selectedOrder.id}/complete-closure`,
        {
          confirmClosure: true,
          rating: 5,
          comment: 'Excelente serviço!'
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Pedido fechado com sucesso!');
        setShowAIClosureModal(false);
        setAiClosureData(null);
        // Recarregar lista de pedidos
        loadMyOrders();
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // Erro ao fechar pedido
      }
      toast.error('Erro ao fechar pedido');
    }
  };

  // Função para buscar cadastros públicos
  // const fetchPublicRegistrations = async () => {
  //   try {
  //     const response = await fetch('/api/registration/agroconecta/public');
  //     const data = await response.json();
  //     if (data.success) {
  //       setPublicRegistrations(data.data);
  //     }
  //   } catch (error) {
  //     Erro ao buscar cadastros públicos
  //   }
  // };

  // Carregar pedidos quando a página carregar
  useEffect(() => {
    const loadMyOrders = async () => {
      // Só carregar pedidos se o usuário estiver logado
      if (!user?.token) {
        setMyOrders([]);
        return;
      }

      try {
        const response = await axios.get('/api/freight-orders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        if (response.data.success) {
          setMyOrders(response.data.data);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // Erro ao carregar pedidos
        }
        // SEM DADOS FALSOS - apenas array vazio
        setMyOrders([]);
      }
    };

    // Buscar cadastros públicos
    // fetchPublicRegistrations();

    loadMyOrders();
    
    // Buscar fretes públicos disponíveis
    const fetchPublicFreights = async () => {
      try {
        setLoadingFreights(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'https://agroisync.com/api';
        const response = await axios.get(`${apiUrl}/freights`);
        
        if (response.data.success && response.data.data) {
          const freights = response.data.data.freights || response.data.data || [];
          setOfertasFrete(Array.isArray(freights) ? freights : []);
        }
      } catch (error) {
        // Silenciar erro - usar mock data
        setOfertasFrete([]);
      } finally {
        setLoadingFreights(false);
      }
    };
    
    fetchPublicFreights();
  }, [user?.token]);


  return (
    <>
      <Helmet>
        <title>Fretes e Logística do Agronegócio | AGROISYNC</title>
        <meta name="description" content="Sistema de fretes inteligente para o agronegócio. Rastreamento GPS em tempo real, economia de até 40%, cotação instantânea por IA. Conecte-se com transportadores verificados." />
        <meta name="keywords" content="fretes agrícolas, logística agronegócio, transporte agrícola, rastreamento GPS, cotação frete, transportadores agrícolas" />
        <meta property="og:title" content="Fretes e Logística do Agronegócio | AGROISYNC" />
        <meta property="og:description" content="Sistema de fretes inteligente com rastreamento GPS em tempo real e economia de até 40%." />
        <link rel="canonical" href="https://agroisync.com/frete" />
      </Helmet>
      <div data-page='agroconecta' style={{ minHeight: '100vh' }}>
      {/* Hero Section com Imagem de Fundo */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=1080&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/70 via-black/50 to-orange-900/30'></div>
        <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
          <div
            style={{ 
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>
              🚛 Fretes e Logística do Agronegócio
            </span>
          </div>

          <h1
            className='mb-6 text-7xl font-bold'
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            Fretes e Logística
          </h1>
          <p
            className='mb-8 text-xl'
            style={{
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}
          >
            Encontre ou ofereça transporte para o agronegócio. Rastreamento GPS em tempo real e economia de até 40%.
          </p>
        </div>
      </section>

      {/* Formulários Funcionais */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', background: '#ffffff' }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
              Buscar Fretes ou Oferecer Transporte
            </h2>
          </div>

          {/* Tabs */}
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              background: 'white',
              borderRadius: '12px',
              padding: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              margin: '0 auto 2rem auto'
            }}>
            <button
              onClick={() => setActiveTab('buscar')}
              className='agro-btn-animated'
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
              className='agro-btn-animated'
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
              <Truck size={12} style={{ marginRight: '0.25rem', display: 'inline' }} />
              Ofertas Disponíveis
            </button>
            <button
              onClick={() => setActiveTab('meus-pedidos')}
              className='agro-btn-animated'
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
              <Package size={12} style={{ marginRight: '0.25rem', display: 'inline' }} />
              Meus Pedidos
            </button>
          </div>

          {/* Botão de Cadastro */}
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                window.location.href = token ? '/user-dashboard' : '/signup/freight';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={12} />
              Cadastrar como Transportador
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          {activeTab === 'buscar' && (
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--accent)' }}>Buscar Frete</h3>
              <form onSubmit={handleFreteSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <MapPin size={10} style={{ marginRight: '0.25rem', display: 'inline' }} />
                      Origem
                    </label>
                    <input
                      type='text'
                      value={freteForm.origem}
                      onChange={e => setFreteForm({ ...freteForm, origem: e.target.value })}
                      placeholder='Cidade, Estado'
                      className='agro-btn-animated'
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <MapPin size={10} style={{ marginRight: '0.25rem', display: 'inline' }} />
                      Destino
                    </label>
                    <input
                      type='text'
                      value={freteForm.destino}
                      onChange={e => setFreteForm({ ...freteForm, destino: e.target.value })}
                      placeholder='Cidade, Estado'
                      className='agro-btn-animated'
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <Package size={10} style={{ marginRight: '0.25rem', display: 'inline' }} />
                      Volume
                    </label>
                    <input
                      type='text'
                      value={freteForm.volume}
                      onChange={e => setFreteForm({ ...freteForm, volume: e.target.value })}
                      placeholder='Ex: 50 toneladas'
                      className='agro-btn-animated'
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <Calendar size={10} style={{ marginRight: '0.25rem', display: 'inline' }} />
                      Data de Coleta
                    </label>
                    <input
                      type='date'
                      value={freteForm.data}
                      onChange={e => setFreteForm({ ...freteForm, data: e.target.value })}
                      className='agro-btn-animated'
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid rgba(42, 127, 79, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: 'rgba(42, 127, 79, 0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      required
                    />
                  </div>
                </div>
                
                {/* Adicionando o componente CloudflareTurnstile */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <CloudflareTurnstile onVerify={token => setTurnstileToken(token)} />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button
                    type='submit'
                    className='btn agro-btn-animated'
                    style={{
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}
                  >
                    <Search size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
                    {t('agroconecta.searchCarriers').replace('🔍 ', '')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'ofertas' && (
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
              }}>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(42, 127, 79, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '16px',
                marginBottom: '2rem',
                textAlign: 'center',
                border: '2px solid rgba(42, 127, 79, 0.1)'
              }}>
                <h3 style={{ 
                  marginBottom: '0.5rem', 
                  color: 'var(--accent)', 
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  fontWeight: '700'
                }}>
                  🚛 {ofertasFrete.length} Fretes Disponíveis Agora!
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  Encontre o melhor frete para sua carga
                </p>
              </div>

              {loadingFreights ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                  <p>Carregando fretes disponíveis...</p>
                </div>
              ) : ofertasFrete.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  background: 'var(--card-bg)',
                  borderRadius: '16px',
                  border: '2px dashed rgba(42, 127, 79, 0.2)'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                  <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Nenhum frete disponível no momento</h4>
                  <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Seja o primeiro a cadastrar!</p>
                  <button
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      window.location.href = token ? '/user-dashboard' : '/signup/freight';
                    }}
                    className='agro-btn-animated'
                    style={{
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <UserPlus size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
                    Cadastrar Frete
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                  gap: 'clamp(1rem, 2vw, 1.5rem)',
                  width: '100%'
                }}>
                  {/* LIMITAÇÃO: Usuários gratuitos veem até 10 fretes (5 completos + 5 com blur) */}
                  {ofertasFrete.slice(0, user?.plan === 'profissional' || user?.plan === 'enterprise' ? undefined : 10).map((oferta, index) => (
                    <FreightCard key={oferta.id} freight={oferta} index={index} />
                  ))}
                  
                  {/* Mensagem de upgrade após o limite */}
                  {(!user || (user.plan === 'gratuito' && ofertasFrete.length > 10)) && (
                      <div style={{ 
                      gridColumn: '1 / -1',
                      padding: '2rem',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                      border: '3px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      marginTop: '1rem'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                      <h3 style={{ 
                        color: '#d97706', 
                        fontSize: '1.5rem', 
                        fontWeight: '700',
                          marginBottom: '0.5rem'
                        }}>
                        Desbloqueie TODOS os Fretes!
                      </h3>
                      <p style={{ 
                        color: 'var(--muted)', 
                        marginBottom: '1.5rem',
                        fontSize: '1rem'
                      }}>
                        Você está vendo apenas {user ? '10' : '5'} fretes. Faça upgrade para ter acesso ilimitado!
                      </p>
                        <div style={{ 
                          display: 'flex', 
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {!user && (
                        <button
                            onClick={() => window.location.href = '/register'}
                          style={{
                              padding: '1rem 2rem',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '1rem',
                            fontWeight: '700',
                              cursor: 'pointer',
                              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                            }}
                          >
                            📝 Criar Conta Grátis
                          </button>
                        )}
                        <button
                          onClick={() => window.location.href = '/plans'}
                          style={{
                            padding: '1rem 2rem',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
                          }}
                        >
                          🚀 Ver Planos Premium
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'meus-pedidos' && (
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem'
                  }}
                >
                  Meus Pedidos de Frete
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Acompanhe seus pedidos e use o chat para comunicação em tempo real
                </p>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {myOrders.map(order => (
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
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem'
                          }}
                        >
                          Pedido {order.orderNumber}
                        </h4>
                        <div
                          style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                        >
                          <span>
                            📦 {order.origin.city}, {order.origin.state} → {order.destination.city},{' '}
                            {order.destination.state}
                          </span>
                          <span>💰 R$ {order.pricing.totalPrice.toLocaleString()}</span>
                          <span>📅 {new Date(order.pickupDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background:
                            order.status === 'delivered'
                              ? '#10b981'
                              : order.status === 'in_transit'
                                ? '#3b82f6'
                                : '#f59e0b',
                          color: 'white'
                        }}
                      >
                        {order.status === 'delivered'
                          ? 'Entregue'
                          : order.status === 'in_transit'
                            ? 'Em Trânsito'
                            : 'Pendente'}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginTop: '1rem'
                      }}
                    >
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
            </div>
          )}
        </div>
      </section>


      {/* Modal de Rastreamento */}
      {showTrackingModal && selectedOrder && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}
            >
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
                <span>
                  📦 {selectedOrder.origin.city}, {selectedOrder.origin.state} → {selectedOrder.destination.city},{' '}
                  {selectedOrder.destination.state}
                </span>
                <span>📅 {new Date(selectedOrder.pickupDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {trackingUpdates.map((event, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background:
                        event.status === 'delivered' ? '#10b981' : event.status === 'in_transit' ? '#3b82f6' : '#f59e0b'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {event.status === 'picked_up'
                        ? 'Carga Coletada'
                        : event.status === 'in_transit'
                          ? 'Em Trânsito'
                          : 'Entregue'}
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

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--accent)',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <MessageSquare size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Use o chat para comunicação em tempo real com o transportador
            </div>
          </div>
        </div>
      )}

      {/* Modal de AI Closure */}
      {showAIClosureModal && selectedOrder && aiClosureData && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}
            >
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
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{aiClosureData.summary}</p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Entrega no Prazo</div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: aiClosureData.performanceMetrics.onTimeDelivery ? '#10b981' : '#ef4444'
                    }}
                  >
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
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{aiClosureData.suggestedMessage}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Rascunho da Fatura
              </h4>
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{aiClosureData.invoiceDraft}</span>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <Download size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Baixar
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}
            >
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

      {/* Modal de Cadastro - REMOVIDO */}

      {/* Modal de Planos */}
      {showPlansModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-800'>{t('agroconecta.premiumPlans')}</h2>
                <button onClick={() => setShowPlansModal(false)} className='text-gray-500 hover:text-gray-700'>
                  <X size={24} />
                </button>
              </div>
              <div className='py-8 text-center'>
                <h3 className='text-xl font-semibold text-gray-600'>Sistema de Planos em Desenvolvimento</h3>
                <p className='mt-2 text-gray-500'>Em breve teremos planos disponíveis para você!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='agro-conecta' style={{ display: 'none' }} />
      </div>
      </div>
    </>
  );
};

export default AgroisyncAgroConecta;
