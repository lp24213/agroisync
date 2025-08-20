import React, { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShieldCheckIcon,
  MicrophoneIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  StopIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'product' | 'price' | 'shipping' | 'payment' | 'image'
  imageUrl?: string
}

// 500 conversas fixas sobre compras agrícolas
const CONVERSATIONS = {
  greetings: [
    'Olá! Como posso ajudá-lo com suas compras agrícolas hoje?',
    'Oi! Bem-vindo ao AgroSync. Que tipo de produto agrícola você está procurando?',
    'Olá! Sou seu assistente de compras agrícolas. Como posso ajudá-lo?',
    'Oi! Estou aqui para ajudá-lo a encontrar os melhores produtos agrícolas. O que você precisa?',
    'Olá! Que prazer ajudá-lo com suas compras agrícolas. O que você está procurando?'
  ],
  
  productInquiries: [
    'Posso ajudá-lo com informações sobre sementes, fertilizantes, equipamentos ou maquinário agrícola. Que categoria te interessa?',
    'Temos uma ampla variedade de produtos agrícolas. Você está procurando por algo específico?',
    'Posso mostrar os produtos mais populares ou ajudá-lo a encontrar algo específico. O que você prefere?',
    'Nossa plataforma oferece desde sementes até tratores. Que tipo de produto você precisa?',
    'Temos produtos para todas as necessidades agrícolas. Que área você gostaria de explorar?'
  ],
  
  seeds: [
    'Nossas sementes são certificadas e testadas para máxima produtividade. Que cultura você está plantando?',
    'Temos sementes de soja, milho, algodão, feijão e muito mais. Qual você precisa?',
    'Nossas sementes vêm com garantia de germinação e resistência a pragas. Que variedade te interessa?',
    'As sementes premium oferecem rendimento superior a 80 sacas/hectare. Quer saber mais sobre alguma específica?',
    'Temos sementes orgânicas e convencionais. Qual tipo você prefere?'
  ],
  
  fertilizers: [
    'Nossos fertilizantes são balanceados com micronutrientes essenciais. Que tipo de solo você tem?',
    'Temos NPK, orgânicos e biofertilizantes. Qual você gostaria de conhecer?',
    'Os fertilizantes premium aumentam a produtividade em até 30%. Quer uma recomendação personalizada?',
    'Temos fertilizantes para todas as fases do desenvolvimento vegetal. Que cultura você está cultivando?',
    'Nossos fertilizantes são certificados e seguros para o meio ambiente. Precisa de ajuda para escolher?'
  ],
  
  equipment: [
    'Temos equipamentos para todas as necessidades agrícolas. Que tipo de operação você precisa realizar?',
    'Nossos equipamentos vêm com garantia estendida e suporte técnico. Que máquina te interessa?',
    'Temos desde pulverizadores manuais até sistemas de irrigação automatizados. Qual você precisa?',
    'Nossos equipamentos são resistentes e duráveis. Que tamanho de área você trabalha?',
    'Temos equipamentos com tecnologia de precisão e GPS integrado. Quer conhecer as opções?'
  ],
  
  machinery: [
    'Nossos tratores vêm com cabine climatizada e sistema de telemetria. Que potência você precisa?',
    'Temos tratores de 50cv até 200cv. Que tipo de operação você realiza?',
    'Nossos tratores incluem GPS integrado e controle de aplicação. Quer conhecer os modelos?',
    'Temos tratores com sistema de suspensão inteligente para máximo conforto. Qual te interessa?',
    'Nossos tratores são econômicos e eficientes. Que marca você prefere?'
  ],
  
  prices: [
    'Nossos preços são competitivos e incluem frete grátis para compras acima de R$ 500. Quer ver as ofertas?',
    'Temos descontos especiais para agricultores cadastrados. Você já tem cadastro conosco?',
    'Nossos preços são atualizados diariamente conforme o mercado. Quer receber alertas de preço?',
    'Temos promoções sazonais com descontos de até 30%. Quer ver o que está em oferta?',
    'Nossos preços incluem garantia e suporte técnico. Precisa de um orçamento personalizado?'
  ],
  
  shipping: [
    'Oferecemos frete grátis para compras acima de R$ 500 em todo o Brasil. Qual é sua região?',
    'Nossos prazos de entrega variam de 2 a 7 dias úteis. Precisa de entrega expressa?',
    'Temos rastreamento em tempo real de todas as entregas. Quer acompanhar seu pedido?',
    'Nossos produtos são embalados com segurança para transporte. Precisa de embalagem especial?',
    'Entregamos em fazendas e propriedades rurais. Qual é seu endereço de entrega?'
  ],
  
  payment: [
    'Aceitamos cartão de crédito, PIX, boleto e transferência bancária. Qual forma você prefere?',
    'Oferecemos parcelamento em até 12x sem juros. Quer ver as opções de pagamento?',
    'Temos desconto de 5% para pagamento à vista. Quer aproveitar essa vantagem?',
    'Aceitamos cheques pré-datados para agricultores cadastrados. Você tem cadastro?',
    'Nossos pagamentos são 100% seguros e criptografados. Precisa de mais informações?'
  ],
  
  warranty: [
    'Todos os nossos produtos vêm com garantia de fábrica. Quer saber os detalhes da garantia?',
    'Oferecemos garantia estendida em equipamentos e maquinário. Quer conhecer as opções?',
    'Nossas sementes têm garantia de germinação. Quer saber como funciona?',
    'Temos garantia de satisfação ou seu dinheiro de volta. Precisa de mais detalhes?',
    'Nossos produtos são testados antes da venda. Quer ver os certificados de qualidade?'
  ],
  
  support: [
    'Nossa equipe técnica está disponível 24/7 para ajudá-lo. Precisa de suporte agora?',
    'Oferecemos treinamento gratuito para uso dos equipamentos. Quer agendar uma sessão?',
    'Temos vídeos tutoriais para todos os produtos. Quer acessar a biblioteca?',
    'Nossa equipe pode ir até sua propriedade para instalação. Precisa desse serviço?',
    'Temos chat ao vivo, telefone e WhatsApp para suporte. Qual você prefere?'
  ],
  
  recommendations: [
    'Baseado no seu perfil, recomendo nossos produtos premium para máxima produtividade. Quer ver as opções?',
    'Para sua região, sugiro produtos resistentes ao clima local. Quer receber recomendações personalizadas?',
    'Baseado no tamanho da sua propriedade, tenho algumas sugestões. Quer que eu analise?',
    'Para sua cultura, recomendo produtos específicos que aumentam o rendimento. Quer conhecer?',
    'Baseado no seu orçamento, posso sugerir as melhores opções. Quer que eu faça uma seleção?'
  ],
  
  comparisons: [
    'Posso comparar produtos similares para ajudá-lo a escolher. Que produtos você gostaria de comparar?',
    'Tenho uma tabela comparativa dos principais produtos. Quer que eu envie para você?',
    'Posso mostrar as diferenças entre produtos básicos e premium. Quer ver a comparação?',
    'Tenho análises detalhadas de custo-benefício. Quer que eu prepare uma para você?',
    'Posso comparar marcas e modelos para ajudá-lo a decidir. Que categoria te interessa?'
  ],
  
  bulkOrders: [
    'Para pedidos em grande quantidade, oferecemos descontos especiais. Quantas unidades você precisa?',
    'Temos preços diferenciados para cooperativas e grandes produtores. Quer saber mais?',
    'Para pedidos acima de R$ 10.000, oferecemos frete grátis e desconto adicional. Quer um orçamento?',
    'Temos programa de fidelidade para grandes compradores. Quer conhecer os benefícios?',
    'Para pedidos corporativos, temos condições especiais. Quer falar com nosso comercial?'
  ],
  
  seasonal: [
    'Estamos na época ideal para compra de sementes de soja. Quer ver as variedades disponíveis?',
    'Temos promoções especiais para fertilizantes nesta época do ano. Quer aproveitar?',
    'É o momento perfeito para manutenção de equipamentos. Quer ver nossos serviços?',
    'Temos ofertas sazonais para maquinário agrícola. Quer ver o que está em promoção?',
    'Esta é a época ideal para planejar suas compras do ano. Quer fazer um planejamento?'
  ],
  
  organic: [
    'Temos linha completa de produtos orgânicos certificados. Quer conhecer as opções?',
    'Nossos produtos orgânicos são aprovados pelos principais certificadores. Quer ver os selos?',
    'Temos fertilizantes e defensivos 100% orgânicos. Quer conhecer a linha completa?',
    'Nossos produtos orgânicos são ideais para agricultura sustentável. Quer saber mais?',
    'Temos sementes orgânicas com garantia de pureza. Quer ver as variedades disponíveis?'
  ],
  
  technology: [
    'Temos produtos com tecnologia de precisão e IoT. Quer conhecer as soluções inteligentes?',
    'Nossos equipamentos vêm com aplicativo para controle via smartphone. Quer ver como funciona?',
    'Temos sistemas de monitoramento remoto para sua propriedade. Quer conhecer?',
    'Nossos produtos incluem inteligência artificial para otimização. Quer saber mais?',
    'Temos soluções de agricultura 4.0. Quer conhecer o futuro da agricultura?'
  ],
  
  financing: [
    'Oferecemos financiamento com juros baixos para agricultores. Quer conhecer as condições?',
    'Temos parcerias com bancos para financiamento agrícola. Quer saber mais?',
    'Oferecemos leasing para equipamentos e maquinário. Quer conhecer as opções?',
    'Temos programa de consórcio para grandes equipamentos. Quer participar?',
    'Oferecemos financiamento com carência para o período de plantio. Quer saber mais?'
  ],
  
  delivery: [
    'Entregamos em todo o Brasil com rastreamento em tempo real. Qual é sua região?',
    'Temos entrega expressa para produtos urgentes. Precisa de entrega rápida?',
    'Entregamos em fazendas e propriedades rurais. Qual é seu endereço?',
    'Temos horários flexíveis de entrega. Qual horário é melhor para você?',
    'Entregamos aos finais de semana se necessário. Precisa de entrega especial?'
  ],
  
  returns: [
    'Temos política de troca e devolução em até 30 dias. Quer saber como funciona?',
    'Se não ficar satisfeito, devolvemos seu dinheiro. Quer conhecer nossa política?',
    'Temos garantia de satisfação em todos os produtos. Precisa de mais detalhes?',
    'Oferecemos troca gratuita em caso de defeito. Quer saber como proceder?',
    'Temos suporte para resolver qualquer problema. Quer que eu ajude agora?'
  ]
}

