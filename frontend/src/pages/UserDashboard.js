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
          price: 150.00,
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
          price: 85.00,
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
          value: 2500.00,
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
          'Authorization': `Bearer ${token}`
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
    { id: 'items', label: userType === 'producer' ? 'Meus Produtos' : 'Meus Fretes', icon: userType === 'producer' ? Package : Truck },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              <p className="text-sm text-gray-600">Itens Cadastrados</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.visibility === 'public').length}
              </p>
              <p className="text-sm text-gray-600">Visíveis Publicamente</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Conversas Ativas</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Produto "Soja Premium" liberado</p>
              <p className="text-xs text-gray-500">Há 2 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nova mensagem recebida</p>
              <p className="text-xs text-gray-500">Há 4 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Plus className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Novo item cadastrado</p>
              <p className="text-xs text-gray-500">Ontem</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {userType === 'producer' ? 'Meus Produtos' : 'Meus Fretes'}
        </h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Novo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {userType === 'producer' ? item.name : `${item.origin} → ${item.destination}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {userType === 'producer' ? item.location : `R$ ${item.value}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <VisibilityManager
                item={item}
                itemType={userType === 'producer' ? 'product' : 'freight'}
                onVisibilityChange={(isPublic) => {
                  setItems(prev => prev.map(i => 
                    i.id === item.id ? { ...i, visibility: isPublic ? 'public' : 'private' } : i
                  ));
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
            <p className="text-gray-600">Configurações em desenvolvimento...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Painel do Usuário</h1>
                <p className="text-sm text-gray-600">
                  {userType === 'producer' ? 'Produtor' : userType === 'buyer' ? 'Comprador' : 'Transportador'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="producer">Produtor</option>
                <option value="buyer">Comprador</option>
                <option value="carrier">Transportador</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Cadastrar {userType === 'producer' ? 'Produto' : 'Frete'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nome do produto/frete"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Descrição detalhada"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Categoria"
                  />
                </div>
              </div>
              
              {userType === 'producer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Quantidade disponível"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddItem}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
