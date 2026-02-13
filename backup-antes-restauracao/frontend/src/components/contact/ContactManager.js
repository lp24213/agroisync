import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Reply,
  Archive,
  Clock,
  Star,
  User,
  Search,
  FileText,
  Eye,
  Trash
} from 'lucide-react';
import contactService from '../../services/contactService';

const ContactManager = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'replied', 'archived'
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados mockados
      const mockMessages = [
        {
          id: 'msg-001',
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
          subject: 'Dúvida sobre produtos',
          message: 'Gostaria de saber mais informações sobre os produtos de soja disponíveis.',
          type: 'general',
          priority: 'normal',
          status: 'unread',
          createdAt: new Date(Date.now() - 3600000),
          attachments: [],
          metadata: {
            userAgent: 'Mozilla/5.0...',
            ip: '192.168.1.1'
          }
        },
        {
          id: 'msg-002',
          name: 'Maria Santos',
          email: 'maria@example.com',
          phone: '(21) 88888-8888',
          subject: 'Problema com pedido',
          message: 'Meu pedido ORD-001 não foi entregue no prazo. Preciso de ajuda urgente.',
          type: 'support',
          priority: 'high',
          status: 'replied',
          createdAt: new Date(Date.now() - 7200000),
          repliedAt: new Date(Date.now() - 1800000),
          attachments: ['invoice.pdf'],
          metadata: {
            userAgent: 'Mozilla/5.0...',
            ip: '192.168.1.2'
          }
        },
        {
          id: 'msg-003',
          name: 'Pedro Oliveira',
          email: 'pedro@example.com',
          phone: '(31) 77777-7777',
          subject: 'Proposta de parceria',
          message: 'Somos uma empresa de logística e gostaríamos de estabelecer uma parceria.',
          type: 'partnership',
          priority: 'normal',
          status: 'archived',
          createdAt: new Date(Date.now() - 86400000),
          archivedAt: new Date(Date.now() - 43200000),
          attachments: ['proposal.pdf', 'company_profile.pdf'],
          metadata: {
            userAgent: 'Mozilla/5.0...',
            ip: '192.168.1.3'
          }
        }
      ];

      setMessages(mockMessages);

      // Estatísticas mockadas
      setStats({
        total: 24,
        unread: 8,
        replied: 12,
        archived: 4,
        thisWeek: 6,
        avgResponseTime: 2.5
      });
    } catch (error) {
      console.error('Erro ao carregar dados de contato:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async messageId => {
    try {
      await contactService.markAsRead(messageId);
      setMessages(prev => prev.map(msg => (msg.id === messageId ? { ...msg, status: 'read' } : msg)));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleArchive = async messageId => {
    try {
      await contactService.archiveMessage(messageId);
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, status: 'archived', archivedAt: new Date() } : msg))
      );
    } catch (error) {
      console.error('Erro ao arquivar mensagem:', error);
    }
  };

  const handleDelete = async messageId => {
    try {
      await contactService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && message.status === 'unread') ||
      (filter === 'replied' && message.status === 'replied') ||
      (filter === 'archived' && message.status === 'archived');

    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = priority => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'unread':
        return <AlertCircle className='h-4 w-4 text-red-500' />;
      case 'read':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'replied':
        return <Reply className='h-4 w-4 text-blue-500' />;
      case 'archived':
        return <Archive className='h-4 w-4 text-slate-500' />;
      default:
        return <Clock className='h-4 w-4 text-slate-400' />;
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'support':
        return <AlertCircle className='h-4 w-4' />;
      case 'sales':
        return <Star className='h-4 w-4' />;
      case 'partnership':
        return <User className='h-4 w-4' />;
      default:
        return <MessageSquare className='h-4 w-4' />;
    }
  };

  const renderStats = () => (
    <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              {t('contact.totalMessages', 'Total de Mensagens')}
            </p>
            <p className='text-2xl font-bold text-slate-900 dark:text-white'>{stats.total}</p>
          </div>
          <Mail className='h-8 w-8 text-emerald-600' />
        </div>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{t('contact.unreadMessages', 'Não Lidas')}</p>
            <p className='text-2xl font-bold text-slate-900 dark:text-white'>{stats.unread}</p>
          </div>
          <AlertCircle className='h-8 w-8 text-red-600' />
        </div>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{t('contact.repliedMessages', 'Respondidas')}</p>
            <p className='text-2xl font-bold text-slate-900 dark:text-white'>{stats.replied}</p>
          </div>
          <Reply className='h-8 w-8 text-green-600' />
        </div>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              {t('contact.avgResponseTime', 'Tempo Médio de Resposta')}
            </p>
            <p className='text-2xl font-bold text-slate-900 dark:text-white'>{stats.avgResponseTime}h</p>
          </div>
          <Clock className='h-8 w-8 text-blue-600' />
        </div>
      </div>
    </div>
  );

  const renderMessageList = () => (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
          {t('contact.messages', 'Mensagens de Contato')}
        </h3>

        <div className='flex gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
            }`}
          >
            {t('contact.all', 'Todas')}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
            }`}
          >
            {t('contact.unread', 'Não Lidas')}
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === 'replied'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
            }`}
          >
            {t('contact.replied', 'Respondidas')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
        <input
          type='text'
          placeholder={t('contact.search', 'Buscar mensagens...')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
        />
      </div>

      <div className='space-y-4'>
        {filteredMessages.map(message => (
          <motion.div
            key={message.id}
            className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-3 flex items-center gap-3'>
                  <h4 className='font-semibold text-slate-800 dark:text-slate-200'>{message.subject}</h4>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {t(`contactPriority.${message.priority}`, message.priority)}
                  </span>
                  {getStatusIcon(message.status)}
                </div>

                <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <p className='mb-1 text-sm text-slate-600 dark:text-slate-400'>{t('contact.from', 'De')}:</p>
                    <p className='font-medium text-slate-800 dark:text-slate-200'>
                      {message.name} ({message.email})
                    </p>
                  </div>
                  <div>
                    <p className='mb-1 text-sm text-slate-600 dark:text-slate-400'>{t('contact.type', 'Tipo')}:</p>
                    <div className='flex items-center gap-2'>
                      {getTypeIcon(message.type)}
                      <span className='text-slate-800 dark:text-slate-200'>
                        {t(`contactType.${message.type}`, message.type)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className='mb-4 line-clamp-2 text-slate-700 dark:text-slate-300'>{message.message}</p>

                <div className='flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400'>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    {new Date(message.createdAt).toLocaleString('pt-BR')}
                  </div>
                  {message.attachments.length > 0 && (
                    <div className='flex items-center gap-1'>
                      <FileText className='h-4 w-4' />
                      {message.attachments.length} {t('contact.attachments', 'anexos')}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={() => setSelectedMessage(message)}
                  className='p-2 text-slate-500 transition-colors hover:text-emerald-600'
                  title={t('contact.viewDetails', 'Ver Detalhes')}
                >
                  <Eye className='h-5 w-5' />
                </button>

                {message.status === 'unread' && (
                  <button
                    onClick={() => handleMarkAsRead(message.id)}
                    className='p-2 text-slate-500 transition-colors hover:text-green-600'
                    title={t('contact.markAsRead', 'Marcar como Lida')}
                  >
                    <CheckCircle className='h-5 w-5' />
                  </button>
                )}

                <button
                  onClick={() => handleArchive(message.id)}
                  className='p-2 text-slate-500 transition-colors hover:text-blue-600'
                  title={t('contact.archive', 'Arquivar')}
                >
                  <Archive className='h-5 w-5' />
                </button>

                <button
                  onClick={() => handleDelete(message.id)}
                  className='p-2 text-slate-500 transition-colors hover:text-red-600'
                  title={t('contact.delete', 'Deletar')}
                >
                  <Trash className='h-5 w-5' />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600'></div>
          <p className='text-slate-600 dark:text-slate-400'>{t('contact.loading', 'Carregando mensagens...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl p-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold text-slate-800 dark:text-slate-200'>
          {t('contact.manager', 'Gerenciador de Contatos')}
        </h1>
        <p className='text-slate-600 dark:text-slate-400'>
          {t('contact.managerSubtitle', 'Gerencie mensagens de contato e respostas')}
        </p>
      </div>

      {renderStats()}
      {renderMessageList()}
    </div>
  );
};

export default ContactManager;
