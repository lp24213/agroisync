// import axios from 'axios';

// Configuração da API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Idiomas suportados
export const SUPPORTED_LANGUAGES = {
  'pt': 'Português',
  'en': 'English',
  'es': 'Español',
  'zh': '中文'
};

// Tipos de mensagem do chatbot
export const CHATBOT_MESSAGE_TYPES = {
  'text': 'Texto',
  'voice': 'Voz',
  'image': 'Imagem',
  'system': 'Sistema',
  'suggestion': 'Sugestão'
};

// Categorias de ajuda
export const HELP_CATEGORIES = {
  'faq': {
    name: 'Perguntas Frequentes',
    icon: '❓',
    color: 'bg-blue-100 text-blue-800'
  },
  'registration': {
    name: 'Ajuda com Cadastro',
    icon: '📝',
    color: 'bg-green-100 text-green-800'
  },
  'intermediation': {
    name: 'Como Funciona a Intermediação',
    icon: '🤝',
    color: 'bg-purple-100 text-purple-800'
  },
  'transactions': {
    name: 'Status de Transações',
    icon: '📊',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'technical': {
    name: 'Suporte Técnico',
    icon: '🔧',
    color: 'bg-gray-100 text-gray-800'
  }
};

class ChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.currentLanguage = 'pt';
    this.isListening = false;
    this.recognition = null;
    this.synthesis = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // Inicializar serviços de voz
  async initializeVoiceServices() {
    try {
      // Verificar suporte ao Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.getLanguageCode();
        
        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          this.handleVoiceInput(transcript);
        };
        
        this.recognition.onerror = (event) => {
          console.error('Erro no reconhecimento de voz:', event.error);
        };
      }

      // Verificar suporte ao Web Speech Synthesis
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }

      // Verificar suporte ao MediaRecorder para gravação
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.mediaRecorder = new MediaRecorder(stream);
          
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };
          
          this.mediaRecorder.onstop = () => {
            this.processAudioRecording();
          };
        } catch (error) {
          console.error('Erro ao acessar microfone:', error);
        }
      }

      console.log('Serviços de voz inicializados');
      return { success: true };
    } catch (error) {
      console.error('Erro ao inicializar serviços de voz:', error);
      return { success: false, error: error.message };
    }
  }

  // Definir idioma
  setLanguage(language) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = this.getLanguageCode();
    }
  }

  // Obter código do idioma para API de voz
  getLanguageCode() {
    const languageMap = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN'
    };
    return languageMap[this.currentLanguage] || 'pt-BR';
  }

  // Processar mensagem de texto
  async processTextMessage(message) {
    try {
      const userMessage = {
        id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        language: this.currentLanguage
      };

      this.conversationHistory.push(userMessage);

      // Em produção, enviar para API de IA (OpenAI, Claude, etc.)
      // const response = await axios.post(`${API_BASE_URL}/chatbot/process`, {
      //   message: message,
      //   language: this.currentLanguage,
      //   context: this.getConversationContext()
      // });

      // Simular resposta da IA para desenvolvimento
      const aiResponse = await this.generateMockAIResponse(message);
      
      const aiMessage = {
        id: `AI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        language: this.currentLanguage,
        suggestions: aiResponse.suggestions || [],
        category: aiResponse.category
      };

      this.conversationHistory.push(aiMessage);

      return aiMessage;
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      throw error;
    }
  }

  // Processar entrada de voz
  async processVoiceInput() {
    try {
      if (!this.recognition) {
        throw new Error('Reconhecimento de voz não disponível');
      }

      this.isListening = true;
      this.recognition.start();

      return { success: true, message: 'Ouvindo...' };
    } catch (error) {
      console.error('Erro ao iniciar reconhecimento de voz:', error);
      throw error;
    }
  }

  // Parar reconhecimento de voz
  stopVoiceInput() {
    try {
      if (this.recognition) {
        this.recognition.stop();
        this.isListening = false;
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao parar reconhecimento de voz:', error);
      throw error;
    }
  }

  // Processar entrada de voz recebida
  async handleVoiceInput(transcript) {
    try {
      this.isListening = false;
      
      // Processar como mensagem de texto
      const response = await this.processTextMessage(transcript);
      
      // Falar a resposta
      if (this.synthesis) {
        this.speakText(response.content);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao processar entrada de voz:', error);
      throw error;
    }
  }

  // Falar texto
  speakText(text) {
    try {
      if (!this.synthesis) {
        throw new Error('Síntese de voz não disponível');
      }

      // Cancelar fala anterior
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode();
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      this.synthesis.speak(utterance);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao falar texto:', error);
      throw error;
    }
  }

  // Iniciar gravação de áudio
  async startAudioRecording() {
    try {
      if (!this.mediaRecorder) {
        throw new Error('Gravação de áudio não disponível');
      }

      this.audioChunks = [];
      this.mediaRecorder.start();
      
      return { success: true, message: 'Gravando áudio...' };
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      throw error;
    }
  }

  // Parar gravação de áudio
  stopAudioRecording() {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      throw error;
    }
  }

  // Processar gravação de áudio
  async processAudioRecording() {
    try {
      // const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      
      // Em produção, enviar para API de transcrição (Whisper, etc.)
      // const formData = new FormData();
      // formData.append('audio', audioBlob);
      // formData.append('language', this.currentLanguage);
      
      // const response = await axios.post(`${API_BASE_URL}/chatbot/transcribe`, formData);
      // const transcript = response.data.transcript;

      // Simular transcrição para desenvolvimento
      const transcript = 'Transcrição simulada do áudio gravado';
      
      // Processar como mensagem de texto
      const response = await this.processTextMessage(transcript);
      
      return response;
    } catch (error) {
      console.error('Erro ao processar gravação de áudio:', error);
      throw error;
    }
  }

  // Processar upload de imagem
  async processImageUpload(imageFile) {
    try {
      const userMessage = {
        id: `IMG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'image',
        content: URL.createObjectURL(imageFile),
        sender: 'user',
        timestamp: new Date().toISOString(),
        language: this.currentLanguage,
        fileName: imageFile.name,
        fileSize: imageFile.size
      };

      this.conversationHistory.push(userMessage);

      // Em produção, enviar para API de análise de imagem (GPT-4V, Claude, etc.)
      // const formData = new FormData();
      // formData.append('image', imageFile);
      // formData.append('language', this.currentLanguage);
      
      // const response = await axios.post(`${API_BASE_URL}/chatbot/analyze-image`, formData);
      // const analysis = response.data.analysis;

      // Simular análise de imagem para desenvolvimento
      const analysis = await this.generateMockImageAnalysis(imageFile);
      
      const aiMessage = {
        id: `AI_IMG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: analysis.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        language: this.currentLanguage,
        suggestions: analysis.suggestions || [],
        category: 'image_analysis'
      };

      this.conversationHistory.push(aiMessage);

      return aiMessage;
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      throw error;
    }
  }

  // Obter histórico da conversa
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Limpar histórico da conversa
  clearConversationHistory() {
    this.conversationHistory = [];
    return { success: true };
  }

  // Obter contexto da conversa para IA
  getConversationContext() {
    const recentMessages = this.conversationHistory.slice(-10);
    return {
      messages: recentMessages,
      language: this.currentLanguage,
      userPreferences: this.getUserPreferences()
    };
  }

  // Obter preferências do usuário
  getUserPreferences() {
    return {
      language: this.currentLanguage,
      voiceEnabled: !!this.synthesis,
      voiceRecognitionEnabled: !!this.recognition
    };
  }

  // Buscar ajuda por categoria
  async getHelpByCategory(category) {
    try {
      const helpContent = this.getHelpContent(category);
      
      const helpMessage = {
        id: `HELP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: helpContent.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        language: this.currentLanguage,
        category: category,
        suggestions: helpContent.suggestions || []
      };

      this.conversationHistory.push(helpMessage);
      return helpMessage;
    } catch (error) {
      console.error('Erro ao buscar ajuda:', error);
      throw error;
    }
  }

  // Buscar FAQ
  async searchFAQ(query) {
    try {
      const faqResults = this.searchFAQContent(query);
      
      const faqMessage = {
        id: `FAQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: faqResults.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        language: this.currentLanguage,
        category: 'faq',
        suggestions: faqResults.suggestions || []
      };

      this.conversationHistory.push(faqMessage);
      return faqMessage;
    } catch (error) {
      console.error('Erro ao buscar FAQ:', error);
      throw error;
    }
  }

  // Métodos auxiliares para desenvolvimento
  async generateMockAIResponse(message) {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();
    
    // Respostas baseadas em palavras-chave
    if (lowerMessage.includes('cadastro') || lowerMessage.includes('registro')) {
      return {
        content: 'Para fazer seu cadastro no AGROISYNC, clique em "Cadastrar" no menu superior. Você precisará fornecer: nome completo, e-mail, telefone e CPF/CNPJ. Após o cadastro, faremos a verificação dos dados com a Receita Federal.',
        suggestions: ['Como verificar CPF/CNPJ?', 'Preciso de ajuda com o cadastro', 'Quais documentos são necessários?'],
        category: 'registration'
      };
    } else if (lowerMessage.includes('intermediação') || lowerMessage.includes('como funciona')) {
      return {
        content: 'O AGROISYNC funciona como uma plataforma de intermediação. Quando você tem interesse em um produto ou frete, registramos sua intenção e abrimos um canal de comunicação direto com o vendedor/anunciante. A plataforma não realiza vendas diretas, apenas conecta compradores e vendedores.',
        suggestions: ['Como negociar preços?', 'Quanto tempo leva para fechar um negócio?', 'Posso cancelar uma intenção?'],
        category: 'intermediation'
      };
    } else if (lowerMessage.includes('transação') || lowerMessage.includes('status')) {
      return {
        content: 'Para verificar o status de suas transações, acesse seu painel de controle em "Minhas Transações". Os status possíveis são: Aguardando Negociação, Em Negociação, Acordado, Concluído ou Cancelado.',
        suggestions: ['Como mudar o status?', 'Quanto tempo leva cada etapa?', 'Preciso de ajuda com uma transação'],
        category: 'transactions'
      };
    } else if (lowerMessage.includes('frete') || lowerMessage.includes('carga')) {
      return {
        content: 'Para encontrar fretes, acesse a seção "AgroConecta". Você pode buscar por origem, destino, tipo de carga e valor. Ao encontrar um frete de interesse, clique em "Tenho Interesse" para iniciar a negociação.',
        suggestions: ['Como calcular o valor do frete?', 'Quais documentos preciso para o frete?', 'Como acompanhar o frete?'],
        category: 'freight'
      };
    } else {
      return {
        content: 'Olá! Sou o assistente virtual do AgroSync. Como posso ajudá-lo hoje? Posso auxiliar com cadastro, intermediação, transações, fretes e muito mais.',
        suggestions: ['Ajuda com cadastro', 'Como funciona a intermediação?', 'Status de transações', 'Buscar fretes'],
        category: 'general'
      };
    }
  }

  async generateMockImageAnalysis(imageFile) {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      content: `Analisei a imagem "${imageFile.name}". Parece ser um produto agrícola. Para obter uma análise mais detalhada, você pode:\n\n1. Descrever o que está na imagem\n2. Fazer uma pergunta específica sobre o produto\n3. Solicitar ajuda para cadastrar este produto`,
      suggestions: ['Como cadastrar este produto?', 'Qual categoria seria adequada?', 'Preciso de mais detalhes'],
      category: 'image_analysis'
    };
  }

  getHelpContent(category) {
    const helpData = {
      'registration': {
        content: '**Ajuda com Cadastro:**\n\n1. Clique em "Cadastrar" no menu\n2. Preencha todos os campos obrigatórios\n3. Verifique seu e-mail para confirmação\n4. Aguarde a verificação do CPF/CNPJ\n5. Acesse seu painel de controle',
        suggestions: ['Problemas com verificação', 'Esqueci minha senha', 'Como editar perfil']
      },
      'intermediation': {
        content: '**Como Funciona a Intermediação:**\n\n1. Você encontra um produto/frete de interesse\n2. Clica em "Tenho Interesse"\n3. Sistema cria uma transação\n4. Abre mensageria privada com o vendedor\n5. Negociam diretamente os termos\n6. Plataforma apenas conecta, não vende',
        suggestions: ['Como negociar preços?', 'Quanto tempo leva?', 'Posso cancelar?']
      },
      'transactions': {
        content: '**Status de Transações:**\n\n- **Aguardando:** Intenção registrada, aguardando início da negociação\n- **Em Negociação:** Partes estão conversando\n- **Acordado:** Termos foram definidos\n- **Concluído:** Negócio finalizado\n- **Cancelado:** Transação cancelada',
        suggestions: ['Como mudar status?', 'Problemas com transação', 'Histórico completo']
      }
    };

    return helpData[category] || {
      content: 'Categoria de ajuda não encontrada. Tente: cadastro, intermediação, transações, fretes ou suporte técnico.',
      suggestions: ['Ajuda com cadastro', 'Como funciona a intermediação?', 'Status de transações']
    };
  }

  searchFAQContent(query) {
    const faqData = [
      {
        question: 'Como funciona o cadastro?',
        answer: 'O cadastro é simples: preencha seus dados, confirme o e-mail e aguarde a verificação do CPF/CNPJ pela Receita Federal.'
      },
      {
        question: 'A plataforma vende produtos?',
        answer: 'Não, o AgroSync é uma plataforma de intermediação. Conectamos compradores e vendedores para que negociem diretamente.'
      },
      {
        question: 'Como negociar preços?',
        answer: 'Após registrar interesse, você terá acesso à mensageria privada para negociar diretamente com o vendedor.'
      },
      {
        question: 'Quanto tempo leva para fechar um negócio?',
        answer: 'O tempo varia conforme a negociação entre as partes. Alguns negócios fecham em horas, outros podem levar dias.'
      }
    ];

    const matchingFAQ = faqData.find(faq => 
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingFAQ) {
      return {
        content: `**Pergunta:** ${matchingFAQ.question}\n\n**Resposta:** ${matchingFAQ.answer}`,
        suggestions: ['Mais perguntas frequentes', 'Ajuda com cadastro', 'Como funciona a intermediação?']
      };
    } else {
      return {
        content: 'Não encontrei uma resposta específica para sua pergunta. Tente reformular ou escolha uma das opções abaixo.',
        suggestions: ['Como funciona o cadastro?', 'A plataforma vende produtos?', 'Como negociar preços?']
      };
    }
  }

  // Desconectar serviços
  disconnect() {
    try {
      if (this.recognition) {
        this.recognition.stop();
      }
      if (this.synthesis) {
        this.synthesis.cancel();
      }
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      
      this.isListening = false;
      if (process.env.NODE_ENV !== 'production') {
        console.log('Serviços do chatbot desconectados');
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar serviços:', error);
      return { success: false, error: error.message };
    }
  }
}

const chatbotService = new ChatbotService();
export default chatbotService;
