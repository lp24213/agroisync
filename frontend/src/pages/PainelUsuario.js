import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, Package, MessageSquare, Bell, Settings, 
  ShoppingCart, Truck, Eye, Clock, CheckCircle, 
  XCircle, Calendar, DollarSign, MapPin, Phone, Mail,
  Plus, Edit, Trash, Filter, Grid, List
} from 'lucide-react';
import TransactionList from '../components/TransactionList';
import transactionService, { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../services/transactionService';

const PainelUsuario = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('transactions');
  const [loading, setLoading] = useState(true);
  
  // Estados para dados do usuário
  const [userTransactions, setUserTransactions] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  
  // Estados para filtros
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Verificar se há parâmetros na URL para abrir aba específica
    const transactionId = searchParams.get('transactionId');
    const tab = searchParams.get('tab');
    
    if (tab) {
      setActiveTab(tab);
    }

    loadUserData();
  }, [isAuthenticated, navigate, searchParams]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) return;

      // Carregar transações do usuário
      const transactions = await transactionService.getUserTransactions(user.id);
      setUserTransactions(transactions);

      // Carregar mensagens das transações
      const allMessages = [];
      for (const txn of transactions) {
        const messages = await transactionService.getTransactionMessages(txn.id);
        allMessages.push(...messages.map(msg => ({ ...msg, transactionId: txn.id })));
      }
      setUserMessages(allMessages);

      // Carregar perfil do usuário (mock por enquanto)
      setUserProfile({
        id: user.id,
        name: user.name || 'Usuário',
        email: user.email || '',
        phone: user.phone || '',
        cpfCnpjVerified: false,
        address: {
          cep: '',
          city: '',
          state: '',
          lat: null,
          lng: null
        }
      });

      // Carregar notificações (mock por enquanto)
      setUserNotifications([
        {
          id: 1,
          type: 'info',
          title: 'Bem-vindo ao AgroSync',
          message: 'Seu painel de controle está ativo',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    let filtered = [...userTransactions];

    // Filtro por tipo
    if (transactionFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === transactionFilter);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }

    return filtered;
  };

  const getTransactionsByRole = (role) => {
    const filtered = getFilteredTransactions();
    
    if (role === 'buyer') {
      return filtered.filter(txn => txn.buyerId === user.id);
    } else if (role === 'seller') {
      return filtered.filter(txn => txn.sellerId === user.id);
    }
    
    return filtered;
  };

  const handleViewTransaction = (transaction) => {
    // Abrir detalhes da transação
    console.log('Visualizar transação:', transaction);
  };

  const handleSendMessage = (transaction) => {
    // Abrir mensageria para a transação
    setActiveTab('messages');
    // Aqui seria implementada a abertura do chat
    console.log('Abrir mensageria para transação:', transaction.id);
  };

  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      await transactionService.updateTransactionStatus(transactionId, newStatus);
      await loadUserData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const tabs = [
    { id: 'transactions', name: 'Minhas Transações', icon: Package },
    { id: 'messages', name: 'Mensagens', icon: MessageSquare },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'settings', name: 'Preferências', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-agro-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu painel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="title-premium text-4xl font-bold mb-4">
            Painel de Controle
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Gerencie suas transações, mensagens e perfil
          </p>
        </motion.div>

        {/* Navegação por abas */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-agro-green-500 text-agro-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Aba: Minhas Transações */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Filtros */}
                <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Transação
                    </label>
                    <select
                      value={transactionFilter}
                      onChange={(e) => setTransactionFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500"
                    >
                      <option value="all">Todas</option>
                      <option value="PRODUCT">Produtos</option>
                      <option value="FREIGHT">Fretes</option>
                      <option value="SERVICE">Serviços</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500"
                    >
                      <option value="all">Todos</option>
                      <option value="PENDING">Aguardando</option>
                      <option value="NEGOTIATING">Em Negociação</option>
                      <option value="AGREED">Acordado</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* Transações como Comprador */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <span>Minhas Compras</span>
                  </h3>
                  
                  {getTransactionsByRole('buyer').length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Nenhuma compra registrada
                      </h4>
                      <p className="text-gray-500">
                        Suas intenções de compra aparecerão aqui
                      </p>
                    </div>
                  ) : (
                    <TransactionList
                      transactions={getTransactionsByRole('buyer')}
                      title=""
                      onViewTransaction={handleViewTransaction}
                      onSendMessage={handleSendMessage}
                    />
                  )}
                </div>

                {/* Transações como Vendedor */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Minhas Vendas</span>
                  </h3>
                  
                  {getTransactionsByRole('seller').length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Nenhuma venda registrada
                      </h4>
                      <p className="text-gray-500">
                        Suas vendas aparecerão aqui quando receber interesses
                      </p>
                    </div>
                  ) : (
                    <TransactionList
                      transactions={getTransactionsByRole('seller')}
                      title=""
                      onViewTransaction={handleViewTransaction}
                      onSendMessage={handleSendMessage}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Aba: Mensagens */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Mensagens</h3>
                
                {userMessages.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">
                      Nenhuma mensagem
                    </h4>
                    <p className="text-gray-500">
                      Suas mensagens de negociação aparecerão aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userMessages.map((message) => (
                      <div key={message.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                              Transação: {message.transactionId}
                            </p>
                            <p className="text-gray-800">{message.body || 'Mensagem'}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aba: Notificações */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Notificações</h3>
                
                {userNotifications.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">
                      Nenhuma notificação
                    </h4>
                    <p className="text-gray-500">
                      Suas notificações aparecerão aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userNotifications.map((notification) => (
                      <div key={notification.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-gray-600">{notification.message}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aba: Perfil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Perfil do Usuário</h3>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Informações Pessoais</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nome</label>
                          <p className="text-gray-900">{userProfile?.name || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">E-mail</label>
                          <p className="text-gray-900">{userProfile?.email || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Telefone</label>
                          <p className="text-gray-900">{userProfile?.phone || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Verificação CPF/CNPJ</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userProfile?.cpfCnpjVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userProfile?.cpfCnpjVerified ? 'Verificado' : 'Não verificado'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Endereço</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">CEP</label>
                          <p className="text-gray-900">{userProfile?.address?.cep || 'Não informado'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cidade</label>
                          <p className="text-gray-900">{userProfile?.address?.city || 'Não informada'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Estado</label>
                          <p className="text-gray-900">{userProfile?.address?.state || 'Não informado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="px-4 py-2 bg-agro-green-600 text-white rounded-lg hover:bg-agro-green-700 transition-colors">
                      Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Aba: Preferências */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Preferências</h3>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Notificações</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-agro-green-600 focus:ring-agro-green-500" defaultChecked />
                          <span className="ml-2 text-gray-700">E-mail</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-agro-green-600 focus:ring-agro-green-500" defaultChecked />
                          <span className="ml-2 text-gray-700">SMS</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-agro-green-600 focus:ring-agro-green-500" defaultChecked />
                          <span className="ml-2 text-gray-700">Push</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">Idioma</h4>
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500">
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 bg-agro-green-600 text-white rounded-lg hover:bg-agro-green-700 transition-colors">
                        Salvar Preferências
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PainelUsuario;
