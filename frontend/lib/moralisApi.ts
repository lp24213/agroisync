// moralisApi.ts - integração Moralis API para blockchain, NFTs e transações
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2';

export interface MoralisNFT {
  token_address: string;
  token_id: string;
  amount: string;
  token_hash: string;
  block_number_minted: string;
  updated_at: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri?: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  last_token_uri_sync?: string;
  last_metadata_sync?: string;
  minter_address?: string;
}

export interface MoralisTransaction {
  hash: string;
  nonce: string;
  transaction_index: string;
  from_address: string;
  to_address: string;
  value: string;
  gas: string;
  gas_price: string;
  input: string;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_contract_address?: string;
  receipt_root?: string;
  receipt_status: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  transfer_index: number[];
}

export interface MoralisTokenBalance {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  total_supply?: string;
  percentage_of_holders: number;
}

export interface MoralisError {
  message: string;
  code?: string;
}

/**
 * Classe para integração com a API Moralis
 * Fornece métodos para buscar NFTs, transações e dados de blockchain
 */
class MoralisApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = MORALIS_API_KEY || '';
    this.baseUrl = MORALIS_BASE_URL;
    
    if (!this.apiKey) {
      console.warn('Moralis API key não configurada. Configure NEXT_PUBLIC_MORALIS_API_KEY no .env');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Moralis API key não configurada');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'X-API-Key': this.apiKey,
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
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Moralis API Error:', error);
      throw error;
    }
  }

  /**
   * Busca NFTs de uma carteira específica
   * @param walletAddress - Endereço da carteira
   * @param chain - Chain ID (padrão: eth)
   * @param format - Formato de resposta (padrão: decimal)
   * @param limit - Limite de resultados (padrão: 100)
   * @param offset - Offset para paginação (padrão: 0)
   */
  async getNftsByWallet(
    walletAddress: string,
    chain: string = 'eth',
    format: string = 'decimal',
    limit: number = 100,
    offset: number = 0
  ): Promise<{ result: MoralisNFT[]; total: number }> {
    const endpoint = `/${walletAddress}/nft?chain=${chain}&format=${format}&limit=${limit}&offset=${offset}`;
    const data = await this.request<{ result: MoralisNFT[]; total: number }>(endpoint);
    return data;
  }

  /**
   * Busca transações de uma carteira específica
   * @param walletAddress - Endereço da carteira
   * @param chain - Chain ID (padrão: eth)
   * @param limit - Limite de resultados (padrão: 100)
   * @param offset - Offset para paginação (padrão: 0)
   */
  async getTransactionsByWallet(
    walletAddress: string,
    chain: string = 'eth',
    limit: number = 100,
    offset: number = 0
  ): Promise<{ result: MoralisTransaction[]; total: number }> {
    const endpoint = `/${walletAddress}/transactions?chain=${chain}&limit=${limit}&offset=${offset}`;
    const data = await this.request<{ result: MoralisTransaction[]; total: number }>(endpoint);
    return data;
  }

  /**
   * Busca saldo de tokens de uma carteira específica
   * @param walletAddress - Endereço da carteira
   * @param chain - Chain ID (padrão: eth)
   */
  async getTokenBalances(
    walletAddress: string,
    chain: string = 'eth'
  ): Promise<{ result: MoralisTokenBalance[]; total: number }> {
    const endpoint = `/${walletAddress}/erc20?chain=${chain}`;
    const data = await this.request<{ result: MoralisTokenBalance[]; total: number }>(endpoint);
    return data;
  }

  /**
   * Busca informações de um NFT específico
   * @param tokenAddress - Endereço do contrato do token
   * @param tokenId - ID do token
   * @param chain - Chain ID (padrão: eth)
   * @param format - Formato de resposta (padrão: decimal)
   */
  async getNftMetadata(
    tokenAddress: string,
    tokenId: string,
    chain: string = 'eth',
    format: string = 'decimal'
  ): Promise<MoralisNFT> {
    const endpoint = `/${tokenAddress}/${tokenId}?chain=${chain}&format=${format}`;
    const data = await this.request<MoralisNFT>(endpoint);
    return data;
  }

  /**
   * Busca transações de um NFT específico
   * @param tokenAddress - Endereço do contrato do token
   * @param tokenId - ID do token
   * @param chain - Chain ID (padrão: eth)
   * @param limit - Limite de resultados (padrão: 100)
   */
  async getNftTransactions(
    tokenAddress: string,
    tokenId: string,
    chain: string = 'eth',
    limit: number = 100
  ): Promise<{ result: MoralisTransaction[]; total: number }> {
    const endpoint = `/${tokenAddress}/${tokenId}/transfers?chain=${chain}&limit=${limit}`;
    const data = await this.request<{ result: MoralisTransaction[]; total: number }>(endpoint);
    return data;
  }

  /**
   * Busca informações de um token ERC-20
   * @param tokenAddress - Endereço do contrato do token
   * @param chain - Chain ID (padrão: eth)
   */
  async getTokenMetadata(
    tokenAddress: string,
    chain: string = 'eth'
  ): Promise<MoralisTokenBalance> {
    const endpoint = `/${tokenAddress}?chain=${chain}`;
    const data = await this.request<MoralisTokenBalance>(endpoint);
    return data;
  }

  /**
   * Busca preço de um token
   * @param tokenAddress - Endereço do contrato do token
   * @param chain - Chain ID (padrão: eth)
   * @param exchange - Exchange (padrão: uniswap-v3)
   */
  async getTokenPrice(
    tokenAddress: string,
    chain: string = 'eth',
    exchange: string = 'uniswap-v3'
  ): Promise<{ usdPrice: number; exchangeAddress: string; exchangeName: string }> {
    const endpoint = `/${tokenAddress}/price?chain=${chain}&exchange=${exchange}`;
    const data = await this.request<{ usdPrice: number; exchangeAddress: string; exchangeName: string }>(endpoint);
    return data;
  }

  /**
   * Busca histórico de preços de um token
   * @param tokenAddress - Endereço do contrato do token
   * @param chain - Chain ID (padrão: eth)
   * @param exchange - Exchange (padrão: uniswap-v3)
   * @param days - Número de dias (padrão: 30)
   */
  async getTokenPriceHistory(
    tokenAddress: string,
    chain: string = 'eth',
    exchange: string = 'uniswap-v3',
    days: number = 30
  ): Promise<Array<{ timestamp: string; price: number }>> {
    const endpoint = `/${tokenAddress}/price?chain=${chain}&exchange=${exchange}&days=${days}`;
    const data = await this.request<Array<{ timestamp: string; price: number }>>(endpoint);
    return data;
  }
}

