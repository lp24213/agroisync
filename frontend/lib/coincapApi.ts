// coincapApi.ts - integração CoinCap API para preços, gráficos, volume e market cap
const COINCAP_BASE_URL = 'https://api.coincap.io/v2';

export interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

export interface CoinCapHistory {
  priceUsd: string;
  time: number;
  circulatingSupply: string;
  date: string;
}

export interface CoinCapMarket {
  exchangeId: string;
  rank: string;
  baseSymbol: string;
  baseId: string;
  quoteId: string;
  quoteSymbol: string;
  quoteType: string;
  percentTotalVolume: string;
  priceUsd: string;
  volumePercent: string;
}

export interface CoinCapError {
  error: string;
  timestamp: number;
}

/**
 * Classe para integração com a API CoinCap
 * Fornece métodos para buscar preços, histórico e dados de mercado de criptomoedas
 */
class CoinCapApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = COINCAP_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AGROTM-Frontend/1.0',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CoinCap API Error:', error);
      throw error;
    }
  }

  /**
   * Busca informações de um ativo específico
   * @param assetId - ID do ativo (padrão: bitcoin)
   */
  async getCryptoPrice(assetId: string = 'bitcoin'): Promise<{ data: CoinCapAsset }> {
    const endpoint = `/assets/${assetId}`;
    const data = await this.request<{ data: CoinCapAsset }>(endpoint);
    return data;
  }

  /**
   * Busca lista de todos os ativos
   * @param limit - Limite de resultados (padrão: 100)
   * @param offset - Offset para paginação (padrão: 0)
   */
  async getAllAssets(limit: number = 100, offset: number = 0): Promise<{ data: CoinCapAsset[] }> {
    const endpoint = `/assets?limit=${limit}&offset=${offset}`;
    const data = await this.request<{ data: CoinCapAsset[] }>(endpoint);
    return data;
  }

  /**
   * Busca histórico de preços de um ativo
   * @param assetId - ID do ativo (padrão: bitcoin)
   * @param interval - Intervalo (m1, m5, m15, m30, h1, h2, h6, h12, d1)
   * @param start - Timestamp de início (opcional)
   * @param end - Timestamp de fim (opcional)
   */
  async getCryptoMarketChart(
    assetId: string = 'bitcoin',
    interval: string = 'h1',
    start?: number,
    end?: number
  ): Promise<{ data: CoinCapHistory[] }> {
    let endpoint = `/assets/${assetId}/history?interval=${interval}`;
    
    if (start) {
      endpoint += `&start=${start}`;
    }
    
    if (end) {
      endpoint += `&end=${end}`;
    }
    
    const data = await this.request<{ data: CoinCapHistory[] }>(endpoint);
    return data;
  }

  /**
   * Busca dados de mercado de um ativo
   * @param assetId - ID do ativo
   */
  async getAssetMarkets(assetId: string): Promise<{ data: CoinCapMarket[] }> {
    const endpoint = `/assets/${assetId}/markets`;
    const data = await this.request<{ data: CoinCapMarket[] }>(endpoint);
    return data;
  }

  /**
   * Busca taxa de câmbio
   * @param baseId - ID da moeda base
   * @param quoteId - ID da moeda de cotação
   */
  async getExchangeRate(baseId: string, quoteId: string): Promise<{ data: { rateUsd: string } }> {
    const endpoint = `/rates/${baseId}`;
    const data = await this.request<{ data: { rateUsd: string } }>(endpoint);
    return data;
  }

  /**
   * Busca todas as taxas de câmbio
   */
  async getAllExchangeRates(): Promise<{ data: Array<{ id: string; rateUsd: string }> }> {
    const endpoint = '/rates';
    const data = await this.request<{ data: Array<{ id: string; rateUsd: string }> }>(endpoint);
    return data;
  }

  /**
   * Busca informações de um exchange específico
   * @param exchangeId - ID do exchange
   */
  async getExchange(exchangeId: string): Promise<{ data: { id: string; name: string; rank: string; percentTotalVolume: string } }> {
    const endpoint = `/exchanges/${exchangeId}`;
    const data = await this.request<{ data: { id: string; name: string; rank: string; percentTotalVolume: string } }>(endpoint);
    return data;
  }

  /**
   * Busca lista de todos os exchanges
   */
  async getAllExchanges(): Promise<{ data: Array<{ id: string; name: string; rank: string; percentTotalVolume: string }> }> {
    const endpoint = '/exchanges';
    const data = await this.request<{ data: Array<{ id: string; name: string; rank: string; percentTotalVolume: string }> }>(endpoint);
    return data;
  }

  /**
   * Busca dados de mercado de um exchange específico
   * @param exchangeId - ID do exchange
   */
  async getExchangeMarkets(exchangeId: string): Promise<{ data: CoinCapMarket[] }> {
    const endpoint = `/exchanges/${exchangeId}/markets`;
    const data = await this.request<{ data: CoinCapMarket[] }>(endpoint);
    return data;
  }

  /**
   * Busca dados de mercado de um exchange específico para um ativo
   * @param exchangeId - ID do exchange
   * @param assetId - ID do ativo
   */
  async getExchangeAssetMarkets(exchangeId: string, assetId: string): Promise<{ data: CoinCapMarket[] }> {
    const endpoint = `/exchanges/${exchangeId}/markets?assetId=${assetId}`;
    const data = await this.request<{ data: CoinCapMarket[] }>(endpoint);
    return data;
  }

  /**
   * Busca dados de mercado de um exchange específico para um ativo base
   * @param exchangeId - ID do exchange
   * @param baseId - ID do ativo base
   */
  async getExchangeBaseMarkets(exchangeId: string, baseId: string): Promise<{ data: CoinCapMarket[] }> {
    const endpoint = `/exchanges/${exchangeId}/markets?baseId=${baseId}`;
    const data = await this.request<{ data: CoinCapMarket[] }>(endpoint);
    return data;
  }

  /**
   * Busca dados de mercado de um exchange específico para um ativo de cotação
   * @param exchangeId - ID do exchange
   * @param quoteId - ID do ativo de cotação
   */
  async getExchangeQuoteMarkets(exchangeId: string, quoteId: string): Promise<{ data: CoinCapMarket[] }> {
    const endpoint = `/exchanges/${exchangeId}/markets?quoteId=${quoteId}`;
    const data = await this.request<{ data: CoinCapMarket[] }>(endpoint);
    return data;
  }

  /**
   * Busca dados de mercado de um exchange específico para um ativo base e de cotação
   * @param exchangeId - ID do exchange
   * @param baseId - ID do ativo base
   * @param quoteId - ID do ativo de cotação
   */
  async getExchangeBaseQuoteMarkets(exchangeId: string, baseId: string, quoteId: string): Promise<{ data: CoinCapMarket[] }> {
    const endpoint = `/exchanges/${exchangeId}/markets?baseId=${baseId}&quoteId=${quoteId}`;
    const data = await this.request<{ data: CoinCapMarket[] }>(endpoint);
    return data;
  }
}

