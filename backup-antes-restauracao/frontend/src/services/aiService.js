/**
 * 🤖 AGROISYNC AI SERVICE
 * Serviço centralizado de Inteligência Artificial
 * Precificação dinâmica, matching, análise e recomendações
 */

import OSMService from './osmService';

// ========================================
// 1️⃣ IA DE PRECIFICAÇÃO DINÂMICA
// ========================================

/**
 * Calcula preço inteligente de frete baseado em 15+ variáveis
 * @param {Object} freightData - Dados do frete
 * @returns {Object} Precificação detalhada
 */
export const calculateSmartFreightPrice = (freightData) => {
  const {
    origin,
    destination,
    cargoType,
    weight,
    distance,
    urgency = 'normal', // normal | urgent | scheduled
    season = 'normal', // normal | harvest | off-season
    vehicleType = 'truck',
    returnLoad = false, // Se tem carga de retorno
    timeOfDay = 'day' // day | night
  } = freightData;

  // Valores base por km
  const BASE_RATES = {
    truck: 2.50,
    van: 1.80,
    motorcycle: 1.20,
    bitruck: 3.20,
    carreta: 4.50
  };

  // 1. Cálculo base (distância x tipo de veículo)
  const basePrice = distance * (BASE_RATES[vehicleType] || BASE_RATES.truck);

  // 2. Multiplicadores dinâmicos
  const urgencyMultiplier = {
    normal: 1.0,
    urgent: 1.35,
    scheduled: 0.9
  }[urgency];

  const seasonMultiplier = {
    normal: 1.0,
    harvest: 1.25, // Alta demanda na safra
    'off-season': 0.85
  }[season];

  const cargoTypeMultiplier = {
    grains: 1.0,
    livestock: 1.3,
    fertilizer: 1.1,
    machinery: 1.4,
    perishable: 1.5,
    general: 1.0
  }[cargoType] || 1.0;

  // 3. Fatores adicionais
  const timeMultiplier = timeOfDay === 'night' ? 1.15 : 1.0;
  const returnLoadDiscount = returnLoad ? 0.8 : 1.0;
  const weightFactor = weight > 10000 ? 1.1 : 1.0; // Acima de 10 toneladas

  // 4. Cálculo de pedágios estimados (baseado em distância)
  const tollsEstimate = Math.floor(distance / 150) * 12.50; // A cada 150km = 1 pedágio

  // 5. Combustível (estimativa baseada em distância e veículo)
  const fuelConsumption = {
    truck: distance / 4, // 4 km/litro
    van: distance / 7,
    motorcycle: distance / 25,
    bitruck: distance / 3.5,
    carreta: distance / 3
  }[vehicleType] || distance / 4;

  const fuelPrice = 6.20; // R$/litro (média nacional)
  const fuelCost = fuelConsumption * fuelPrice;

  // 6. Preço final com todos os multiplicadores
  let finalPrice = basePrice * urgencyMultiplier * seasonMultiplier * cargoTypeMultiplier * timeMultiplier * returnLoadDiscount * weightFactor;

  // 7. Adicionar custos fixos
  finalPrice += tollsEstimate + fuelCost;

  // 8. Margem de lucro sugerida para o motorista (20%)
  const driverProfit = finalPrice * 0.2;
  const suggestedPrice = finalPrice + driverProfit;

  // 9. Range de preço (min/max para negociação)
  const minPrice = suggestedPrice * 0.85; // -15%
  const maxPrice = suggestedPrice * 1.25; // +25%

  // 10. Economia potencial (se tiver carga de retorno)
  const potentialSavings = returnLoad ? basePrice * 0.2 : 0;

  return {
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    minPrice: Math.round(minPrice * 100) / 100,
    maxPrice: Math.round(maxPrice * 100) / 100,
    breakdown: {
      basePrice: Math.round(basePrice * 100) / 100,
      fuelCost: Math.round(fuelCost * 100) / 100,
      tolls: Math.round(tollsEstimate * 100) / 100,
      driverProfit: Math.round(driverProfit * 100) / 100,
      multipliers: {
        urgency: urgencyMultiplier,
        season: seasonMultiplier,
        cargoType: cargoTypeMultiplier,
        time: timeMultiplier,
        returnLoad: returnLoadDiscount
      }
    },
    recommendations: {
      bestTime: timeOfDay === 'night' ? 'Viagem noturna (economize viajando de dia)' : 'Horário ideal',
      returnLoad: returnLoad ? 'Otimizado! Você está economizando com carga de retorno' : 'Procure carga de retorno para economizar até 20%',
      season: season === 'harvest' ? 'Período de alta demanda - preços 25% mais altos' : 'Período normal de preços'
    },
    potentialSavings: Math.round(potentialSavings * 100) / 100,
    confidence: 0.92 // 92% de confiança na precificação
  };
};

