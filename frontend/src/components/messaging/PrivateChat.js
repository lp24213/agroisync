import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Send, Paperclip, Smile, MoreVertical,
  Phone, Video, Search, Archive,
  Trash, Pin, Star, Reply,
  Check, CheckCheck, Clock, AlertCircle
} from 'lucide-react';

const PrivateChat = ({ 
  chatId, 
  otherUser, 
  onClose, 
  context = 'general' // 'order', 'freight', 'general'
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadMessages();
    setupWebSocket();
    return () => {
      // Cleanup WebSocket
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // Simular carregamento de mensagens
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      const mockMessages = [
        {
          id: 'msg-1',
          senderId: otherUser.id,
          senderName: otherUser.name,
          content: 'Olá! Tenho interesse no seu produto.',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          status: 'delivered'
        },
        {
          id: 'msg-2',
          senderId: user.id,
          senderName: user.name,
          content: 'Olá! Fico feliz com seu interesse. Posso ajudar com mais informações.',
          timestamp: new Date(Date.now() - 3000000),
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg-3',
          senderId: otherUser.id,
          senderName: otherUser.name,
          content: 'Qual o preço por tonelada?',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text',
          status: 'delivered'
        },
        {
          id: 'msg-4',
          senderId: user.id,
          senderName: user.name,
          content: 'O preço é R$ 1.200 por tonelada. Inclui entrega na região.',
          timestamp: new Date(Date.now() - 900000),
          type: 'text',
          status: 'read'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    // Simular WebSocket para mensagens em tempo real
    setIsOnline(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    // Adicionar mensagem localmente
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar status da mensagem
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-slate-400" />;
      case 'delivered':
        return <Check className="w-3 h-3 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const renderMessage = (message) => {
    const isOwn = message.senderId === user.id;
    
    return (
      <motion.div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          {!isOwn && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 ml-2">
              {message.senderName}
            </p>
          )}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-emerald-500 text-white rounded-br-md'
                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md border border-slate-200 dark:border-slate-600'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && getMessageStatusIcon(message.status)}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {t('chat.loading', 'Carregando conversa...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors lg:hidden"
          >
            ←
          </button>
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {otherUser.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {otherUser.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isOnline ? t('chat.online', 'Online') : t('chat.offline', 'Offline')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(renderMessage)}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.typeMessage', 'Digite uma mensagem...')}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
