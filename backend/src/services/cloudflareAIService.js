/**
 * 🤖 CLOUDFLARE AI SERVICE - IA GRÁTIS E MUNDIAL
 * 
 * Serviço de IA usando Cloudflare AI Workers
 * - GRÁTIS (sem custo de API)
 * - Global (funciona no mundo todo)
 * - Rápido (edge computing)
 * - Modelo: Llama 2 7B (Meta)
 */

import logger from '../utils/logger.js';

class CloudflareAIService {
  constructor() {
    this.systemPrompt = `Você é AGROISYNC AI, a inteligência agrícola especialista em OTIMIZAR CUSTOS, PREVENIR PERDAS e AUMENTAR O RENDIMENTO do produtor rural brasileiro.

🎯 SUA MISSÃO: Reduzir custos e aumentar a lucratividade no campo usando tecnologia de ponta.

🎯 SEU FOCO PRINCIPAL: AJUDAR USUÁRIOS A USAR A PLATAFORMA AGROISYNC

🚛 ESPECIALIDADE #1 - SISTEMA DE FRETES AGROISYNC:

**Como funciona:**
- Produtores/vendedores publicam fretes
- IA calcula automaticamente: preço justo, tempo estimado, rota otimizada
- Matching inteligente entre carga e transportador
- Rastreamento GPS em tempo real
- Pagamento seguro (só libera quando entregar)

**Cálculo Automático de Frete por IA:**
1. Origem e destino (cidade e estado)
2. Tipo de carga (grãos, gado, máquinas, etc.)
3. Peso em toneladas
4. IA calcula: distância, tempo, custo de combustível, pedágios
5. Sugere preço justo baseado no mercado

**Exemplo prático:**
"Quero transportar 10 toneladas de soja de Sorriso/MT para Santos/SP"
→ IA responde: "Rota otimizada: 2.100 km, 3-4 dias, preço sugerido: R$ 8.500 a R$ 10.200"

🌾 ESPECIALIDADE #2 - MARKETPLACE DE PRODUTOS AGRÍCOLAS:

**Produtos do AGROISYNC:**
- Grãos (soja, milho, café, algodão, trigo, arroz, feijão)
- Pecuária (gado, suínos, aves, peixes)
- Frutas e hortaliças
- Insumos (fertilizantes, sementes, defensivos)
- Máquinas agrícolas

**IA ajuda com:**
- Sugerir preço de venda baseado no mercado (B3, CEPEA)
- Encontrar compradores próximos
- Recomendar produtos semelhantes
- Alertas de oportunidades de compra/venda

💡 ESPECIALIDADE #3 - COTAÇÕES E CÁLCULOS AUTOMÁTICOS:

**IA calcula TUDO automaticamente:**

**Para Fretes:**
- Distância exata entre cidades
- Tempo estimado de viagem
- Custo de combustível (diesel atual)
- Pedágios na rota
- Desgaste do veículo
- Margem de lucro do freteiro
→ **Preço final sugerido**

**Para Produtos:**
- Preço médio da região
- Histórico de preços (30, 60, 90 dias)
- Tendência de alta/baixa
- Comparação com concorrentes
- Sazonalidade
→ **Preço competitivo sugerido**

**Exemplo real:**
User: "Quanto cobrar para levar 15 ton de milho de Dourados/MS para Curitiba/PR?"
IA: "📊 Análise: 450 km, 7-8h viagem, diesel ~R$ 850, pedágio R$ 120, desgaste R$ 200
💰 Preço sugerido: R$ 3.200 a R$ 3.800 (margem 25-35%)"

🔗 ESPECIALIDADE #4 - MATCHING INTELIGENTE:

**IA conecta automaticamente:**
- Produtor que quer vender → Comprador que quer comprar
- Carga que precisa ser transportada → Caminhoneiro disponível na rota
- Oferta de soja em MT → Demanda de soja em SP
- Caminhão voltando vazio → Carga disponível no caminho de volta

**Notificações Inteligentes:**
"🎯 Encontramos um comprador de soja a 50km de você, interessado em 20 toneladas!"
"🚛 Caminhoneiro disponível na sua rota SP→RJ, preço 15% abaixo da média!"

📊 ESPECIALIDADE #5 - DASHBOARD E ANALYTICS:

**IA analisa seus dados e mostra:**
- Melhor horário para publicar anúncios
- Produtos com maior demanda na sua região
- Rotas de frete mais rentáveis
- Previsão de vendas para próximo mês
- Comparação com concorrentes
- Sugestões de melhoria

💰 PLANOS AGROISYNC (sempre mencione quando relevante):

**🆓 GRATUITO (R$ 0):**
- 2 fretes + 2 produtos GRÁTIS por mês
- Chat básico
- Cotações manuais

**🌱 Inicial (R$ 9,90/mês):**
- 10 fretes + 10 produtos
- IA para cotações
- WhatsApp notifications

**💼 Profissional (R$ 19,90/mês)** ⭐ MAIS VENDIDO
- 50 fretes + 50 produtos
- IA avançada para TUDO
- Otimização de rotas automática
- Matching inteligente
- Analytics completo

**🏢 Empresarial (R$ 79,90/mês):**
- 200 fretes + 200 produtos
- API para integração ERP
- Gerente de conta
- Consultoria mensal

**💎 Premium (R$ 249,90/mês):**
- FRETES E PRODUTOS ILIMITADOS
- IA Premium dedicada
- Consultoria semanal
- White-label

**🏬 Loja Ilimitada (R$ 499,90/mês):**
- TUDO ILIMITADO
- Domínio próprio
- Equipe ilimitada
- Desenvolvimento customizado

🚀 COMANDOS ESPECIAIS QUE VOCÊ ENTENDE:

**Cotação de Frete:**
"Quanto custa frete de [cidade] para [cidade]?"
"Calcule frete de [X] toneladas de [produto]"
→ IA calcula e responde automaticamente

**Precificação de Produto:**
"Quanto cobrar por soja?"
"Preço justo para milho em MT?"
→ IA consulta mercado e sugere preço

**Criar Anúncio:**
"Quero vender soja"
"Como anunciar meu produto?"
→ IA guia passo a passo

**Buscar Frete:**
"Preciso de caminhão para SP"
"Transportador disponível?"
→ IA mostra opções disponíveis

**Análise de Oportunidade:**
"Vale a pena vender agora?"
"Melhor época para comprar fertilizante?"
→ IA analisa mercado e responde

🎯 DIRETRIZES DE ATENDIMENTO:

**SEMPRE:**
- Foque em como a PLATAFORMA AGROISYNC resolve o problema do usuário
- Mencione funcionalidades específicas: "Use nosso sistema de cotação automática"
- Sugira ações na plataforma: "Vá em Fretes > Novo Frete"
- Seja PRÁTICO e OBJETIVO
- Use emojis relevantes (🚛 🌾 💰 📊)
- Máximo 250 palavras por resposta

**QUANDO USUÁRIO PERGUNTAR SOBRE FRETE:**
1. Calcule ou estime valores baseado em: distância, peso, tipo de carga
2. Explique como criar frete na plataforma
3. Mencione que a IA calcula automaticamente
4. Sugira usar o plano Profissional se precisar de mais fretes

**QUANDO USUÁRIO PERGUNTAR SOBRE PRODUTO:**
1. Ajude a precificar baseado no mercado
2. Explique como anunciar na plataforma
3. Sugira categorias corretas
4. Mencione limite do plano atual

**QUANDO USUÁRIO PERGUNTAR SOBRE COTAÇÕES:**
1. Forneça preços aproximados da B3/CEPEA quando possível
2. Indique tendências (alta/baixa)
3. Sugira melhor momento para compra/venda
4. Mostre análise de oportunidade

**PROIBIDO:**
- Inventar preços específicos - use "entre R$ X e R$ Y baseado no mercado"
- Executar código ou comandos
- Compartilhar dados pessoais
- Prometer funcionalidades que não existem

🌍 CONTEXTO:

- **Foco primário:** Brasil (MT, PR, GO, RS, MS, BA - estados agrícolas)
- **Idiomas:** PT-BR (principal), EN, ES, ZH
- **Moeda:** R$ (Real brasileiro)
- **Unidades:** Toneladas, Sacas (60kg), Arrobas (@)

Responda SEMPRE em português brasileiro, exceto quando o usuário perguntar explicitamente em outro idioma.`;
  }

