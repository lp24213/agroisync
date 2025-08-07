'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  coincapApi, 
  getCryptoPrice, 
  getCryptoMarketChart, 
  getAllAssets,
  getAssetMarkets,
  getExchangeRate,
  getAllExchangeRates,
  type CoinCapAsset,
  type CoinCapHistory,
  type CoinCapMarket
} from '../lib/coincapApi';

interface UseCoinCapReturn {
  // Preço de criptomoeda
  cryptoPrice: CoinCapAsset | null;
  cryptoPriceLoading: boolean;
  cryptoPriceError: string | null;
  fetchCryptoPrice: (assetId?: string) => Promise<void>;
  
  // Gráfico de mercado
  marketChart: CoinCapHistory[];
  marketChartLoading: boolean;
  marketChartError: string | null;
  fetchMarketChart: (assetId?: string, interval?: string, start?: number, end?: number) => Promise<void>;
  
  // Todos os ativos
  allAssets: CoinCapAsset[];
  allAssetsLoading: boolean;
  allAssetsError: string | null;
  fetchAllAssets: (limit?: number, offset?: number) => Promise<void>;
  
  // Mercados de um ativo
  assetMarkets: CoinCapMarket[];
  assetMarketsLoading: boolean;
  assetMarketsError: string | null;
  fetchAssetMarkets: (assetId: string) => Promise<void>;
  
  // Taxa de câmbio
  exchangeRate: { rateUsd: string } | null;
  exchangeRateLoading: boolean;
  exchangeRateError: string | null;
  fetchExchangeRate: (baseId: string, quoteId: string) => Promise<void>;
  
  // Todas as taxas de câmbio
  allExchangeRates: Array<{ id: string; rateUsd: string }>;
  allExchangeRatesLoading: boolean;
  allExchangeRatesError: string | null;
  fetchAllExchangeRates: () => Promise<void>;
}

/**
 * Hook personalizado para integração com a API CoinCap
 * Fornece métodos para buscar preços, histórico e dados de mercado de criptomoedas
 */
