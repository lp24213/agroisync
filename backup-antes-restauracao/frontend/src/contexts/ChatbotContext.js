import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot deve ser usado dentro de um ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('text'); // text, voice, image

  // Mensagens iniciais
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou o assistente virtual do AGROISYNC. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      mode: 'text'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Enviar mensagem de texto
  const sendTextMessage = async content => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      mode: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simular resposta da IA
      const response = await simulateAIResponse(content);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        mode: 'text'
      };

      setTimeout(
        () => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        },
        1000 + Math.random() * 2000
      ); // Simular tempo de processamento
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao enviar mensagem:', error);
      }
      setIsTyping(false);
    }
  };

  // Enviar mensagem de voz
  const sendVoiceMessage = async audioBlob => {
    setIsTyping(true);

    try {
      // Simular processamento de áudio
      const transcription = await simulateVoiceTranscription(audioBlob);

      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: transcription,
        timestamp: new Date(),
        mode: 'voice',
        audio: audioBlob
      };

      setMessages(prev => [...prev, userMessage]);

      // Simular resposta da IA
      const response = await simulateAIResponse(transcription);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        mode: 'voice'
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao processar áudio:', error);
      }
      setIsTyping(false);
    }
  };

  // Enviar mensagem com imagem
  const sendImageMessage = async (imageFile, description = '') => {
    setIsTyping(true);

    try {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: description || 'Imagem enviada',
        timestamp: new Date(),
        mode: 'image',
        image: imageFile
      };

      setMessages(prev => [...prev, userMessage]);

      // Simular análise de imagem
      const analysis = await simulateImageAnalysis(imageFile);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: analysis,
        timestamp: new Date(),
        mode: 'image'
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 3000);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro ao processar imagem:', error);
      }
      setIsTyping(false);
    }
  };

  // Simular resposta da IA
  const simulateAIResponse = async userInput => {
    const input = userInput.toLowerCase();

    // Respostas baseadas em palavras-chave
    if (input.includes('preço') || input.includes('cotação')) {
      return 'Posso ajudá-lo com informações sobre preços de commodities. Acesse a seção de cotações para ver os preços em tempo real.';
    }

    if (input.includes('frete') || input.includes('transporte')) {
      return 'Para fretes, use o AgroConecta. Lá você pode publicar cargas ou encontrar transportadores disponíveis.';
    }

    if (input.includes('produto') || input.includes('vender') || input.includes('comprar')) {
      return 'O marketplace é o local ideal para comprar e vender produtos agrícolas. Você pode filtrar por categoria, localização e preço.';
    }

    if (input.includes('cripto') || input.includes('blockchain') || input.includes('nft')) {
      return 'O AGROISYNC oferece pagamentos em criptomoedas, staking e NFTs agrícolas. Acesse a seção Crypto para mais informações.';
    }

    if (input.includes('conta') || input.includes('perfil') || input.includes('cadastro')) {
      return 'Para gerenciar sua conta, acesse o dashboard. Lá você pode atualizar suas informações, ver histórico de transações e gerenciar assinaturas.';
    }

    if (input.includes('ajuda') || input.includes('suporte')) {
      return 'Estou aqui para ajudar! Você pode me fazer perguntas sobre qualquer funcionalidade do AGROISYNC ou acessar a seção de ajuda para mais informações.';
    }

    if (input.includes('planos') || input.includes('assinatura') || input.includes('premium')) {
      return 'O AGROISYNC oferece planos gratuitos e premium. Os planos premium incluem recursos avançados como mensageria, analytics e suporte prioritário.';
    }

    // Resposta padrão
    return 'Entendi sua pergunta. Posso ajudá-lo com informações sobre produtos, fretes, criptomoedas, preços e muito mais. O que gostaria de saber especificamente?';
  };

  // Simular transcrição de voz
  const simulateVoiceTranscription = async audioBlob => {
    // Em uma implementação real, aqui seria feita a transcrição usando uma API como Google Speech-to-Text
    return 'Mensagem de voz transcrita (simulação)';
  };

  // Simular análise de imagem
  const simulateImageAnalysis = async imageFile => {
    // Em uma implementação real, aqui seria feita a análise usando uma API como Google Vision
    return 'Analisei sua imagem. Parece ser relacionada ao agronegócio. Como posso ajudá-lo com base nesta imagem?';
  };

  // Alternar modo do chatbot
  const toggleMode = mode => {
    setCurrentMode(mode);
    if (mode === 'voice') {
      setVoiceEnabled(true);
      setImageMode(false);
    } else if (mode === 'image') {
      setImageMode(true);
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(false);
      setImageMode(false);
    }
  };

  // Limpar conversa
  const clearConversation = () => {
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      content: 'Conversa limpa! Como posso ajudá-lo agora?',
      timestamp: new Date(),
      mode: 'text'
    };
    setMessages([welcomeMessage]);
  };

  // Alternar visibilidade do chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    isOpen,
    messages,
    isTyping,
    voiceEnabled,
    imageMode,
    currentMode,
    sendTextMessage,
    sendVoiceMessage,
    sendImageMessage,
    toggleMode,
    clearConversation,
    toggleChatbot
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
};
