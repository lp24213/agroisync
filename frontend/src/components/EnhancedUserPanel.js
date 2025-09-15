import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  MessageSquare, 
  Eye, 
  Lock, 
  Unlock,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DataAccessControl from './DataAccessControl';
import { getUnlockedData } from '../services/stripe';

const EnhancedUserPanel = ({ userType = 'buyer' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    purchases: [],
    sales: [],
    payments: [],
    messages: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  useEffect(() => {
    loadUserData();
  }, [userType, filters]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData({
        purchases: [
          {
            id: 1,
            title: 'Soja Premium - 1000 toneladas',
            seller: 'Fazenda São João',
            amount: 150000,
            status: 'completed',
            date: '2024-01-15',
            adId: 'ad_001'
          },
          {
            id: 2,
            title: 'Milho Transgênico - 500 toneladas',
            seller: 'AgroTech Solutions',
            amount: 75000,
            status: 'pending',
            date: '2024-01-20',
            adId: 'ad_002'
          }
        ],
        sales: [
          {
            id: 1,
            title: 'Café Arábica - 200 sacas',
            buyer: 'Exportadora Brasil',
            amount: 25000,
            status: 'completed',
            date: '2024-01-10',
            adId: 'ad_003'
          }
        ],
        payments: [
          {
            id: 1,
            type: 'individual',
            amount: 50,
            status: 'succeeded',
            date: '2024-01-15',
            description: 'Acesso aos dados - Soja Premium'
          }
        ],
        stats: {
          totalPurchases: 2,
          totalSales: 1,
          totalSpent: 225000,
          totalEarned: 25000,
          unlockedData: 1,
          pendingPayments: 1
        }
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'succeeded':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { id: 'sales', label: 'Vendas', icon: Truck },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare }
  ];

  const renderOverview = () => (
    <div className="grid grid-4 gap-6">
      <div className="card text-center">
        <div className="flex-center mb-4" style={{ color: 'var(--txc-primary-green)' }}>
          <TrendingUp size={32} />
        </div>
        <h3>Total de Compras</h3>
        <div className="text-3xl font-bold text-primary mb-2">
          {data.stats.totalPurchases}
        </div>
        <p className="text-secondary">Transações realizadas</p>
      </div>

      <div className="card text-center">
        <div className="flex-center mb-4" style={{ color: 'var(--grao-primary-gold)' }}>
          <DollarSign size={32} />
        </div>
        <h3>Valor Total</h3>
        <div className="text-3xl font-bold text-primary mb-2">
          {formatCurrency(data.stats.totalSpent)}
        </div>
        <p className="text-secondary">Investido em compras</p>
      </div>

      <div className="card text-center">
        <div className="flex-center mb-4" style={{ color: 'var(--txc-light-green)' }}>
          <Unlock size={32} />
        </div>
        <h3>Dados Liberados</h3>
        <div className="text-3xl font-bold text-primary mb-2">
          {data.stats.unlockedData}
        </div>
        <p className="text-secondary">Contatos desbloqueados</p>
      </div>

      <div className="card text-center">
        <div className="flex-center mb-4" style={{ color: 'var(--txc-accent-green)' }}>
          <Clock size={32} />
        </div>
        <h3>Pendentes</h3>
        <div className="text-3xl font-bold text-primary mb-2">
          {data.stats.pendingPayments}
        </div>
        <p className="text-secondary">Aguardando pagamento</p>
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-4">
      <div className="flex-between mb-6">
        <h2>Suas Compras</h2>
        <div className="flex gap-2">
          <select 
            className="btn-secondary"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">Todos os status</option>
            <option value="completed">Concluídas</option>
            <option value="pending">Pendentes</option>
            <option value="failed">Falhadas</option>
          </select>
          <button className="btn-secondary">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {data.purchases.map((purchase) => (
        <motion.div
          key={purchase.id}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(purchase.status)}
                <h3 className="text-lg font-semibold">{purchase.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                  {purchase.status}
                </span>
              </div>
              <p className="text-secondary mb-2">Vendedor: {purchase.seller}</p>
              <div className="flex gap-4 text-sm text-secondary">
                <span>Valor: {formatCurrency(purchase.amount)}</span>
                <span>Data: {formatDate(purchase.date)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Eye size={16} />
              </button>
              <button className="btn-primary">
                <MessageSquare size={16} />
              </button>
              <button className="btn-secondary">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          
          {/* Componente de controle de acesso aos dados */}
          <div className="mt-4 border-t pt-4">
            <DataAccessControl
              adId={purchase.adId}
              adData={{
                title: purchase.title,
                userName: purchase.seller,
                phone: '(11) 99999-9999',
                email: 'contato@fazenda.com',
                location: 'São Paulo, SP'
              }}
              onDataUnlocked={(adId, adData) => {
                console.log('Dados liberados:', adId, adData);
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSales = () => (
    <div className="space-y-4">
      <div className="flex-between mb-6">
        <h2>Suas Vendas</h2>
        <div className="flex gap-2">
          <select 
            className="btn-secondary"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">Todos os status</option>
            <option value="completed">Concluídas</option>
            <option value="pending">Pendentes</option>
            <option value="failed">Falhadas</option>
          </select>
        </div>
      </div>

      {data.sales.map((sale) => (
        <motion.div
          key={sale.id}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(sale.status)}
                <h3 className="text-lg font-semibold">{sale.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                  {sale.status}
                </span>
              </div>
              <p className="text-secondary mb-2">Comprador: {sale.buyer}</p>
              <div className="flex gap-4 text-sm text-secondary">
                <span>Valor: {formatCurrency(sale.amount)}</span>
                <span>Data: {formatDate(sale.date)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Eye size={16} />
              </button>
              <button className="btn-primary">
                <MessageSquare size={16} />
              </button>
              <button className="btn-secondary">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      <div className="flex-between mb-6">
        <h2>Histórico de Pagamentos</h2>
        <div className="flex gap-2">
          <select 
            className="btn-secondary"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">Todos os status</option>
            <option value="succeeded">Aprovados</option>
            <option value="pending">Pendentes</option>
            <option value="failed">Falhados</option>
          </select>
        </div>
      </div>

      {data.payments.map((payment) => (
        <motion.div
          key={payment.id}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(payment.status)}
                <h3 className="text-lg font-semibold">{payment.description}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-secondary">
                <span>Tipo: {payment.type}</span>
                <span>Valor: {formatCurrency(payment.amount)}</span>
                <span>Data: {formatDate(payment.date)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Eye size={16} />
              </button>
              <button className="btn-secondary">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="flex-between mb-6">
        <h2>Mensagens</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Buscar mensagens..."
            className="btn-secondary"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <button className="btn-secondary">
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="card text-center py-12">
        <MessageSquare size={48} className="mx-auto mb-4 text-secondary" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
        <p className="text-secondary mb-4">
          Suas conversas com compradores e vendedores aparecerão aqui.
        </p>
        <button className="btn-primary">
          Iniciar Conversa
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'purchases':
        return renderPurchases();
      case 'sales':
        return renderSales();
      case 'payments':
        return renderPayments();
      case 'messages':
        return renderMessages();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-user-panel">
      <div className="container">
        <div className="text-center mb-8">
          <h1>Painel do {userType === 'buyer' ? 'Comprador' : 'Vendedor'}</h1>
          <p>Gerencie suas transações e acompanhe seu progresso</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-secondary rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:text-primary'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedUserPanel;