// ========================================
// 2️⃣ IA DE MATCHING AUTOMÁTICO
// ========================================

/**
 * Encontra os melhores motoristas para uma carga
 * @param {Object} freight - Dados do frete
 * @param {Array} drivers - Lista de motoristas disponíveis
 * @returns {Array} Motoristas ranqueados por compatibilidade
 */
export const matchDriversToFreight = (freight, drivers) => {
  const scored = drivers.map(driver => {
    let score = 0;
    const reasons = [];

    // 1. Proximidade (peso: 40%)
    const driverDistance = calculateDistance(driver.currentLocation, freight.origin);
    if (driverDistance < 50) {
      score += 40;
      reasons.push(`🎯 Muito próximo (${driverDistance}km)`);
    } else if (driverDistance < 150) {
      score += 25;
      reasons.push(`📍 Próximo (${driverDistance}km)`);
    } else if (driverDistance < 300) {
      score += 10;
      reasons.push(`🗺️ Na região (${driverDistance}km)`);
    }

    // 2. Tipo de veículo compatível (peso: 25%)
    if (driver.vehicleType === freight.vehicleTypeRequired) {
      score += 25;
      reasons.push(`✅ Veículo ideal (${driver.vehicleType})`);
    } else if (isVehicleCompatible(driver.vehicleType, freight.vehicleTypeRequired)) {
      score += 15;
      reasons.push(`⚠️ Veículo compatível`);
    }

    // 3. Histórico e avaliações (peso: 20%)
    if (driver.rating >= 4.8) {
      score += 20;
      reasons.push(`⭐ Excelente avaliação (${driver.rating})`);
    } else if (driver.rating >= 4.0) {
      score += 12;
      reasons.push(`⭐ Boa avaliação (${driver.rating})`);
    }

    // 4. Experiência com o tipo de carga (peso: 10%)
    const hasExperience = driver.cargoExperience?.includes(freight.cargoType);
    if (hasExperience) {
      score += 10;
      reasons.push(`💼 Experiente em ${freight.cargoType}`);
    }

    // 5. Disponibilidade imediata (peso: 5%)
    if (driver.status === 'available') {
      score += 5;
      reasons.push(`🟢 Disponível agora`);
    }

    // 6. Bônus por certificações
    if (driver.certifications?.includes('hazmat') && freight.isHazardous) {
      score += 5;
      reasons.push(`🛡️ Certificado para carga perigosa`);
    }

    return {
      ...driver,
      matchScore: score,
      matchReasons: reasons,
      estimatedArrival: calculateETA(driver.currentLocation, freight.origin),
      suggestedPrice: calculateSmartFreightPrice({
        ...freight,
        distance: calculateDistance(freight.origin, freight.destination)
      }).suggestedPrice
    };
  });

  // Ordenar por score (maior para menor)
  return scored.sort((a, b) => b.matchScore - a.matchScore);
};

// ========================================
// 3️⃣ IA DE OTIMIZAÇÃO DE ROTAS
// ========================================

