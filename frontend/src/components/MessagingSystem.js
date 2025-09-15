import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Users,
  MessageCircle,
  Paperclip,
  Smile,
  X,
  Check,
  CheckCheck
} from 'lucide-react';

const MessagingSystem = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Mock data - em produção viria de API
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'João Silva',
      avatar: '/images/avatar1.jpg',
      lastMessage: 'Preciso de informações sobre a carga de soja',
      timestamp: '10:30',
      unread: 2,
      online: true,
      messages: [
        { id: '1', text: 'Olá! Vi seu anúncio de soja', sender: 'other', time: '10:25' },
        { id: '2', text: 'Qual o preço por tonelada?', sender: 'other', time: '10:26' },
        { id: '3', text: 'R$ 1.200 por tonelada', sender: 'me', time: '10:28' },
        { id: '4', text: 'Preciso de informações sobre a carga de soja', sender: 'other', time: '10:30' }
      ]
    },
    {
      id: '2',
      name: 'Maria Santos',
      avatar: '/images/avatar2.jpg',
      lastMessage: 'Transporte confirmado para amanhã',
      timestamp: '09:45',
      unread: 0,
      online: false,
      messages: [
        { id: '1', text: 'Transporte confirmado para amanhã', sender: 'other', time: '09:45' }
      ]
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      avatar: '/images/avatar3.jpg',
      lastMessage: 'Obrigado pela negociação!',
      timestamp: 'Ontem',
      unread: 0,
      online: true,
      messages: [
        { id: '1', text: 'Obrigado pela negociação!', sender: 'other', time: 'Ontem' }
      ]
    }
  ]);

  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    setFilteredChats(
      chats.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, chats]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat.id 
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: message, timestamp: newMessage.time }
          : chat
      )
    );

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat?.id);
  };

  return (
    <div className="messaging-system">
      <div className="messaging-container">
        {/* Sidebar */}
        <div className="messaging-sidebar">
          <div className="messaging-header">
            <h2>Mensagens</h2>
            <div className="messaging-actions">
              <button className="messaging-btn">
                <Users size={20} />
              </button>
              <button className="messaging-btn">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          <div className="messaging-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="messaging-chats">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                className={`messaging-chat ${activeChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat)}
                whileHover={{ backgroundColor: 'var(--agro-hover-bg)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="chat-avatar">
                  <img src={chat.avatar} alt={chat.name} />
                  {chat.online && <div className="online-indicator" />}
                </div>
                <div className="chat-content">
                  <div className="chat-header">
                    <h4>{chat.name}</h4>
                    <span className="chat-time">{chat.timestamp}</span>
                  </div>
                  <p className="chat-last-message">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <div className="unread-badge">{chat.unread}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="messaging-chat-area">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="chat-area-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    <img src={activeChat.avatar} alt={activeChat.name} />
                    {activeChat.online && <div className="online-indicator" />}
                  </div>
                  <div>
                    <h3>{activeChat.name}</h3>
                    <span className="user-status">
                      {activeChat.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn">
                    <Phone size={20} />
                  </button>
                  <button className="chat-action-btn">
                    <Video size={20} />
                  </button>
                  <button className="chat-action-btn">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                <AnimatePresence>
                  {getCurrentChat()?.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`message ${msg.sender}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="message-content">
                        <p>{msg.text}</p>
                        <div className="message-meta">
                          <span>{msg.time}</span>
                          {msg.sender === 'me' && (
                            <div className="message-status">
                              <CheckCheck size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="chat-input-area">
                <div className="chat-input-actions">
                  <button className="input-action-btn">
                    <Paperclip size={20} />
                  </button>
                  <button className="input-action-btn">
                    <Smile size={20} />
                  </button>
                </div>
                <div className="chat-input-container">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    rows={1}
                  />
                </div>
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageCircle size={64} />
              <h3>Selecione uma conversa</h3>
              <p>Escolha uma conversa para começar a trocar mensagens</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .messaging-system {
          height: 100vh;
          background: var(--agro-gradient-primary);
          display: flex;
          flex-direction: column;
        }

        .messaging-container {
          display: flex;
          height: 100%;
          max-width: 1400px;
          margin: 0 auto;
          background: var(--agro-card-bg);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--agro-shadow-xl);
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .messaging-sidebar {
          width: 350px;
          background: var(--agro-navbar-bg);
          border-right: 1px solid var(--agro-border-color);
          display: flex;
          flex-direction: column;
        }

        .messaging-header {
          padding: 20px;
          border-bottom: 1px solid var(--agro-border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .messaging-header h2 {
          color: var(--agro-text-color);
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .messaging-actions {
          display: flex;
          gap: 8px;
        }

        .messaging-btn {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .messaging-btn:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .messaging-search {
          padding: 20px;
          border-bottom: 1px solid var(--agro-border-color);
          position: relative;
        }

        .messaging-search input {
          width: 100%;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 16px 12px 40px;
          border-radius: 8px;
          font-size: 14px;
        }

        .messaging-search svg {
          position: absolute;
          left: 32px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--agro-secondary-color);
        }

        .messaging-chats {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .messaging-chat {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 4px;
        }

        .messaging-chat.active {
          background: var(--agro-active-bg);
        }

        .chat-avatar {
          position: relative;
          margin-right: 12px;
        }

        .chat-avatar img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: var(--agro-primary-color);
          border: 2px solid var(--agro-card-bg);
          border-radius: 50%;
        }

        .chat-content {
          flex: 1;
          min-width: 0;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .chat-header h4 {
          color: var(--agro-text-color);
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .chat-time {
          color: var(--agro-secondary-color);
          font-size: 12px;
        }

        .chat-last-message {
          color: var(--agro-secondary-color);
          font-size: 13px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .messaging-chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--agro-card-bg);
        }

        .chat-area-header {
          padding: 20px;
          border-bottom: 1px solid var(--agro-border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-user-info h3 {
          color: var(--agro-text-color);
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .user-status {
          color: var(--agro-secondary-color);
          font-size: 12px;
        }

        .chat-actions {
          display: flex;
          gap: 8px;
        }

        .chat-action-btn {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .chat-action-btn:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          max-width: 70%;
        }

        .message.me {
          align-self: flex-end;
        }

        .message.other {
          align-self: flex-start;
        }

        .message-content {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 12px 16px;
          position: relative;
        }

        .message.me .message-content {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border-color: var(--agro-primary-color);
        }

        .message-content p {
          margin: 0 0 4px 0;
          font-size: 14px;
          line-height: 1.4;
        }

        .message-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          opacity: 0.7;
        }

        .message-status {
          display: flex;
          align-items: center;
        }

        .chat-input-area {
          padding: 20px;
          border-top: 1px solid var(--agro-border-color);
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .chat-input-actions {
          display: flex;
          gap: 8px;
        }

        .input-action-btn {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .input-action-btn:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .chat-input-container {
          flex: 1;
        }

        .chat-input-container textarea {
          width: 100%;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 14px;
          resize: none;
          min-height: 20px;
          max-height: 100px;
          font-family: inherit;
        }

        .chat-input-container textarea:focus {
          outline: none;
          border-color: var(--agro-primary-color);
        }

        .send-btn {
          background: var(--agro-primary-color);
          border: none;
          color: var(--agro-primary-text);
          cursor: pointer;
          padding: 12px;
          border-radius: 50%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover:not(:disabled) {
          background: var(--agro-primary-hover);
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-chat-selected {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--agro-secondary-color);
          text-align: center;
        }

        .no-chat-selected h3 {
          color: var(--agro-text-color);
          margin: 16px 0 8px 0;
        }

        .no-chat-selected p {
          margin: 0;
        }

        @media (max-width: 768px) {
          .messaging-container {
            margin: 0;
            border-radius: 0;
            height: 100vh;
          }

          .messaging-sidebar {
            width: 100%;
            position: absolute;
            z-index: 10;
            height: 100%;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .messaging-sidebar.open {
            transform: translateX(0);
          }

          .messaging-chat-area {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MessagingSystem;
