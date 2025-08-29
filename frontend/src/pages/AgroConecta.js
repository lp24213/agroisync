import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, MessageCircle, User, Plus, Edit, Trash, 
  Eye, Route, CreditCard, Settings, LogOut, Bell, MapPin,
  Lock, Package, Search, Filter, Star, Calendar, Weight,
  DollarSign, Shield, CheckCircle, AlertTriangle, TrendingUp,
  Users, Globe, Award, Zap, Leaf, Building2, ArrowRight,
  Map, FileText, ShieldCheck
} from 'lucide-react';
import FreightCard from '../components/FreightCard';
import FreightFilters from '../components/FreightFilters';
import freightService, { TRUCK_TYPES, CARGO_TYPES, FREIGHT_STATUS } from '../services/freightService';
import transactionService from '../services/transactionService';
import DocumentValidator from '../components/DocumentValidator';
import baiduMapsService from '../services/baiduMapsService';
import receitaService from '../services/receitaService';

const AgroConecta = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('freights');
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [userFreights, setUserFreights] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [freights, setFreights] = useState([]);
  const [loadingFreights, setLoadingFreights] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    truckTypes: [],
    locations: [],
    minPrice: '',
    maxPrice: '',
    minWeight: '',
    maxWeight: '',
    minRating: 0,
    sortBy: 'relevance',
    dateRange: 'any'
  });

  // Dados simulados para demonstração
  const truckTypes = [
    { value: 'truck_3_4', label: 'Truck 3/4' },
    { value: 'truck_toco', label: 'Truck Toco' },
    { value: 'truck_truck', label: 'Truck Truck' },
    { value: 'truck_carreta', label: 'Carreta' },
    { value: 'truck_pickup', label: 'Pickup' },
    { value: 'truck_van', label: 'Van' }
  ];

  const locations = [
    'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Santa Catarina',
    'Rio Grande do Sul', 'Goiás', 'Mato Grosso', 'Mato Grosso do Sul', 'Bahia'
  ];

  const [newFreight, setNewFreight] = useState({
    origin: '',
    destination: '',
    weight: '',
    price: '',
    date: '',
    description: '',
    truckType: 'truck_3_4',
    requirements: '',
    insurance: false,
    negotiable: true,
    // Campos para validação
    carrierType: 'individual', // 'individual' ou 'company'
    cpf: '',
    cnpj: '',
    ie: '',
    state: '',
    city: '',
    cep: '',
    address: '',
    phone: '',
    email: ''
  });

  // Estados para integrações de serviços
  const [showDocumentValidator, setShowDocumentValidator] = useState(false);
  const [showLocationValidator, setShowLocationValidator] = useState(false);
  const [documentValidationResult, setDocumentValidationResult] = useState(null);
  const [locationValidationResult, setLocationValidationResult] = useState(null);
  const [isValidatingDocument, setIsValidatingDocument] = useState(false);
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  
  // Estados para formulário de frete
  const [showFreightForm, setShowFreightForm] = useState(false);
  const [freightValidationErrors, setFreightValidationErrors] = useState({});

  useEffect(() => {
    if (user && !isAdmin) {
      loadUserData();
    }
    loadPublicFreights();
    // Inicializar serviços
    initializeServices();
  }, [user, isAdmin]);

  const initializeServices = async () => {
    try {
      await baiduMapsService.initialize();
      await receitaService.initialize();
    } catch (error) {
      console.error('Erro ao inicializar serviços:', error);
    }
  };

  const loadUserData = async () => {
    try {
      if (!user?._id && !user?.id) return;

      // Carregar fretes do usuário usando o serviço
      const userFreightsData = await freightService.getUserFreights(user._id || user.id, 'posted');
      setUserFreights(userFreightsData);

      // Carregar fretes onde o usuário se candidatou
      const appliedFreights = await freightService.getUserFreights(user._id || user.id, 'applied');
      
      // Carregar transações do usuário
      const userTransactions = await transactionService.getUserTransactions(user._id || user.id);
      const freightTransactions = userTransactions.filter(txn => txn.type === 'FREIGHT');
      
      // Carregar mensagens das transações
      const allMessages = [];
      for (const txn of freightTransactions) {
        const messages = await transactionService.getTransactionMessages(txn.id);
        allMessages.push(...messages.map(msg => ({ 
          ...msg, 
          transactionId: txn.id,
          from: txn.buyerId === (user._id || user.id) ? 'Comprador' : 'Anunciante'
        })));
      }
      setUserMessages(allMessages);
      
      // Carregar perfil do usuário
      setUserProfile({
        name: user.name,
        email: user.email,
        phone: user.phone || 'Não informado',
          rating: 4.8,
        completedFreights: 45,
        totalEarnings: 12500
      });
      
      // Carregar histórico
      setUserHistory([
        { id: 1, type: 'freight_posted', description: 'Frete São Paulo → Rio de Janeiro', date: '2024-01-15', amount: 1200 },
        { id: 2, type: 'freight_completed', description: 'Frete Minas Gerais → Paraná', date: '2024-01-10', amount: 800 },
        { id: 3, type: 'payment_received', description: 'Pagamento recebido', date: '2024-01-08', amount: 800 }
      ]);
      
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Funções de validação de documentos
  const handleDocumentValidation = async (documents) => {
    setIsValidatingDocument(true);
    try {
      const results = await receitaService.validateDocuments(documents);
      setDocumentValidationResult(results);
      setShowDocumentValidator(false);
    } catch (error) {
      console.error('Erro na validação de documentos:', error);
      alert('Erro ao validar documentos. Tente novamente.');
    } finally {
      setIsValidatingDocument(false);
    }
  };

  // Funções de validação de localização
  const handleLocationValidation = async (address, type) => {
    setIsValidatingLocation(true);
    try {
      const result = await baiduMapsService.validateBrazilianAddress(address);
      if (type === 'origin') {
        setOriginCoordinates(result.coordinates);
        setNewFreight(prev => ({ ...prev, origin: address }));
      } else if (type === 'destination') {
        setDestinationCoordinates(result.coordinates);
        setNewFreight(prev => ({ ...prev, destination: address }));
      }
      setLocationValidationResult(result);
      setShowLocationValidator(false);
    } catch (error) {
      console.error('Erro na validação de localização:', error);
      alert('Erro ao validar endereço. Tente novamente.');
    } finally {
      setIsValidatingLocation(false);
    }
  };

  // Função para calcular rota entre origem e destino
  const calculateRoute = async () => {
    if (originCoordinates && destinationCoordinates) {
      try {
        const route = await baiduMapsService.calculateRoute(
          originCoordinates,
          destinationCoordinates,
          'driving'
        );
        console.log('Rota calculada:', route);
        // Aqui você pode exibir a rota no mapa ou em uma interface
    } catch (error) {
        console.error('Erro ao calcular rota:', error);
      }
    }
  };

  const loadPublicFreights = async () => {
    try {
      setLoadingFreights(true);
      // Simular carregamento de fretes públicos
      const mockFreights = [
        {
          id: 1,
          origin: 'São Paulo, SP',
          destination: 'Rio de Janeiro, RJ',
          weight: 5000,
          price: 850.00,
          date: '2024-01-15',
          status: 'available',
          truckType: 'truck_3_4',
          description: 'Carga de produtos agrícolas para o Rio de Janeiro',
          requirements: 'Caminhão com baú refrigerado',
          insurance: true,
          negotiable: true,
          announcerName: 'João Silva',
          verified: true,
          announcerRating: 4.8,
          announcerReviews: 127,
          createdAt: new Date('2024-01-10')
        },
        {
          id: 2,
          origin: 'Campinas, SP',
          destination: 'Curitiba, PR',
          weight: 3500,
          price: 650.00,
          date: '2024-01-20',
          status: 'available',
          truckType: 'truck_toco',
          description: 'Transporte de máquinas agrícolas',
          requirements: 'Caminhão com plataforma',
          insurance: false,
          negotiable: true,
          announcerName: 'Maria Santos',
          verified: true,
          announcerRating: 4.6,
          announcerReviews: 89,
          createdAt: new Date('2024-01-08')
        },
        {
          id: 3,
          origin: 'Goiânia, GO',
          destination: 'Brasília, DF',
          weight: 8000,
          price: 450.00,
          date: '2024-01-18',
          status: 'available',
          truckType: 'truck_carreta',
          description: 'Carga de grãos para Brasília',
          requirements: 'Carreta graneleira',
          insurance: true,
          negotiable: false,
          announcerName: 'Pedro Oliveira',
          verified: false,
          announcerRating: 4.2,
          announcerReviews: 45,
          createdAt: new Date('2024-01-05')
        },
        {
          id: 4,
          origin: 'Uberlândia, MG',
          destination: 'São Paulo, SP',
          weight: 6000,
          price: 750.00,
          date: '2024-01-22',
          status: 'available',
          truckType: 'truck_truck',
          description: 'Transporte de produtos lácteos',
          requirements: 'Caminhão com baú refrigerado',
          insurance: true,
          negotiable: true,
          announcerName: 'Ana Costa',
          verified: true,
          announcerRating: 4.9,
          announcerReviews: 156,
          createdAt: new Date('2024-01-12')
        },
        {
          id: 5,
          origin: 'Londrina, PR',
          destination: 'Porto Alegre, RS',
          weight: 4000,
          price: 580.00,
          date: '2024-01-25',
          status: 'available',
          truckType: 'truck_3_4',
          description: 'Carga de frutas para Porto Alegre',
          requirements: 'Caminhão com baú ventilado',
          insurance: false,
          negotiable: true,
          announcerName: 'Carlos Ferreira',
          verified: true,
          announcerRating: 4.4,
          announcerReviews: 67,
          createdAt: new Date('2024-01-09')
        },
        {
          id: 6,
          origin: 'Vitória, ES',
          destination: 'Belo Horizonte, MG',
          weight: 7000,
          price: 680.00,
          date: '2024-01-28',
          status: 'available',
          truckType: 'truck_toco',
          description: 'Transporte de equipamentos',
          requirements: 'Caminhão com plataforma',
          insurance: true,
          negotiable: false,
          announcerName: 'Roberto Lima',
          verified: false,
          announcerRating: 4.1,
          announcerReviews: 34,
          createdAt: new Date('2024-01-06')
        }
      ];

      // Gerar dados mock se não existirem
      const existingFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
      if (existingFreights.length === 0) {
        freightService.generateMockData();
      }
      
      // Carregar fretes usando o serviço
      const freightsData = await freightService.getPublicFreights(filters);
      setFreights(freightsData);
    } catch (error) {
      console.error('Erro ao carregar fretes:', error);
    } finally {
      setLoadingFreights(false);
    }
  };

  const handleAddFreight = async () => {
    if (newFreight.origin && newFreight.destination && newFreight.price) {
      try {
        const freightData = {
        ...newFreight,
        price: parseFloat(newFreight.price),
          weight: parseFloat(newFreight.weight) || 0,
          carrier: (user?._id || user?.id) || 'user_anonymous',
          cargoType: 'general'
        };
        
        const createdFreight = await freightService.createFreight(freightData);
        
        if (createdFreight) {
          setUserFreights([...userFreights, createdFreight]);
      setNewFreight({ 
        origin: '', destination: '', weight: '', price: '', 
        date: '', description: '', truckType: 'truck_3_4',
        requirements: '', insurance: false, negotiable: true
      });
          
          // Recarregar fretes públicos
          await loadPublicFreights();
        }
      } catch (error) {
        console.error('Erro ao criar frete:', error);
        alert('Erro ao criar frete. Tente novamente.');
      }
    }
  };

  const handleDeleteFreight = async (freightId) => {
    try {
      const result = await freightService.deleteFreight(freightId);
      if (result?.success) {
    setUserFreights(userFreights.filter(f => f.id !== freightId));
        // Recarregar fretes públicos
        await loadPublicFreights();
      }
    } catch (error) {
      console.error('Erro ao deletar frete:', error);
      alert('Erro ao deletar frete. Tente novamente.');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const toggleSecretPanel = () => {
    setShowSecretPanel(!showSecretPanel);
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    
    // Aplicar filtros em tempo real
    try {
      const filteredFreights = await freightService.getPublicFreights(newFilters);
      setFreights(filteredFreights);
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
    }
  };

  const handleFreightContact = (freight) => {
    // Implementar contato com o anunciante
    console.log('Contatando anunciante do frete:', freight.id);
  };

  const handleFreightFavorite = (freightId, isFavorite) => {
    // Implementar sistema de favoritos
    console.log('Favoritando frete:', freightId, isFavorite);
  };

  const handleFreightView = (freight) => {
    // Implementar visualização detalhada
    console.log('Visualizando frete:', freight.id);
  };

  const handleFreightApply = async (freight) => {
    if (!user) {
      alert('Faça login para se candidatar a fretes');
      navigate('/login');
      return;
    }

    try {
      // Criar transação de intermediação (FREIGHT)
      const transaction = await transactionService.createTransaction({
        type: 'FREIGHT',
        itemId: freight._id || freight.id,
        itemModel: 'Freight',
        buyerId: user._id || user.id,
        sellerId: freight.carrier._id || freight.carrier,
        status: 'PENDING',
        items: [{
          id: freight._id || freight.id,
          name: `Frete ${freight.publicData?.originCity || freight.origin} → ${freight.publicData?.destinationCity || freight.destination}`,
          price: freight.publicData?.freightValue || freight.price,
          quantity: 1,
          unit: 'frete'
        }],
        total: freight.publicData?.freightValue || freight.price,
        shipping: {
          origin: freight.publicData?.originCity || freight.origin,
          destination: freight.publicData?.destinationCity || freight.destination,
          weight: freight.publicData?.weight || freight.weight,
          truckType: freight.publicData?.freightType || freight.truckType
        }
      });

      if (transaction) {
        // Notificar usuários
        await transactionService.notifyUsers(transaction);
        
        // Redirecionar para painel com mensageria aberta
        navigate(`/painel?transactionId=${transaction.id}&tab=messages`);
        
        alert('Candidatura registrada! Redirecionando para mensageria...');
      }
    } catch (error) {
      console.error('Erro ao se candidatar ao frete:', error);
      alert('Erro ao se candidatar. Tente novamente.');
    }
  };

  // Validação de documentos para fretes via Receita Federal
  const validateFreightDocuments = async () => {
    setIsValidatingDocument(true);
    setDocumentValidationResult(null);
    setFreightValidationErrors(prev => ({ ...prev, cpf: null, cnpj: null, ie: null }));

    try {
      await receitaService.initialize();
      
      let validationResults = {};
      
      if (newFreight.carrierType === 'individual') {
        if (newFreight.cpf) {
          const cpfResult = await receitaService.validateCPF(newFreight.cpf);
          validationResults.cpf = cpfResult;
          
          if (!cpfResult.valid) {
            setFreightValidationErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
          }
        }
      } else {
        if (newFreight.cnpj) {
          const cnpjResult = await receitaService.validateCNPJ(newFreight.cnpj);
          validationResults.cnpj = cnpjResult;
          
          if (!cnpjResult.valid) {
            setFreightValidationErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido' }));
          }
        }
        
        if (newFreight.ie && newFreight.state) {
          const ieResult = await receitaService.validateIE(newFreight.ie, newFreight.state);
          validationResults.ie = ieResult;
          
          if (!ieResult.valid) {
            setFreightValidationErrors(prev => ({ ...prev, ie: 'Inscrição Estadual inválida' }));
          }
        }
      }
      
      setDocumentValidationResult(validationResults);
      
      // Verificar se todas as validações passaram
      const allValid = Object.values(validationResults).every(result => result.valid);
      return allValid;
      
    } catch (error) {
      console.error('Erro na validação de documentos:', error);
      alert('Erro ao validar documentos. Tente novamente.');
      return false;
    } finally {
      setIsValidatingDocument(false);
    }
  };

  // Validação de endereço para fretes via Baidu Maps e IBGE
  const validateFreightAddress = async () => {
    setIsValidatingLocation(true);
    setLocationValidationResult(null);
    setFreightValidationErrors(prev => ({ ...prev, origin: null, destination: null }));

    try {
      await baiduMapsService.initialize();
      
      let validationResults = {};
      
      // Validação de origem
      if (newFreight.origin) {
        const originResult = await baiduMapsService.validateBrazilianAddress(newFreight.origin);
        validationResults.origin = originResult;
        
        if (originResult.valid) {
          setOriginCoordinates(originResult.coordinates);
        } else {
          setFreightValidationErrors(prev => ({ ...prev, origin: 'Endereço de origem não encontrado' }));
        }
      }
      
      // Validação de destino
      if (newFreight.destination) {
        const destinationResult = await baiduMapsService.validateBrazilianAddress(newFreight.destination);
        validationResults.destination = destinationResult;
        
        if (destinationResult.valid) {
          setDestinationCoordinates(destinationResult.coordinates);
        } else {
          setFreightValidationErrors(prev => ({ ...prev, destination: 'Endereço de destino não encontrado' }));
        }
      }
      
      setLocationValidationResult(validationResults);
      
      // Verificar se todas as validações passaram
      const allValid = Object.values(validationResults).every(result => result.valid);
      return allValid;
      
    } catch (error) {
      console.error('Erro na validação de endereço:', error);
      alert('Erro ao validar endereço. Tente novamente.');
      return false;
    } finally {
      setIsValidatingLocation(false);
    }
  };

  // Função para cadastrar frete
  const handleFreightSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validar documentos primeiro
      const documentsValid = await validateFreightDocuments();
      if (!documentsValid) {
        alert('Por favor, corrija os erros de validação dos documentos antes de continuar.');
        return;
      }
      
      // Validar endereços
      const addressesValid = await validateFreightAddress();
      if (!addressesValid) {
        alert('Por favor, corrija os erros de validação dos endereços antes de continuar.');
        return;
      }
      
      // Criar o frete
      const freightData = {
        ...newFreight,
        originCoordinates,
        destinationCoordinates,
        carrier: {
          id: user._id || user.id,
          name: user.name,
          type: newFreight.carrierType,
          documents: {
            cpf: newFreight.cpf,
            cnpj: newFreight.cnpj,
            ie: newFreight.ie
          },
          contact: {
            phone: newFreight.phone,
            email: newFreight.email
          }
        },
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      const newFreightCreated = await freightService.createFreight(freightData);
      
      if (newFreightCreated) {
        // Atualizar lista de fretes do usuário
        setUserFreights(prev => [newFreightCreated, ...prev]);
        
        // Fechar formulário
        setShowFreightForm(false);
        
        // Limpar dados
        setNewFreight({
          origin: '',
          destination: '',
          weight: '',
          price: '',
          date: '',
          description: '',
          truckType: 'truck_3_4',
          requirements: '',
          insurance: false,
          negotiable: true,
          carrierType: 'individual',
          cpf: '',
          cnpj: '',
          ie: '',
          state: '',
          city: '',
          cep: '',
          address: '',
          phone: '',
          email: ''
        });
        setOriginCoordinates(null);
        setDestinationCoordinates(null);
        
        alert('Frete cadastrado com sucesso!');
      }
      
    } catch (error) {
      console.error('Erro ao cadastrar frete:', error);
      alert('Erro ao cadastrar frete. Tente novamente.');
    }
  };

  // Função para lidar com mudanças no formulário
  const handleFreightFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFreight(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erros de validação quando o campo é alterado
    if (freightValidationErrors[name]) {
      setFreightValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // PÁGINA PÚBLICA - mostrar para todos
  if (!user || isAdmin) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-600 bg-clip-text text-transparent">
                AgroConecta
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Plataforma de fretes e logística agropecuária que conecta produtores e transportadores de forma inteligente e segura
              </p>
              
              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">3.4K+</div>
                  <div className="text-sm text-slate-600">Fretes Ativos</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">12.5K+</div>
                  <div className="text-sm text-slate-600">Usuários</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">27</div>
                  <div className="text-sm text-slate-600">Estados</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">98%</div>
                  <div className="text-sm text-slate-600">Satisfação</div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Opções de Cadastro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid md:grid-cols-2 gap-8 mb-16"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Anunciante de Frete</h3>
                <p className="text-slate-700 mb-6">
                  <strong>Campos obrigatórios:</strong> cidade origem, cidade destino, valor do frete, dados gerais (telefone, e-mail, localização, CPF/CNPJ).
                </p>
                <p className="text-sm text-slate-600 mb-6">
                  <strong>Exibição pública:</strong> SOMENTE cidade destino + valor do frete. Dados pessoais (telefone, CPF/CNPJ, endereço) ficam ocultos até login e pagamento.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cadastro?type=anunciante-frete')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cadastrar como Anunciante
                </motion.button>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-200 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Freteiro</h3>
                <p className="text-slate-700 mb-6">
                  <strong>Campos obrigatórios:</strong> placa do caminhão, tipo de caminhão, nº de eixos, localização, CPF/CNPJ.
                </p>
                <p className="text-sm text-slate-600 mb-6">
                  <strong>Exibição pública:</strong> SOMENTE nome do freteiro. Dados privados liberados após login e pagamento.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cadastro?type=freteiro')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Cadastrar como Freteiro
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Fretes Públicos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-8 border border-slate-200"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Fretes Disponíveis</h3>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  <strong>Regra de Privacidade:</strong> Apenas cidade destino e valor do frete são exibidos publicamente. 
                  Dados pessoais (telefone, CPF/CNPJ, endereço) ficam ocultos até login e pagamento.
                </p>
              </div>
              
              {loadingFreights ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 text-lg">Carregando fretes...</p>
                </div>
              ) : freights.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="w-20 h-20 mx-auto text-slate-400 mb-6" />
                  <p className="text-slate-600 text-xl mb-2">Nenhum frete disponível</p>
                  <p className="text-slate-500">Seja o primeiro a cadastrar um frete!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freights.slice(0, 6).map((freight) => (
                    <motion.div
                      key={freight.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-full h-32 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                        <Truck className="w-16 h-16 text-emerald-600" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-slate-800">Frete #{freight.id}</h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p><strong>Destino:</strong> {freight.destination}</p>
                        <p><strong>Valor:</strong> R$ {freight.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 flex items-center justify-center">
                          <Lock className="w-3 h-3 mr-1" />
                          Dados completos disponíveis após login e pagamento
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300"
                      >
                        Ver Detalhes
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {freights.length > 6 && (
                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors duration-300"
                  >
                    Ver Todos os Fretes
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Usuário logado - mostrar fretes + painel secreto
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header com botão do painel secreto - DESIGN PREMIUM */}
      <div className="bg-gradient-to-r from-slate-100 to-emerald-50 border-b-2 border-emerald-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-600 bg-clip-text text-transparent"
            >
              AgroConecta - Sistema de Fretes
            </motion.h1>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSecretPanel}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Meu Painel</span>
                {showSecretPanel && <span className="ml-2">←</span>}
              </motion.button>
              
              <div className="relative">
                <Bell className="w-6 h-6 text-amber-500 cursor-pointer" />
                {userMessages.filter(m => m.unread).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {userMessages.filter(m => m.unread).length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Painel Secreto (lado esquerdo) */}
        {showSecretPanel && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-slate-50 border-r border-slate-200 min-h-screen"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Painel Privado</h2>
              
              {/* Tabs do painel */}
              <div className="flex space-x-2 mb-6">
                {['dashboard', 'freights', 'messages', 'profile'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {tab === 'dashboard' && 'Dashboard'}
                    {tab === 'freights' && 'Fretes'}
                    {tab === 'messages' && 'Mensagens'}
                    {tab === 'profile' && 'Perfil'}
                  </button>
                ))}
              </div>

              {/* Conteúdo das tabs */}
              <div className="space-y-6">
                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                  <div>
                    <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
                      <h3 className="font-semibold mb-2 text-slate-800">Resumo</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Fretes Ativos</p>
                          <p className="text-xl font-bold text-slate-800">{userFreights.length}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Mensagens</p>
                          <p className="text-xl font-bold text-slate-800">{userMessages.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold mb-2 text-slate-800">Atividade Recente</h3>
                      <div className="space-y-2 text-sm text-slate-600">
                        {userHistory.length > 0 ? (
                          userHistory.slice(0, 3).map((item) => (
                            <p key={item.id}>• {item.description}</p>
                          ))
                        ) : (
                          <p className="text-slate-500">Nenhuma atividade recente</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fretes */}
                {activeTab === 'freights' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">Meus Fretes</h3>
                      <button className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors text-white">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {userFreights.length > 0 ? (
                        userFreights.map((freight) => (
                          <div key={freight.id} className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">{freight.origin} → {freight.destination}</h4>
                                <p className="text-sm text-slate-500">{freight.weight} • {freight.date}</p>
                                <p className="text-sm text-slate-700">R$ {freight.price.toFixed(2)}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-1 bg-slate-600 rounded hover:bg-slate-700 text-white">
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteFreight(freight.id)}
                                  className="p-1 bg-red-600 rounded hover:bg-red-700 text-white"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500">
                          <Package className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p>Nenhum frete cadastrado</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mensagens */}
                {activeTab === 'messages' && (
                  <div>
                    <h3 className="font-semibold mb-4 text-slate-800">Minhas Mensagens</h3>
                    <div className="space-y-3">
                      {userMessages.length > 0 ? (
                        userMessages.map((message) => (
                          <div key={message.id} className={`bg-white rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors border border-slate-200 ${
                            message.unread ? 'border-l-4 border-emerald-500' : ''
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">{message.from}</h4>
                                <p className="text-sm text-slate-500">{message.subject}</p>
                                <p className="text-xs text-slate-400">{message.date}</p>
                              </div>
                              {message.unread && (
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p>Nenhuma mensagem</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Perfil */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">Meu Perfil</h3>
                      <button 
                        onClick={handleEditProfile}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded text-sm hover:from-emerald-600 hover:to-blue-600 transition-colors text-white"
                      >
                        {isEditing ? 'Cancelar' : 'Editar'}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-500">Nome</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile?.name || ''} 
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="font-medium text-slate-800">{userProfile?.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Email</label>
                        <p className="font-medium text-slate-800">{userProfile?.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Telefone</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile?.phone || ''} 
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="font-medium text-slate-800">{userProfile?.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Veículo</label>
                        <p className="font-medium text-slate-700">{userProfile?.vehicle}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Plano</label>
                        <p className="font-medium text-slate-700">{userProfile?.plan}</p>
                      </div>
                      
                      {isEditing && (
                        <button 
                          onClick={handleSaveProfile}
                          className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors text-white"
                        >
                          Salvar Alterações
                        </button>
                      )}
                    </div>

                    {/* Ações de Validação */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3">Validações e Verificações</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          onClick={() => setShowDocumentValidator(true)}
                          className="flex items-center p-3 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-emerald-600 mr-3" />
                          <div className="text-left">
                            <p className="font-medium text-slate-800">Validar Documentos</p>
                            <p className="text-sm text-slate-600">CPF, CNPJ e IE</p>
                          </div>
                        </button>

                        <button
                          onClick={() => setShowLocationValidator(true)}
                          className="flex items-center p-3 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                        >
                          <Map className="w-5 h-5 text-emerald-600 mr-3" />
                          <div className="text-left">
                            <p className="font-medium text-slate-800">Validar Endereços</p>
                            <p className="text-sm text-slate-600">Origem e destino</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Fretes (lado direito) */}
        <div className={`flex-1 ${showSecretPanel ? 'ml-0' : ''}`}>
          <main className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4">
              {!showSecretPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-600 bg-clip-text text-transparent">
                    AgroConecta - Sistema de Fretes
                  </h1>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Encontre os melhores fretes para sua carga ou conecte-se com transportadores confiáveis
                  </p>
                </motion.div>
              )}
              
              {/* Filtros */}
              <FreightFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                truckTypes={truckTypes}
                locations={locations}
                priceRange={{ min: 0, max: 10000 }}
                onPriceRangeChange={() => {}}
              />

              {/* Controles de visualização */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600">
                    {freights.length} frete{freights.length !== 1 ? 's' : ''} encontrado{freights.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 space-y-1">
                      <div className="w-full h-1 bg-current rounded-sm"></div>
                      <div className="w-full h-1 bg-current rounded-sm"></div>
                      <div className="w-full h-1 bg-current rounded-sm"></div>
                    </div>
                  </motion.button>
                </div>
              </div>
              
              {/* Grid de fretes */}
              {loadingFreights ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-slate-100 rounded-2xl p-6 border border-slate-200 animate-pulse">
                      <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded mb-4"></div>
                      <div className="h-6 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : freights.length === 0 ? (
                <div className="text-center py-16">
                  <Truck className="w-20 h-20 mx-auto text-slate-400 mb-6" />
                  <p className="text-slate-600 text-xl mb-2">Nenhum frete disponível</p>
                  <p className="text-slate-500">Tente ajustar os filtros ou cadastre-se para ver fretes disponíveis</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {freights.map((freight) => (
                    <FreightCard
                      key={freight.id}
                      freight={freight}
                      onContact={handleFreightContact}
                      onFavorite={handleFreightFavorite}
                      onView={handleFreightView}
                      onApply={handleFreightApply}
                      userType={user?.userType || 'anunciante'}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de Validação de Documentos */}
      <AnimatePresence>
        {showDocumentValidator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Validação de Documentos</h3>
                  <button
                    onClick={() => setShowDocumentValidator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Fechar</span>
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <DocumentValidator onValidationComplete={handleDocumentValidation} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Validação de Localização */}
      <AnimatePresence>
        {showLocationValidator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Validação de Endereço</h3>
                  <button
                    onClick={() => setShowLocationValidator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Fechar</span>
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo de Endereço
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                      <option value="origin">Origem</option>
                      <option value="destination">Destino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Endereço para Validação
                    </label>
                    <input
                      type="text"
                      placeholder="Digite o endereço completo"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => handleLocationValidation('Endereço de teste', 'origin')}
                    disabled={isValidatingLocation}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isValidatingLocation ? 'Validando...' : 'Validar Endereço'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgroConecta;
