const OpenAI = require('openai');
const fs = require('fs');
const logger = require('../utils/logger');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.systemPrompt = `Você é um assistente inteligente especializado em agronegócio da plataforma AgroSync. Suas responsabilidades incluem:

1. **Conhecimento do Agronegócio:**
   - Produtos agrícolas (grãos, frutas, legumes, etc.)
   - Logística e transporte rural
   - Preços de commodities
   - Mercados agrícolas
   - Tecnologia agrícola

2. **Funcionalidades da Plataforma:**
   - Marketplace de produtos agrícolas
   - Sistema AgroConecta para logística
   - Rastreamento de cargas
   - Análises de mercado

3. **Comandos Especiais:**
   - "criar frete" ou "criar pedido de frete" - Para criar pedidos de transporte
   - "rastrear [número do pedido]" - Para consultar status de frete
   - "preços [produto]" - Para consultar preços de commodities

4. **Diretrizes de Segurança:**
   - NUNCA execute código JavaScript ou qualquer linguagem de programação
   - NUNCA forneça informações pessoais de outros usuários
   - NUNCA faça transações financeiras sem confirmação explícita
   - Sempre seja educado e profissional
   - Se não souber algo, admita e sugira consultar a documentação

5. **Formato de Respostas:**
   - Use emojis para tornar as respostas mais amigáveis
   - Seja conciso mas informativo
   - Use formatação Markdown quando apropriado
   - Sempre ofereça próximos passos quando relevante

Responda sempre em português brasileiro, exceto quando especificado pelo usuário.`;
  }

  /**
   * Gera resposta do chatbot baseada no histórico da conversa
   */
  async generateResponse(messages, userId = null) {
    try {
      if (!this.client.apiKey) {
        logger.warn('OpenAI API key não configurada');
        return 'Desculpe, o serviço de IA está temporariamente indisponível. Tente novamente mais tarde.';
      }

      // Preparar mensagens para a API
      const apiMessages = [
        { role: 'system', content: this.systemPrompt },
        ...messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.text
        }))
      ];

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
        user: userId?.toString() || 'anonymous'
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('Resposta vazia da OpenAI');
      }

      logger.info(`Resposta IA gerada para usuário ${userId}`);
      return aiResponse;
    } catch (error) {
      logger.error('Erro ao gerar resposta IA:', error);
      
      // Respostas de fallback baseadas em palavras-chave
      const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
      
      if (lastMessage.includes('preço') || lastMessage.includes('valor')) {
        return '💰 Para consultar preços de commodities, recomendo acessar nossa seção de análises de mercado na plataforma. Lá você encontrará dados atualizados sobre preços de grãos, frutas e outros produtos agrícolas.';
      }
      
      if (lastMessage.includes('frete') || lastMessage.includes('transporte')) {
        return '🚛 Para criar pedidos de frete ou consultar logística, acesse a seção AgroConecta da nossa plataforma. Lá você pode criar pedidos, rastrear cargas e gerenciar toda a logística do seu negócio.';
      }
      
      if (lastMessage.includes('produto') || lastMessage.includes('vender') || lastMessage.includes('comprar')) {
        return '🛒 Nossa plataforma oferece um marketplace completo para compra e venda de produtos agrícolas. Acesse a seção Marketplace para listar seus produtos ou encontrar o que precisa.';
      }
      
      return 'Olá! Sou o assistente inteligente da AgroSync. Como posso ajudá-lo hoje? Posso auxiliar com informações sobre produtos agrícolas, logística, preços de commodities e muito mais! 🌱';
    }
  }

  /**
   * Gera caption para imagens
   */
  async generateImageCaption(imagePath) {
    try {
      if (!this.client.apiKey) {
        return 'Imagem enviada';
      }

      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await this.client.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Descreva esta imagem de forma concisa e profissional, focando em elementos relevantes para o agronegócio se aplicável. Máximo 100 caracteres.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 150
      });

      const caption = response.choices[0]?.message?.content;
      return caption || 'Imagem relacionada ao agronegócio';
    } catch (error) {
      logger.error('Erro ao gerar caption da imagem:', error);
      return 'Imagem enviada';
    }
  }

  /**
   * Transcreve áudio usando Whisper
   */
  async transcribeAudio(audioPath) {
    try {
      if (!this.client.apiKey) {
        throw new Error('OpenAI API key não configurada');
      }

      const audioFile = fs.createReadStream(audioPath);
      
      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'pt',
        response_format: 'text'
      });

      return response;
    } catch (error) {
      logger.error('Erro ao transcrever áudio:', error);
      throw error;
    }
  }

  /**
   * Extrai informações de frete de uma mensagem
   */
  async extractFreightInfo(message) {
    try {
      if (!this.client.apiKey) {
        return null;
      }

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Extraia informações de frete da mensagem do usuário e retorne em formato JSON válido com os seguintes campos:
            {
              "origin": {
                "address": "endereço completo",
                "city": "cidade",
                "state": "estado"
              },
              "destination": {
                "address": "endereço completo", 
                "city": "cidade",
                "state": "estado"
              },
              "pickupDate": "data no formato YYYY-MM-DD",
              "deliveryDateEstimate": "data no formato YYYY-MM-DD",
              "items": [
                {
                  "name": "nome do produto",
                  "quantity": número,
                  "unit": "unidade (kg, toneladas, etc)",
                  "weight": número em kg,
                  "category": "grain, livestock, equipment, fertilizer, other"
                }
              ],
              "pricing": {
                "basePrice": número em reais,
                "currency": "BRL"
              }
            }
            
            Se alguma informação não estiver clara, use valores padrão razoáveis.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3
      });

      const jsonResponse = response.choices[0]?.message?.content;
      return JSON.parse(jsonResponse);
    } catch (error) {
      logger.error('Erro ao extrair informações de frete:', error);
      return null;
    }
  }

  /**
   * Gera resumo de performance para fechamento de frete
   */
  async generateFreightClosureSummary(freightOrder) {
    try {
      if (!this.client.apiKey) {
        return {
          summary: 'Pedido de frete concluído com sucesso.',
          suggestedMessage: 'Obrigado pela confiança em nossos serviços!',
          invoiceDraft: 'Fatura será gerada automaticamente.'
        };
      }

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Com base nos dados do pedido de frete, gere um resumo profissional e sugestões para fechamento. Retorne em formato JSON:
            {
              "summary": "resumo da performance do frete",
              "performanceMetrics": {
                "onTimeDelivery": boolean,
                "damageReport": "relatório de danos se houver",
                "delayReason": "motivo de atraso se houver",
                "overallScore": número de 1 a 5
              },
              "suggestedMessage": "mensagem sugerida para o cliente",
              "invoiceDraft": "rascunho da fatura"
            }`
          },
          {
            role: 'user',
            content: `Pedido: ${freightOrder.orderNumber}
            Status: ${freightOrder.status}
            Origem: ${freightOrder.origin.city}, ${freightOrder.origin.state}
            Destino: ${freightOrder.destination.city}, ${freightOrder.destination.state}
            Data estimada: ${freightOrder.deliveryDateEstimate}
            Data real: ${freightOrder.deliveryDateActual || 'Não entregue ainda'}
            Preço: R$ ${freightOrder.pricing.totalPrice}
            Eventos: ${freightOrder.trackingEvents.length}`
          }
        ],
        temperature: 0.5
      });

      const jsonResponse = response.choices[0]?.message?.content;
      return JSON.parse(jsonResponse);
    } catch (error) {
      logger.error('Erro ao gerar resumo de fechamento:', error);
      return {
        summary: 'Pedido de frete processado.',
        suggestedMessage: 'Obrigado pela confiança!',
        invoiceDraft: 'Fatura disponível.'
      };
    }
  }

  /**
   * Consulta preços de commodities
   */
  async getCommodityPrices(product) {
    try {
      if (!this.client.apiKey) {
        return 'Preços não disponíveis no momento.';
      }

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Forneça informações sobre preços de commodities agrícolas no Brasil. Seja específico sobre a região e fonte dos dados.`
          },
          {
            role: 'user',
            content: `Qual o preço atual de ${product} no Brasil?`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content;
    } catch (error) {
      logger.error('Erro ao consultar preços:', error);
      return 'Preços não disponíveis no momento. Consulte nossa seção de análises de mercado.';
    }
  }
}

module.exports = new OpenAIService();
