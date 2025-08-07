'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  moralisApi, 
  getNftsByWallet, 
  getTransactionsByWallet, 
  getTokenBalances,
  getNftMetadata,
  getTokenPrice,
  type MoralisNFT,
  type MoralisTransaction,
  type MoralisTokenBalance
} from '../lib/moralisApi';

interface UseMoralisReturn {
  // NFTs
  nfts: MoralisNFT[];
  nftsLoading: boolean;
  nftsError: string | null;
  fetchNfts: (walletAddress: string, chain?: string) => Promise<void>;
  
  // Transações
  transactions: MoralisTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  fetchTransactions: (walletAddress: string, chain?: string) => Promise<void>;
  
  // Saldos de tokens
  tokenBalances: MoralisTokenBalance[];
  tokenBalancesLoading: boolean;
  tokenBalancesError: string | null;
  fetchTokenBalances: (walletAddress: string, chain?: string) => Promise<void>;
  
  // NFT específico
  nftMetadata: MoralisNFT | null;
  nftMetadataLoading: boolean;
  nftMetadataError: string | null;
  fetchNftMetadata: (tokenAddress: string, tokenId: string, chain?: string) => Promise<void>;
  
  // Preço de token
  tokenPrice: { usdPrice: number; exchangeAddress: string; exchangeName: string } | null;
  tokenPriceLoading: boolean;
  tokenPriceError: string | null;
  fetchTokenPrice: (tokenAddress: string, chain?: string) => Promise<void>;
}

/**
 * Hook personalizado para integração com a API Moralis
 * Fornece métodos para buscar NFTs, transações e dados de blockchain
 */
export const useMoralis = (): UseMoralisReturn => {
  // Estados para NFTs
  const [nfts, setNfts] = useState<MoralisNFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState(false);
  const [nftsError, setNftsError] = useState<string | null>(null);

  // Estados para transações
  const [transactions, setTransactions] = useState<MoralisTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  // Estados para saldos de tokens
  const [tokenBalances, setTokenBalances] = useState<MoralisTokenBalance[]>([]);
  const [tokenBalancesLoading, setTokenBalancesLoading] = useState(false);
  const [tokenBalancesError, setTokenBalancesError] = useState<string | null>(null);

  // Estados para metadados de NFT
  const [nftMetadata, setNftMetadata] = useState<MoralisNFT | null>(null);
  const [nftMetadataLoading, setNftMetadataLoading] = useState(false);
  const [nftMetadataError, setNftMetadataError] = useState<string | null>(null);

  // Estados para preço de token
  const [tokenPrice, setTokenPrice] = useState<{ usdPrice: number; exchangeAddress: string; exchangeName: string } | null>(null);
  const [tokenPriceLoading, setTokenPriceLoading] = useState(false);
  const [tokenPriceError, setTokenPriceError] = useState<string | null>(null);

  // Função para buscar NFTs
  const fetchNfts = useCallback(async (walletAddress: string, chain: string = 'eth') => {
    if (!walletAddress) {
      setNftsError('Endereço da carteira é obrigatório');
      return;
    }

    try {
      setNftsLoading(true);
      setNftsError(null);

      const nftsData = await getNftsByWallet(walletAddress, chain);
      setNfts(nftsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar NFTs';
      setNftsError(errorMessage);
      console.error('Erro ao buscar NFTs:', error);
    } finally {
      setNftsLoading(false);
    }
  }, []);

  // Função para buscar transações
  const fetchTransactions = useCallback(async (walletAddress: string, chain: string = 'eth') => {
    if (!walletAddress) {
      setTransactionsError('Endereço da carteira é obrigatório');
      return;
    }

    try {
      setTransactionsLoading(true);
      setTransactionsError(null);

      const transactionsData = await getTransactionsByWallet(walletAddress, chain);
      setTransactions(transactionsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar transações';
      setTransactionsError(errorMessage);
      console.error('Erro ao buscar transações:', error);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // Função para buscar saldos de tokens
  const fetchTokenBalances = useCallback(async (walletAddress: string, chain: string = 'eth') => {
    if (!walletAddress) {
      setTokenBalancesError('Endereço da carteira é obrigatório');
      return;
    }

    try {
      setTokenBalancesLoading(true);
      setTokenBalancesError(null);

      const tokenBalancesData = await getTokenBalances(walletAddress, chain);
      setTokenBalances(tokenBalancesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar saldos de tokens';
      setTokenBalancesError(errorMessage);
      console.error('Erro ao buscar saldos de tokens:', error);
    } finally {
      setTokenBalancesLoading(false);
    }
  }, []);

  // Função para buscar metadados de NFT
  const fetchNftMetadata = useCallback(async (tokenAddress: string, tokenId: string, chain: string = 'eth') => {
    if (!tokenAddress || !tokenId) {
      setNftMetadataError('Endereço do token e ID são obrigatórios');
      return;
    }

    try {
      setNftMetadataLoading(true);
      setNftMetadataError(null);

      const metadata = await getNftMetadata(tokenAddress, tokenId, chain);
      setNftMetadata(metadata);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar metadados do NFT';
      setNftMetadataError(errorMessage);
      console.error('Erro ao buscar metadados do NFT:', error);
    } finally {
      setNftMetadataLoading(false);
    }
  }, []);

  // Função para buscar preço de token
  const fetchTokenPrice = useCallback(async (tokenAddress: string, chain: string = 'eth') => {
    if (!tokenAddress) {
      setTokenPriceError('Endereço do token é obrigatório');
      return;
    }

    try {
      setTokenPriceLoading(true);
      setTokenPriceError(null);

      const price = await getTokenPrice(tokenAddress, chain);
      setTokenPrice(price);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar preço do token';
      setTokenPriceError(errorMessage);
      console.error('Erro ao buscar preço do token:', error);
    } finally {
      setTokenPriceLoading(false);
    }
  }, []);

  return {
    // NFTs
    nfts,
    nftsLoading,
    nftsError,
    fetchNfts,
    
    // Transações
    transactions,
    transactionsLoading,
    transactionsError,
    fetchTransactions,
    
    // Saldos de tokens
    tokenBalances,
    tokenBalancesLoading,
    tokenBalancesError,
    fetchTokenBalances,
    
    // NFT específico
    nftMetadata,
    nftMetadataLoading,
    nftMetadataError,
    fetchNftMetadata,
    
    // Preço de token
    tokenPrice,
    tokenPriceLoading,
    tokenPriceError,
    fetchTokenPrice,
  };
};
