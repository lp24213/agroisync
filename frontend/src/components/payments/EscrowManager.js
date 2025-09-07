import React, { useState, // useEffect } from 'react';
import { motion } from 'framer-';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, XCircle } from 'lucide-react';
import paymentService from '../../services/paymentService';

const EscrowManager = () => {
  const {  } = useTranslation();
  const {  } = // useAuth();
  const [// transactions, setTransactions] = useState([]);
  const [// loading, // setLoading] = useState(false);
  const [// selectedTransaction, setSelectedTransaction] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed', 'cancelled'
  const [stats, setStats] = useState({});

  // useEffect(() => {
    loadEscrowData();
  }, []);

  const loadEscrowData = async () => {
    // setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      const mockTransactions = [
        {
          id: 'escrow-001',
          orderId: 'ORD-001',
          buyer: { id: '// user-1', name: 'João Silva', email: 'joao@example.com' },
          seller: { id: '// user-2', name: 'Maria Santos', email: 'maria@example.com' },
          amount: 15000,
          currency: 'brl',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000),
          description: 'Compra de Soja Premium - 12.5 toneladas',
          escrowFee: 150,
          releaseConditions: [
            'Confirmação de entrega',
            'Inspeção de qualidade',
            'Documentação completa'
          ],
          documents: ['invoice.pdf', 'quality_cert.pdf'],
          estimatedRelease: new Date(Date.now() + 172800000) // 2 dias
        },
        {
          id: 'escrow-002',
          orderId: 'ORD-002',
          buyer: { id: '// user-3', name: 'Pedro Oliveira', email: 'pedro@example.com' },
          seller: { id: '// user-4', name: 'Ana Costa', email: 'ana@example.com' },
          amount: 8500,
          currency: 'brl',
          status: 'completed',
          createdAt: new Date(Date.now() - 259200000),
          completedAt: new Date(Date.now() - 86400000),
          description: 'Compra de Milho Orgânico - 10 toneladas',
          escrowFee: 85,
          releaseConditions: ['Confirmação de entrega'],
          documents: ['invoice.pdf', 'delivery_confirmation.pdf']
        }
      ];

      setTransactions(mockTransactions);

      // Estatísticas mockadas
      setStats({
        totalTransactions: 24,
        pendingAmount: 125000,
        completedAmount: 450000,
        totalFees: 5750,
        averageProcessingTime: 2.5
      });
    } catch (error) {
      console.error('Erro ao carregar dados Escrow:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handleReleasePayment = async (transactionId) => {
    try {
      await paymentService.releaseEscrowPayment(
        transactionId,
        // user.id,
        'Pagamento liberado após confirmação de entrega'
      );
      
      // Atualizar status local
      setTransactions(prev => 
        prev.map(// t => 
          // t.id === transactionId 
            ? { ...// t, status: 'completed', completedAt: new Date() }
            : // t
        )
      );
    } catch (error) {
      console.error('Erro ao liberar pagamento:', error);
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    try {
      await paymentService.cancelEscrowTransaction(
        transactionId,
        'Transação cancelada por solicitação do admin'
      );
      
      // Atualizar status local
      setTransactions(prev => 
        prev.map(// t => 
          // t.id === transactionId 
            ? { ...// t, status: 'cancelled', cancelledAt: new Date() }
            : // t
        )
      );
    } catch (error) {
      console.error('Erro ao cancelar transação:', error);
    }
  };

  const filteredTransactions = // transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <// Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <// CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <// AlertTriangle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {// t('escrow.totalTransactions', 'Total de Transações')}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalTransactions}
            </p>
          </div>
          <// Shield className="w-8 h-8 text-emerald-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {// t('escrow.pendingAmount', 'Valor Pendente')}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(stats.pendingAmount)}
            </p>
          </div>
          <// Clock className="w-8 h-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {// t('escrow.completedAmount', 'Valor Processado')}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(stats.completedAmount)}
            </p>
          </div>
          <// CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {// t('escrow.totalFees', 'Taxas Totais')}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(stats.totalFees)}
            </p>
          </div>
          <// DollarSign className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const renderTransactionList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {// t('escrow.// transactions', 'Transações Escrow')}
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {// t('escrow.all', 'Todas')}
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {// t('escrow.pending', 'Pendentes')}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {// t('escrow.completed', 'Concluídas')}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <// motion.div
            key={transaction.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {transaction.description}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {// t(`escrowStatus.${transaction.status}`, transaction.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {// t('escrow.buyer', 'Comprador')}:
                    </p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {transaction.buyer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {// t('escrow.seller', 'Vendedor')}:
                    </p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {transaction.seller.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <// DollarSign className="w-4 h-4" />
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(transaction.amount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <// Calendar className="w-4 h-4" />
                    {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <// FileText className="w-4 h-4" />
                    {transaction.documents.length} {// t('escrow.documents', 'documentos')}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTransaction(transaction)}
                  className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
                  title={// t('escrow.viewDetails', 'Ver Detalhes')}
                >
                  <// Eye className="w-5 h-5" />
                </button>
                
                {transaction.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReleasePayment(transaction.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      {// t('escrow.release', 'Liberar')}
                    </button>
                    <button
                      onClick={() => handleCancelTransaction(transaction.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      {// t('escrow.cancel', 'Cancelar')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </// motion.div>
        ))}
      </div>
    </div>
  );

  if (// loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {// t('escrow.// loading', 'Carregando transações Escrow...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {// t('escrow.title', 'Gerenciador Escrow')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {// t('escrow.subtitle', 'Gerencie transações em garantia e libere pagamentos')}
        </p>
      </div>

      {renderStats()}
      {renderTransactionList()}
    </div>
  );
};

export default EscrowManager;
