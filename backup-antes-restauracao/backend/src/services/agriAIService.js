/**
 * 🌾 AGROISYNC AI - INTELIGÊNCIA AGRÍCOLA PARA PRODUTORES
 * 
 * Especializada em:
 * - Redução de custos
 * - Prevenção de perdas
 * - Aumento de rendimento
 * - Previsão climática
 * - Análise de produtividade
 */

import logger from '../utils/logger.js';

class AgriAIService {
  constructor() {
    this.systemPrompt = `Você é AGROISYNC AI - a inteligência agrícola especialista em OTIMIZAR CUSTOS, PREVENIR PERDAS e AUMENTAR O RENDIMENTO do produtor rural brasileiro.

🎯 SUA MISSÃO PRINCIPAL:
Reduzir custos e aumentar a lucratividade no campo usando tecnologia de ponta, dados climáticos e análise preditiva.

🌾 ESPECIALIDADES CORE:

**1. REDUÇÃO DE CUSTOS (Até 30%)**
- Cálculo de aplicação ótima de insumos (fertilizantes, defensivos)
- Recomendação de compra no momento ideal
- Análise de custo-benefício de maquinário
- Otimização de mão de obra
- Economia de combustível e energia

**Exemplo:**
User: "Quanto de adubo usar na soja?"
IA: "📊 Análise do solo: N-P-K 5-20-20, 300kg/ha
💰 Custo: R$ 180/ha vs R$ 250/ha (recomendação padrão)
✅ Economia: R$ 70/ha = R$ 7.000 em 100ha"

**2. PREVISÃO CLIMÁTICA E ALERTAS**
- Previsão de chuva próximos 7-15 dias
- Janela ideal de plantio
- Risco de geada/seca
- Umidade do solo estimada
- Alerta de condições adversas

**Exemplo:**
User: "Posso plantar milho semana que vem?"
IA: "⚠️ Não recomendo. Previsão: chuva forte quarta e quinta
✅ Janela ideal: 23 a 28 de outubro (5 dias sem chuva)
💧 Umidade solo: 65% (ideal: 60-70%)"

**3. ANÁLISE DE PERDAS E PREJUÍZOS**
- Estimativa de perda por pragas/doenças
- Cálculo de prejuízo evitável
- Recomendação de ações preventivas
- ROI de tratamentos
- Análise de risco por talhão

**Exemplo:**
User: "Tenho ferrugem na soja, o que faço?"
IA: "⚠️ ALERTA CRÍTICO - Ferrugem asiática detectada
📊 Estimativa de perda: 15-30% (R$ 45.000 em 100ha)
💊 Tratamento recomendado: Fungicida X + Y (R$ 8.000)
✅ Prejuízo evitável: R$ 37.000
🕐 URGENTE: Aplicar em 48-72h"

**4. SIMULADOR DE LUCRO E CUSTOS**
- Custo total da lavoura
- Projeção de produtividade
- Preço de venda esperado
- Lucro líquido estimado
- Comparativo com safra anterior

**Exemplo:**
User: "Quanto vou lucrar com soja em 100ha?"
IA: "💰 SIMULAÇÃO - Soja 100ha, MT, safra 24/25

📊 Custos:
- Sementes: R$ 18.000
- Fertilizantes: R$ 45.000
- Defensivos: R$ 28.000
- Operações: R$ 35.000
TOTAL: R$ 126.000

📈 Receita Estimada:
- Produtividade: 60 sc/ha = 6.000 sacas
- Preço: R$ 130/saca (B3 hoje)
TOTAL: R$ 780.000

✅ LUCRO LÍQUIDO: R$ 654.000 (520% ROI)"

**5. OTIMIZAÇÃO DE IRRIGAÇÃO E ÁGUA**
- Cálculo de eficiência hídrica
- Quando irrigar (economia de água e energia)
- Detecção de desperdício
- Custo de irrigação vs chuva

**6. COMPARATIVO REGIONAL**
- Produtividade vs média da região
- Custos vs média estadual
- Benchmarking com top performers
- Oportunidades de melhoria

**7. ALERTAS AUTOMÁTICOS**
- Chuva nas próximas 48h
- Janela de aplicação de defensivos
- Momento ideal de colheita
- Oportunidades de venda (preço alto)
- Riscos climáticos (geada, seca)

🎯 DIRETRIZES DE ATENDIMENTO:

**SEMPRE RESPONDA COM:**
1. Dados práticos e números reais
2. Economia ou lucro esperado (em R$)
3. Ações específicas recomendadas
4. Prazos ("nas próximas 72h", "até 15/nov")
5. Comparação: "antes vs depois" ou "com vs sem"

**FORMATO DE RESPOSTA:**
📊 Análise/Diagnóstico
💰 Impacto Financeiro
✅ Recomendação
🕐 Prazo de Ação

**QUANDO USUÁRIO PERGUNTAR:**

→ **Clima:** Dê previsão + janela ideal + risco
→ **Custo:** Calcule + mostre economia + sugira otimização
→ **Plantio:** Analise solo + clima + época + ROI esperado
→ **Pragas:** Identifique + prejuízo + tratamento + custo
→ **Lucro:** Simule completo (custo + receita + lucro líquido)

**PROIBIDO:**
- Dar recomendações genéricas sem números
- Inventar dados - use "estimativa baseada em X"
- Ignorar contexto regional (MT ≠ PR ≠ RS)
- Esquecer de mencionar economia ou lucro

🌍 CONTEXTO BRASILEIRO:

**Principais Estados Agrícolas:**
- MT (Mato Grosso): Soja, Milho, Algodão - Cerrado
- PR (Paraná): Soja, Milho, Trigo - Subtropical
- RS (Rio Grande do Sul): Arroz, Soja, Trigo - Pampa
- GO (Goiás): Soja, Milho, Sorgo - Cerrado
- MS (Mato Grosso do Sul): Soja, Milho, Gado
- BA (Bahia): Soja, Algodão, Café - Oeste baiano

**Épocas de Plantio:**
- Soja: Setembro a Dezembro
- Milho 1ª safra: Agosto a Novembro
- Milho 2ª safra (safrinha): Janeiro a Março
- Algodão: Dezembro a Janeiro

**Preços Atuais (Referência B3/CEPEA):**
- Soja: R$ 120-140/saca (60kg)
- Milho: R$ 60-75/saca
- Café arábica: R$ 1.200-1.500/saca
- Boi gordo: R$ 280-320/@

**Custos Médios:**
- Soja: R$ 3.500-4.500/ha
- Milho: R$ 2.800-3.800/ha
- Algodão: R$ 8.000-12.000/ha

Responda SEMPRE focando em ECONOMIA e LUCRO para o produtor.`;
  }

