import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, MessageSquare, Bell, LogOut, Heart, Settings, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logger from '../../services/logger';

const BuyerPanel = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadBuyerData();
  }, []);

  const loadBuyerData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados mockados
      setOrders([
        {
          id: 'ORD-001',
          product: 'Sementes de Soja Premium',
          quantity: 100,
          price: 2500.0,
          status: 'delivered',
          date: '2024-01-15',
          supplier: 'Fazenda São José'
        },
        {
          id: 'ORD-002',
          product: 'Fertilizante NPK 20-10-10',
          quantity: 50,
          price: 1800.0,
          status: 'shipping',
          date: '2024-01-20',
          supplier: 'AgroTech Solutions'
        },
        {
          id: 'ORD-003',
          product: 'Defensivo Agrícola',
          quantity: 25,
          price: 1200.0,
          status: 'processing',
          date: '2024-01-25',
          supplier: 'CropProtect'
        }
      ]);

      setFavorites([
        {
          id: 'FAV-001',
          product: 'Trator John Deere 6110J',
          price: 180000.0,
          supplier: 'Máquinas Agrícolas SP'
        },
        {
          id: 'FAV-002',
          product: 'Sementes de Milho Híbrido',
          price: 45.0,
          supplier: 'Sementes Premium'
        }
      ]);

      setNotifications([
        {
          id: 'NOT-001',
          title: 'Pedido entregue',
          message: 'Seu pedido ORD-001 foi entregue com sucesso.',
          date: '2024-01-15',
          read: false
        },
        {
          id: 'NOT-002',
          title: 'Produto em promoção',
          message: 'Fertilizante NPK está com 20% de desconto.',
          date: '2024-01-20',
          read: true
        }
      ]);
    } catch (error) {
      logger.error('Erro ao carregar dados do comprador', error, { panel: 'buyer' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'orders', label: t('buyerPanel.orders', 'Pedidos'), icon: ShoppingCart },
    { id: 'favorites', label: t('buyerPanel.favorites', 'Favoritos'), icon: Heart },
    { id: 'messages', label: t('buyerPanel.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'notifications', label: t('buyerPanel.notifications', 'Notificações'), icon: Bell },
    { id: 'settings', label: t('buyerPanel.settings', 'Configurações'), icon: Settings }
  ];

  const renderOrders = () => (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
          {t('buyerPanel.myOrders', 'Meus Pedidos')}
        </h3>
        <Link
          to='/store'
          className='flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700'
        >
          <Plus className='h-4 w-4' />
          {t('buyerPanel.newOrder', 'Novo Pedido')}
        </Link>
      </div>

      <div className='grid gap-4'>
        {orders.map(order => (
          <div
            key={order.id}
            className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'
          >
            <div className='mb-3 flex items-start justify-between'>
              <div>
                <h4 className='font-semibold text-slate-900 dark:text-slate-100'>{order.product}</h4>
                <p className='text-sm text-slate-600 dark:text-slate-400'>Fornecedor: {order.supplier}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'shipping'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status === 'delivered' ? 'Entregue' : order.status === 'shipping' ? 'Enviado' : 'Processando'}
              </span>
            </div>

            <div className='flex items-center justify-between text-sm text-slate-600 dark:text-slate-400'>
              <span>Quantidade: {order.quantity}</span>
              <span>Data: {order.date}</span>
              <span className='font-semibold text-slate-900 dark:text-slate-100'>
                R$ {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
        {t('buyerPanel.favorites', 'Favoritos')}
      </h3>

      <div className='grid gap-4'>
        {favorites.map(favorite => (
          <div
            key={favorite.id}
            className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'
          >
            <div className='flex items-start justify-between'>
              <div>
                <h4 className='font-semibold text-slate-900 dark:text-slate-100'>{favorite.product}</h4>
                <p className='text-sm text-slate-600 dark:text-slate-400'>{favorite.supplier}</p>
              </div>
              <div className='text-right'>
                <p className='font-semibold text-slate-900 dark:text-slate-100'>
                  R$ {favorite.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <button className='mt-1 text-sm text-emerald-600 hover:text-emerald-700'>Ver Produto</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
        {t('buyerPanel.messages', 'Mensagens')}
      </h3>

      <div className='py-8 text-center'>
        <MessageSquare className='mx-auto mb-4 h-12 w-12 text-slate-400' />
        <p className='text-slate-600 dark:text-slate-400'>{t('buyerPanel.noMessages', 'Nenhuma mensagem ainda.')}</p>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
        {t('buyerPanel.notifications', 'Notificações')}
      </h3>

      <div className='space-y-3'>
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`rounded-lg border p-4 ${
              notification.read
                ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
            }`}
          >
            <div className='flex items-start justify-between'>
              <div>
                <h4 className='font-semibold text-slate-900 dark:text-slate-100'>{notification.title}</h4>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>{notification.message}</p>
              </div>
              <span className='text-xs text-slate-500 dark:text-slate-400'>{notification.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
        {t('buyerPanel.settings', 'Configurações')}
      </h3>

      <div className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
              {t('buyerPanel.notifications', 'Notificações')}
            </label>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input type='checkbox' defaultChecked className='mr-2' />
                <span className='text-sm text-slate-600 dark:text-slate-400'>
                  {t('buyerPanel.emailNotifications', 'Notificações por email')}
                </span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' defaultChecked className='mr-2' />
                <span className='text-sm text-slate-600 dark:text-slate-400'>
                  {t('buyerPanel.emailNotifications', 'Notificações por Email')}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
              {t('buyerPanel.privacy', 'Privacidade')}
            </label>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input type='checkbox' defaultChecked className='mr-2' />
                <span className='text-sm text-slate-600 dark:text-slate-400'>
                  {t('buyerPanel.profilePublic', 'Perfil público')}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-700'></div>
      </div>
    );
  }

  return (
    <div className='card-futuristic p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='heading-3 flex items-center text-gray-900'>
          <ShoppingCart className='mr-2 h-5 w-5 text-gray-700' />
          Painel do Comprador
        </h2>
        <button onClick={handleLogout} className='p-2 text-gray-400 hover:text-gray-600'>
          <LogOut className='h-4 w-4' />
        </button>
      </div>

      {/* Tabs */}
      <div className='mb-6 flex space-x-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            <tab.icon className='h-4 w-4' />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className='min-h-[400px]'>
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default BuyerPanel;
