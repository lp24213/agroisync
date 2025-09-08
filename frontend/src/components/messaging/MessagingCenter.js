import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageCircle, Search, Filter, MoreVertical } from 'lucide-react'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'

const MessagingCenter = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [showChatList, setShowChatList] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowChatList(false)
    } else {
      setShowChatList(true)
    }
  }, [isMobile, selectedChat])

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    if (isMobile) {
      setShowChatList(false)
    }
  }

  const handleBackToList = () => {
    setShowChatList(true)
    setSelectedChat(null)
  }

  const handleNewMessage = () => {
    // Implementar criação de nova mensagem
    console.log('Nova mensagem')
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {isMobile && !showChatList && (
            <button
              onClick={handleBackToList}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-agro-emerald" />
            Mensagens
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewMessage}
            className="px-4 py-2 bg-agro-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            Nova Mensagem
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <AnimatePresence>
          {showChatList && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`${isMobile ? 'absolute inset-0 z-10' : 'w-1/3'} border-r border-gray-200 dark:border-gray-700`}
            >
              <ChatList
                onChatSelect={handleChatSelect}
                selectedChatId={selectedChat?.id}
                searchTerm={searchTerm}
                filter={filter}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <div className={`${isMobile ? 'w-full' : 'w-2/3'} flex flex-col`}>
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              onBack={handleBackToList}
              isMobile={isMobile}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Escolha uma conversa da lista para começar a conversar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagingCenter