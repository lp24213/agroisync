import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Truck,
  MessageCircle
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - em produção viria de API
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'produtor',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      location: 'Sinop - MT',
      phone: '(66) 99999-9999',
      announcements: 5,
      sales: 8
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      role: 'comprador',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      location: 'Sorriso - MT',
      phone: '(66) 88888-8888',
      announcements: 0,
      sales: 12
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@email.com',
      role: 'transportador',
      status: 'pending',
      joinDate: '2024-01-18',
      lastLogin: '2024-01-18',
      location: 'Cuiabá - MT',
      phone: '(66) 77777-7777',
      announcements: 3,
      sales: 0
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'Soja Premium - 1000 toneladas',
      user: 'João Silva',
      category: 'Commodities',
      price: 'R$ 1.200/ton',
      status: 'active',
      views: 45,
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Trator John Deere 6120',
      user: 'João Silva',
      category: 'Máquinas',
      price: 'R$ 85.000',
      status: 'sold',
      views: 120,
      date: '2024-01-10'
    },
    {
      id: '3',
      title: 'Transporte de Carga - Cuiabá/SP',
      user: 'Carlos Oliveira',
      category: 'Transporte',
      price: 'R$ 2.500',
      status: 'pending',
      views: 32,
      date: '2024-01-12'
    }
  ]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Usuários', icon: <Users size={20} /> },
    { id: 'announcements', label: 'Anúncios', icon: <Package size={20} /> },
    { id: 'moderation', label: 'Moderação', icon: <Shield size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> }
  ];

  const stats = [
    { label: 'Usuários Ativos', value: '1.2K', color: 'var(--agro-primary-color)' },
    { label: 'Anúncios Ativos', value: '456', color: 'var(--agro-secondary-color)' },
    { label: 'Vendas Hoje', value: '23', color: 'var(--agro-gold)' },
    { label: 'Receita Mensal', value: 'R$ 45K', color: 'var(--agro-neon-green)' }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (userId, action) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: action === 'approve' ? 'active' : action === 'reject' ? 'inactive' : user.status }
          : user
      )
    );
  };

  const handleAnnouncementAction = (announcementId, action) => {
    setAnnouncements(prevAnnouncements =>
      prevAnnouncements.map(announcement =>
        announcement.id === announcementId
          ? { ...announcement, status: action }
          : announcement
      )
    );
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Painel Administrativo</h2>
        <p>Gerencie toda a plataforma AGROISYNC</p>
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
                <Users size={16} />
              </div>
              <div className="activity-content">
                <p>Novo usuário cadastrado: Maria Santos</p>
                <span className="activity-time">2 horas atrás</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Package size={16} />
              </div>
              <div className="activity-content">
                <p>Anúncio "Soja Premium" foi publicado</p>
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
          <h3>Usuários Pendentes</h3>
          <div className="pending-users">
            {users.filter(u => u.status === 'pending').map((user) => (
              <div key={user.id} className="pending-card">
                <div className="pending-info">
                  <h4>{user.name}</h4>
                  <p>{user.email} • {user.role}</p>
                </div>
                <div className="pending-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleUserAction(user.id, 'approve')}
                  >
                    <CheckCircle size={16} />
                    Aprovar
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleUserAction(user.id, 'reject')}
                  >
                    <XCircle size={16} />
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="users-header">
        <h2>Gerenciar Usuários</h2>
        <div className="users-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary">
            <Filter size={18} />
            Filtros
          </button>
          <button className="btn-secondary">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="table-cell">Usuário</div>
          <div className="table-cell">Email</div>
          <div className="table-cell">Função</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Último Login</div>
          <div className="table-cell">Ações</div>
        </div>
        {filteredUsers.map((user) => (
          <div key={user.id} className="table-row">
            <div className="table-cell">
              <div className="user-info">
                <div className="user-avatar">
                  <Users size={16} />
                </div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-location">
                    <MapPin size={12} />
                    {user.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="table-cell">
              <div className="user-email">{user.email}</div>
              <div className="user-phone">
                <Phone size={12} />
                {user.phone}
              </div>
            </div>
            <div className="table-cell">
              <span className={`role-badge ${user.role}`}>
                {user.role === 'produtor' ? 'Produtor' : 
                 user.role === 'comprador' ? 'Comprador' : 'Transportador'}
              </span>
            </div>
            <div className="table-cell">
              <span className={`status-badge ${user.status}`}>
                {user.status === 'active' ? 'Ativo' : 
                 user.status === 'pending' ? 'Pendente' : 'Inativo'}
              </span>
            </div>
            <div className="table-cell">
              <div className="last-login">
                <Calendar size={12} />
                {user.lastLogin}
              </div>
            </div>
            <div className="table-cell">
              <div className="user-actions">
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
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="admin-announcements">
      <div className="announcements-header">
        <h2>Gerenciar Anúncios</h2>
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
      </div>

      <div className="announcements-grid">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="announcement-card">
            <div className="announcement-header">
              <h3>{announcement.title}</h3>
              <div className="announcement-actions">
                <button 
                  className="action-btn approve"
                  onClick={() => handleAnnouncementAction(announcement.id, 'active')}
                >
                  <CheckCircle size={16} />
                </button>
                <button 
                  className="action-btn reject"
                  onClick={() => handleAnnouncementAction(announcement.id, 'rejected')}
                >
                  <XCircle size={16} />
                </button>
                <button className="action-btn">
                  <Eye size={16} />
                </button>
                <button className="action-btn danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="announcement-meta">
              <span className="announcement-user">{announcement.user}</span>
              <span className="announcement-category">{announcement.category}</span>
              <span className="announcement-price">{announcement.price}</span>
            </div>
            <div className="announcement-stats">
              <div className="stat">
                <Eye size={14} />
                {announcement.views} visualizações
              </div>
              <div className="stat">
                <Calendar size={14} />
                {announcement.date}
              </div>
            </div>
            <div className="announcement-status">
              <span className={`status-badge ${announcement.status}`}>
                {announcement.status === 'active' ? 'Ativo' : 
                 announcement.status === 'pending' ? 'Pendente' : 
                 announcement.status === 'sold' ? 'Vendido' : 'Rejeitado'}
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
      case 'users':
        return renderUsers();
      case 'announcements':
        return renderAnnouncements();
      case 'moderation':
        return <div className="admin-moderation"><h2>Moderação</h2><p>Sistema de moderação de conteúdo</p></div>;
      case 'settings':
        return <div className="admin-settings"><h2>Configurações</h2><p>Configurações da plataforma</p></div>;
      default:
        return renderDashboard();
    }
  };

  // Verificar se é admin
  if (user?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <Shield size={64} />
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar o painel administrativo.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-profile">
            <div className="admin-avatar">
              <Shield size={24} />
            </div>
            <div className="admin-info">
              <h3>{user?.name || 'Administrador'}</h3>
              <span className="admin-role">Administrador</span>
            </div>
          </div>

          <nav className="admin-nav">
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
        <div className="admin-main">
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        .admin-panel {
          min-height: 100vh;
          background: var(--agro-gradient-primary);
          padding: 20px;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 20px;
          height: calc(100vh - 40px);
        }

        .admin-sidebar {
          width: 280px;
          background: var(--agro-navbar-bg);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--agro-border-color);
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--agro-border-color);
          margin-bottom: 20px;
        }

        .admin-avatar {
          width: 48px;
          height: 48px;
          background: var(--agro-primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--agro-primary-text);
        }

        .admin-info h3 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .admin-role {
          color: var(--agro-secondary-color);
          font-size: 12px;
        }

        .admin-nav {
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

        .admin-main {
          flex: 1;
          background: var(--agro-card-bg);
          border-radius: 16px;
          padding: 30px;
          overflow-y: auto;
          border: 1px solid var(--agro-border-color);
        }

        .admin-dashboard h2 {
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

        .pending-users {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pending-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
        }

        .pending-info h4 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .pending-info p {
          color: var(--agro-secondary-color);
          font-size: 14px;
          margin: 0;
        }

        .pending-actions {
          display: flex;
          gap: 8px;
        }

        .btn-approve {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .btn-approve:hover {
          background: var(--agro-primary-hover);
        }

        .btn-reject {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          border: 1px solid rgba(255, 59, 48, 0.3);
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .btn-reject:hover {
          background: rgba(255, 59, 48, 0.2);
        }

        .admin-users h2,
        .admin-announcements h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 20px 0;
        }

        .users-header,
        .announcements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .users-filters,
        .announcements-filters {
          display: flex;
          gap: 16px;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 16px 12px 40px;
          border-radius: 8px;
          font-size: 14px;
          width: 250px;
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

        .users-table {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
          background: var(--agro-hover-bg);
          padding: 16px;
          font-weight: 600;
          color: var(--agro-text-color);
          border-bottom: 1px solid var(--agro-border-color);
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
          padding: 16px;
          border-bottom: 1px solid var(--agro-border-color);
          transition: all 0.3s ease;
        }

        .table-row:hover {
          background: var(--agro-hover-bg);
        }

        .table-cell {
          display: flex;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: var(--agro-primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--agro-primary-text);
        }

        .user-name {
          color: var(--agro-text-color);
          font-weight: 500;
          font-size: 14px;
        }

        .user-location {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .user-email {
          color: var(--agro-text-color);
          font-size: 14px;
        }

        .user-phone {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .role-badge.produtor {
          background: rgba(57, 255, 20, 0.1);
          color: var(--agro-primary-color);
        }

        .role-badge.comprador {
          background: rgba(0, 212, 255, 0.1);
          color: var(--agro-secondary-color);
        }

        .role-badge.transportador {
          background: rgba(255, 215, 0, 0.1);
          color: var(--agro-gold);
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(57, 255, 20, 0.1);
          color: var(--agro-primary-color);
        }

        .status-badge.pending {
          background: rgba(255, 215, 0, 0.1);
          color: var(--agro-gold);
        }

        .status-badge.inactive {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
        }

        .status-badge.sold {
          background: rgba(0, 212, 255, 0.1);
          color: var(--agro-secondary-color);
        }

        .status-badge.rejected {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
        }

        .last-login {
          color: var(--agro-secondary-color);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .user-actions {
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

        .action-btn.approve:hover {
          color: var(--agro-primary-color);
          border-color: var(--agro-primary-color);
        }

        .action-btn.reject:hover {
          color: #ff3b30;
          border-color: #ff3b30;
        }

        .action-btn.danger:hover {
          color: #ff3b30;
          border-color: #ff3b30;
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

        .announcement-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .announcement-user {
          color: var(--agro-text-color);
          font-size: 14px;
          font-weight: 500;
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

        .announcement-status {
          text-align: right;
        }

        .admin-moderation,
        .admin-settings {
          text-align: center;
          padding: 60px 20px;
        }

        .admin-moderation h2,
        .admin-settings h2 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .admin-moderation p,
        .admin-settings p {
          color: var(--agro-secondary-color);
          font-size: 16px;
        }

        .admin-unauthorized {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--agro-text-color);
        }

        .admin-unauthorized h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 16px 0 8px 0;
        }

        .admin-unauthorized p {
          color: var(--agro-secondary-color);
          font-size: 16px;
        }

        @media (max-width: 1024px) {
          .admin-container {
            flex-direction: column;
            height: auto;
          }

          .admin-sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
          }

          .admin-nav {
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

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .table-cell {
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .admin-panel {
            padding: 10px;
          }

          .admin-main {
            padding: 20px;
          }

          .users-header,
          .announcements-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .users-filters,
          .announcements-filters {
            flex-direction: column;
          }

          .search-box input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
