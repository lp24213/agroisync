import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquare, Send, Search, Filter, MoreVertical,
  User, Phone, Mail, MapPin, Calendar, Clock,
  ChevronLeft, ChevronRight, Plus, Edit, Trash,
  CheckCircle, AlertCircle, Lock, Unlock, Package, Truck, File
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mensageria = () => {
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Mensageria Privada - AgroSync';
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isPaid) {
      navigate('/planos');
      return;
    }
    
    loadConversations();
  }, [user, isPaid, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // Simular carregamento de conversas (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConversations = [
        {
          id: 1,
          type: 'product',
          title: 'Soja Premium - João Silva',
          lastMessage: 'Gostaria de mais informações sobre o produto...',
          lastMessageTime: '10:30',
          unreadCount: 2,
          participant: {
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-9999',
            city: 'São Paulo, SP',
            document: '123.456.789-00'
          },
          product: {
            name: 'Soja Premium',
            price: 180.00,
            category: 'Grãos'
          }
        },
        {
          id: 2,
          type: 'freight',
          title: 'Frete SP → RJ - Maria Santos',
          lastMessage: 'Preciso de frete para Rio de Janeiro...',
          lastMessageTime: '09:15',
          unreadCount: 0,
          participant: {
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(21) 88888-8888',
            city: 'Rio de Janeiro, RJ',
            document: '987.654.321-00'
          },
          freight: {
            origin: 'São Paulo',
            destination: 'Rio de Janeiro',
            value: 2500.00,
            vehicle: 'Scania R500'
          }
        },
        {
          id: 3,
          type: 'product',
          title: 'Milho Especial - Carlos Oliveira',
          lastMessage: 'Qual a disponibilidade para entrega?',
          lastMessageTime: 'Ontem',
          unreadCount: 1,
          participant: {
            name: 'Carlos Oliveira',
            email: 'carlos@email.com',
            phone: '(31) 77777-7777',
            city: 'Belo Horizonte, MG',
            document: '456.789.123-00'
          },
          product: {
            name: 'Milho Especial',
            price: 95.00,
            category: 'Grãos'
          }
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      // Simular carregamento de mensagens (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMessages = [
        {
          id: 1,
          senderId: 'other',
          content: 'Olá! Gostaria de mais informações sobre o produto Soja Premium.',
          timestamp: '2024-01-15 10:00',
          type: 'text'
        },
        {
          id: 2,
          senderId: 'user',
          content: 'Olá! Claro, posso ajudar. A soja é de alta qualidade, certificada para exportação.',
          timestamp: '2024-01-15 10:05',
          type: 'text'
        },
        {
          id: 3,
          senderId: 'other',
          content: 'Qual o preço por tonelada e disponibilidade?',
          timestamp: '2024-01-15 10:10',
          type: 'text'
        },
        {
          id: 4,
          senderId: 'user',
          content: 'R$ 180,00 por tonelada. Temos 1000 toneladas disponíveis para entrega imediata.',
          timestamp: '2024-01-15 10:15',
          type: 'text'
        },
        {
          id: 5,
          senderId: 'other',
          content: 'Perfeito! Gostaria de agendar uma visita técnica.',
          timestamp: '2024-01-15 10:30',
          type: 'text'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      // Simular envio (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const message = {
        id: Date.now(),
        senderId: 'user',
        content: newMessage,
        timestamp: new Date().toLocaleString('pt-BR'),
        type: 'text'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Atualizar última mensagem na conversa
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: newMessage, lastMessageTime: 'Agora' }
            : conv
        )
      );
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('O arquivo deve ter menos de 10MB.');
      return;
    }

    // Simular upload (substituir por API real)
    const reader = new FileReader();
    reader.onload = () => {
      const message = {
        id: Date.now(),
        senderId: 'user',
        content: `Arquivo enviado: ${file.name}`,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: reader.result
        },
        timestamp: new Date().toLocaleString('pt-BR'),
        type: 'file'
      };
      
      setMessages(prev => [...prev, message]);
    };
    reader.readAsDataURL(file);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getConversationIcon = (type) => {
    switch (type) {
      case 'product':
        return <Package className="w-5 h-5" />;
      case 'freight':
        return <Truck className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getConversationTypeLabel = (type) => {
    switch (type) {
      case 'product':
        return 'Produto';
      case 'freight':
        return 'Frete';
      default:
        return 'Geral';
    }
  };

  if (!user) {
    return null;
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Acesso Restrito
          </h2>
          <p className="text-slate-600 mb-6">
            A mensageria privada está disponível apenas para usuários com plano ativo.
          </p>
          <button
            onClick={() => navigate('/planos')}
            className="px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="pt-32 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Mensageria Privada
            </h1>
            <p className="text-xl text-slate-600">
              Conecte-se diretamente com compradores, vendedores e transportadores
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
            <div className="flex h-[600px]">
              {/* Sidebar - Lista de Conversas */}
              <div className="w-1/3 border-r border-slate-200 flex flex-col">
                {/* Header da Sidebar */}
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Conversas
                    </h3>
                    <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Busca e Filtros */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar conversas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                          filterType === 'all'
                            ? 'bg-slate-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Todas
                      </button>
                      <button
                        onClick={() => setFilterType('product')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                          filterType === 'product'
                            ? 'bg-slate-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Produtos
                      </button>
                      <button
                        onClick={() => setFilterType('freight')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                          filterType === 'freight'
                            ? 'bg-slate-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Fretes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de Conversas */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                      <p className="text-slate-600">Carregando conversas...</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Nenhuma conversa encontrada</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors duration-200 ${
                          selectedConversation?.id === conversation.id ? 'bg-slate-100' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {getConversationIcon(conversation.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-slate-800 truncate">
                                {conversation.title}
                              </h4>
                              <span className="text-xs text-slate-500">
                                {conversation.lastMessageTime}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                conversation.type === 'product' 
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {getConversationTypeLabel(conversation.type)}
                              </span>
                              
                              {conversation.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-600 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header da Conversa */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedConversation(null)}
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            {getConversationIcon(selectedConversation.type)}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {selectedConversation.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {getConversationTypeLabel(selectedConversation.type)}
                            </p>
                          </div>
                        </div>
                        
                        <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.senderId === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-start space-x-2 ${message.senderId === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.senderId === 'user' ? 'bg-slate-600' : 'bg-slate-100'
                              }`}>
                                {message.senderId === 'user' ? (
                                  <User className="w-4 h-4 text-white" />
                                ) : (
                                  <User className="w-4 h-4 text-slate-600" />
                                )}
                              </div>
                              
                              <div className={`rounded-lg px-3 py-2 ${
                                message.senderId === 'user' 
                                  ? 'bg-slate-600 text-white' 
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {message.type === 'file' && message.file && (
                                  <div className="mb-2">
                                    <div className="flex items-center space-x-2 p-2 bg-white/20 rounded">
                                      <div className="w-8 h-8 bg-white/30 rounded flex items-center justify-center">
                                        <File className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{message.file.name}</p>
                                        <p className="text-xs opacity-80">
                                          {(message.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input de Mensagem */}
                    <div className="p-4 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                          title="Anexar arquivo"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Digite sua mensagem..."
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                          disabled={sending}
                        />
                        
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          title="Enviar mensagem"
                        >
                          {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Estado vazio */
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Selecione uma conversa
                      </h3>
                      <p className="text-slate-600">
                        Escolha uma conversa da lista para começar a trocar mensagens
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mensageria;