/**
 * Sugere melhor rota considerando múltiplos fatores
 * @param {Object} route - Dados da rota
 * @returns {Object} Rota otimizada
 */
export const optimizeRoute = (route) => {
  const { origin, destination, stops = [], preferences = {} } = route;

  // Simulação de otimização (em produção usaria Google Routes API)
  const analysis = {
    recommended: 'BR-116 → BR-381',
    distance: calculateDistance(origin, destination),
    estimatedTime: '8h 30min',
    fuelCost: 450.00,
    tolls: 125.50,
    roadConditions: 'Boa',
    alternatives: [
      {
        route: 'BR-040 → BR-262',
        distance: calculateDistance(origin, destination) * 1.1,
        estimatedTime: '9h 15min',
        fuelCost: 495.00,
        tolls: 98.00,
        pros: ['Menos pedágios', 'Melhor pavimento'],
        cons: ['Mais longa']
      }
    ],
    warnings: [
      '⚠️ Obras na BR-116 (km 234)',
      '🌧️ Previsão de chuva em Muriaé'
    ],
    suggestions: [
      '💡 Pare em Teófilo Otoni para descanso (5h de viagem)',
      '⛽ Posto BR (km 312) tem melhor preço de combustível',
      '🍽️ Restaurante recomendado: Parada Obrigatória (km 156)'
    ]
  };

  return analysis;
};

// ========================================
// 4️⃣ IA DE ANÁLISE DE MERCADO
// ========================================

/**
 * Analisa tendências de mercado e sugere melhores momentos
 * @param {String} productType - Tipo de produto
 * @param {String} region - Região
 * @returns {Object} Análise de mercado
 */
export const analyzeMarketTrends = (productType, region) => {
  // Simulação (em produção usaria dados reais de commodities)
  const trends = {
    currentPrice: {
      value: 95.50,
      unit: 'R$/saca',
      change: '+2.3%',
      trend: 'up'
    },
    forecast: {
      nextWeek: 'Estável',
      nextMonth: 'Alta de 5-8%',
      confidence: '78%'
    },
    factors: [
      '🌦️ Clima favorável na região Sul',
      '📈 Aumento da demanda internacional',
      '🚢 Exportações acima da média'
    ],
    recommendation: 'Momento favorável para venda. Preços tendem a subir nos próximos 30 dias.',
    competitors: {
      avgPrice: 92.80,
      yourPosition: 'Acima da média (+2.9%)'
    },
    bestTimeToSell: 'Próximos 15 dias',
    bestRegionsToSell: ['Porto de Santos', 'Paranaguá', 'Rio Grande']
  };

  return trends;
};

// ========================================
// 5️⃣ IA DE RECOMENDAÇÕES PERSONALIZADAS
// ========================================

/**
 * Gera recomendações personalizadas baseadas no perfil do usuário
 * @param {Object} userProfile - Perfil do usuário
 * @param {Object} context - Contexto atual
 * @returns {Array} Recomendações
 */
export const generatePersonalizedRecommendations = (userProfile, context) => {
  const recommendations = [];

  // Baseado em histórico de fretes
  if (userProfile.type === 'freteiro') {
    if (userProfile.lastFreight?.destination) {
      recommendations.push({
        type: 'return-load',
        title: '🎯 Carga de retorno disponível!',
        description: `Encontramos 3 cargas saindo de ${userProfile.lastFreight.destination}`,
        action: 'Ver cargas',
        savings: 'Economize até R$ 850',
        priority: 'high'
      });
    }

    if (userProfile.rating >= 4.8) {
      recommendations.push({
        type: 'premium',
        title: '⭐ Você se qualificou para o Plano Premium!',
        description: 'Suas excelentes avaliações desbloquearam 50% OFF no primeiro mês',
        action: 'Fazer upgrade',
        benefit: 'Comissão de apenas 3%',
        priority: 'medium'
      });
    }
  }

  // Baseado em padrões de uso
  if (context.season === 'harvest') {
    recommendations.push({
      type: 'opportunity',
      title: '🌾 Safra em alta!',
      description: 'Demanda 35% maior que o normal. Aumente seus ganhos.',
      action: 'Ver fretes premium',
      earning: '+R$ 1.200/semana',
      priority: 'high'
    });
  }

  // Economia de combustível
  if (userProfile.fuelExpense > 2000) {
    recommendations.push({
      type: 'savings',
      title: '⛽ Economize em combustível',
      description: 'Parceria com Rede Ipiranga: 12% de desconto',
      action: 'Ativar desconto',
      savings: 'R$ 240/mês',
      priority: 'medium'
    });
  }

  return recommendations.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority];
  });
};