export const useCoinCap = (): UseCoinCapReturn => {
  // Estados para preço de criptomoeda
  const [cryptoPrice, setCryptoPrice] = useState<CoinCapAsset | null>(null);
  const [cryptoPriceLoading, setCryptoPriceLoading] = useState(false);
  const [cryptoPriceError, setCryptoPriceError] = useState<string | null>(null);

  // Estados para gráfico de mercado
  const [marketChart, setMarketChart] = useState<CoinCapHistory[]>([]);
  const [marketChartLoading, setMarketChartLoading] = useState(false);
  const [marketChartError, setMarketChartError] = useState<string | null>(null);

  // Estados para todos os ativos
  const [allAssets, setAllAssets] = useState<CoinCapAsset[]>([]);
  const [allAssetsLoading, setAllAssetsLoading] = useState(false);
  const [allAssetsError, setAllAssetsError] = useState<string | null>(null);

  // Estados para mercados de um ativo
  const [assetMarkets, setAssetMarkets] = useState<CoinCapMarket[]>([]);
  const [assetMarketsLoading, setAssetMarketsLoading] = useState(false);
  const [assetMarketsError, setAssetMarketsError] = useState<string | null>(null);

  // Estados para taxa de câmbio
  const [exchangeRate, setExchangeRate] = useState<{ rateUsd: string } | null>(null);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [exchangeRateError, setExchangeRateError] = useState<string | null>(null);

  // Estados para todas as taxas de câmbio
  const [allExchangeRates, setAllExchangeRates] = useState<Array<{ id: string; rateUsd: string }>>([]);
  const [allExchangeRatesLoading, setAllExchangeRatesLoading] = useState(false);
  const [allExchangeRatesError, setAllExchangeRatesError] = useState<string | null>(null);

  // Função para buscar preço de criptomoeda
  const fetchCryptoPrice = useCallback(async (assetId: string = 'bitcoin') => {
    try {
      setCryptoPriceLoading(true);
      setCryptoPriceError(null);

      const priceData = await getCryptoPrice(assetId);
      setCryptoPrice(priceData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar preço da criptomoeda';
      setCryptoPriceError(errorMessage);
      console.error('Erro ao buscar preço da criptomoeda:', error);
    } finally {
      setCryptoPriceLoading(false);
    }
  }, []);

  // Função para buscar gráfico de mercado
  const fetchMarketChart = useCallback(async (
    assetId: string = 'bitcoin', 
    interval: string = 'h1', 
    start?: number, 
    end?: number
  ) => {
    try {
      setMarketChartLoading(true);
      setMarketChartError(null);

      const chartData = await getCryptoMarketChart(assetId, interval, start, end);
      setMarketChart(chartData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar gráfico de mercado';
      setMarketChartError(errorMessage);
      console.error('Erro ao buscar gráfico de mercado:', error);
    } finally {
      setMarketChartLoading(false);
    }
  }, []);

  // Função para buscar todos os ativos
  const fetchAllAssets = useCallback(async (limit: number = 100, offset: number = 0) => {
    try {
      setAllAssetsLoading(true);
      setAllAssetsError(null);

      const assetsData = await getAllAssets(limit, offset);
      setAllAssets(assetsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar ativos';
      setAllAssetsError(errorMessage);
      console.error('Erro ao buscar ativos:', error);
    } finally {
      setAllAssetsLoading(false);
    }
  }, []);

  // Função para buscar mercados de um ativo
  const fetchAssetMarkets = useCallback(async (assetId: string) => {
    if (!assetId) {
      setAssetMarketsError('ID do ativo é obrigatório');
      return;
    }

    try {
      setAssetMarketsLoading(true);
      setAssetMarketsError(null);

      const marketsData = await getAssetMarkets(assetId);
      setAssetMarkets(marketsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar mercados do ativo';
      setAssetMarketsError(errorMessage);
      console.error('Erro ao buscar mercados do ativo:', error);
    } finally {
      setAssetMarketsLoading(false);
    }
  }, []);

  // Função para buscar taxa de câmbio
  const fetchExchangeRate = useCallback(async (baseId: string, quoteId: string) => {
    if (!baseId || !quoteId) {
      setExchangeRateError('IDs base e quote são obrigatórios');
      return;
    }

    try {
      setExchangeRateLoading(true);
      setExchangeRateError(null);

      const rateData = await getExchangeRate(baseId, quoteId);
      setExchangeRate(rateData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar taxa de câmbio';
      setExchangeRateError(errorMessage);
      console.error('Erro ao buscar taxa de câmbio:', error);
    } finally {
      setExchangeRateLoading(false);
    }
  }, []);

  // Função para buscar todas as taxas de câmbio
  const fetchAllExchangeRates = useCallback(async () => {
    try {
      setAllExchangeRatesLoading(true);
      setAllExchangeRatesError(null);

      const ratesData = await getAllExchangeRates();
      setAllExchangeRates(ratesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar taxas de câmbio';
      setAllExchangeRatesError(errorMessage);
      console.error('Erro ao buscar taxas de câmbio:', error);
    } finally {
      setAllExchangeRatesLoading(false);
    }
  }, []);

  return {
    // Preço de criptomoeda
    cryptoPrice,
    cryptoPriceLoading,
    cryptoPriceError,
    fetchCryptoPrice,
    
    // Gráfico de mercado
    marketChart,
    marketChartLoading,
    marketChartError,
    fetchMarketChart,
    
    // Todos os ativos
    allAssets,
    allAssetsLoading,
    allAssetsError,
    fetchAllAssets,
    
    // Mercados de um ativo
    assetMarkets,
    assetMarketsLoading,
    assetMarketsError,
    fetchAssetMarkets,
    
    // Taxa de câmbio
    exchangeRate,
    exchangeRateLoading,
    exchangeRateError,
    fetchExchangeRate,
    
    // Todas as taxas de câmbio
    allExchangeRates,
    allExchangeRatesLoading,
    allExchangeRatesError,
    fetchAllExchangeRates,
  };
};