  /**
   * Gera resposta do chatbot usando Cloudflare AI Workers
   * Com limitações por plano
   */
  async generateResponse(env, messages, userId = null, mode = 'general', userPlan = 'free', isAdmin = false) {
    try {
      // Verificar se Cloudflare AI está disponível
      if (!env || !env.AI) {
        logger.warn('Cloudflare AI não está disponível neste ambiente');
        return this.getFallbackResponse(mode);
      }

      // Preparar histórico de mensagens
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || msg.message || ''
      }));

      // Adicionar prompt do sistema
      const aiMessages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory
      ];

      // Chamar Cloudflare AI Workers (Llama 2 - Meta)
      const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages: aiMessages,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9
      });

      const aiResponse = response.response || response.result?.response || response.text;

      if (!aiResponse || aiResponse.trim() === '') {
        logger.warn('IA retornou resposta vazia');
        return this.getFallbackResponse(mode);
      }

      logger.info(`✅ Resposta IA gerada (Cloudflare AI) para usuário ${userId || 'anônimo'}`);
      return aiResponse.trim();

    } catch (error) {
      logger.error('❌ Erro ao gerar resposta IA:', error);
      return this.getFallbackResponse(mode);
    }
  }

  /**
   * Gera resposta inteligente baseada em contexto (sem chamar IA quando não precisa)
   */
  getSmartResponse(message, intent, userId) {
    const lowerMessage = message.toLowerCase();
    
    // Cotação de frete com cálculo automático
    if (intent === 'calculate_freight') {
      // Tentar extrair cidades da mensagem
      const match = lowerMessage.match(/de\s+(\w+)[,\/]?(\w{2})\s+para\s+(\w+)[,\/]?(\w{2})/i);
      if (match) {
        const [_, originCity, originState, destCity, destState] = match;
        const weightMatch = lowerMessage.match(/(\d+)\s*(ton|toneladas|t)/i);
        const weight = weightMatch ? parseInt(weightMatch[1]) : 10;
        
        const calc = this.calculateFreightPrice(originCity, originState, destCity, destState, weight, 'grains');
        
        return `🚛 **Cotação de Frete ${originCity}/${originState} → ${destCity}/${destState}**

📏 Distância: ~${calc.distance} km
⏱️ Tempo estimado: ${calc.estimatedDays}-${calc.estimatedDays + 1} dias
⚖️ Peso: ${weight} toneladas

💰 **Preço Sugerido:**
- Mínimo: R$ ${calc.minPrice.toLocaleString('pt-BR')}
- Máximo: R$ ${calc.maxPrice.toLocaleString('pt-BR')}
- Recomendado: R$ ${calc.suggestedPrice.toLocaleString('pt-BR')}

✅ **Próximo Passo:**
1. Acesse **Fretes** > **Novo Frete**
2. Preencha origem e destino
3. Use o preço sugerido
4. Publique!

💡 Nossa IA já calcula tudo automaticamente quando você cria o frete!`;
      }
    }
    
    return null; // Deixa a IA processar
  }

  /**
   * Resposta de fallback quando IA não está disponível
   */
  getFallbackResponse(mode = 'general') {
    const fallbacks = {
      general: `Olá! 👋 Sou a AGROISYNC AI, sua assistente especializada em **FRETES** e **AGRONEGÓCIO**!

Como posso ajudar você hoje?

📦 **Marketplace:** Compre e venda produtos agrícolas
🚛 **Fretes:** Encontre transportadores confiáveis
💰 **Planos:** Conheça nossos planos a partir de R$ 0,00
₿ **Criptos:** Trade e invista em AgroToken
📊 **Dashboard:** Gerencie seus negócios

Digite sua dúvida ou escolha uma opção acima!`,

      agriculture: `🌾 **Especialista em Agricultura**

Posso ajudar com:
- Cultivo de grãos (soja, milho, trigo, arroz)
- Manejo de safras
- Controle de pragas
- Adubação e fertilização
- Calendário agrícola
- Melhores práticas de plantio

O que você gostaria de saber?`,

      commerce: `💼 **Especialista em Comércio Agrícola**

Posso ajudar com:
- Compra e venda de produtos
- Negociação de preços
- Logística e frete
- Pagamentos seguros
- Marketing de produtos
- Análise de mercado

Como posso ajudar no seu negócio?`,

      support: `🆘 **Suporte AGROISYNC**

Como posso ajudar?

📞 **Contatos:**
- Email: suporte@agroisync.com
- WhatsApp: Em breve
- Horário: Seg-Sex, 8h-18h

🔍 **Dúvidas Comuns:**
- Como criar um anúncio?
- Como solicitar um frete?
- Como funciona o pagamento?
- Quais são os planos?

Digite sua dúvida!`
    };

    return fallbacks[mode] || fallbacks.general;
  }

  /**
   * Gera descrição de imagem (usando Cloudflare AI Vision)
   */
  async generateImageCaption(env, imageUrl) {
    try {
      if (!env || !env.AI) {
        return 'Imagem enviada pelo usuário';
      }

      // Usar modelo de visão da Cloudflare
      const response = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
        image: imageUrl,
        prompt: 'Descreva esta imagem em português brasileiro, focando em elementos relacionados ao agronegócio.',
        max_tokens: 100
      });

      return response.description || response.text || 'Imagem enviada pelo usuário';

    } catch (error) {
      logger.error('Erro ao gerar descrição de imagem:', error);
      return 'Imagem enviada pelo usuário';
    }
  }

  /**
   * Análise de sentimento da mensagem
   */
  analyzeSentiment(message) {
    const positiveWords = ['obrigado', 'agradeço', 'excelente', 'ótimo', 'bom', 'perfeito', 'legal'];
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'problema', 'erro', 'bug', 'não funciona'];

    const lowerMessage = message.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerMessage.includes(word));
    const hasNegative = negativeWords.some(word => lowerMessage.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  /**
   * Detecta intenção do usuário - SUPER ESPECÍFICO PARA AGROISYNC
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    const intents = {
      // Fretes (PRIORIDADE #1)
      calculate_freight: ['calcular frete', 'quanto custa frete', 'preço de frete', 'quanto cobrar frete', 'cotação frete', 'simular frete'],
      create_freight: ['criar frete', 'novo frete', 'publicar frete', 'anunciar frete', 'cadastrar frete'],
      search_freight: ['procurar frete', 'buscar frete', 'encontrar caminhão', 'preciso transportar'],
      
      // Produtos (PRIORIDADE #2)
      price_product: ['preço', 'quanto vale', 'cotação', 'quanto cobrar', 'valor de mercado'],
      create_product: ['anunciar', 'vender', 'cadastrar produto', 'novo produto', 'publicar produto'],
      search_product: ['comprar', 'procurar produto', 'buscar', 'quero comprar', 'onde encontrar'],
      
      // Plataforma
      how_to_use: ['como usar', 'como funciona', 'tutorial', 'ensinar', 'passo a passo'],
      plans: ['plano', 'assinar', 'upgrade', 'quanto custa o plano', 'gratuito', 'free'],
      
      // Logística e otimização
      optimize_route: ['melhor rota', 'otimizar rota', 'caminho mais rápido', 'rota mais barata'],
      
      // Criptomoedas
      crypto: ['cripto', 'bitcoin', 'agrotoken', 'carteira', 'wallet', 'metamask'],
      
      // Mercado
      market_analysis: ['análise de mercado', 'tendência', 'vai subir', 'vai cair', 'melhor época'],
      
      // Suporte
      help: ['ajuda', 'help', 'problema', 'erro', 'não funciona', 'suporte']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }
  
  /**
   * Calcula frete automaticamente (IA simulada com lógica real)
   */
  calculateFreightPrice(originCity, originState, destCity, destState, weight, cargoType) {
    // Distâncias aproximadas entre capitais (em km)
    const distances = {
      'SP-RJ': 430, 'SP-MG': 600, 'SP-PR': 400, 'SP-SC': 500, 'SP-RS': 1100,
      'MG-RJ': 430, 'MG-SP': 600, 'MG-BA': 1200,
      'PR-SC': 300, 'PR-RS': 700, 'PR-SP': 400,
      'MT-SP': 1700, 'MT-GO': 800, 'MT-MS': 700,
      'GO-SP': 900, 'GO-MG': 800, 'GO-DF': 200,
      'MS-SP': 1000, 'MS-PR': 700
    };
    
    const route = `${originState}-${destState}`;
    let distance = distances[route] || distances[`${destState}-${originState}`] || 800;
    
    // Ajustes baseados no tipo de carga
    const cargoMultipliers = {
      'grains': 1.0,      // Grãos - padrão
      'livestock': 1.3,   // Gado vivo - mais cuidado
      'fruits': 1.2,      // Frutas - refrigeração
      'machinery': 1.5,   // Máquinas - carga pesada
      'fertilizers': 1.1, // Fertilizantes
      'general': 1.0
    };
    
    const multiplier = cargoMultipliers[cargoType] || 1.0;
    
    // Cálculo do preço
    const dieselCostPerKm = 2.5; // R$ por km (diesel + manutenção)
    const baseCost = distance * dieselCostPerKm;
    const weightFactor = weight / 10; // Ajuste por peso
    const margin = 1.3; // 30% margem
    
    const estimatedPrice = (baseCost + (weightFactor * 100)) * multiplier * margin;
    const minPrice = estimatedPrice * 0.85;
    const maxPrice = estimatedPrice * 1.15;
    
    const days = Math.ceil(distance / 600); // ~600km por dia
    
    return {
      distance,
      estimatedDays: days,
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      suggestedPrice: Math.round(estimatedPrice)
    };
  }

  /**
   * Resposta rápida baseada em intenção (sem IA)
   */
  getQuickResponse(intent) {
    const responses = {
      create_freight: `🚛 **Como Criar Frete no AGROISYNC**

**Passo a Passo:**
1. Acesse **Fretes** no menu superior
2. Clique em **"Novo Frete"** (botão verde)
3. Preencha os dados:
   - 📍 Origem: Cidade e Estado
   - 📍 Destino: Cidade e Estado
   - 📦 Tipo de carga: Grãos, Gado, Máquinas, etc.
   - ⚖️ Peso: Em toneladas ou kg
   - 📅 Data de coleta

4. **IA calcula automaticamente:**
   - Distância exata
   - Tempo estimado
   - Preço justo (baseado no mercado)

5. Revise e publique!

💡 **Dica PRO:** Precisa calcular antes? Me diga:
"Quanto custa frete de [cidade] para [cidade] com [X] toneladas?"

🎁 **Plano Gratuito:** 2 fretes grátis/mês
⭐ **Profissional:** 50 fretes + IA avançada

Quer calcular um frete agora?`,

      create_product: `📦 **Como Anunciar Produto no AGROISYNC**

**Passo a Passo:**
1. Acesse **Marketplace** no menu
2. Clique em **"Anunciar Produto"** (botão verde)
3. Preencha os dados:
   - 📸 Fotos do produto (até 10 fotos)
   - 📝 Título e descrição
   - 🏷️ Categoria (Grãos, Frutas, Gado, etc.)
   - 💰 Preço (nossa IA sugere baseado no mercado!)
   - 📦 Quantidade e unidade (kg, ton, saca, @)
   - 📍 Localização (cidade e estado)

4. **IA ajuda você:**
   - Sugere preço justo baseado na B3/CEPEA
   - Recomenda categoria correta
   - Otimiza descrição para SEO
   - Encontra compradores próximos

5. Publique e venda!

💡 **Precificação Inteligente:**
Me diga: "Quanto vale soja em MT?" ou "Preço de café em MG?"
E eu te dou a cotação atualizada!

🎁 **Planos:**
- Gratuito: 2 produtos
- Inicial: 10 produtos (R$ 9,90)
- Profissional: 50 produtos + IA (R$ 19,90) ⭐

Quer que eu sugira um preço para seu produto?`,

      search_product: `🛒 **Comprar Produtos**

Para comprar:
1. Acesse **Marketplace**
2. Use os filtros (categoria, localização, preço)
3. Veja os produtos disponíveis
4. Clique para ver detalhes
5. Inicie o chat com o vendedor
6. Feche o negócio!

🔍 O que você está procurando?`,

      pricing: `💰 **Preços e Cotações**

Oferecemos:
- Cotações em tempo real da B3
- Preços históricos (até 1 ano)
- Previsão de preços com IA
- Comparação regional
- Alertas de preço

📊 **Principais Commodities:**
- Soja, Milho, Café, Algodão, Boi Gordo

Qual commodity você quer consultar?`,

      plans: `💎 **Planos AGROISYNC**

🆓 **GRATUITO - R$ 0**
- 2 fretes + 2 produtos GRÁTIS

🌱 **Inicial - R$ 9,90**
- 10 fretes + 10 produtos

💼 **Profissional - R$ 19,90** ⭐ MAIS POPULAR
- 50 fretes + 50 produtos + IA

🏢 **Empresarial - R$ 79,90**
- 200 fretes + 200 produtos + API

💎 **Premium - R$ 249,90**
- ILIMITADO + Consultoria

🏬 **Loja Ilimitada - R$ 499,90**
- TUDO ILIMITADO + Domínio próprio

Qual plano te interessa?`,

      crypto: `₿ **Criptomoedas AGROISYNC**

**AgroToken (AGT):**
- Nossa própria criptomoeda
- Cashback em compras
- Stake para ganhar juros
- Trade com outras criptos

**Corretora Integrada:**
- Bitcoin (BTC)
- Ethereum (ETH)
- USDT (Tether)
- E mais!

**Como Usar:**
1. Conecte sua carteira (MetaMask)
2. Faça KYC (verificação)
3. Compre AgroToken
4. Use na plataforma ou faça trade

Quer conectar sua carteira?`,

      help: `🆘 **Como posso ajudar?**

**Tutoriais Rápidos:**
1. Como vender produtos
2. Como solicitar fretes
3. Como comprar
4. Como funciona o pagamento
5. Quais são os planos
6. Como usar criptomoedas

**Suporte:**
- Email: suporte@agroisync.com
- WhatsApp: (em breve)
- Horário: Seg-Sex, 8h-18h

Digite o número do tutorial ou sua dúvida!`
    };

    return responses[intent] || null;
  }
}

export default CloudflareAIService;

