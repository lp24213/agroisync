import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, Image, File, MapPin, 
  Smile, MoreVertical, Phone, Video, 
  Search, Archive, Trash, Eye, EyeOff
} from 'lucide-react';
import messagingService, { MESSAGE_TYPES } from '../services/messagingService';

const ChatInterface = ({ 
  transactionId, 
  currentUserId, 
  otherUserId, 
  onClose, 
  isOpen = false 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && transactionId) {
      loadMessages();
      subscribeToMessages();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isOpen, transactionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messagesData = await messagingService.getTransactionMessages(transactionId);
      setMessages(messagesData);
      
      // Marcar mensagens como lidas
      await messagingService.markTransactionAsRead(transactionId, currentUserId);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = async () => {
    try {
      const sub = await messagingService.subscribeToTransaction(
        transactionId,
        handleNewMessage
      );
      setSubscription(sub);
    } catch (error) {
      console.error('Erro ao inscrever para mensagens:', error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    
    // Marcar como lida se for para o usuário atual
    if (message.to === currentUserId) {
      messagingService.markMessageAsRead(message.id);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const sentMessage = await messagingService.sendMessage(
        transactionId,
        otherUserId,
        newMessage.trim(),
        'text'
      );
      
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
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

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setSending(true);
      
      // Em produção, fazer upload para AWS S3
      const fileUrl = await uploadFileToS3(file);
      
      const sentMessage = await messagingService.sendMessage(
        transactionId,
        otherUserId,
        fileUrl,
        type,
        {
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl
        }
      );
      
      setMessages(prev => [...prev, sentMessage]);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const uploadFileToS3 = async (file) => {
    // Simular upload para S3
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://s3.amazonaws.com/agroisync/${file.name}`);
      }, 1000);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMessage = (message, index) => {
    const isOwn = message.fromUserId === currentUserId;
    const showDate = index === 0 || 
      formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);

    return (
      <div key={message.id}>
        {showDate && (
          <div className="text-center my-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
              {formatDate(message.timestamp)}
            </span>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
        >
          <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
            <div className={`px-4 py-2 rounded-lg ${
              isOwn 
                ? 'bg-agro-green-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {message.type === 'image' && (
                <img 
                  src={message.content} 
                  alt="Imagem" 
                  className="max-w-full rounded mb-2"
                />
              )}
              
              {message.type === 'file' && (
                <div className="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded">
                  <File className="w-4 h-4" />
                  <span className="text-sm">{message.attachments?.name}</span>
                </div>
              )}
              
              {message.type === 'location' && (
                <div className="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Localização compartilhada</span>
                </div>
              )}
              
              <p className="text-sm">{message.content}</p>
            </div>
            
            <div className={`text-xs text-gray-500 mt-1 ${
              isOwn ? 'text-right' : 'text-left'
            }`}>
              {formatTime(message.timestamp)}
              {message.read && isOwn && (
                <span className="ml-2">✓✓</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-agro-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {otherUserId?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Negociação #{transactionId}
              </h3>
              <p className="text-sm text-gray-500">
                Usuário: {otherUserId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-2 border-b border-gray-200"
            >
              <input
                type="text"
                placeholder="Buscar nas mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments Bar */}
        <AnimatePresence>
          {showAttachments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-2 border-b border-gray-200 bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Image className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Imagem</span>
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <File className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Arquivo</span>
                </button>
                
                <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Localização</span>
                </button>
              </div>
              
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'image')}
                className="hidden"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e, 'file')}
                className="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green-600"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhuma mensagem encontrada' : 'Nenhuma mensagem ainda'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMessages.map((message, index) => 
                renderMessage(message, index)
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-agro-green-500 focus:border-agro-green-500"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-4 py-2 bg-agro-green-600 text-white rounded-lg hover:bg-agro-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Enviando...' : 'Enviar'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatInterface;
