import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Package, ShoppingCart, MessageSquare, BarChart3,
  Plus, Edit, Trash, TrendingUp
} from 'lucide-react';

const UserPanel = ({ user, myProducts, myPurchases, myStock, myMessages }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-agro mb-4">
          Meu Painel
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Gerencie seus produtos, acompanhe suas transações e conecte-se com outros usuários.
        </p>
      </div>

      {/* User Info */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{user?.name || 'Usuário'}</h3>
            <p className="text-white/60">{user?.email || 'email@exemplo.com'}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-white/60">Membro desde: {formatDate(user?.createdAt || new Date())}</span>
              <span className="text-emerald-400">Verificado ✓</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient-emerald">{myProducts?.length || 0}</div>
            <div className="text-white/60 text-sm">Produtos</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <Package className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gradient-emerald mb-1">{myProducts?.length || 0}</div>
          <div className="text-white/60 text-sm">Meus Produtos</div>
        </div>
        <div className="card p-6 text-center">
          <ShoppingCart className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gradient-emerald mb-1">{myPurchases?.length || 0}</div>
          <div className="text-white/60 text-sm">Minhas Compras</div>
        </div>
        <div className="card p-6 text-center">
          <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gradient-emerald mb-1">{myStock?.length || 0}</div>
          <div className="text-white/60 text-sm">Vendas</div>
        </div>
        <div className="card p-6 text-center">
          <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gradient-emerald mb-1">{myMessages?.length || 0}</div>
          <div className="text-white/60 text-sm">Mensagens</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
          { id: 'products', name: 'Meus Produtos', icon: Package },
          { id: 'purchases', name: 'Minhas Compras', icon: ShoppingCart },
          { id: 'sales', name: 'Minhas Vendas', icon: TrendingUp },
          { id: 'messages', name: 'Mensagens', icon: MessageSquare }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-black'
                : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Content based on active tab */}
      <div className="card p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Visão Geral da Conta</h3>
            
            {/* Recent Activity */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Atividade Recente</h4>
              <div className="space-y-3">
                {myProducts?.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg">
                    <Package className="w-5 h-5 text-emerald-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-white/60 text-sm">Produto atualizado</p>
                    </div>
                    <span className="text-white/40 text-sm">{formatDate(product.updatedAt)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Ações Rápidas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors duration-300"
                >
                  <Plus className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Adicionar Produto</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-sky-500/20 border border-sky-500/30 rounded-lg text-sky-400 hover:bg-sky-500/30 transition-colors duration-300"
                >
                  <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Ver Mensagens</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-colors duration-300"
                >
                  <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Relatórios</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Meus Produtos</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-4 py-2"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Novo Produto
              </motion.button>
            </div>
            
            {myProducts?.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">Você ainda não cadastrou produtos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts?.map((product) => (
                  <div key={product.id} className="border border-emerald-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{product.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-400">{formatCurrency(product.price)}</span>
                      <div className="flex space-x-2">
                        <button className="text-emerald-400 hover:text-emerald-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Minhas Compras</h3>
            
            {myPurchases?.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">Você ainda não fez compras</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPurchases?.map((purchase) => (
                  <div key={purchase.id} className="border border-emerald-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white">
                          {purchase.items?.[0]?.name || 'Produto'}
                        </h4>
                        <p className="text-sm text-white/60">
                          Vendedor: {purchase.seller?.name || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(purchase.status)}`}>
                        {getStatusText(purchase.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-400">
                        {formatCurrency(purchase.total)}
                      </span>
                      <span className="text-sm text-white/60">
                        {formatDate(purchase.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Minhas Vendas</h3>
            
            {myStock?.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">Você ainda não tem vendas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myStock?.map((sale) => (
                  <div key={sale.id} className="border border-emerald-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white">
                          {sale.items?.[0]?.name || 'Produto'}
                        </h4>
                        <p className="text-sm text-white/60">
                          Comprador: {sale.buyer?.name || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(sale.status)}`}>
                        {getStatusText(sale.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-400">
                        {formatCurrency(sale.total)}
                      </span>
                      <span className="text-sm text-white/60">
                        {formatDate(sale.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Mensagens</h3>
            
            {myMessages?.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">Você ainda não tem mensagens</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myMessages?.map((message) => (
                  <div key={message.id} className="border border-emerald-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white">{message.sender?.name || 'Usuário'}</h4>
                        <p className="text-sm text-white/60">{message.subject || 'Assunto da mensagem'}</p>
                      </div>
                      <span className="text-sm text-white/60">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
