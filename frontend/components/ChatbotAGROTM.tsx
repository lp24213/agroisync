'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotData {
  [key: string]: string;
}

interface QuickSuggestion {
  id: string;
  text: string;
  category: string;
}

export function ChatbotAGROTM() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual da AGROTM. Como posso ajudar você hoje?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatbotData, setChatbotData] = useState<ChatbotData>({});
  const [quickSuggestions, setQuickSuggestions] = useState<QuickSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do chatbot
  useEffect(() => {
    fetch('/data/chatbotData.json')
      .then((res) => res.json())
      .then((data) => {
        setChatbotData(data);
        // Gerar sugestões rápidas baseadas nos dados
        generateQuickSuggestions(data);
      })
      .catch((error) => console.error('Erro ao carregar dados do chatbot:', error));
  }, []);

  // Gerar sugestões rápidas
  const generateQuickSuggestions = (data: ChatbotData) => {
    const suggestions: QuickSuggestion[] = [
      { id: '1', text: 'Como funciona o staking?', category: 'investimentos' },
      { id: '2', text: 'Quero criar minha conta', category: 'conta' },
      { id: '3', text: 'Preciso de suporte técnico', category: 'suporte' },
      { id: '4', text: 'Quero ver o dashboard', category: 'dashboard' },
      { id: '5', text: 'Como comprar AGROTM?', category: 'investimentos' },
      { id: '6', text: 'Quero saber sobre NFTs', category: 'nft' },
      { id: '7', text: 'Preciso de ajuda com carteira', category: 'tecnologia' },
      { id: '8', text: 'Quero ver os planos', category: 'planos' },
    ];
    setQuickSuggestions(suggestions);
  };

  // Scroll automático para mensagens mais recentes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função para encontrar resposta aproximada
  const findBestMatch = (userInput: string): string | null => {
    const input = userInput.toLowerCase().trim();
    
    // Busca exata
    if (chatbotData[input]) {
      return chatbotData[input];
    }

    // Busca aproximada
    const words = input.split(' ');
    let bestMatch = '';
    let bestScore = 0;

    Object.keys(chatbotData).forEach((key) => {
      const keyWords = key.toLowerCase().split(' ');
      let score = 0;

      words.forEach((word) => {
        if (keyWords.some((keyWord) => keyWord.includes(word) || word.includes(keyWord))) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    });

    // Retorna match se score for maior que 50% das palavras
    return bestScore >= words.length * 0.5 ? chatbotData[bestMatch] : null;
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simular delay de resposta
    setTimeout(() => {
      const response = findBestMatch(userMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || 'Desculpe, não entendi sua pergunta. Pode reformular ou entrar em contato conosco pelo WhatsApp: +55 (66) 99236-2830',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5566992362830', '_blank');
  };

  const handleQuickSuggestion = (suggestion: QuickSuggestion) => {
    handleSendMessage(suggestion.text);
  };

  return (
    <>
      {/* Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black p-4 rounded-full shadow-neon-green hover:shadow-neon-green transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="relative w-full max-w-md h-[500px] bg-[#000000] border border-[#00FF7F]/20 rounded-2xl shadow-neon-green overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#00FF7F]/10 to-[#00cc66]/10 border-b border-[#00FF7F]/20 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-[#00FF7F]">AGROTM Assistant</h3>
                    <p className="text-xs text-[#cccccc]">Online • Respostas Automáticas</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#cccccc] hover:text-[#00FF7F] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 h-80">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black'
                          : 'bg-[#00FF7F]/10 text-[#cccccc] border border-[#00FF7F]/20'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-end mt-1">
                        <Clock className="w-3 h-3 text-[#cccccc] mr-1" />
                        <span className="text-xs text-[#cccccc]">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#00FF7F] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#00FF7F] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#00FF7F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border-t border-[#00FF7F]/20"
                >
                  <p className="text-xs text-[#00FF7F] font-orbitron mb-3">💡 Sugestões rápidas:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickSuggestions.slice(0, 4).map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F] p-2 rounded-lg hover:bg-[#00FF7F]/20 transition-colors text-xs font-orbitron"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-[#00FF7F]/20">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-[#000000] border border-[#00FF7F]/20 rounded-xl px-4 py-2 text-[#cccccc] placeholder-[#cccccc]/50 focus:outline-none focus:border-[#00FF7F] transition-colors font-orbitron"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black p-2 rounded-xl hover:shadow-neon-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* WhatsApp Button */}
                <button
                  onClick={openWhatsApp}
                  className="w-full mt-2 bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F] py-2 rounded-xl hover:bg-[#00FF7F]/20 transition-colors text-sm font-orbitron"
                >
                  💬 Falar com atendente humano
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 