import React, { useState, useEffect } from 'react';
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
  Clock,
  DollarSign
} from 'lucide-react';
import VisibilityManager from '../components/VisibilityManager';
import Messaging from './Messaging';

const UserDashboard = () => {
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

  useEffect(() => {
    loadUserData();
  }, [userType]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados do usuário
      const mockData = generateMockData();
      setItems(mockData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    if (userType === 'producer') {
      return [
        {
          id: 1,
          name: 'Soja Premium',
          location: 'Sinop, MT',
          category: 'Grãos',
          image: 'https://via.placeholder.com/300x200',
          price: 150.0,
          quantity: 1000,
          contact: '(65) 99999-9999',
          fullDescription: 'Soja de alta qualidade, colhida em dezembro de 2024',
          specifications: 'Proteína: 38%, Umidade: 12%',
          visibility: 'public'
        },
        {
          id: 2,
          name: 'Milho Híbrido',
          location: 'Sorriso, MT',
          category: 'Grãos',
          image: 'https://via.placeholder.com/300x200',
          price: 85.0,
          quantity: 500,
          contact: '(65) 88888-8888',
          fullDescription: 'Milho híbrido de alta produtividade',
          specifications: 'Proteína: 8%, Umidade: 14%',
          visibility: 'private'
        }
      ];
    } else if (userType === 'carrier') {
      return [
        {
          id: 1,
          origin: 'Sinop, MT',
          destination: 'São Paulo, SP',
          value: 2500.0,
          vehicleType: 'Caminhão',
          contact: '(65) 77777-7777',
          fullDescription: 'Transporte de grãos com temperatura controlada',
          requirements: 'Caminhão refrigerado, motorista experiente',
          schedule: 'Saída: 08:00, Chegada: 18:00',
          visibility: 'public'
        }
      ];
    }
    return [];
  };

  const handleAddItem = async () => {
    try {
      const api = process.env.REACT_APP_API_URL || '/api';
      const token = localStorage.getItem('authToken');

      const endpoint = userType === 'carrier' ? '/freights' : '/products';
      const payload = {
        ...newItem,
        type: userType,
        userId: JSON.parse(localStorage.getItem('user') || '{}').id
      };

      const res = await fetch(`${api}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('✅ Item cadastrado com sucesso!');
        setShowAddModal(false);
        setNewItem({ name: '', description: '', price: '', category: '', quantity: '', image: null });
        loadUserData(); // Recarregar dados
      } else {
        alert('❌ Erro ao cadastrar item');
      }
    } catch (error) {
      alert('❌ Erro de conexão');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    {
      id: 'items',
      label: userType === 'producer' ? 'Meus Produtos' : 'Meus Fretes',
      icon: userType === 'producer' ? Package : Truck
    },
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
              <p className='text-2xl font-bold text-gray-900'>12</p>
              <p className='text-sm text-gray-600'>Conversas Ativas</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Atividade Recente</h3>
        <div className='space-y-3'>
          <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
            <CheckCircle className='h-5 w-5 text-green-500' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>Produto "Soja Premium" liberado</p>
              <p className='text-xs text-gray-500'>Há 2 horas</p>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
            <MessageCircle className='h-5 w-5 text-blue-500' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>Nova mensagem recebida</p>
              <p className='text-xs text-gray-500'>Há 4 horas</p>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'>
            <Plus className='h-5 w-5 text-purple-500' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>Novo item cadastrado</p>
              <p className='text-xs text-gray-500'>Ontem</p>
            </div>
          </div>
        </div>
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

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {items.map(item => (
          <motion.div
            key={item.id}
            className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'
            whileHover={{ scale: 1.02 }}
          >
            <div className='p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h4 className='font-semibold text-gray-900'>
                    {userType === 'producer' ? item.name : `${item.origin} → ${item.destination}`}
                  </h4>
                  <p className='text-sm text-gray-600'>
                    {userType === 'producer' ? item.location : `R$ ${item.value}`}
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
                    prev.map(i => (i.id === item.id ? { ...i, visibility: isPublic ? 'public' : 'private' } : i))
                  );
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'items':
        return renderItems();
      case 'messages':
        return <Messaging />;
      case 'settings':
        return (
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>Configurações</h3>
            <p className='text-gray-600'>Configurações em desenvolvimento...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (loading) {
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
        {/* Header */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <User className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h1 className='text-xl font-semibold text-gray-900'>Painel do Usuário</h1>
                <p className='text-sm text-gray-600'>
                  {userType === 'producer' ? 'Produtor' : userType === 'buyer' ? 'Comprador' : 'Transportador'}
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
