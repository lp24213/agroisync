import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Settings, 
  Bell, 
  BarChart3, 
  Package, 
  Truck, 
  MessageCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

const IndividualPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - em produção viria de API
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'Soja Premium - 1000 toneladas',
      category: 'Commodities',
      price: 'R$ 1.200/ton',
      location: 'Sinop - MT',
      date: '2024-01-15',
      status: 'active',
      views: 45,
      contacts: 8
    },
    {
      id: '2',
      title: 'Trator John Deere 6120',
      category: 'Máquinas',
      price: 'R$ 85.000',
      location: 'Sorriso - MT',
      date: '2024-01-10',
      status: 'sold',
      views: 120,
      contacts: 15
    },
    {
      id: '3',
      title: 'Transporte de Carga - Cuiabá/SP',
      category: 'Transporte',
      price: 'R$ 2.500',
      location: 'Cuiabá - MT',
      date: '2024-01-12',
      status: 'active',
      views: 32,
      contacts: 5
    }
  ]);

  const [transportOffers, setTransportOffers] = useState([
    {
      id: '1',
      origin: 'Sinop - MT',
      destination: 'São Paulo - SP',
      cargo: 'Soja',
      weight: '25 toneladas',
      price: 'R$ 2.800',
      date: '2024-01-20',
      status: 'available'
    },
    {
      id: '2',
      origin: 'Sorriso - MT',
      destination: 'Porto de Santos - SP',
      cargo: 'Milho',
      weight: '30 toneladas',
      price: 'R$ 3.200',
      date: '2024-01-22',
      status: 'booked'
    }
  ]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'announcements', label: 'Meus Anúncios', icon: <Package size={20} /> },
    { id: 'transport', label: 'Transporte', icon: <Truck size={20} /> },
    { id: 'messages', label: 'Mensagens', icon: <MessageCircle size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> }
  ];

  const stats = [
    { label: 'Anúncios Ativos', value: '12', color: 'var(--agro-primary-color)' },
    { label: 'Visualizações', value: '1.2K', color: 'var(--agro-secondary-color)' },
    { label: 'Contatos', value: '45', color: 'var(--agro-gold)' },
    { label: 'Vendas', value: '8', color: 'var(--agro-neon-green)' }
  ];

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="panel-dashboard">
      <div className="dashboard-header">
        <h2>Bem-vindo, {user?.name || 'Usuário'}!</h2>
        <p>Gerencie seus negócios agrícolas de forma inteligente</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>Atividade Recente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <Eye size={16} />
              </div>
              <div className="activity-content">
                <p>Seu anúncio "Soja Premium" foi visualizado 12 vezes hoje</p>
                <span className="activity-time">2 horas atrás</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <MessageCircle size={16} />
              </div>
              <div className="activity-content">
                <p>Nova mensagem de João Silva sobre transporte</p>
                <span className="activity-time">4 horas atrás</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <DollarSign size={16} />
              </div>
              <div className="activity-content">
                <p>Venda confirmada: Trator John Deere</p>
                <span className="activity-time">1 dia atrás</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Anúncios em Destaque</h3>
          <div className="featured-announcements">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="featured-card">
                <h4>{announcement.title}</h4>
                <div className="featured-meta">
                  <span className="featured-price">{announcement.price}</span>
                  <span className="featured-location">
                    <MapPin size={14} />
                    {announcement.location}
                  </span>
                </div>
                <div className="featured-stats">
                  <span>{announcement.views} visualizações</span>
                  <span>{announcement.contacts} contatos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="panel-announcements">
      <div className="announcements-header">
        <h2>Meus Anúncios</h2>
        <button className="btn-primary">
          <Plus size={20} />
          Novo Anúncio
        </button>
      </div>

      <div className="announcements-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar anúncios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      <div className="announcements-grid">
        {filteredAnnouncements.map((announcement) => (
          <motion.div
            key={announcement.id}
            className="announcement-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="announcement-header">
              <h3>{announcement.title}</h3>
              <div className="announcement-actions">
                <button className="action-btn">
                  <Eye size={16} />
                </button>
                <button className="action-btn">
                  <Edit size={16} />
                </button>
                <button className="action-btn danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="announcement-meta">
              <span className="announcement-category">{announcement.category}</span>
              <span className="announcement-price">{announcement.price}</span>
            </div>
            <div className="announcement-location">
              <MapPin size={14} />
              {announcement.location}
            </div>
            <div className="announcement-stats">
              <div className="stat">
                <Eye size={14} />
                {announcement.views} visualizações
              </div>
              <div className="stat">
                <MessageCircle size={14} />
                {announcement.contacts} contatos
              </div>
            </div>
            <div className="announcement-footer">
              <span className="announcement-date">
                <Calendar size={14} />
                {announcement.date}
              </span>
              <span className={`announcement-status ${announcement.status}`}>
                {announcement.status === 'active' ? 'Ativo' : 'Vendido'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTransport = () => (
    <div className="panel-transport">
      <div className="transport-header">
        <h2>Transporte</h2>
        <button className="btn-primary">
          <Plus size={20} />
          Nova Oferta
        </button>
      </div>

      <div className="transport-offers">
        {transportOffers.map((offer) => (
          <div key={offer.id} className="transport-card">
            <div className="transport-route">
              <div className="route-point">
                <div className="route-dot origin"></div>
                <span>{offer.origin}</span>
              </div>
              <div className="route-line"></div>
              <div className="route-point">
                <div className="route-dot destination"></div>
                <span>{offer.destination}</span>
              </div>
            </div>
            <div className="transport-details">
              <div className="transport-cargo">
                <Package size={16} />
                {offer.cargo} - {offer.weight}
              </div>
              <div className="transport-price">{offer.price}</div>
              <div className="transport-date">
                <Calendar size={14} />
                {offer.date}
              </div>
            </div>
            <div className="transport-status">
              <span className={`status-badge ${offer.status}`}>
                {offer.status === 'available' ? 'Disponível' : 'Reservado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'announcements':
        return renderAnnouncements();
      case 'transport':
        return renderTransport();
      case 'messages':
        return <div className="panel-messages"><h2>Mensagens</h2><p>Integração com sistema de mensageria</p></div>;
      case 'settings':
        return <div className="panel-settings"><h2>Configurações</h2><p>Configurações da conta</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="individual-panel">
      <div className="panel-container">
        {/* Sidebar */}
        <div className="panel-sidebar">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-info">
              <h3>{user?.name || 'Usuário'}</h3>
              <span className="user-role">{user?.role || 'Produtor'}</span>
            </div>
          </div>

          <nav className="panel-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="panel-main">
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        .individual-panel {
          min-height: 100vh;
          background: var(--agro-gradient-primary);
          padding: 20px;
        }

        .panel-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 20px;
          height: calc(100vh - 40px);
        }

        .panel-sidebar {
          width: 280px;
          background: var(--agro-navbar-bg);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--agro-border-color);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--agro-border-color);
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          background: var(--agro-primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--agro-primary-text);
        }

        .user-info h3 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .user-role {
          color: var(--agro-secondary-color);
          font-size: 12px;
        }

        .panel-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          background: none;
          border: none;
          color: var(--agro-text-color);
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-item:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .nav-item.active {
          background: var(--agro-active-bg);
          color: var(--agro-primary-color);
        }

        .panel-main {
          flex: 1;
          background: var(--agro-card-bg);
          border-radius: 16px;
          padding: 30px;
          overflow-y: auto;
          border: 1px solid var(--agro-border-color);
        }

        .panel-dashboard h2 {
          color: var(--agro-text-color);
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .dashboard-header p {
          color: var(--agro-secondary-color);
          font-size: 16px;
          margin: 0 0 30px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          color: var(--agro-secondary-color);
          font-size: 14px;
          font-weight: 500;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .dashboard-section h3 {
          color: var(--agro-text-color);
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px 0;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background: var(--agro-primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--agro-primary-text);
        }

        .activity-content p {
          color: var(--agro-text-color);
          font-size: 14px;
          margin: 0 0 4px 0;
        }

        .activity-time {
          color: var(--agro-secondary-color);
          font-size: 12px;
        }

        .featured-announcements {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .featured-card {
          padding: 16px;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
        }

        .featured-card h4 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .featured-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .featured-price {
          color: var(--agro-primary-color);
          font-weight: 600;
        }

        .featured-location {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .featured-stats {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: var(--agro-secondary-color);
        }

        .panel-announcements h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 20px 0;
        }

        .announcements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .btn-primary {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: var(--agro-primary-hover);
          transform: translateY(-1px);
        }

        .announcements-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 30px;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-box input {
          width: 100%;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 16px 12px 40px;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--agro-secondary-color);
        }

        .btn-secondary {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .announcements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .announcement-card {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
          padding: 20px;
        }

        .announcement-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .announcement-header h3 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          flex: 1;
        }

        .announcement-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .action-btn.danger:hover {
          color: #ff3b30;
          border-color: #ff3b30;
        }

        .announcement-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .announcement-category {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .announcement-price {
          color: var(--agro-primary-color);
          font-weight: 600;
        }

        .announcement-location {
          color: var(--agro-secondary-color);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .announcement-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .stat {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .announcement-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--agro-border-color);
        }

        .announcement-date {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .announcement-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .announcement-status.active {
          background: rgba(57, 255, 20, 0.1);
          color: var(--agro-primary-color);
        }

        .announcement-status.sold {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
        }

        .panel-transport h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 20px 0;
        }

        .transport-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .transport-offers {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .transport-card {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
          padding: 20px;
        }

        .transport-route {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .route-point {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--agro-text-color);
          font-weight: 500;
        }

        .route-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .route-dot.origin {
          background: var(--agro-primary-color);
        }

        .route-dot.destination {
          background: var(--agro-secondary-color);
        }

        .route-line {
          flex: 1;
          height: 2px;
          background: var(--agro-border-color);
        }

        .transport-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .transport-cargo {
          color: var(--agro-text-color);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .transport-price {
          color: var(--agro-primary-color);
          font-weight: 600;
          font-size: 18px;
        }

        .transport-date {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .transport-status {
          text-align: right;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.available {
          background: rgba(57, 255, 20, 0.1);
          color: var(--agro-primary-color);
        }

        .status-badge.booked {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
        }

        .panel-messages,
        .panel-settings {
          text-align: center;
          padding: 60px 20px;
        }

        .panel-messages h2,
        .panel-settings h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .panel-messages p,
        .panel-settings p {
          color: var(--agro-secondary-color);
          font-size: 16px;
        }

        @media (max-width: 1024px) {
          .panel-container {
            flex-direction: column;
            height: auto;
          }

          .panel-sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
          }

          .panel-nav {
            flex-direction: row;
            gap: 12px;
          }

          .nav-item {
            white-space: nowrap;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .announcements-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .individual-panel {
            padding: 10px;
          }

          .panel-main {
            padding: 20px;
          }

          .announcements-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .announcements-filters {
            flex-direction: column;
          }

          .transport-details {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default IndividualPanel;