  /**
   * Calcula redução de custos com IA
   */
  calculateCostReduction(culture, area, currentCost) {
    const optimizations = {
      fertilizers: 0.15, // 15% economia
      defensives: 0.20,  // 20% economia
      fuel: 0.10,        // 10% economia
      water: 0.25        // 25% economia (irrigação)
    };

    const totalReduction = currentCost * 0.30; // Até 30% total
    
    return {
      current: currentCost,
      optimized: currentCost - totalReduction,
      savings: totalReduction,
      savingsPerHa: totalReduction / area,
      percentage: 30
    };
  }

  /**
   * Simula lucro da safra
   */
  simulateProfit(culture, area, productivity) {
    const prices = {
      soja: 130,      // R$/saca
      milho: 67,      // R$/saca
      algodao: 180,   // R$/@
      cafe: 1350      // R$/saca
    };

    const costs = {
      soja: 4000,     // R$/ha
      milho: 3200,    // R$/ha
      algodao: 10000, // R$/ha
      cafe: 12000     // R$/ha
    };

    const price = prices[culture.toLowerCase()] || 100;
    const costPerHa = costs[culture.toLowerCase()] || 3500;

    const totalCost = costPerHa * area;
    const totalProduction = productivity * area; // sacas ou @
    const totalRevenue = totalProduction * price;
    const profit = totalRevenue - totalCost;
    const roi = ((profit / totalCost) * 100).toFixed(1);

    return {
      costs: {
        perHa: costPerHa,
        total: totalCost
      },
      revenue: {
        production: totalProduction,
        pricePerUnit: price,
        total: totalRevenue
      },
      profit: {
        total: profit,
        perHa: profit / area,
        roi: parseFloat(roi)
      }
    };
  }

  /**
   * Análise de risco climático
   */
  analyzeClimaticRisk(region, culture, plantDate) {
    // Simulação de risco baseado em padrões históricos
    const risks = {
      MT: { drought: 0.3, frost: 0.05, excess_rain: 0.2 },
      PR: { drought: 0.15, frost: 0.25, excess_rain: 0.3 },
      RS: { drought: 0.2, frost: 0.35, excess_rain: 0.25 },
      GO: { drought: 0.35, frost: 0.02, excess_rain: 0.15 },
      MS: { drought: 0.25, frost: 0.10, excess_rain: 0.20 }
    };

    const regionRisk = risks[region] || { drought: 0.2, frost: 0.15, excess_rain: 0.2 };

    return {
      region,
      culture,
      risks: regionRisk,
      recommendation: regionRisk.drought > 0.3 ? 'Considere irrigação' : 
                     regionRisk.frost > 0.3 ? 'Atenção a geadas' :
                     'Condições favoráveis'
    };
  }

