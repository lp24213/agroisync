import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Eye, Clock, CheckCircle, XCircle, 
  AlertTriangle, Calendar, DollarSign, Package, Truck 
} from 'lucide-react';
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../services/transactionService';

const TransactionList = ({ transactions, title, emptyMessage, onViewTransaction, onSendMessage }) => {
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const toggleExpanded = (transactionId) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'NEGOTIATING':
        return <MessageSquare className="w-4 h-4" />;
      case 'AGREED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          {emptyMessage || 'Nenhuma transação encontrada'}
        </h3>
        <p className="text-slate-500">
          Suas transações aparecerão aqui quando você começar a negociar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      
      {transactions.map((transaction) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium overflow-hidden"
        >
          {/* Header da transação */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  TRANSACTION_STATUS[transaction.status]?.color || 'bg-slate-100 text-slate-800'
                }`}>
                  {getStatusIcon(transaction.status)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">
                    {TRANSACTION_TYPES[transaction.type] || 'Transação'}
                  </h4>
                  <p className="text-sm text-slate-500">
                    ID: {transaction.id}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(transaction.total)}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Status e informações */}
          <div className="p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                TRANSACTION_STATUS[transaction.status]?.color || 'bg-slate-100 text-slate-800'
              }`}>
                {TRANSACTION_STATUS[transaction.status]?.name || transaction.status}
              </span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleExpanded(transaction.id)}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSendMessage && onSendMessage(transaction)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-slate-600">
              {TRANSACTION_STATUS[transaction.status]?.description || 'Status da transação'}
            </p>
          </div>

          {/* Detalhes expandidos */}
          {expandedTransaction === transaction.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200"
            >
              <div className="p-4 space-y-4">
                                 {/* Informações das partes */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {transaction.buyerId && (
                     <div className="p-3 bg-blue-50 rounded-lg">
                       <h5 className="font-medium text-blue-800 mb-2">Comprador</h5>
                       <p className="text-sm text-blue-700">ID: {transaction.buyerId}</p>
                       <p className="text-xs text-blue-600">Usuário do sistema</p>
                     </div>
                   )}
                   
                   {transaction.sellerId && (
                     <div className="p-3 bg-green-50 rounded-lg">
                       <h5 className="font-medium text-green-800 mb-2">Vendedor</h5>
                       <p className="text-sm text-green-700">ID: {transaction.sellerId}</p>
                       <p className="text-xs text-green-600">Usuário do sistema</p>
                     </div>
                   )}
                 </div>

                {/* Itens da transação */}
                {transaction.items && transaction.items.length > 0 && (
                  <div>
                    <h5 className="font-medium text-slate-800 mb-2">Itens</h5>
                    <div className="space-y-2">
                      {transaction.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-3">
                            <Package className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.quantity} {item.unit}</p>
                            <p className="text-xs text-slate-500">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações de frete */}
                {transaction.shipping && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Informações de Frete</span>
                    </h5>
                    <p className="text-sm text-blue-700">
                      Destino: {transaction.shipping.destination}
                    </p>
                    {transaction.shipping.cost && (
                      <p className="text-sm text-blue-700">
                        Custo: {formatCurrency(transaction.shipping.cost)}
                      </p>
                    )}
                  </div>
                )}

                {/* Histórico da transação */}
                {transaction.history && transaction.history.length > 0 && (
                  <div>
                    <h5 className="font-medium text-slate-800 mb-2">Histórico</h5>
                    <div className="space-y-2">
                      {transaction.history.map((event, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 rounded">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{event.description}</p>
                            <p className="text-xs text-slate-500">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => onViewTransaction && onViewTransaction(transaction)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalhes</span>
                  </button>
                  
                  <button
                    onClick={() => onSendMessage && onSendMessage(transaction)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;
