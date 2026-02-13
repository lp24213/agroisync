import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, ShoppingCart, MessageSquare, BarChart3, Plus, Edit, Trash, TrendingUp } from 'lucide-react';

const UserPanel = ({ user, myProducts, myPurchases, myStock, myMessages }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = value => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = status => {
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

  const getStatusText = status => {
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
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <h2 className='text-gradient-agro mb-4 text-3xl font-bold'>Meu Painel</h2>
        <p className='mx-auto max-w-2xl text-white/60'>
          Gerencie seus produtos, acompanhe suas transações e conecte-se com outros usuários.
        </p>
      </div>

      {/* User Info */}
      <div className='card p-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500'>
            <User className='h-8 w-8 text-white' />
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-bold text-white'>{user?.name || 'Usuário'}</h3>
            <p className='text-white/60'>{user?.email || 'email@exemplo.com'}</p>
            <div className='mt-2 flex items-center space-x-4 text-sm'>
              <span className='text-white/60'>Membro desde: {formatDate(user?.createdAt || new Date())}</span>
              <span className='text-emerald-400'>Verificado ✓</span>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-gradient-emerald text-2xl font-bold'>{myProducts?.length || 0}</div>
            <div className='text-sm text-white/60'>Produtos</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
        <div className='card p-6 text-center'>
          <Package className='mx-auto mb-3 h-8 w-8 text-emerald-400' />
          <div className='text-gradient-emerald mb-1 text-2xl font-bold'>{myProducts?.length || 0}</div>
          <div className='text-sm text-white/60'>Meus Produtos</div>
        </div>
        <div className='card p-6 text-center'>
          <ShoppingCart className='mx-auto mb-3 h-8 w-8 text-emerald-400' />
          <div className='text-gradient-emerald mb-1 text-2xl font-bold'>{myPurchases?.length || 0}</div>
          <div className='text-sm text-white/60'>Minhas Compras</div>
        </div>
        <div className='card p-6 text-center'>
          <BarChart3 className='mx-auto mb-3 h-8 w-8 text-emerald-400' />
          <div className='text-gradient-emerald mb-1 text-2xl font-bold'>{myStock?.length || 0}</div>
          <div className='text-sm text-white/60'>Vendas</div>
        </div>
        <div className='card p-6 text-center'>
          <MessageSquare className='mx-auto mb-3 h-8 w-8 text-emerald-400' />
          <div className='text-gradient-emerald mb-1 text-2xl font-bold'>{myMessages?.length || 0}</div>
          <div className='text-sm text-white/60'>Mensagens</div>
        </div>
      </div>

      {/* Tabs */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {[
          { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
          { id: 'products', name: 'Meus Produtos', icon: Package },
          { id: 'purchases', name: 'Minhas Compras', icon: ShoppingCart },
          { id: 'sales', name: 'Minhas Vendas', icon: TrendingUp },
          { id: 'messages', name: 'Mensagens', icon: MessageSquare }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-black'
                : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
            }`}
          >
            <tab.icon className='h-4 w-4' />
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Content based on active tab */}
      <div className='card p-6'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            <h3 className='mb-4 text-xl font-bold text-white'>Visão Geral da Conta</h3>

            {/* Recent Activity */}
            <div>
              <h4 className='mb-3 text-lg font-semibold text-white'>Atividade Recente</h4>
              <div className='space-y-3'>
                {myProducts?.slice(0, 3).map(product => (
                  <div key={product.id} className='flex items-center space-x-3 rounded-lg bg-black/30 p-3'>
                    <Package className='h-5 w-5 text-emerald-400' />
                    <div className='flex-1'>
                      <p className='font-medium text-white'>{product.name}</p>
                      <p className='text-sm text-white/60'>Produto atualizado</p>
                    </div>
                    <span className='text-sm text-white/40'>{formatDate(product.updatedAt)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className='mb-3 text-lg font-semibold text-white'>Ações Rápidas</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='rounded-lg border border-emerald-500/30 bg-emerald-500/20 p-4 text-emerald-400 transition-colors duration-300 hover:bg-emerald-500/30'
                >
                  <Plus className='mx-auto mb-2 h-6 w-6' />
                  <span className='text-sm font-medium'>Adicionar Produto</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='rounded-lg border border-sky-500/30 bg-sky-500/20 p-4 text-sky-400 transition-colors duration-300 hover:bg-sky-500/30'
                >
                  <MessageSquare className='mx-auto mb-2 h-6 w-6' />
                  <span className='text-sm font-medium'>Ver Mensagens</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='rounded-lg border border-amber-500/30 bg-amber-500/20 p-4 text-amber-400 transition-colors duration-300 hover:bg-amber-500/30'
                >
                  <BarChart3 className='mx-auto mb-2 h-6 w-6' />
                  <span className='text-sm font-medium'>Relatórios</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-white'>Meus Produtos</h3>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='btn-primary px-4 py-2'>
                <Plus className='mr-2 inline h-4 w-4' />
                Novo Produto
              </motion.button>
            </div>

            {myProducts?.length === 0 ? (
              <div className='py-8 text-center'>
                <Package className='mx-auto mb-3 h-12 w-12 text-white/40' />
                <p className='text-white/60'>Você ainda não cadastrou produtos</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {myProducts?.map(product => (
                  <div key={product.id} className='rounded-lg border border-emerald-500/20 p-4'>
                    <div className='mb-2 flex items-start justify-between'>
                      <h4 className='font-medium text-white'>{product.name}</h4>
                      <span className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </div>
                    <p className='mb-2 text-sm text-white/60'>{product.description}</p>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-emerald-400'>{formatCurrency(product.price)}</span>
                      <div className='flex space-x-2'>
                        <button className='text-emerald-400 hover:text-emerald-300'>
                          <Edit className='h-4 w-4' />
                        </button>
                        <button className='text-red-400 hover:text-red-300'>
                          <Trash className='h-4 w-4' />
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
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-white'>Minhas Compras</h3>

            {myPurchases?.length === 0 ? (
              <div className='py-8 text-center'>
                <ShoppingCart className='mx-auto mb-3 h-12 w-12 text-white/40' />
                <p className='text-white/60'>Você ainda não fez compras</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {myPurchases?.map(purchase => (
                  <div key={purchase.id} className='rounded-lg border border-emerald-500/20 p-4'>
                    <div className='mb-2 flex items-start justify-between'>
                      <div>
                        <h4 className='font-medium text-white'>{purchase.items?.[0]?.name || 'Produto'}</h4>
                        <p className='text-sm text-white/60'>Vendedor: {purchase.seller?.name || 'N/A'}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(purchase.status)}`}>
                        {getStatusText(purchase.status)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-emerald-400'>{formatCurrency(purchase.total)}</span>
                      <span className='text-sm text-white/60'>{formatDate(purchase.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-white'>Minhas Vendas</h3>

            {myStock?.length === 0 ? (
              <div className='py-8 text-center'>
                <TrendingUp className='mx-auto mb-3 h-12 w-12 text-white/40' />
                <p className='text-white/60'>Você ainda não tem vendas</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {myStock?.map(sale => (
                  <div key={sale.id} className='rounded-lg border border-emerald-500/20 p-4'>
                    <div className='mb-2 flex items-start justify-between'>
                      <div>
                        <h4 className='font-medium text-white'>{sale.items?.[0]?.name || 'Produto'}</h4>
                        <p className='text-sm text-white/60'>Comprador: {sale.buyer?.name || 'N/A'}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(sale.status)}`}>
                        {getStatusText(sale.status)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold text-emerald-400'>{formatCurrency(sale.total)}</span>
                      <span className='text-sm text-white/60'>{formatDate(sale.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-white'>Mensagens</h3>

            {myMessages?.length === 0 ? (
              <div className='py-8 text-center'>
                <MessageSquare className='mx-auto mb-3 h-12 w-12 text-white/40' />
                <p className='text-white/60'>Você ainda não tem mensagens</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {myMessages?.map(message => (
                  <div key={message.id} className='rounded-lg border border-emerald-500/20 p-4'>
                    <div className='mb-2 flex items-start justify-between'>
                      <div>
                        <h4 className='font-medium text-white'>{message.sender?.name || 'Usuário'}</h4>
                        <p className='text-sm text-white/60'>{message.subject || 'Assunto da mensagem'}</p>
                      </div>
                      <span className='text-sm text-white/60'>{formatDate(message.createdAt)}</span>
                    </div>
                    <p className='text-sm text-white/70'>{message.content}</p>
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
