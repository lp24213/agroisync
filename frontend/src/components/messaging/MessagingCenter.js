import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Plus } from 'lucide-react';
import ChatList from './ChatList';
import PrivateChat from './PrivateChat';

const MessagingCenter = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowChatList(false);
    } else {
      setShowChatList(true);
    }
  }, [selectedChat, isMobile]);

  const handleSelectChat = chat => {
    setSelectedChat(chat);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    if (isMobile) {
      setShowChatList(true);
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setShowChatList(true);
  };

  return (
    <div className='h-full bg-white dark:bg-slate-800'>
      <div className='flex h-full'>
        {/* Chat List - Desktop: Always visible, Mobile: Conditional */}
        <AnimatePresence>
          {showChatList && (
            <motion.div
              className={`${
                isMobile ? 'absolute inset-0 z-10' : 'w-1/3 border-r border-slate-200 dark:border-slate-700'
              }`}
              initial={{ x: isMobile ? -320 : 0 }}
              animate={{ x: 0 }}
              exit={{ x: isMobile ? -320 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatList onSelectChat={handleSelectChat} selectedChatId={selectedChat?.id} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className={`${isMobile ? 'w-full' : 'w-2/3'} flex flex-col`}>
          {selectedChat ? (
            <PrivateChat
              chatId={selectedChat.id}
              otherUser={selectedChat.otherUser}
              onClose={handleCloseChat}
              context={selectedChat.context}
            />
          ) : (
            <div className='flex flex-1 items-center justify-center p-8'>
              <div className='text-center'>
                <MessageSquare className='mx-auto mb-6 h-24 w-24 text-slate-400' />
                <h2 className='mb-4 text-2xl font-bold text-slate-600 dark:text-slate-400'>
                  {t('messaging.welcome', 'Bem-vindo ao Centro de Mensagens')}
                </h2>
                <p className='mb-6 max-w-md text-slate-500 dark:text-slate-500'>
                  {t(
                    'messaging.description',
                    'Selecione uma conversa para começar a conversar ou inicie uma nova conversa.'
                  )}
                </p>
                <button className='mx-auto flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700'>
                  <Plus className='h-5 w-5' />
                  {t('messaging.newConversation', 'Nova Conversa')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingCenter;
