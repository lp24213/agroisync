'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Bot, 
  User,
  Download,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
  imageUrl?: string;
  voiceUrl?: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o AgroSync AI, seu assistente virtual para agricultura. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: selectedFile ? 'image' : 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedFile(null);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, selectedFile),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (text: string, file: File | null): string => {
    const responses: string[] = [
      'Interessante! Com base na sua pergunta, posso sugerir algumas soluções para otimizar sua produção agrícola.',
      'Excelente pergunta! Vou analisar os dados e fornecer insights personalizados para seu caso.',
      'Baseado nas informações fornecidas, recomendo implementar práticas sustentáveis para melhorar a produtividade.',
      'Analisando o contexto, vejo que você pode se beneficiar de tecnologias de agricultura de precisão.',
      'Ótima observação! Vou preparar um relatório detalhado com recomendações específicas para sua região.'
    ];
    
    if (file) {
      return 'Analisei a imagem enviada e identifiquei padrões interessantes. Posso ajudar com recomendações específicas baseadas no que vejo.';
    }
    
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex]!;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Here you would implement text-to-speech functionality
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 z-50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-8 h-8 text-white mx-auto" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-8 h-8 text-white mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-black/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-400/20 to-blue-600/20 p-4 border-b border-cyan-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AgroSync AI</h3>
                    <p className="text-cyan-400 text-sm">Assistente Virtual</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-cyan-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 h-[380px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-600' 
                          : 'bg-gradient-to-br from-purple-400 to-pink-600'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}>
                                                 {message.type === 'image' && message.imageUrl && (
                           <NextImage 
                             src={message.imageUrl} 
                             alt="Uploaded image" 
                             width={300}
                             height={128}
                             className="w-full h-32 object-cover rounded-lg mb-2"
                           />
                         )}
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-black/70' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-2xl border border-white/20">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-cyan-400 text-sm">Digitando...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-cyan-400/30 bg-black/50">
              {/* File Preview */}
              {selectedFile && (
                <div className="mb-3 p-2 bg-white/10 rounded-lg border border-cyan-400/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">{selectedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-cyan-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'text-cyan-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-200"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() && !selectedFile}
                  className="p-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-black rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

                             <input
                 ref={fileInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handleFileSelect}
                 className="hidden"
                 alt=""
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
