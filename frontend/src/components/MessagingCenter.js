import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import messagingService from '../services/messagingService';

const MessagingCenter = ({ userId, isOpen, onClose }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      connectToMessaging();
    }
  }, [isOpen, userId]);

  const connectToMessaging = async () => {
    try {
      const result = await messagingService.connect(userId);
      if (result.success) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Erro ao conectar à mensageria:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const handleClose = () => {
    setSelectedConversation(null);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Central de Mensageria</h2>
                <p className="text-emerald-100 text-sm">
                  {selectedConversation 
                    ? `Transação #${selectedConversation.transactionId}`
                    : 'Gerencie suas conversas'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Lista de Conversas */}
          <AnimatePresence mode="wait">
            {!selectedConversation ? (
              <motion.div
                key="conversations"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-r border-gray-200"
              >
                <ConversationList
                  userId={userId}
                  onSelectConversation={handleConversationSelect}
                  selectedTransactionId={selectedConversation?.transactionId}
                />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageThread
                  userId={userId}
                  transactionId={selectedConversation.transactionId}
                  onBack={handleBackToConversations}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status de Conexão */}
        {!isConnected && (
          <div className="absolute bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm">
            Conectando à mensageria...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MessagingCenter;