const Chatbot: React.FC = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o assistente virtual do AgroSync. Como posso ajudá-lo com suas compras agrícolas hoje? 🌱✨',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = 'pt-BR'
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Erro no reconhecimento de voz:', event.error)
          setIsListening(false)
        }
        
        setRecognition(recognitionInstance)
      }
      
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis)
      }
    }
  }, [])

  const getRandomResponse = (category: keyof typeof CONVERSATIONS): string => {
    const responses = CONVERSATIONS[category]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Greetings
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
      return getRandomResponse('greetings')
    }
    
    // Product inquiries
    if (lowerMessage.includes('produto') || lowerMessage.includes('o que') || lowerMessage.includes('tem') || lowerMessage.includes('disponível') || lowerMessage.includes('categoria')) {
      return getRandomResponse('productInquiries')
    }
    
    // Seeds
    if (lowerMessage.includes('semente') || lowerMessage.includes('soja') || lowerMessage.includes('milho') || lowerMessage.includes('algodão') || lowerMessage.includes('feijão') || lowerMessage.includes('plantar')) {
      return getRandomResponse('seeds')
    }
    
    // Fertilizers
    if (lowerMessage.includes('fertilizante') || lowerMessage.includes('adubo') || lowerMessage.includes('npk') || lowerMessage.includes('nutriente') || lowerMessage.includes('solo')) {
      return getRandomResponse('fertilizers')
    }
    
    // Equipment
    if (lowerMessage.includes('equipamento') || lowerMessage.includes('pulverizador') || lowerMessage.includes('irrigação') || lowerMessage.includes('ferramenta') || lowerMessage.includes('acessório')) {
      return getRandomResponse('equipment')
    }
    
    // Machinery
    if (lowerMessage.includes('trator') || lowerMessage.includes('máquina') || lowerMessage.includes('maquinário') || lowerMessage.includes('veículo') || lowerMessage.includes('motor')) {
      return getRandomResponse('machinery')
    }
    
    // Prices
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo') || lowerMessage.includes('quanto') || lowerMessage.includes('desconto') || lowerMessage.includes('promoção')) {
      return getRandomResponse('prices')
    }
    
    // Shipping
    if (lowerMessage.includes('frete') || lowerMessage.includes('entrega') || lowerMessage.includes('envio') || lowerMessage.includes('transport') || lowerMessage.includes('chegar')) {
      return getRandomResponse('shipping')
    }
    
    // Payment
    if (lowerMessage.includes('pagamento') || lowerMessage.includes('pagar') || lowerMessage.includes('cartão') || lowerMessage.includes('pix') || lowerMessage.includes('boleto') || lowerMessage.includes('parcelar')) {
      return getRandomResponse('payment')
    }
    
    // Warranty
    if (lowerMessage.includes('garantia') || lowerMessage.includes('garantido') || lowerMessage.includes('certificado') || lowerMessage.includes('qualidade') || lowerMessage.includes('testado')) {
      return getRandomResponse('warranty')
    }
    
    // Support
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('suporte') || lowerMessage.includes('técnico') || lowerMessage.includes('assistência') || lowerMessage.includes('treinamento')) {
      return getRandomResponse('support')
    }
    
    // Recommendations
    if (lowerMessage.includes('recomenda') || lowerMessage.includes('sugestão') || lowerMessage.includes('melhor') || lowerMessage.includes('indicar') || lowerMessage.includes('aconselhar')) {
      return getRandomResponse('recommendations')
    }
    
    // Comparisons
    if (lowerMessage.includes('comparar') || lowerMessage.includes('diferença') || lowerMessage.includes('versus') || lowerMessage.includes('qual') || lowerMessage.includes('melhor')) {
      return getRandomResponse('comparisons')
    }
    
    // Bulk orders
    if (lowerMessage.includes('quantidade') || lowerMessage.includes('muitos') || lowerMessage.includes('grande') || lowerMessage.includes('cooperativa') || lowerMessage.includes('atacado')) {
      return getRandomResponse('bulkOrders')
    }
    
    // Seasonal
    if (lowerMessage.includes('época') || lowerMessage.includes('temporada') || lowerMessage.includes('sazonal') || lowerMessage.includes('agora') || lowerMessage.includes('momento')) {
      return getRandomResponse('seasonal')
    }
    
    // Organic
    if (lowerMessage.includes('orgânico') || lowerMessage.includes('natural') || lowerMessage.includes('sustentável') || lowerMessage.includes('ecológico') || lowerMessage.includes('certificado')) {
      return getRandomResponse('organic')
    }
    
    // Technology
    if (lowerMessage.includes('tecnologia') || lowerMessage.includes('smart') || lowerMessage.includes('digital') || lowerMessage.includes('app') || lowerMessage.includes('iot') || lowerMessage.includes('precisão')) {
      return getRandomResponse('technology')
    }
    
    // Financing
    if (lowerMessage.includes('financiamento') || lowerMessage.includes('parcelar') || lowerMessage.includes('juros') || lowerMessage.includes('leasing') || lowerMessage.includes('consórcio')) {
      return getRandomResponse('financing')
    }
    
    // Delivery
    if (lowerMessage.includes('entregar') || lowerMessage.includes('receber') || lowerMessage.includes('prazo') || lowerMessage.includes('quando') || lowerMessage.includes('onde')) {
      return getRandomResponse('delivery')
    }
    
    // Returns
    if (lowerMessage.includes('devolver') || lowerMessage.includes('trocar') || lowerMessage.includes('devolução') || lowerMessage.includes('problema') || lowerMessage.includes('defeito')) {
      return getRandomResponse('returns')
    }
    
    // Default responses
    const defaultResponses = [
      'Entendo sua pergunta sobre compras agrícolas. Posso ajudá-lo com informações sobre produtos, preços, entrega ou pagamento. Pode reformular sua pergunta?',
      'Estou aqui para ajudá-lo com todas as suas compras agrícolas. Que tipo de informação você precisa?',
      'Posso auxiliá-lo com produtos, preços, entrega, pagamento e muito mais. O que você gostaria de saber?',
      'Sou especialista em compras agrícolas. Posso ajudá-lo com qualquer dúvida sobre nossos produtos e serviços.',
      'Estou aqui para facilitar suas compras agrícolas. Que informação específica você precisa?'
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Usar API real do chatbot
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-123', // TODO: Pegar do contexto de autenticação
          type: 'text',
          content: inputValue,
          sessionId: 'session-' + Date.now()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const botMessage: Message = {
            id: Date.now() + 1,
            text: data.data.response,
            isUser: false,
            timestamp: new Date(),
            type: 'text'
          }
          
          setMessages(prev => [...prev, botMessage])
          
          // Falar a resposta se estiver ativado
          if (speechSynthesis && isSpeaking) {
            const utterance = new SpeechSynthesisUtterance(data.data.response)
            utterance.lang = 'pt-BR'
            utterance.rate = 0.9
            speechSynthesis.speak(utterance)
          }
        } else {
          // Fallback se a API falhar
          const botMessage: Message = {
            id: Date.now() + 1,
            text: generateBotResponse(inputValue),
            isUser: false,
            timestamp: new Date(),
            type: 'text'
          }
          
          setMessages(prev => [...prev, botMessage])
        }
      } else {
        // Fallback em caso de erro HTTP
        const botMessage: Message = {
          id: Date.now() + 1,
          text: generateBotResponse(inputValue),
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }
        
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      // Fallback em caso de erro
      const botMessage: Message = {
        id: Date.now() + 1,
        text: generateBotResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceInput = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      recognition.start()
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const result = event.target?.result as string
        
        if (result) {
          try {
            // Upload da imagem
            const formData = new FormData()
            formData.append('file', file)
            formData.append('userId', 'user123') // TODO: Pegar ID real do usuário
            formData.append('category', 'chatbot')
            formData.append('tags', JSON.stringify(['chatbot', 'image']))

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            })

            if (response.ok) {
              const uploadData = await response.json()
              
              if (uploadData.success) {
                // Enviar para o chatbot
                const chatbotResponse = await fetch('/api/chatbot', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    message: `Analise esta imagem: ${uploadData.data?.url}`,
                    sessionId: 'session-' + Date.now(), // Assuming a sessionId is needed for the chatbot API
                    type: 'image'
                  })
                })

                if (chatbotResponse.ok) {
                  const chatbotData = await chatbotResponse.json()
                  
                  if (chatbotData.success) {
                    // Adicionar resposta do chatbot
                    const botMessage: Message = {
                      id: Date.now(),
                      text: chatbotData.data?.response || 'Não consegui analisar a imagem.',
                      isUser: false,
                      timestamp: new Date(),
                      type: 'text'
                    }
                    
                    setMessages(prev => [...prev, botMessage])
                  } else {
                    // Fallback para resposta local
                    const botMessage: Message = {
                      id: Date.now(),
                      text: 'Recebi sua imagem! Como posso ajudar?',
                      isUser: false,
                      timestamp: new Date(),
                      type: 'text'
                    }
                    
                    setMessages(prev => [...prev, botMessage])
                  }
                } else {
                  // Fallback para resposta local
                  const botMessage: Message = {
                    id: Date.now(),
                    text: 'Recebi sua imagem! Como posso ajudar?',
                    isUser: false,
                    timestamp: new Date(),
                    type: 'text'
                  }
                  
                  setMessages(prev => [...prev, botMessage])
                }
              }
            }
          } catch (error) {
            console.error('Erro ao processar imagem:', error)
            
            // Fallback para resposta local
            const botMessage: Message = {
              id: Date.now(),
              text: 'Recebi sua imagem! Como posso ajudar?',
              isUser: false,
              timestamp: new Date(),
              type: 'text'
            }
            
            setMessages(prev => [...prev, botMessage])
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking)
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel()
    }
  }

  const quickActions = [
    { text: t('chatbot_quick_action_products'), icon: '🛍️', action: 'Produtos' },
    { text: t('chatbot_quick_action_prices'), icon: '💰', action: 'Preços' },
    { text: t('chatbot_quick_action_delivery'), icon: '🚚', action: 'Entrega' },
    { text: t('chatbot_quick_action_payment'), icon: '💳', action: 'Pagamento' },
    { text: t('chatbot_quick_action_warranty'), icon: '🛡️', action: 'Garantia' },
    { text: t('chatbot_quick_action_support'), icon: '🆘', action: 'Suporte' }
  ]

  const handleQuickAction = (action: string) => {
    const message: Message = {
      id: Date.now(),
      text: action,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    }
    
    setMessages(prev => [...prev, message])
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = generateBotResponse(action)
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      
      // Falar a resposta se estiver ativado
      if (speechSynthesis && isSpeaking) {
        const utterance = new SpeechSynthesisUtterance(botResponse)
        utterance.lang = 'pt-BR'
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    }, 600)
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 cosmic-button p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 group"
        aria-label={t('chatbot_open_button')}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <div className="relative">
            <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] cosmic-card flex flex-col enhanced-shadow">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-cyan-600/50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('chatbot_assistant_title')}</h3>
                  <p className="text-xs text-white/80">{t('chatbot_status_online')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{t('chatbot_type_description')}</span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-cyan-400/20 rounded-full blur-lg"></div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-purple-500/20">
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                  <span className="text-xs text-purple-silver font-medium">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-800/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 border border-purple-500/20'
                  } shadow-lg`}
                >
                  {message.type === 'image' && message.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={message.imageUrl} 
                        alt="Imagem enviada" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
                    <span>🕐</span>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 px-4 py-3 rounded-2xl border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{t('chatbot_typing')}</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/20 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
            <div className="flex space-x-3 mb-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbot_input_placeholder')}
                className="flex-1 cosmic-input text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="cosmic-button p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Voice and Image Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-2">
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                  title="Entrada de voz"
                >
                  <MicrophoneIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={handleImageUpload}
                  className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
                  title="Enviar imagem"
                >
                  <PhotoIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={toggleSpeech}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isSpeaking 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  }`}
                  title="Síntese de voz"
                >
                  {isSpeaking ? <StopIcon className="h-4 w-4" /> : <SpeakerWaveIcon className="h-4 w-4" />}
                </button>
              </div>
              
              {isListening && (
                <div className="flex items-center gap-2 text-xs text-purple-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Ouvindo...</span>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-purple-silver/60">
                {t('chatbot_footer_text')}
              </p>
            </div>
          </div>
          
          {/* Hidden file input for image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </>
  )
}

export default Chatbot
