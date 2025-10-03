const OpenAI = require('openai');
const fs = require('fs');
const logger = require('../utils/logger');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.systemPrompt = `VocÃª Ã© um assistente inteligente especializado em agronegÃ³cio da plataforma AgroSync. Suas responsabilidades incluem:

1. **Conhecimento do AgronegÃ³cio:**
   - Produtos agrÃ­colas (grÃ£os, frutas, legumes, etc.)
   - LogÃ­stica e transporte rural
   - PreÃ§os de commodities
   - Mercados agrÃ­colas
   - Tecnologia agrÃ­cola

2. **Funcionalidades da Plataforma:**
   - Marketplace de produtos agrÃ­colas
   - Sistema AgroConecta para logÃ­stica
   - Rastreamento de cargas
   - AnÃ¡lises de mercado

3. **Comandos Especiais:**
   - "criar frete" ou "criar pedido de frete" - Para criar pedidos de transporte
   - "rastrear [nÃºmero do pedido]" - Para consultar status de frete
   - "preÃ§os [produto]" - Para consultar preÃ§os de commodities

4. **Diretrizes de SeguranÃ§a:**
   - NUNCA execute cÃ³digo JavaScript ou qualquer linguagem de programaÃ§Ã£o
   - NUNCA forneÃ§a informaÃ§Ãµes pessoais de outros usuÃ¡rios
   - NUNCA faÃ§a transaÃ§Ãµes financeiras sem confirmaÃ§Ã£o explÃ­cita
   - Sempre seja educado e profissional
   - Se nÃ£o souber algo, admita e sugira consultar a documentaÃ§Ã£o

5. **Formato de Respostas:**
   - Use emojis para tornar as respostas mais amigÃ¡veis
   - Seja conciso mas informativo
   - Use formataÃ§Ã£o Markdown quando apropriado
   - Sempre ofereÃ§a prÃ³ximos passos quando relevante

Responda sempre em portuguÃªs brasileiro, exceto quando especificado pelo usuÃ¡rio.`;
  }

  /**
   * Gera resposta do chatbot baseada no histÃ³rico da conversa
   */
  async generateResponse(messages, userId = null) {
    try {
      if (!this.client.apiKey) {
        logger.warn('OpenAI API key nÃ£o configurada');
        return 'Desculpe, o serviÃ§o de IA estÃ¡ temporariamente indisponÃ­vel. Tente novamente mais tarde.';
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

      logger.info(`Resposta IA gerada para usuÃ¡rio ${userId}`);
      return aiResponse;
    } catch (error) {
      logger.error('Erro ao gerar resposta IA:', error);

      // Respostas de fallback baseadas em palavras-chave
      const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';

      if (lastMessage.includes('preÃ§o') || lastMessage.includes('valor')) {
        return 'ðŸ’° Para consultar preÃ§os de commodities, recomendo acessar nossa seÃ§Ã£o de anÃ¡lises de mercado na plataforma. LÃ¡ vocÃª encontrarÃ¡ dados atualizados sobre preÃ§os de grÃ£os, frutas e outros produtos agrÃ­colas.';
      }

      if (lastMessage.includes('frete') || lastMessage.includes('transporte')) {
        return 'ðŸš› Para criar pedidos de frete ou consultar logÃ­stica, acesse a seÃ§Ã£o AgroConecta da nossa plataforma. LÃ¡ vocÃª pode criar pedidos, rastrear cargas e gerenciar toda a logÃ­stica do seu negÃ³cio.';
      }

      if (
        lastMessage.includes('produto') ||
        lastMessage.includes('vender') ||
        lastMessage.includes('comprar')
      ) {
        return 'ðŸ›’ Nossa plataforma oferece um marketplace completo para compra e venda de produtos agrÃ­colas. Acesse a seÃ§Ã£o Marketplace para listar seus produtos ou encontrar o que precisa.';
      }

      return 'OlÃ¡! Sou o assistente inteligente da AgroSync. Como posso ajudÃ¡-lo hoje? Posso auxiliar com informaÃ§Ãµes sobre produtos agrÃ­colas, logÃ­stica, preÃ§os de commodities e muito mais! ðŸŒ±';
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
                text: 'Descreva esta imagem de forma concisa e profissional, focando em elementos relevantes para o agronegÃ³cio se aplicÃ¡vel. MÃ¡ximo 100 caracteres.'
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
      return caption || 'Imagem relacionada ao agronegÃ³cio';
    } catch (error) {
      logger.error('Erro ao gerar caption da imagem:', error);
      return 'Imagem enviada';
    }
  }

  /**
   * Transcreve Ã¡udio usando Whisper
   */
  async transcribeAudio(audioPath) {
    try {
      if (!this.client.apiKey) {
        throw new Error('OpenAI API key nÃ£o configurada');
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
      logger.error('Erro ao transcrever Ã¡udio:', error);
      throw error;
    }
  }

  /**
   * Extrai informaÃ§Ãµes de frete de uma mensagem
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
            content: `Extraia informaÃ§Ãµes de frete da mensagem do usuÃ¡rio e retorne em formato JSON vÃ¡lido com os seguintes campos:
            {
              "origin": {
                "address": "endereÃ§o completo",
                "city": "cidade",
                "state": "estado"
              },
              "destination": {
                "address": "endereÃ§o completo", 
                "city": "cidade",
                "state": "estado"
              },
              "pickupDate": "data no formato YYYY-MM-DD",
              "deliveryDateEstimate": "data no formato YYYY-MM-DD",
              "items": [
                {
                  "name": "nome do produto",
                  "quantity": nÃºmero,
                  "unit": "unidade (kg, toneladas, etc)",
                  "weight": nÃºmero em kg,
                  "category": "grain, livestock, equipment, fertilizer, other"
                }
              ],
              "pricing": {
                "basePrice": nÃºmero em reais,
                "currency": "BRL"
              }
            }
            
            Se alguma informaÃ§Ã£o nÃ£o estiver clara, use valores padrÃ£o razoÃ¡veis.`
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
      logger.error('Erro ao extrair informaÃ§Ãµes de frete:', error);
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
          summary: 'Pedido de frete concluÃ­do com sucesso.',
          suggestedMessage: 'Obrigado pela confianÃ§a em nossos serviÃ§os!',
          invoiceDraft: 'Fatura serÃ¡ gerada automaticamente.'
        };
      }

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Com base nos dados do pedido de frete, gere um resumo profissional e sugestÃµes para fechamento. Retorne em formato JSON:
            {
              "summary": "resumo da performance do frete",
              "performanceMetrics": {
                "onTimeDelivery": boolean,
                "damageReport": "relatÃ³rio de danos se houver",
                "delayReason": "motivo de atraso se houver",
                "overallScore": nÃºmero de 1 a 5
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
            Data real: ${freightOrder.deliveryDateActual || 'NÃ£o entregue ainda'}
            PreÃ§o: R$ ${freightOrder.pricing.totalPrice}
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
        suggestedMessage: 'Obrigado pela confianÃ§a!',
        invoiceDraft: 'Fatura disponÃ­vel.'
      };
    }
  }

  /**
   * Consulta preÃ§os de commodities
   */
  async getCommodityPrices(product) {
    try {
      if (!this.client.apiKey) {
        return 'PreÃ§os nÃ£o disponÃ­veis no momento.';
      }

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'ForneÃ§a informaÃ§Ãµes sobre preÃ§os de commodities agrÃ­colas no Brasil. Seja especÃ­fico sobre a regiÃ£o e fonte dos dados.'
          },
          {
            role: 'user',
            content: `Qual o preÃ§o atual de ${product} no Brasil?`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content;
    } catch (error) {
      logger.error('Erro ao consultar preÃ§os:', error);
      return 'PreÃ§os nÃ£o disponÃ­veis no momento. Consulte nossa seÃ§Ã£o de anÃ¡lises de mercado.';
    }
  }
}

module.exports = new OpenAIService();