// Instância singleton do cliente CoinCap
export const coincapApi = new CoinCapApiClient();

// Funções de conveniência para uso direto
export async function getCryptoPrice(assetId: string = 'bitcoin'): Promise<CoinCapAsset> {
  try {
    const data = await coincapApi.getCryptoPrice(assetId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar preço na CoinCap API:', error);
    throw new Error('Erro ao buscar preço na CoinCap API');
  }
}

export async function getCryptoMarketChart(
  assetId: string = 'bitcoin',
  interval: string = 'h1',
  start?: number,
  end?: number
): Promise<CoinCapHistory[]> {
  try {
    const data = await coincapApi.getCryptoMarketChart(assetId, interval, start, end);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar gráfico na CoinCap API:', error);
    throw new Error('Erro ao buscar gráfico na CoinCap API');
  }
}

export async function getAllAssets(limit: number = 100, offset: number = 0): Promise<CoinCapAsset[]> {
  try {
    const data = await coincapApi.getAllAssets(limit, offset);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar ativos na CoinCap API:', error);
    throw new Error('Erro ao buscar ativos na CoinCap API');
  }
}

export async function getAssetMarkets(assetId: string): Promise<CoinCapMarket[]> {
  try {
    const data = await coincapApi.getAssetMarkets(assetId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar mercados na CoinCap API:', error);
    throw new Error('Erro ao buscar mercados na CoinCap API');
  }
}

export async function getExchangeRate(baseId: string, quoteId: string): Promise<{ rateUsd: string }> {
  try {
    const data = await coincapApi.getExchangeRate(baseId, quoteId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar taxa de câmbio na CoinCap API:', error);
    throw new Error('Erro ao buscar taxa de câmbio na CoinCap API');
  }
}

export async function getAllExchangeRates(): Promise<Array<{ id: string; rateUsd: string }>> {
  try {
    const data = await coincapApi.getAllExchangeRates();
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio na CoinCap API:', error);
    throw new Error('Erro ao buscar taxas de câmbio na CoinCap API');
  }
}

export async function getExchange(exchangeId: string): Promise<{ id: string; name: string; rank: string; percentTotalVolume: string }> {
  try {
    const data = await coincapApi.getExchange(exchangeId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar exchange na CoinCap API:', error);
    throw new Error('Erro ao buscar exchange na CoinCap API');
  }
}

export async function getAllExchanges(): Promise<Array<{ id: string; name: string; rank: string; percentTotalVolume: string }>> {
  try {
    const data = await coincapApi.getAllExchanges();
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar exchanges na CoinCap API:', error);
    throw new Error('Erro ao buscar exchanges na CoinCap API');
  }
}

export async function getExchangeMarkets(exchangeId: string): Promise<CoinCapMarket[]> {
  try {
    const data = await coincapApi.getExchangeMarkets(exchangeId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar mercados do exchange na CoinCap API:', error);
    throw new Error('Erro ao buscar mercados do exchange na CoinCap API');
  }
}

export async function getExchangeAssetMarkets(exchangeId: string, assetId: string): Promise<CoinCapMarket[]> {
  try {
    const data = await coincapApi.getExchangeAssetMarkets(exchangeId, assetId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar mercados do ativo no exchange na CoinCap API:', error);
    throw new Error('Erro ao buscar mercados do ativo no exchange na CoinCap API');
  }
}

export async function getExchangeBaseMarkets(exchangeId: string, baseId: string): Promise<CoinCapMarket[]> {
  try {
    const data = await coincapApi.getExchangeBaseMarkets(exchangeId, baseId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar mercados base no exchange na CoinCap API:', error);
    throw new Error('Erro ao buscar mercados base no exchange na CoinCap API');
  }
}

export async function getExchangeQuoteMarkets(exchangeId: string, quoteId: string): Promise<CoinCapMarket[]> {
  try {
    const data = await coincapApi.getExchangeQuoteMarkets(exchangeId, quoteId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar mercados de cotação no exchange na CoinCap API:', error);
    throw new Error('Erro ao buscar mercados de cotação no exchange na CoinCap API');
  }
}

export async function getExchangeBaseQuoteMarkets(exchangeId: string, baseId: string, quoteId: string): Promise<CoinCapMarket[]> {
  try {
    const data = await coincapApi.getExchangeBaseQuoteMarkets(exchangeId, baseId, quoteId);
    return data.data;
  } catch (error) {
    console.error('Erro ao buscar mercados base/cotação no exchange na CoinCap API:', error);
    throw new Error('Erro ao buscar mercados base/cotação no exchange na CoinCap API');
  }
}