  /**
   * Gera resposta especializada do chatbot
   */
  async generateResponse(env, messages, userId = null, mode = 'general', userPlan = 'free', isAdmin = false) {
    try {
      if (!env || !env.AI) {
        logger.warn('Cloudflare AI não disponível');
        return this.getFallbackResponse(mode);
      }

      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || msg.message || ''
      }));

      const aiMessages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory
      ];

      // Adicionar contexto do plano do usuário
      const planContext = `\n\n[CONTEXTO DO USUÁRIO: Plano ${userPlan.toUpperCase()}, ${isAdmin ? 'ADMIN' : 'USER'}]`;
      if (aiMessages.length > 0) {
        aiMessages[aiMessages.length - 1].content += planContext;
      }

      const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages: aiMessages,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9
      });

      const aiResponse = response.response || response.result?.response || response.text;

      if (!aiResponse || aiResponse.trim() === '') {
        return this.getFallbackResponse(mode);
      }

      logger.info(`✅ IA Agrícola - User: ${userId}, Plan: ${userPlan}, Mode: ${mode}`);
      return aiResponse.trim();

    } catch (error) {
      logger.error('❌ Erro IA:', error);
      return this.getFallbackResponse(mode);
    }
  }

  /**
   * Detecta intenção especializada para agricultura
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    const intents = {
      // Custos e Economia (PRIORIDADE #1)
      reduce_costs: ['reduzir custo', 'economizar', 'gastar menos', 'otimizar gasto', 'baratear'],
      calculate_input: ['quanto de adubo', 'quantidade de fertilizante', 'dose de', 'aplicação de'],
      
      // Clima e Plantio (PRIORIDADE #2)
      weather_forecast: ['previsão', 'vai chover', 'clima', 'tempo', 'chuva'],
      planting_window: ['quando plantar', 'melhor época', 'janela de plantio', 'posso plantar'],
      
      // Análise de Produtividade
      yield_prediction: ['quanto vou colher', 'produtividade', 'quantas sacas', 'estimativa de safra'],
      profit_simulation: ['lucro', 'quanto vou ganhar', 'vale a pena', 'roi', 'retorno'],
      
      // Problemas e Perdas
      pest_disease: ['praga', 'doença', 'ferrugem', 'lagarta', 'pulgão', 'fungo'],
      loss_analysis: ['perda', 'prejuízo', 'quanto vou perder', 'dano'],
      
      // Irrigação
      irrigation: ['irrigação', 'regar', 'água', 'quanto molhar', 'pivot'],
      
      // Comparação e Benchmarking
      regional_comparison: ['média da região', 'comparar', 'benchmark', 'como estou'],
      
      // Fretes e Logística
      freight_calc: ['frete', 'transporte', 'quanto custa levar', 'logística'],
      
      // Mercado
      market_price: ['preço', 'cotação', 'quanto está', 'valor'],
      best_time_sell: ['quando vender', 'melhor momento', 'preço vai subir']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  /**
   * Resposta inteligente com cálculos automáticos
   */
  getSmartResponse(message, intent, userId, userPlan = 'free') {
    const lowerMessage = message.toLowerCase();

    // Simulação de lucro
    if (intent === 'profit_simulation' || lowerMessage.includes('lucro') || lowerMessage.includes('quanto vou ganhar')) {
      const areaMatch = lowerMessage.match(/(\d+)\s*ha/i);
      const area = areaMatch ? parseInt(areaMatch[1]) : 100;
      
      const cultureMatch = lowerMessage.match(/soja|milho|algodão|café/i);
      const culture = cultureMatch ? cultureMatch[0].toLowerCase() : 'soja';
      
      const prodMatch = lowerMessage.match(/(\d+)\s*sc/i);
      const productivity = prodMatch ? parseInt(prodMatch[1]) : 60; // sacas/ha

      const simulation = this.simulateProfit(culture, area, productivity);

      return `💰 **SIMULAÇÃO DE LUCRO - ${culture.toUpperCase()} (${area} hectares)**

📊 **CUSTOS TOTAIS:**
- Por hectare: R$ ${simulation.costs.perHa.toLocaleString('pt-BR')}
- Total ${area}ha: R$ ${simulation.costs.total.toLocaleString('pt-BR')}

📈 **RECEITA ESTIMADA:**
- Produtividade: ${productivity} sc/ha = ${simulation.revenue.production.toLocaleString('pt-BR')} sacas
- Preço atual: R$ ${simulation.revenue.pricePerUnit}/saca (B3)
- Receita total: R$ ${simulation.revenue.total.toLocaleString('pt-BR')}

✅ **LUCRO LÍQUIDO PREVISTO:**
- Total: R$ ${simulation.profit.total.toLocaleString('pt-BR')}
- Por hectare: R$ ${simulation.profit.perHa.toLocaleString('pt-BR')}/ha
- ROI: ${simulation.profit.roi}%

💡 **DICA:**${userPlan === 'free' ? ' Assine o plano PRO (R$ 19,90) para análises avançadas!' : ' Use o dashboard para acompanhar em tempo real!'}

Quer ver como reduzir custos em 30%?`;
    }

    // Redução de custos
    if (intent === 'reduce_costs' || lowerMessage.includes('economizar')) {
      const areaMatch = lowerMessage.match(/(\d+)\s*ha/i);
      const area = areaMatch ? parseInt(areaMatch[1]) : 100;
      const currentCost = area * 4000; // R$ 4.000/ha médio

      const reduction = this.calculateCostReduction('soja', area, currentCost);

      return `💰 **ANÁLISE DE REDUÇÃO DE CUSTOS - ${area}ha**

📊 **SITUAÇÃO ATUAL:**
- Custo total: R$ ${reduction.current.toLocaleString('pt-BR')}
- Custo/ha: R$ ${(reduction.current / area).toLocaleString('pt-BR')}

✅ **COM OTIMIZAÇÃO IA:**
- Custo otimizado: R$ ${reduction.optimized.toLocaleString('pt-BR')}
- **ECONOMIA: R$ ${reduction.savings.toLocaleString('pt-BR')} (${reduction.percentage}%)**
- Economia/ha: R$ ${reduction.savingsPerHa.toLocaleString('pt-BR')}

🎯 **COMO ECONOMIZAR:**
1. **Fertilizantes (15%):** Dose precisa por talhão (análise de solo)
2. **Defensivos (20%):** Aplicação apenas onde necessário (drone/IA)
3. **Combustível (10%):** Otimização de rotas e operações
4. **Irrigação (25%):** Apenas quando necessário (sensores)

${userPlan === 'free' ? '💎 **Plano Enterprise:** Economia de R$ ' + reduction.savings.toLocaleString('pt-BR') + ' paga o plano por 15 anos!' : '✅ Continue usando nossas recomendações para máxima economia!'}

Quer detalhes de alguma otimização específica?`;
    }

    return null; // Deixa a IA processar
  }

  /**
   * Resposta de fallback
   */
  getFallbackResponse(mode = 'general') {
    const fallbacks = {
      general: `🌾 **AGROISYNC AI - Inteligência Agrícola**

Como posso ajudar a **REDUZIR CUSTOS** e **AUMENTAR LUCROS** na sua propriedade?

💰 **Principais Funcionalidades:**

📊 **Análise de Custos:** "Como economizar em insumos?"
📈 **Simulação de Lucro:** "Quanto vou lucrar com soja em 100ha?"
🌤️ **Previsão Climática:** "Vai chover essa semana?"
⚠️ **Alertas de Perdas:** "Como evitar prejuízo com pragas?"
💧 **Otimização de Irrigação:** "Quando devo irrigar?"
📊 **Comparativo Regional:** "Estou acima da média?"

💎 **Planos:**
- 🆓 Gratuito: Previsões básicas
- 💼 Pro (R$ 19,90): IA personalizada + análises semanais
- 🏢 Enterprise (R$ 499,90): Redução máxima de custos

Digite sua dúvida!`,

      agriculture: `🌾 **Especialista em Agricultura de Precisão**

Posso ajudar com:
- Cálculo de aplicação de insumos
- Análise de solo e recomendação NPK
- Controle de pragas e doenças
- Janela de plantio ideal
- Estimativa de produtividade
- Redução de custos operacionais

O que você precisa otimizar?`,

      commerce: `💼 **Consultoria Comercial Agrícola**

Como posso ajudar:
- Melhor momento para vender
- Preço justo do seu produto
- Análise de mercado
- Tendências de commodity
- Simulação de lucro
- Estratégia de comercialização

Sobre qual produto quer falar?`
    };

    return fallbacks[mode] || fallbacks.general;
  }
}

export default AgriAIService;

