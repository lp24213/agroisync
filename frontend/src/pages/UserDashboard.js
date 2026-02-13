import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  Truck,
  TrendingUp,
  MessageCircle,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Upload,
  Camera,
  Sprout
} from 'lucide-react';
import VisibilityManager from '../components/VisibilityManager';
import Messaging from './Messaging';
import productService from '../services/productService';
import freightService from '../services/freightService';
import ImageUpload from '../components/ImageUpload';
import { toast } from 'react-hot-toast';

const UserDashboard = () => {
  const { isAuthenticated, isLoading, user: authUser } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('producer'); // producer, buyer, carrier
  const [activeTab, setActiveTab] = useState('overview');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    image: null
  });
  const [itemImages, setItemImages] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [planExpiresAt, setPlanExpiresAt] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [conversationsCount, setConversationsCount] = useState(0);
  const [userFreights, setUserFreights] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [userSupplies, setUserSupplies] = useState([]);
  const [loadingSupplies, setLoadingSupplies] = useState(false);
  const [showAddSupply, setShowAddSupply] = useState(false);
  const [newSupply, setNewSupply] = useState({
    name: '',
    category: '',
    description: '',
    unit: 'kg',
    avg_price: '',
    quantity: ''
  });
  
  // Estados para configurações
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    company: ''
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Buscar informações do plano do usuário
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.data?.user || data.user;
          if (user) {
            setUserPlan(user.plan);
            setPlanExpiresAt(user.plan_expires_at);
            setProfileData({
              name: user.name || '',
              username: user.username || '',
              email: user.email || '',
              phone: user.phone || '',
              company: user.company || ''
            });
            
            if (user.plan_expires_at) {
              const expires = new Date(user.plan_expires_at);
              const now = new Date();
              const days = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
              setDaysRemaining(days);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar plano:', error);
      }
    };

    fetchUserPlan();
  }, []);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Buscar produtos e fretes do usuário (SEMPRE buscar ambos para mostrar limites)
      try {
        const productsData = await productService.getMyProducts();
        const productsArray = productsData?.products || productsData?.data?.products || [];
        setUserProducts(Array.isArray(productsArray) ? productsArray : []);
        console.log('✅ Produtos carregados:', productsArray.length);
        
        if (userType === 'producer' || userType === 'buyer') {
          setItems(Array.isArray(productsArray) ? productsArray : []);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        setUserProducts([]);
      }
      
      try {
        const freightsData = await freightService.getMyFreights();
        const freightsArray = freightsData?.freights || freightsData?.data?.freights || [];
        setUserFreights(Array.isArray(freightsArray) ? freightsArray : []);
        console.log('✅ Fretes carregados:', freightsArray.length);
        
        if (userType === 'carrier') {
          setItems(Array.isArray(freightsArray) ? freightsArray : []);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar fretes:', error);
        setUserFreights([]);
      }

      // Buscar insumos do usuário
      try {
        const suppliesRes = await fetch('https://agroisync-backend.contato-00d.workers.dev/api/supplies/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (suppliesRes.ok) {
          const suppliesData = await suppliesRes.json();
          setUserSupplies(suppliesData.data || []);
          console.log('✅ Insumos carregados:', suppliesData.data?.length || 0);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar insumos:', error);
        setUserSupplies([]);
      }

      // Buscar número real de conversas ativas
      try {
        const apiUrl = process.env.REACT_APP_API_URL || '/api';
        const conversationsRes = await fetch(`${apiUrl}/conversations?status=active`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (conversationsRes.ok) {
          const conversationsData = await conversationsRes.json();
          const conversations = conversationsData?.data?.conversations || [];
          setConversationsCount(conversations.length);
          console.log('✅ Conversas ativas:', conversations.length);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar conversas:', error);
        setConversationsCount(0);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Carregar dados do perfil para configurações
  useEffect(() => {
    if (activeTab === 'settings') {
      const loadProfileData = async () => {
        try {
          const token = localStorage.getItem('token') || localStorage.getItem('authToken');
          if (!token) return;

          const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data?.data || data?.user || data;
            
            setProfileData({
              name: userData.name || '',
              username: userData.username || '',
              email: userData.email || '',
              phone: userData.phone || '',
              company: userData.company || ''
            });
            
            if (userData.avatar) {
              setProfileImage(userData.avatar);
            }
          }
        } catch (error) {
          console.error('❌ Erro ao carregar perfil:', error);
        }
      };

      loadProfileData();
    }
  }, [activeTab]);

  const handleAddItem = async () => {
    try {
      console.log('🔄 Cadastrando item:', newItem);
      
      if (userType === 'carrier') {
        // Criar frete
        const result = await freightService.createFreight({
          origin: newItem.origin || newItem.name,
          destination: newItem.destination || '',
          cargo_type: newItem.category || newItem.description,
          weight: newItem.quantity || 0,
          price: newItem.price || 0
        });
        
        if (result.success) {
          toast.success('✅ Frete cadastrado com sucesso!');
          setShowAddModal(false);
          setNewItem({ name: '', description: '', price: '', category: '', quantity: '', image: null });
          setItemImages([]);
          loadUserData();
        }
      } else {
        // Criar produto
        const result = await productService.createProduct({
          title: newItem.name,
          description: newItem.description,
          price: newItem.price,
          category: newItem.category,
          quantity: newItem.quantity,
          unit: 'kg',
          images: itemImages
        });
        
        if (result.success) {
          toast.success('✅ Produto cadastrado com sucesso!');
          setShowAddModal(false);
          setNewItem({ name: '', description: '', price: '', category: '', quantity: '', image: null });
          setItemImages([]);
          loadUserData();
        }
      }
    } catch (error) {
      console.error('❌ Erro ao cadastrar:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Erro ao cadastrar item';
      toast.error(errorMsg);
      
      // Se for erro de limite, mostrar botão de upgrade
      if (error.response?.data?.limitReached) {
        toast.error('Faça upgrade do seu plano para continuar!', { duration: 5000 });
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) return;

      const updatePayload = {
        ...profileData,
        avatar: profileImage || null
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      if (response.ok) {
        toast.success('✅ Perfil atualizado com sucesso!');
        
        // Atualizar contexto de autenticação se necessário
        const updatedUser = await response.json();
        if (updatedUser?.data) {
          // Pode atualizar o AuthContext aqui se necessário
        }
      } else {
        throw new Error('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    {
      id: 'items',
      label: userType === 'producer' ? 'Meus Produtos' : 'Meus Fretes',
      icon: userType === 'producer' ? Package : Truck
    },
    { id: 'supplies', label: 'Meus Insumos', icon: Sprout },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const renderOverview = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <motion.div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm' whileHover={{ scale: 1.02 }}>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
              <Package className='h-6 w-6 text-green-600' />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>{items.length}</p>
              <p className='text-sm text-gray-600'>Itens Cadastrados</p>
            </div>
          </div>
        </motion.div>

        <motion.div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm' whileHover={{ scale: 1.02 }}>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <Eye className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>
                {items.filter(item => item.visibility === 'public').length}
              </p>
              <p className='text-sm text-gray-600'>Visíveis Publicamente</p>
            </div>
          </div>
        </motion.div>

        <motion.div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm' whileHover={{ scale: 1.02 }}>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
              <MessageCircle className='h-6 w-6 text-purple-600' />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>{conversationsCount}</p>
              <p className='text-sm text-gray-600'>Conversas Ativas</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Seus Produtos Recentes</h3>
        {items.length === 0 ? (
          <div className='py-8 text-center text-gray-500'>
            <Package className='mx-auto mb-2 h-12 w-12 text-gray-300' />
            <p>Nenhum item cadastrado ainda</p>
            <button
              onClick={() => setShowAddModal(true)}
              className='mt-4 text-green-600 hover:text-green-700 font-medium'
            >
              Adicionar seu primeiro item
            </button>
          </div>
        ) : (
          <div className='space-y-3'>
            {items.slice(0, 3).map((item, index) => (
              <div key={item.id || index} className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>{item.name || item.title}</p>
                  <p className='text-xs text-gray-500'>
                    {item.category || 'Produto'} • R$ {item.price || '0,00'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderItems = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {userType === 'producer' ? 'Meus Produtos' : 'Meus Fretes'}
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
        >
          <Plus className='h-4 w-4' />
          Adicionar Novo
        </button>
      </div>

      {items.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-white p-12 text-center'>
          <Package className='mx-auto mb-4 h-16 w-16 text-gray-300' />
          <h3 className='mb-2 text-lg font-semibold text-gray-900'>Nenhum item cadastrado</h3>
          <p className='mb-4 text-gray-600'>Comece adicionando seu primeiro {userType === 'producer' ? 'produto' : 'frete'}!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className='rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700'
          >
            Adicionar Agora
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'
              whileHover={{ scale: 1.02 }}
            >
              <div className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <h4 className='font-semibold text-gray-900'>
                      {userType === 'producer' ? (item.name || item.title) : `${item.origin} → ${item.destination}`}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      {userType === 'producer' ? (item.location || item.category) : `R$ ${item.value || item.price}`}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                      <Edit className='h-4 w-4' />
                    </button>
                    <button className='rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600'>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                <VisibilityManager
                  item={item}
                  itemType={userType === 'producer' ? 'product' : 'freight'}
                  onVisibilityChange={isPublic => {
                    setItems(prev =>
                      prev.map((i, idx) => (idx === index ? { ...i, visibility: isPublic ? 'public' : 'private' } : i))
                    );
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Informações do Perfil</h3>
        
        {/* Upload de Imagem de Perfil */}
        <div className='mb-6'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Foto de Perfil</label>
          <div className='flex items-center gap-4'>
            <div className='flex h-24 w-24 items-center justify-center rounded-full bg-gray-200'>
              {profileImage ? (
                <img src={profileImage} alt='Profile' className='h-24 w-24 rounded-full object-cover' />
              ) : (
                <Camera className='h-8 w-8 text-gray-400' />
              )}
            </div>
            <div>
              <ImageUpload
                images={profileImage ? [profileImage] : []}
                onChange={(images) => setProfileImage(images[0])}
                maxImages={1}
              />
              <p className='mt-1 text-xs text-gray-500'>Formatos: JPG, PNG até 5MB</p>
            </div>
          </div>
        </div>

        {/* Formulário de Dados */}
        <div className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Nome Completo</label>
            <input
              type='text'
              value={profileData.name}
              onChange={e => setProfileData({ ...profileData, name: e.target.value })}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
              placeholder='Seu nome completo'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Nome de Usuário <span className='text-xs text-gray-400'>(opcional)</span>
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400'>@</span>
              <input
                type='text'
                value={profileData.username}
                onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 pl-8 focus:border-transparent focus:ring-2 focus:ring-green-500'
                placeholder='seunome'
              />
            </div>
            <p className='mt-1 text-xs text-gray-500'>
              Seu perfil público: agroisync.com/@{profileData.username || 'seunome'}
            </p>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              value={profileData.email}
              onChange={e => setProfileData({ ...profileData, email: e.target.value })}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
              placeholder='seu@email.com'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Telefone</label>
            <input
              type='tel'
              value={profileData.phone}
              onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
              placeholder='(00) 00000-0000'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Empresa (opcional)</label>
            <input
              type='text'
              value={profileData.company}
              onChange={e => setProfileData({ ...profileData, company: e.target.value })}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
              placeholder='Nome da sua empresa'
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            className='w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Plano e Limites</h3>
        <div className='space-y-3'>
          <div className='rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-3'>
            <p className='text-sm font-semibold text-gray-800'>
              Plano: <span className='text-green-600'>{userPlan?.toUpperCase() || 'GRATUITO'}</span>
            </p>
          </div>
          
          {/* Limites de Fretes */}
          <div className='rounded-lg bg-blue-50 p-3'>
            <p className='mb-1 text-xs font-medium text-gray-600'>🚚 Fretes Cadastrados:</p>
            <p className='text-lg font-bold text-blue-600'>
              {userFreights?.length || 0} / {userPlan === 'gratuito' ? '5' : '∞'}
            </p>
            {userPlan === 'gratuito' && userFreights?.length >= 5 && (
              <p className='mt-1 text-xs font-semibold text-orange-600'>⚠️ Limite atingido! Faça upgrade.</p>
            )}
          </div>
          
          {/* Limites de Produtos */}
          <div className='rounded-lg bg-green-50 p-3'>
            <p className='mb-1 text-xs font-medium text-gray-600'>📦 Produtos Cadastrados:</p>
            <p className='text-lg font-bold text-green-600'>
              {userProducts?.length || 0} / {userPlan === 'gratuito' ? '5' : '∞'}
            </p>
            {userPlan === 'gratuito' && userProducts?.length >= 5 && (
              <p className='mt-1 text-xs font-semibold text-orange-600'>⚠️ Limite atingido! Faça upgrade.</p>
            )}
          </div>
          
          {/* Limites de Insumos */}
          <div className='rounded-lg bg-purple-50 p-3'>
            <p className='mb-1 text-xs font-medium text-gray-600'>🌱 Insumos Cadastrados:</p>
            <p className='text-lg font-bold text-purple-600'>
              {userSupplies?.length || 0} / {userPlan === 'gratuito' ? '10' : '∞'}
            </p>
            {userPlan === 'gratuito' && userSupplies?.length >= 10 && (
              <p className='mt-1 text-xs font-semibold text-orange-600'>⚠️ Limite atingido! Faça upgrade.</p>
            )}
          </div>
          
          {planExpiresAt && (
            <p className='text-xs text-gray-500'>
              Expira em: {new Date(planExpiresAt).toLocaleDateString('pt-BR')}
            </p>
          )}
          
          <button
            onClick={() => navigate('/planos')}
            className='mt-4 w-full rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2.5 font-semibold text-white transition-all hover:from-green-700 hover:to-blue-700 hover:shadow-lg'
          >
            ⬆️ Fazer Upgrade
          </button>
        </div>
      </div>
    </div>
  );

  const handleAddSupply = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        toast.error('Você precisa estar logado para cadastrar insumos');
        return;
      }

      const response = await fetch('https://agroisync-backend.contato-00d.workers.dev/api/supplies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSupply)
      });

      if (response.ok) {
        toast.success('✅ Insumo cadastrado com sucesso!');
        setShowAddSupply(false);
        setNewSupply({ name: '', category: '', description: '', unit: 'kg', avg_price: '', quantity: '' });
        loadUserData(); // Recarregar dados
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erro ao cadastrar insumo');
      }
    } catch (error) {
      console.error('Erro ao cadastrar insumo:', error);
      toast.error('Erro ao processar solicitação');
    }
  };

  const renderSupplies = () => {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Meus Insumos Agrícolas</h2>
            <p className='text-gray-600 mt-1'>Gerencie seus insumos e produtos para venda</p>
          </div>
          <button
            onClick={() => setShowAddSupply(true)}
            className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors'
          >
            <Plus className='h-5 w-5' />
            Adicionar Insumo
          </button>
        </div>

        {showAddSupply && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
          >
            <h3 className='text-lg font-semibold mb-4'>Cadastrar Novo Insumo</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nome do Insumo</label>
                <input
                  type='text'
                  value={newSupply.name}
                  onChange={e => setNewSupply({ ...newSupply, name: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='Ex: Ureia, Glifosato, NPK...'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Categoria</label>
                <select
                  value={newSupply.category}
                  onChange={e => setNewSupply({ ...newSupply, category: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  <option value=''>Selecione...</option>
                  <option value='fertilizante'>Fertilizante</option>
                  <option value='defensivo'>Defensivo</option>
                  <option value='semente'>Semente</option>
                  <option value='corretivo'>Corretivo</option>
                  <option value='outro'>Outro</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Preço Médio (R$)</label>
                <input
                  type='number'
                  value={newSupply.avg_price}
                  onChange={e => setNewSupply({ ...newSupply, avg_price: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='0.00'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Unidade</label>
                <select
                  value={newSupply.unit}
                  onChange={e => setNewSupply({ ...newSupply, unit: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  <option value='kg'>kg</option>
                  <option value='ton'>ton</option>
                  <option value='L'>L</option>
                  <option value='sc'>sc (saca)</option>
                  <option value='un'>unidade</option>
                </select>
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Descrição</label>
                <textarea
                  value={newSupply.description}
                  onChange={e => setNewSupply({ ...newSupply, description: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  rows={3}
                  placeholder='Descreva o insumo...'
                />
              </div>
            </div>
            <div className='flex gap-3 mt-4'>
              <button
                onClick={handleAddSupply}
                className='flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors'
              >
                Cadastrar
              </button>
              <button
                onClick={() => setShowAddSupply(false)}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}

        {loadingSupplies ? (
          <div className='text-center py-12'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
            <p className='text-gray-600'>Carregando insumos...</p>
          </div>
        ) : userSupplies.length === 0 ? (
          <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center'>
            <Sprout className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Nenhum insumo cadastrado</h3>
            <p className='text-gray-600 mb-4'>Comece cadastrando seus primeiros insumos agrícolas</p>
            <button
              onClick={() => setShowAddSupply(true)}
              className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition-colors'
            >
              <Plus className='h-5 w-5' />
              Adicionar Primeiro Insumo
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {userSupplies.map((supply) => (
              <motion.div
                key={supply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>{supply.name}</h3>
                    <p className='text-sm text-gray-500 capitalize'>{supply.category}</p>
                  </div>
                  <div className='flex gap-2'>
                    <button className='p-2 text-gray-400 hover:text-blue-600 transition-colors'>
                      <Edit className='h-4 w-4' />
                    </button>
                    <button className='p-2 text-gray-400 hover:text-red-600 transition-colors'>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                {supply.description && (
                  <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{supply.description}</p>
                )}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                  <div>
                    <p className='text-xs text-gray-500'>Preço Médio</p>
                    <p className='text-lg font-bold text-green-600'>
                      R$ {supply.avg_price?.toFixed(2) || '0.00'} / {supply.unit || 'kg'}
                    </p>
                  </div>
                  {supply.price_variation !== undefined && supply.price_variation !== 0 && (
                    <div className={`text-sm font-semibold ${supply.price_variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {supply.price_variation > 0 ? '+' : ''}{supply.price_variation?.toFixed(2)}%
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'items':
        return renderItems();
      case 'supplies':
        return renderSupplies();
      case 'messages':
        return <Messaging />;
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (loading || isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
          <p className='text-gray-600'>Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        {/* Aviso de Teste Grátis */}
        {userPlan === 'inicial' && daysRemaining > 0 && daysRemaining <= 3 && (
          <div className='mb-6 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='text-2xl'>⏰</div>
                <div>
                  <h3 className='font-bold text-yellow-800'>
                    Teste Grátis - {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} restante{daysRemaining === 1 ? '' : 's'}
                  </h3>
                  <p className='text-sm text-yellow-700'>
                    Aproveite para testar todas as funcionalidades! Depois escolha um plano para continuar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/plans')}
                className='rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700 transition-colors'
              >
                Ver Planos
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <User className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-xl font-semibold text-gray-900'>
                  {profileData.name ? `Olá, ${profileData.name.split(' ')[0]}!` : 'Painel do Usuário'}
                </h1>
                <p className='text-sm text-gray-600'>
                  {userType === 'producer' ? 'Produtor' : userType === 'buyer' ? 'Comprador' : 'Transportador'}
                  {userPlan && ` • Plano: ${userPlan}`}
                  {daysRemaining > 0 && daysRemaining <= 30 && ` • ${daysRemaining} dias restantes`}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <select
                value={userType}
                onChange={e => setUserType(e.target.value)}
                className='rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <option value='producer'>Produtor</option>
                <option value='buyer'>Comprador</option>
                <option value='carrier'>Transportador</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white shadow-sm'>
          <div className='flex border-b border-gray-200'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-600 bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className='h-4 w-4' />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Modal de Adicionar Item */}
      {showAddModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6'>
            <h3 className='mb-4 text-lg font-semibold'>Cadastrar {userType === 'producer' ? 'Produto' : 'Frete'}</h3>

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Nome *</label>
                <input
                  type='text'
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                  placeholder='Nome do produto/frete'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Descrição *</label>
                <textarea
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                  rows='3'
                  placeholder='Descrição detalhada'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Preço (R$) *</label>
                  <input
                    type='number'
                    value={newItem.price}
                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                    placeholder='0.00'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Categoria *</label>
                  <input
                    type='text'
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                    placeholder='Categoria'
                  />
                </div>
              </div>

              {userType === 'producer' && (
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Quantidade</label>
                  <input
                    type='number'
                    value={newItem.quantity}
                    onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500'
                    placeholder='Quantidade disponível'
                  />
                </div>
              )}

              {userType === 'producer' && (
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Fotos do Produto</label>
                  <ImageUpload
                    images={itemImages}
                    onChange={setItemImages}
                    maxImages={5}
                  />
                </div>
              )}
            </div>

            <div className='mt-6 flex gap-3'>
              <button
                onClick={() => setShowAddModal(false)}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50'
              >
                Cancelar
              </button>
              <button
                onClick={handleAddItem}
                className='flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
