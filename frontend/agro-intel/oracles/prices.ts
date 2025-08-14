/**
 * Módulo de preços de tokens - Implementação mock
 * Em produção, seria conectado a APIs de preços reais
 */

/**
 * Obtém o preço atual de um token
 * @param symbol Símbolo do token
 * @param date Data específica (opcional)
 * @returns Preço do token em USD
 */
export async function getTokenPrice(symbol: string, date?: Date): Promise<number> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Preços mock baseados no símbolo
  const basePrices: Record<string, number> = {
    'AGRO': 0.85,
    'ETH': 2500,
    'USDC': 1.0,
    'USDT': 1.0,
    'BTC': 45000
  };
  
  const basePrice = basePrices[symbol] || 1.0;
  
  // Se uma data específica foi fornecida, simular variação histórica
  if (date) {
    const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    const variation = Math.sin(daysDiff * 0.1) * 0.1; // Variação senoidal
    return basePrice * (1 + variation);
  }
  
  // Preço atual com pequena variação aleatória
  const variation = (Math.random() - 0.5) * 0.05; // ±2.5%
  return basePrice * (1 + variation);
}

/**
 * Obtém preços históricos de um token
 * @param symbol Símbolo do token
 * @param days Número de dias para histórico
 * @returns Array de preços históricos
 */
export async function getTokenPriceHistory(symbol: string, days: number = 30): Promise<Array<{date: string, price: number}>> {
  const basePrice = await getTokenPrice(symbol);
  const history = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = Math.sin(i * 0.2) * 0.15; // Variação senoidal
    const price = basePrice * (1 + variation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(0.01, price) // Preço mínimo de $0.01
    });
  }
  
  return history;
}

/**
 * Obtém preços de múltiplos tokens
 * @param symbols Array de símbolos de tokens
 * @returns Objeto com preços dos tokens
 */
export async function getMultipleTokenPrices(symbols: string[]): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  
  for (const symbol of symbols) {
    prices[symbol] = await getTokenPrice(symbol);
  }
  
  return prices;
}
