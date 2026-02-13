// 💰 PAINEL DE MONETIZAÇÃO - ADMIN
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Award, Target, Eye, MousePointer, 
  Plus, Edit, Trash2, Pause, Play, BarChart3, Calendar,
  Upload, ExternalLink, Settings as SettingsIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getApiUrl } from '../../config/constants';

const MonetizationPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [ads, setAds] = useState([]);
  const [sponsoredItems, setSponsoredItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddAdModal, setShowAddAdModal] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadAds();
    loadSponsoredItems();
    loadSettings();
  }, []);

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('authToken');

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${getApiUrl('')}/monetization/dashboard`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) setDashboard(data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadAds = async () => {
    try {
      const response = await fetch(`${getApiUrl('')}/monetization/ads`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) setAds(data.data || []);
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSponsoredItems = async () => {
    try {
      const response = await fetch(`${getApiUrl('')}/monetization/sponsored`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) setSponsoredItems(data.data || []);
    } catch (error) {
      console.error('Error loading sponsored items:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(`${getApiUrl('')}/monetization/settings`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) setSettings(data.data || {});
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // ================================================================
  // DASHBOARD TAB
  // ================================================================

  const renderDashboard = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-900'>💰 Dashboard de Monetização</h2>
      
      {/* Cards de receita */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg'
        >
          <div className='flex items-center justify-between mb-2'>
            <DollarSign className='h-8 w-8' />
            <span className='text-sm font-medium opacity-90'>30 dias</span>
          </div>
          <h3 className='text-3xl font-bold mb-1'>
            R$ {(dashboard?.revenue?.total || 0).toFixed(2)}
          </h3>
          <p className='text-sm opacity-90'>Receita Total</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg'
        >
          <div className='flex items-center justify-between mb-2'>
            <Award className='h-8 w-8' />
            <span className='text-sm font-medium opacity-90'>Ativos</span>
          </div>
          <h3 className='text-3xl font-bold mb-1'>
            {dashboard?.active_ads || 0}
          </h3>
          <p className='text-sm opacity-90'>Anúncios Ativos</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg'
        >
          <div className='flex items-center justify-between mb-2'>
            <Target className='h-8 w-8' />
            <span className='text-sm font-medium opacity-90'>Premium</span>
          </div>
          <h3 className='text-3xl font-bold mb-1'>
            {dashboard?.sponsored_items || 0}
          </h3>
          <p className='text-sm opacity-90'>Itens Patrocinados</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg'
        >
          <div className='flex items-center justify-between mb-2'>
            <TrendingUp className='h-8 w-8' />
            <span className='text-sm font-medium opacity-90'>Pendentes</span>
          </div>
          <h3 className='text-3xl font-bold mb-1'>
            R$ {(dashboard?.pending_transactions?.amount || 0).toFixed(2)}
          </h3>
          <p className='text-sm opacity-90'>A Receber</p>
        </motion.div>
      </div>

      {/* Gráfico de receitas (mockup) */}
      <div className='bg-white rounded-xl p-6 shadow-lg'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>📊 Receitas por Categoria</h3>
        <div className='space-y-3'>
          {dashboard?.revenue && Object.entries(dashboard.revenue).map(([key, value]) => {
            if (key === 'total') return null;
            const percentage = dashboard.revenue.total > 0 
              ? (value / dashboard.revenue.total * 100).toFixed(1)
              : 0;
            
            const colors = {
              subscription: '#3b82f6',
              advertisement: '#22c55e',
              commission: '#a855f7',
              sponsorship: '#f97316'
            };
            
            const labels = {
              subscription: 'Assinaturas',
              advertisement: 'Anúncios',
              commission: 'Comissões',
              sponsorship: 'Patrocínios'
            };
            
            return (
              <div key={key}>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700'>{labels[key] || key}</span>
                  <span className='text-sm font-bold text-gray-900'>R$ {value.toFixed(2)} ({percentage}%)</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    style={{
                      width: `${percentage}%`,
                      background: colors[key] || '#6b7280',
                      height: '100%',
                      borderRadius: '9999px',
                      transition: 'width 0.3s'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Anúncios */}
      {dashboard?.top_ads && dashboard.top_ads.length > 0 && (
        <div className='bg-white rounded-xl p-6 shadow-lg'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>🏆 Top Anúncios (Melhor CTR)</h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 bg-gray-50'>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Anúncio</th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Local</th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Impressões</th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>Cliques</th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600'>CTR</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.top_ads.map(ad => (
                  <tr key={ad.id} className='border-b border-gray-100 hover:bg-gray-50'>
                    <td className='px-4 py-3 text-sm font-medium text-gray-900'>{ad.title}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{ad.placement}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{ad.impressions}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{ad.clicks}</td>
                    <td className='px-4 py-3 text-sm font-bold text-green-600'>{ad.ctr.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // ================================================================
  // ADS TAB
  // ================================================================

  const renderAds = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>📢 Anúncios e Banners</h2>
        <button
          onClick={() => setShowAddAdModal(true)}
          className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'
        >
          <Plus className='h-5 w-5' />
          Criar Anúncio
        </button>
      </div>

      {/* Lista de anúncios */}
      <div className='grid gap-4'>
        {ads.map(ad => (
          <div key={ad.id} className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <h3 className='text-lg font-bold text-gray-900'>{ad.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ad.status}
                  </span>
                  <span className='px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>
                    {ad.placement}
                  </span>
                </div>
                <p className='text-sm text-gray-600 mb-3'>{ad.description}</p>
                
                <div className='grid grid-cols-4 gap-4'>
                  <div className='bg-blue-50 rounded-lg p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Eye className='h-4 w-4 text-blue-600' />
                      <span className='text-xs font-medium text-gray-600'>Impressões</span>
                    </div>
                    <p className='text-lg font-bold text-blue-600'>{ad.impressions}</p>
                  </div>
                  
                  <div className='bg-green-50 rounded-lg p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <MousePointer className='h-4 w-4 text-green-600' />
                      <span className='text-xs font-medium text-gray-600'>Cliques</span>
                    </div>
                    <p className='text-lg font-bold text-green-600'>{ad.clicks}</p>
                  </div>
                  
                  <div className='bg-purple-50 rounded-lg p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <BarChart3 className='h-4 w-4 text-purple-600' />
                      <span className='text-xs font-medium text-gray-600'>CTR</span>
                    </div>
                    <p className='text-lg font-bold text-purple-600'>{ad.ctr.toFixed(2)}%</p>
                  </div>
                  
                  <div className='bg-orange-50 rounded-lg p-3'>
                    <div className='flex items-center gap-2 mb-1'>
                      <DollarSign className='h-4 w-4 text-orange-600' />
                      <span className='text-xs font-medium text-gray-600'>Valor</span>
                    </div>
                    <p className='text-lg font-bold text-orange-600'>R$ {ad.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className='flex gap-2 ml-4'>
                <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg' title='Editar'>
                  <Edit className='h-5 w-5' />
                </button>
                <button className='p-2 text-orange-600 hover:bg-orange-50 rounded-lg' title='Pausar'>
                  <Pause className='h-5 w-5' />
                </button>
                <button className='p-2 text-red-600 hover:bg-red-50 rounded-lg' title='Excluir'>
                  <Trash2 className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ================================================================
  // SPONSORED ITEMS TAB
  // ================================================================

  const renderSponsored = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-900'>⭐ Itens Patrocinados</h2>
      
      <div className='grid gap-4'>
        {sponsoredItems.map(item => (
          <div key={item.id} className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <h3 className='text-lg font-bold text-gray-900'>{item.item_title || 'Item'}</h3>
                  <span className='px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800'>
                    {item.item_type === 'product' ? '📦 Produto' : '🚛 Frete'}
                  </span>
                  <span className='px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800'>
                    {item.sponsorship_type}
                  </span>
                </div>
                
                <div className='grid grid-cols-3 gap-4 mt-3'>
                  <div>
                    <p className='text-xs text-gray-600 mb-1'>Período</p>
                    <p className='text-sm font-semibold text-gray-900'>
                      {new Date(item.start_date).toLocaleDateString('pt-BR')} →{' '}
                      {new Date(item.end_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <p className='text-xs text-gray-600 mb-1'>Impressões</p>
                    <p className='text-lg font-bold text-blue-600'>{item.impressions}</p>
                  </div>
                  
                  <div>
                    <p className='text-xs text-gray-600 mb-1'>Conversões</p>
                    <p className='text-lg font-bold text-green-600'>{item.conversions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {sponsoredItems.length === 0 && (
          <div className='text-center py-12 bg-gray-50 rounded-xl'>
            <Award className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600'>Nenhum item patrocinado no momento</p>
          </div>
        )}
      </div>
    </div>
  );

  // ================================================================
  // SETTINGS TAB
  // ================================================================

  const renderSettings = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-900'>⚙️ Configurações de Monetização</h2>
      
      <div className='bg-white rounded-xl p-6 shadow-lg'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>💰 Taxas e Comissões</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {Object.entries(settings).filter(([key]) => key.includes('commission')).map(([key, value]) => (
            <div key={key} className='border border-gray-200 rounded-lg p-4'>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                {key.replace(/_/g, ' ').replace(/commission rate/i, 'Taxa')}
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  step='0.1'
                  value={value}
                  onChange={(e) => updateSetting(key, e.target.value)}
                  className='w-full rounded-lg border-gray-300 px-3 py-2'
                />
                <span className='text-gray-600 font-medium'>%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-xl p-6 shadow-lg'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>💵 Preços de Patrocínio</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(settings).filter(([key]) => key.includes('price')).map(([key, value]) => (
            <div key={key} className='border border-gray-200 rounded-lg p-4'>
              <label className='text-sm font-medium text-gray-700 mb-2 block'>
                {key.replace(/_/g, ' ').replace(/price/i, '').trim()}
              </label>
              <div className='flex items-center gap-2'>
                <span className='text-gray-600 font-medium'>R$</span>
                <input
                  type='number'
                  step='0.01'
                  value={value}
                  onChange={(e) => updateSetting(key, e.target.value)}
                  className='w-full rounded-lg border-gray-300 px-3 py-2'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-xl p-6 shadow-lg'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>🔧 Ativar/Desativar Recursos</h3>
        <div className='space-y-3'>
          {Object.entries(settings).filter(([key]) => key.startsWith('enable_')).map(([key, value]) => (
            <label key={key} className='flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50'>
              <span className='text-sm font-medium text-gray-700'>
                {key.replace(/enable_/g, '').replace(/_/g, ' ').toUpperCase()}
              </span>
              <input
                type='checkbox'
                checked={value === 'true'}
                onChange={(e) => updateSetting(key, e.target.checked ? 'true' : 'false')}
                className='h-5 w-5 text-green-600 rounded'
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const updateSetting = async (key, value) => {
    try {
      const response = await fetch(`${getApiUrl('')}/monetization/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Configuração atualizada!');
        setSettings(prev => ({ ...prev, [key]: value }));
      } else {
        toast.error('Erro ao atualizar configuração');
      }
    } catch (error) {
      toast.error('Erro de conexão');
      console.error('Error updating setting:', error);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className='h-5 w-5' /> },
    { id: 'ads', label: 'Anúncios', icon: <Award className='h-5 w-5' /> },
    { id: 'sponsored', label: 'Patrocinados', icon: <Target className='h-5 w-5' /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon className='h-5 w-5' /> }
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>💰 Painel de Monetização</h1>
          <p className='text-gray-600'>Gerencie anúncios, patrocínios e receitas da plataforma</p>
        </div>

        {/* Tabs */}
        <div className='mb-6 border-b border-gray-200'>
          <div className='flex gap-2 overflow-x-auto'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'border-b-4 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
            <p className='text-gray-600 mt-4'>Carregando...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'ads' && renderAds()}
            {activeTab === 'sponsored' && renderSponsored()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}
      </div>
    </div>
  );
};

export default MonetizationPanel;

