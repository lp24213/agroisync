import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  Send,
  Paperclip,
  CheckCheck,
  Clock,
  Check,
  AlertCircle,
  Phone,
  Video,
  MoreVertical,
  Smile
} from 'lucide-react';

const PrivateChat = ({ chatId, otherUser, onClose, context = 'general' }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

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
  }, [otherUser.id, otherUser.name, user.id, user.name]);

  const setupWebSocket = useCallback(() => {
    setIsOnline(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadMessages();
    setupWebSocket();
    return () => {
      // Cleanup WebSocket
    };
  }, [chatId, loadMessages, setupWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages(prev => prev.map(msg => (msg.id === message.id ? { ...msg, status: 'delivered' } : msg)));
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => prev.map(msg => (msg.id === message.id ? { ...msg, status: 'error' } : msg)));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = timestamp => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatusIcon = status => {
    switch (status) {
      case 'sending':
        return <Clock className='h-3 w-3 text-slate-400' />;
      case 'delivered':
        return <Check className='h-3 w-3 text-slate-400' />;
      case 'read':
        return <CheckCheck className='h-3 w-3 text-blue-500' />;
      case 'error':
        return <AlertCircle className='h-3 w-3 text-red-500' />;
      default:
        return null;
    }
  };

  const renderMessage = message => {
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
          {!isOwn && <p className='mb-1 ml-2 text-xs text-slate-500 dark:text-slate-400'>{message.senderName}</p>}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? 'rounded-br-md bg-emerald-500 text-white'
                : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            <p className='text-sm'>{message.content}</p>
          </div>
          <div className={`mt-1 flex items-center gap-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className='text-xs text-slate-500 dark:text-slate-400'>{formatTime(message.timestamp)}</span>
            {isOwn && getMessageStatusIcon(message.status)}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600'></div>
          <p className='text-slate-600 dark:text-slate-400'>{t('chat.loading', 'Carregando conversa...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col bg-white dark:bg-slate-800'>
      <div className='flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex items-center gap-3'>
          <button
            onClick={onClose}
            className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden'
          >
            ←
          </button>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500'>
            <span className='font-semibold text-white'>{otherUser.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <h3 className='font-semibold text-slate-800 dark:text-slate-200'>{otherUser.name}</h3>
            <div className='flex items-center gap-2'>
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                {isOnline ? t('chat.online', 'Online') : t('chat.offline', 'Offline')}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700'>
            <Phone className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </button>
          <button className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700'>
            <Video className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </button>
          <button className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700'>
            <MoreVertical className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </button>
        </div>
      </div>

      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
        <AnimatePresence>{messages.map(renderMessage)}</AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <div className='border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800'>
        <div className='flex items-end gap-2'>
          <button className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700'>
            <Paperclip className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </button>

          <div className='relative flex-1'>
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.typeMessage', 'Digite uma mensagem...')}
              className='w-full resize-none rounded-2xl border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              rows='1'
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <button className='rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700'>
            <Smile className='h-5 w-5 text-slate-600 dark:text-slate-400' />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className='rounded-lg bg-emerald-600 p-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {sending ? (
              <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
            ) : (
              <Send className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
