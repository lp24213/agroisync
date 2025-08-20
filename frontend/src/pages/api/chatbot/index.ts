import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'

type ChatMessage = {
  _id?: string
  userId: string
  type: 'text' | 'voice' | 'image'
  content: string
  response: string
  timestamp: Date
  sessionId: string
  metadata?: {
    language?: string
    confidence?: number
    processingTime?: number
  }
}

type ChatbotResponse = {
  success: boolean
  message: string
  data?: {
    response: string
    messageId: string
    sessionId: string
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'

// Simulação de respostas do chatbot baseadas no contexto
const generateResponse = (content: string, type: string): string => {
  const lowerContent = content.toLowerCase()
  
  // Respostas para perguntas sobre AgroSync
  if (lowerContent.includes('agrosync') || lowerContent.includes('agro') || lowerContent.includes('plataforma')) {
    return 'O AgroSync é uma plataforma revolucionária que combina blockchain e inteligência artificial para transformar o agronegócio. Oferecemos marketplace de produtos agrícolas, investimentos em propriedades rurais, staking pools e muito mais!'
  }
  
  // Respostas sobre marketplace
  if (lowerContent.includes('marketplace') || lowerContent.includes('produto') || lowerContent.includes('compra') || lowerContent.includes('venda')) {
    return 'Nosso marketplace permite que produtores vendam produtos agrícolas diretamente para compradores, eliminando intermediários. Você pode comprar grãos, frutas, verduras e outros produtos com preços competitivos e rastreabilidade completa.'
  }
  
  // Respostas sobre propriedades
  if (lowerContent.includes('propriedade') || lowerContent.includes('terra') || lowerContent.includes('investimento') || lowerContent.includes('rural')) {
    return 'Oferecemos oportunidades de investimento em propriedades rurais através de tokenização. Você pode investir em terras agrícolas de alta qualidade, recebendo rendimentos baseados na produção e valorização da propriedade.'
  }
  
  // Respostas sobre staking
  if (lowerContent.includes('staking') || lowerContent.includes('apy') || lowerContent.includes('rendimento') || lowerContent.includes('pool')) {
    return 'Nossos pools de staking oferecem rendimentos atrativos (APY de até 18%) para quem mantém tokens AGRO bloqueados. Quanto mais tempo você mantém, maiores são os rendimentos. É uma forma segura de gerar renda passiva.'
  }
  
  // Respostas sobre blockchain
  if (lowerContent.includes('blockchain') || lowerContent.includes('cripto') || lowerContent.includes('token') || lowerContent.includes('segurança')) {
    return 'Utilizamos tecnologia blockchain para garantir transparência, segurança e imutabilidade de todas as transações. Cada operação é registrada na blockchain, proporcionando confiança total para nossos usuários.'
  }
  
  // Respostas sobre suporte
  if (lowerContent.includes('ajuda') || lowerContent.includes('suporte') || lowerContent.includes('contato') || lowerContent.includes('problema')) {
    return 'Nossa equipe de suporte está disponível 24/7 para ajudar você. Entre em contato através do chat, email (suporte@agroisync.com) ou telefone (+55 66 99999-9999).'
  }
  
  // Respostas sobre cadastro
  if (lowerContent.includes('cadastro') || lowerContent.includes('conta') || lowerContent.includes('registro') || lowerContent.includes('começar')) {
    return 'Para começar a usar o AgroSync, basta criar uma conta gratuita em nosso site. Após a verificação, você terá acesso a todas as funcionalidades da plataforma, incluindo marketplace, investimentos e staking.'
  }
  
  // Respostas sobre preços
  if (lowerContent.includes('preço') || lowerContent.includes('custo') || lowerContent.includes('taxa') || lowerContent.includes('comissão')) {
    return 'Nossas taxas são transparentes e competitivas: 2% para transações no marketplace, 1% para operações de staking, e taxas mínimas para transferências. Não há taxas ocultas ou surpresas.'
  }
  
  // Respostas sobre segurança
  if (lowerContent.includes('seguro') || lowerContent.includes('proteção') || lowerContent.includes('risco') || lowerContent.includes('garantia')) {
    return 'Sua segurança é nossa prioridade. Utilizamos criptografia de nível bancário, autenticação de dois fatores, e todas as transações são protegidas por smart contracts na blockchain. Seus fundos estão sempre seguros.'
  }
  
  // Respostas sobre funcionalidades
  if (lowerContent.includes('funcionalidade') || lowerContent.includes('recurso') || lowerContent.includes('o que pode') || lowerContent.includes('como funciona')) {
    return 'O AgroSync oferece: marketplace de produtos agrícolas, investimentos em propriedades rurais, pools de staking com rendimentos atrativos, carteira digital, histórico completo de transações, e muito mais!'
  }
  
  // Resposta padrão
  return 'Obrigado por sua pergunta! O AgroSync é uma plataforma completa para o agronegócio digital. Posso ajudar com informações sobre marketplace, investimentos, staking, ou qualquer outra dúvida sobre nossa plataforma. Como posso ajudá-lo hoje?'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatbotResponse>
) {
  if (req.method === 'POST') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      const { userId, type, content, sessionId } = req.body

      if (!userId || !type || !content || !sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        })
      }

      // Gerar resposta baseada no conteúdo
      const response = generateResponse(content, type)
      
      // Calcular tempo de processamento
      const startTime = Date.now()
      const processingTime = Date.now() - startTime

      // Criar mensagem
      const message: ChatMessage = {
        userId,
        type,
        content,
        response,
        timestamp: new Date(),
        sessionId,
        metadata: {
          language: 'pt-BR',
          confidence: 0.95,
          processingTime
        }
      }

      // Salvar no MongoDB
      const messagesCollection = db.collection('chat_messages')
      const result = await messagesCollection.insertOne({
        ...message,
        _id: new ObjectId()
      })

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Mensagem processada com sucesso',
        data: {
          response,
          messageId: result.insertedId.toString(),
          sessionId
        }
      })

    } catch (error: any) {
      console.error('Erro na API de chatbot:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      const { userId, sessionId, limit = 50 } = req.query

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        })
      }

      // Buscar histórico de mensagens
      const messagesCollection = db.collection('chat_messages')
      const filter: any = { userId: userId.toString() }
      
      if (sessionId) {
        filter.sessionId = sessionId.toString()
      }

      const messages = await messagesCollection
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit as string))
        .toArray()

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Histórico carregado com sucesso',
        data: {
          response: '',
          messageId: '',
          sessionId: sessionId?.toString() || '',

        }
      })

    } catch (error: any) {
      console.error('Erro ao buscar histórico do chatbot:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