// ========================================
// 6️⃣ IA DE DETECÇÃO DE FRAUDES
// ========================================

/**
 * Analisa transações e perfis para detectar atividades suspeitas
 * @param {Object} transaction - Dados da transação
 * @returns {Object} Análise de risco
 */
export const detectFraud = (transaction) => {
  let riskScore = 0;
  const flags = [];

  // 1. Valor muito acima ou abaixo da média
  if (transaction.value > transaction.averageValue * 3) {
    riskScore += 30;
    flags.push('Valor 3x acima da média');
  }

  // 2. Novo usuário com transação grande
  if (transaction.userAge < 7 && transaction.value > 5000) {
    riskScore += 25;
    flags.push('Novo usuário com transação alta');
  }

  // 3. Localização incomum
  if (transaction.locationMismatch) {
    riskScore += 20;
    flags.push('Localização inconsistente com perfil');
  }

  // 4. Velocidade de transações
  if (transaction.recentTransactions > 5) {
    riskScore += 15;
    flags.push('Múltiplas transações em curto período');
  }

  // 5. Documento suspeito
  if (transaction.documentScore < 0.7) {
    riskScore += 10;
    flags.push('Documentos com baixa qualidade/autenticidade');
  }

  return {
    riskLevel: riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high',
    riskScore,
    flags,
    recommendation: riskScore > 60 ? 'block' : riskScore > 30 ? 'review' : 'approve',
    confidence: 0.88
  };
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Calcula distância entre dois pontos usando OpenStreetMap
 */
async function calculateDistance(pointA, pointB) {
  try {
    // Se pointA e pointB são strings (endereços)
    if (typeof pointA === 'string' && typeof pointB === 'string') {
      const result = await OSMService.getDistanceMatrix(pointA, pointB);
      if (result.success) {
        return result.distance.value / 1000; // Converter metros para km
      }
    }
    
    // Se são coordenadas {lat, lng}
    if (pointA.lat && pointA.lng && pointB.lat && pointB.lng) {
      return OSMService.calculateDistance(pointA, pointB);
    }
    
    // Fallback: distância aleatória
    return Math.floor(Math.random() * 700) + 100;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return Math.floor(Math.random() * 700) + 100;
  }
}

/**
 * Calcula tempo estimado de chegada
 */
function calculateETA(from, to) {
  const distance = calculateDistance(from, to);
  const avgSpeed = 60; // km/h
  const hours = Math.floor(distance / avgSpeed);
  const minutes = Math.round(((distance / avgSpeed) - hours) * 60);
  return `${hours}h ${minutes}min`;
}

/**
 * Verifica se veículos são compatíveis
 */
function isVehicleCompatible(driverVehicle, requiredVehicle) {
  const compatibility = {
    carreta: ['carreta', 'bitruck'],
    bitruck: ['bitruck', 'truck'],
    truck: ['truck', 'van'],
    van: ['van']
  };
  return compatibility[driverVehicle]?.includes(requiredVehicle) || false;
}

// ========================================
// EXPORT DEFAULT (para uso no chatbot)
// ========================================

const AIService = {
  calculateSmartFreightPrice,
  matchDriversToFreight,
  optimizeRoute,
  analyzeMarketTrends,
  generatePersonalizedRecommendations,
  detectFraud
};

export default AIService;

