import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Truck, MessageSquare, Bell, LogOut, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverPanel = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('freights');
  const [loading, setLoading] = useState(false);
  const [availableFreights, setAvailableFreights] = useState([]);
  const [myFreights, setMyFreights] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      setAvailableFreights([
        {
          id: 'FREIGHT-001',
          origin: 'São Paulo, SP',
          destination: 'Rio de Janeiro, RJ',
          distance: 430,
          weight: 15000,
          price: 2500.00,
          date: '2024-01-30',
          client: 'AgroTech Solutions',
          type: 'Sementes'
        },
        {
          id: 'FREIGHT-002',
          origin: 'Campinas, SP',
          destination: 'Belo Horizonte, MG',
          distance: 580,
          weight: 20000,
          price: 3200.00,
          date: '2024-02-01',
          client: 'Fazenda São José',
          type: 'Fertilizantes'
        },
        {
          id: 'FREIGHT-003',
          origin: 'Ribeirão Preto, SP',
          destination: 'Goiânia, GO',
          distance: 720,
          weight: 25000,
          price: 4500.00,
          date: '2024-02-05',
          client: 'CropProtect',
          type: 'Defensivos'
        }
      ]);

      setMyFreights([
        {
          id: 'MY-FREIGHT-001',
          origin: 'São Paulo, SP',
          destination: 'Curitiba, PR',
          distance: 410,
          weight: 18000,
          price: 2800.00,
          status: 'in_transit',
          date: '2024-01-25',
          client: 'AgroMax',
          type: 'Sementes',
          progress: 65
        },
        {
          id: 'MY-FREIGHT-002',
          origin: 'Santos, SP',
          destination: 'Porto Alegre, RS',
          distance: 1100,
          weight: 22000,
          price: 5500.00,
          status: 'completed',
          date: '2024-01-20',
          client: 'Exportadora Brasil',
          type: 'Grãos',
          progress: 100
        }
      ]);

      setEarnings({
        thisMonth: 8300.00,
        lastMonth: 12500.00,
        total: 45000.00,
        completedFreights: 12
      });

      setNotifications([
        {
          id: 'NOT-001',
          title: 'Frete concluído',
          message: 'Seu frete MY-FREIGHT-002 foi concluído com sucesso.',
          date: '2024-01-20',
          read: false
        },
        {
          id: 'NOT-002',
          title: 'Novo frete disponível',
          message: 'Um novo frete para Goiânia está disponível.',
          date: '2024-01-25',
          read: true
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const acceptFreight = (freightId) => {
    const freight = availableFreights.find(f => f.id === freightId);
    if (freight) {
      setMyFreights(prev => [...prev, { ...freight, status: 'accepted', progress: 0 }]);
      setAvailableFreights(prev => prev.filter(f => f.id !== freightId));
    }
  };

  const tabs = [
    { id: 'freights', label: t('driverPanel.availableFreights', 'Fretes Disponíveis'), icon: Truck },
    { id: 'myFreights', label: t('driverPanel.myFreights', 'Meus Fretes'), icon: Navigation },
    { id: 'earnings', label: t('driverPanel.earnings', 'Ganhos'), icon: Bell },
    { id: 'messages', label: t('driverPanel.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'notifications', label: t('driverPanel.notifications', 'Notificações'), icon: Bell }
  ];

  const renderAvailableFreights = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.availableFreights', 'Fretes Disponíveis')}
      </h3>

      <div className="grid gap-4">
        {availableFreights.map((freight) => (
          <div key={freight.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  {freight.origin} → {freight.destination}
                  </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {freight.client} • {freight.type}
                </p>
              </div>
              <span className="text-lg font-bold text-emerald-600">
                R$ {freight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <div>
                <span className="font-medium">Distância:</span> {freight.distance} km
                    </div>
              <div>
                <span className="font-medium">Peso:</span> {freight.weight.toLocaleString()} kg
                  </div>
                    <div>
                <span className="font-medium">Data:</span> {freight.date}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {freight.type}
              </div>
            </div>
            
            <button
              onClick={() => acceptFreight(freight.id)}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Aceitar Frete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMyFreights = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.myFreights', 'Meus Fretes')}
      </h3>
      
      <div className="grid gap-4">
        {myFreights.map((freight) => (
          <div key={freight.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  {freight.origin} → {freight.destination}
                  </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {freight.client} • {freight.type}
                </p>
              </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                freight.status === 'completed' ? 'bg-green-100 text-green-800' :
                freight.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {freight.status === 'completed' ? 'Concluído' :
                 freight.status === 'in_transit' ? 'Em Trânsito' : 'Aceito'}
                  </span>
                </div>
                
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <div>
                <span className="font-medium">Distância:</span> {freight.distance} km
                    </div>
              <div>
                <span className="font-medium">Peso:</span> {freight.weight.toLocaleString()} kg
                  </div>
                    <div>
                <span className="font-medium">Data:</span> {freight.date}
                    </div>
              <div>
                <span className="font-medium">Valor:</span> R$ {freight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {freight.status === 'in_transit' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>Progresso</span>
                      <span>{freight.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${freight.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ver Detalhes
                  </button>
              {freight.status === 'in_transit' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Atualizar Status
                  </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.earnings', 'Ganhos')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Este Mês
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            R$ {earnings.thisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Mês Passado
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            R$ {earnings.lastMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Total
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            R$ {earnings.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Estatísticas
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600 dark:text-slate-400">Fretes Concluídos:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 ml-2">
              {earnings.completedFreights}
            </span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400">Média por Frete:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 ml-2">
              R$ {(earnings.total / earnings.completedFreights).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.messages', 'Mensagens')}
            </h3>
      
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          {t('driverPanel.noMessages', 'Nenhuma mensagem ainda.')}
                </p>
              </div>
          </div>
        );

  const renderNotifications = () => (
    <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
        {t('driverPanel.notifications', 'Notificações')}
            </h3>
            
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 rounded-lg border ${
            notification.read 
              ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' 
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  {notification.title}
              </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {notification.message}
                </p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {notification.date}
              </span>
            </div>
          </div>
        ))}
            </div>
          </div>
        );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="card-futuristic p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-gray-900 flex items-center">
          <Truck className="w-5 h-5 mr-2 text-gray-700" />
          Painel do Motorista
        </h2>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        {tabs.map((tab) => (
                  <button
                    key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
        ))}
          </div>

          {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'freights' && renderAvailableFreights()}
        {activeTab === 'myFreights' && renderMyFreights()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'notifications' && renderNotifications()}
      </div>
    </div>
  );
};

export default DriverPanel;