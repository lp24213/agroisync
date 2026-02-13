import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../config/constants';
// import RegistrationSystem from '../components/RegistrationSystem'; // Componente removido
// import PlansSystem from '../components/PlansSystem'; // Componente removido
import {
  Truck,
  MapPin,
  Clock,
  Users,
  Zap,
  UserPlus,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Search,
  Calendar,
  X,
  Package,
  DollarSign,
  Eye,
  MessageSquare,
  Bot,
  Download
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';
import CloudflareTurnstile from '../components/CloudflareTurnstile';
import FreightCard from '../components/FreightCard'; // NOVO: Card com limitações
// import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt'; // Componente removido
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

  const features = [
    {
      icon: <MapPin size={48} />,
      title: t('agroconecta.gpsTracking'),
      description: t('agroconecta.gpsTrackingDesc'),
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(59, 130, 246, 0.2)',
      emoji: '📍'
    },
    {
      icon: <DollarSign size={48} />,
      title: t('agroconecta.savingsFeature'),
      description: t('agroconecta.savingsFeatureDesc'),
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(34, 197, 94, 0.2)',
      emoji: '💰'
    },
    {
      icon: <Zap size={48} />,
      title: t('agroconecta.instantQuote'),
      description: t('agroconecta.instantQuoteDesc'),
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(168, 85, 247, 0.2)',
      emoji: '⚡'
    },
    {
      icon: <Shield size={48} />,
      title: t('agroconecta.freeInsurance'),
      description: t('agroconecta.freeInsuranceDesc'),
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(239, 68, 68, 0.2)',
      emoji: '🔒'
    }
  ];

  const steps = [
    {
      number: '01',
      title: t('agroconecta.step1'),
      description: t('agroconecta.step1Desc'),
      icon: <Truck size={24} />
    },
    {
      number: '02',
      title: t('agroconecta.step2'),
      description: t('agroconecta.step2Desc'),
      icon: <MapPin size={24} />
    },
    {
      number: '03',
      title: t('agroconecta.step3'),
      description: t('agroconecta.step3Desc'),
      icon: <CheckCircle size={24} />
    }
  ];

  const sectionVariants = {
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
    <>
      <Helmet>
        <title>Fretes e Logística do Agronegócio | AGROISYNC</title>
        <meta name="description" content="Sistema de fretes inteligente para o agronegócio. Rastreamento GPS em tempo real, economia de até 40%, cotação instantânea por IA. Conecte-se com transportadores verificados." />
        <meta name="keywords" content="fretes agrícolas, logística agronegócio, transporte agrícola, rastreamento GPS, cotação frete, transportadores agrícolas" />
        <meta property="og:title" content="Fretes e Logística do Agronegócio | AGROISYNC" />
        <meta property="og:description" content="Sistema de fretes inteligente com rastreamento GPS em tempo real e economia de até 40%." />
        <link rel="canonical" href="https://agroisync.com/frete" />
      </Helmet>
      <div data-page='agroconecta'>
      {/* HERO COM IMAGEM DE FRETE */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/1282700817/pt/foto/grain-auger-of-combine-pouring-soy-bean-into-tractor-trailer.jpg?s=612x612&w=0&k=20&c=VaxEcgSsi9jYW-gzMPXQDOrRgbr7FAIKV1VwcMB6qf4=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/50 via-black/70 to-cyan-900/30'></div>
        <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              marginBottom: '20px',
              display: 'inline-block'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>
              🚚 Logística Inteligente do Agronegócio
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
              background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            🚛 {t('agroconecta.heroTitle')}
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
            {t('agroconecta.heroSubtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>📍</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('agroconecta.realTimeTracking').replace('📍 ', '')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>💰</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('agroconecta.savingsUpTo').replace('💰 ', '')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{t('agroconecta.quoteInMinute').replace('⚡ ', '')}</span>
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
                window.location.href = token ? '/user-dashboard' : '/signup/freight';
              }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {t('agroconecta.quoteFreightNow')}
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
              {t('agroconecta.searchCarriers')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Formulários Funcionais - AGORA PRIMEIRO! */}
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
            <h2 className='agro-section-title'>{t('agroconecta.freightsInAction')}</h2>
            <p className='agro-section-subtitle'>Busque fretes ou ofereça seus serviços de transporte</p>
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
              <Truck size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
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
              <Package size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Meus Pedidos
            </button>
          </motion.div>

          {/* Botão de Cadastro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                window.location.href = token ? '/user-dashboard' : '/signup/freight';
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
              Cadastrar como Transportador
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
                      <MapPin size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
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
                      type='text'
                      value={freteForm.destino}
                      onChange={e => setFreteForm({ ...freteForm, destino: e.target.value })}
                      placeholder='Cidade, Estado'
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
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <Package size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
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
                      type='date'
                      value={freteForm.data}
                      onChange={e => setFreteForm({ ...freteForm, data: e.target.value })}
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
            </motion.div>
          )}

          {activeTab === 'ofertas' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                maxWidth: '1400px',
                margin: '0 auto'
              }}
            >
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
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section - AGORA DEPOIS DO PAINEL FUNCIONAL! */}
      <section className='agro-section'>
        <div className='agro-container'>
          <motion.div
            variants={sectionVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='agro-text-center'
          >
            <motion.h2 className='agro-section-title' variants={itemVariants}>
              {t('agroconecta.mainFeatures')}
            </motion.h2>
            <motion.p className='agro-section-subtitle' variants={itemVariants}>
              {t('agroconecta.mainFeaturesDesc')}
            </motion.p>
          </motion.div>

          <div className='agro-cards-grid' style={{ textAlign: 'center' }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className='agro-card agro-fade-in agro-card-animated'
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.05 }}
                style={{ 
                  position: 'relative', 
                  textAlign: 'center',
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
                <div className='agro-card-icon' style={{ color: feature.color, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem' }}>
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

      {/* How It Works Section */}
      <section className='agro-section' style={{ background: 'var(--agro-light-beige)' }}>
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
              <Star size={32} />
            </div>
            <h2 className='agro-section-title'>{t('agroconecta.howItWorks')}</h2>
            <p className='agro-section-subtitle'>{t('agroconecta.howItWorksDesc')}</p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--agro-space-xl)'
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className='agro-card'
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ textAlign: 'center', position: 'relative' }}
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

                <div
                  style={{
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
                  }}
                >
                  {step.icon}
                </div>

                <h3 className='agro-card-title' style={{ marginBottom: 'var(--agro-space-md)' }}>
                  {step.title}
                </h3>
                <p className='agro-card-description'>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Globe size={32} />
            </div>
            <h2 className='agro-section-title' style={{ marginBottom: 'var(--agro-space-lg)' }}>
              {t('agroconecta.readyToConnect')}
            </h2>
            <p className='agro-section-subtitle' style={{ marginBottom: 'var(--agro-space-xl)' }}>
              {t('agroconecta.readyToConnectDesc')}
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--agro-space-lg)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <Link to='/register' className='agro-btn agro-btn-primary' style={{ textAlign: 'center' }}>
                {t('agroconecta.haveLoad')}
                <ArrowRight size={20} />
              </Link>
              <Link to='/register' className='agro-btn agro-btn-secondary' style={{ textAlign: 'center' }}>
                {t('agroconecta.amCarrier')}
              </Link>
            </div>
          </motion.div>
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