// Instância singleton do cliente Moralis
export const moralisApi = new MoralisApiClient();

// Funções de conveniência para uso direto
export async function getNftsByWallet(walletAddress: string, chain: string = 'eth') {
  try {
    const data = await moralisApi.getNftsByWallet(walletAddress, chain);
    return data.result;
  } catch (error) {
    console.error('Erro ao buscar NFTs na Moralis API:', error);
    throw new Error('Erro ao buscar NFTs na Moralis API');
  }
}

export async function getTransactionsByWallet(walletAddress: string, chain: string = 'eth') {
  try {
    const data = await moralisApi.getTransactionsByWallet(walletAddress, chain);
    return data.result;
  } catch (error) {
    console.error('Erro ao buscar transações na Moralis API:', error);
    throw new Error('Erro ao buscar transações na Moralis API');
  }
}

export async function getTokenBalances(walletAddress: string, chain: string = 'eth') {
  try {
    const data = await moralisApi.getTokenBalances(walletAddress, chain);
    return data.result;
  } catch (error) {
    console.error('Erro ao buscar saldos na Moralis API:', error);
    throw new Error('Erro ao buscar saldos na Moralis API');
  }
}

export async function getNftMetadata(tokenAddress: string, tokenId: string, chain: string = 'eth') {
  try {
    return await moralisApi.getNftMetadata(tokenAddress, tokenId, chain);
  } catch (error) {
    console.error('Erro ao buscar metadados do NFT na Moralis API:', error);
    throw new Error('Erro ao buscar metadados do NFT na Moralis API');
  }
}

export async function getTokenPrice(tokenAddress: string, chain: string = 'eth') {
  try {
    return await moralisApi.getTokenPrice(tokenAddress, chain);
  } catch (error) {
    console.error('Erro ao buscar preço do token na Moralis API:', error);
    throw new Error('Erro ao buscar preço do token na Moralis API');
  }
}
