// Exemplos de uso das APIs Moralis e CoinCap
// Este arquivo contém exemplos práticos de como usar as integrações

import React, { useEffect, useState } from 'react';
import { useMoralis } from '../hooks/useMoralis';
import { useCoinCap } from '../hooks/useCoinCap';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

// Exemplo 1: Componente para exibir NFTs de uma carteira
export function NftWalletExample({ walletAddress }: { walletAddress: string }) {
  const { nfts, nftsLoading, nftsError, fetchNfts } = useMoralis();

  useEffect(() => {
    if (walletAddress) {
      fetchNfts(walletAddress);
    }
  }, [walletAddress, fetchNfts]);

  if (nftsLoading) {
    return <div className="animate-pulse">Carregando NFTs...</div>;
  }

  if (nftsError) {
    return <div className="text-red-400">Erro: {nftsError}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => (
        <Card key={`${nft.token_address}-${nft.token_id}`} className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">NFT</span>
            </div>
            <div>
              <p className="font-semibold">
                {nft.metadata?.name || nft.name || `NFT #${nft.token_id}`}
              </p>
              <p className="text-gray-400 text-sm">{nft.symbol}</p>
            </div>
          </div>
          
          {nft.metadata?.image && (
            <img 
              src={nft.metadata.image} 
              alt={nft.metadata?.name || 'NFT'} 
              className="w-full h-32 object-cover rounded mb-2"
            />
          )}
          
          <div className="flex justify-between items-center">
            <Badge variant="secondary">ID: {nft.token_id}</Badge>
            <span className="text-gray-400 text-sm">
              {nft.contract_type}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Exemplo 2: Componente para exibir transações de uma carteira
export function TransactionHistoryExample({ walletAddress }: { walletAddress: string }) {
  const { transactions, transactionsLoading, transactionsError, fetchTransactions } = useMoralis();

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions(walletAddress);
    }
  }, [walletAddress, fetchTransactions]);

  if (transactionsLoading) {
    return <div className="animate-pulse">Carregando transações...</div>;
  }

  if (transactionsError) {
    return <div className="text-red-400">Erro: {transactionsError}</div>;
  }

  return (
    <div className="space-y-2">
      {transactions.slice(0, 10).map((tx) => (
        <Card key={tx.hash} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(parseInt(tx.block_timestamp)).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {parseFloat(tx.value) > 0 ? `${parseFloat(tx.value).toFixed(4)} ETH` : '0 ETH'}
              </p>
              <Badge variant={tx.receipt_status === '1' ? 'success' : 'error'}>
                {tx.receipt_status === '1' ? 'Sucesso' : 'Falha'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Exemplo 3: Componente para exibir preços de criptomoedas
export function CryptoPriceExample({ assetId = 'bitcoin' }: { assetId?: string }) {
  const { cryptoPrice, cryptoPriceLoading, cryptoPriceError, fetchCryptoPrice } = useCoinCap();

  useEffect(() => {
    fetchCryptoPrice(assetId);
  }, [assetId, fetchCryptoPrice]);

  if (cryptoPriceLoading) {
    return <div className="animate-pulse">Carregando preço...</div>;
  }

  if (cryptoPriceError) {
    return <div className="text-red-400">Erro: {cryptoPriceError}</div>;
  }

  if (!cryptoPrice) {
    return <div>Nenhum dado disponível</div>;
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Preço Atual</h3>
          <p className="text-2xl font-bold text-blue-400">
            ${parseFloat(cryptoPrice.priceUsd).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Variação 24h</h3>
          <p className={`text-xl font-bold ${
            parseFloat(cryptoPrice.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {parseFloat(cryptoPrice.changePercent24Hr) >= 0 ? '+' : ''}
            {parseFloat(cryptoPrice.changePercent24Hr).toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm">Volume 24h</h3>
          <p className="text-xl font-bold text-white">
            ${parseFloat(cryptoPrice.volumeUsd24Hr).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Exemplo 4: Componente para exibir gráfico de preços
export function CryptoChartExample({ assetId = 'bitcoin', interval = 'h1' }: { assetId?: string; interval?: string }) {
  const { marketChart, marketChartLoading, marketChartError, fetchMarketChart } = useCoinCap();

  useEffect(() => {
    fetchMarketChart(assetId, interval);
  }, [assetId, interval, fetchMarketChart]);

  if (marketChartLoading) {
    return <div className="animate-pulse">Carregando gráfico...</div>;
  }

  if (marketChartError) {
    return <div className="text-red-400">Erro: {marketChartError}</div>;
  }

  if (!marketChart.length) {
    return <div>Nenhum dado disponível</div>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Histórico de Preços</h3>
      <div className="max-h-64 overflow-y-auto">
        {marketChart.slice(-10).map((point, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
            <span className="text-gray-400">
              {new Date(point.time).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="font-semibold">
              ${parseFloat(point.priceUsd).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Exemplo 5: Componente integrado que usa ambas as APIs
export function IntegratedExample({ walletAddress }: { walletAddress?: string }) {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [selectedInterval, setSelectedInterval] = useState('h1');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['bitcoin', 'ethereum', 'cardano', 'solana'].map((asset) => (
          <Button
            key={asset}
            variant={selectedAsset === asset ? 'primary' : 'secondary'}
            onClick={() => setSelectedAsset(asset)}
            className="capitalize"
          >
            {asset}
          </Button>
        ))}
      </div>

      <CryptoPriceExample assetId={selectedAsset} />
      
      <div className="flex gap-2 mb-4">
        {[
          { value: 'm1', label: '1 min' },
          { value: 'h1', label: '1 hora' },
          { value: 'd1', label: '1 dia' }
        ].map((interval) => (
          <Button
            key={interval.value}
            variant={selectedInterval === interval.value ? 'primary' : 'secondary'}
            onClick={() => setSelectedInterval(interval.value)}
          >
            {interval.label}
          </Button>
        ))}
      </div>

      <CryptoChartExample assetId={selectedAsset} interval={selectedInterval} />

      {walletAddress && (
        <>
          <h2 className="text-2xl font-bold">NFTs da Carteira</h2>
          <NftWalletExample walletAddress={walletAddress} />
          
          <h2 className="text-2xl font-bold">Transações Recentes</h2>
          <TransactionHistoryExample walletAddress={walletAddress} />
        </>
      )}
    </div>
  );
}

// Exemplo 6: Hook personalizado para dados combinados
export function useCombinedCryptoData(assetId: string = 'bitcoin') {
  const { cryptoPrice, fetchCryptoPrice } = useCoinCap();
  const { marketChart, fetchMarketChart } = useCoinCap();

  useEffect(() => {
    fetchCryptoPrice(assetId);
    fetchMarketChart(assetId, 'h1');
  }, [assetId, fetchCryptoPrice, fetchMarketChart]);

  return {
    price: cryptoPrice,
    chart: marketChart,
    isLoading: !cryptoPrice && !marketChart.length,
  };
}

// Exemplo 7: Componente que usa o hook combinado
export function CombinedCryptoDataExample({ assetId = 'bitcoin' }: { assetId?: string }) {
  const { price, chart, isLoading } = useCombinedCryptoData(assetId);

  if (isLoading) {
    return <div className="animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="space-y-4">
      {price && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold">{price.name} ({price.symbol})</h3>
          <p className="text-2xl font-bold text-blue-400">
            ${parseFloat(price.priceUsd).toFixed(2)}
          </p>
        </div>
      )}
      
      {chart.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Últimos Preços</h3>
          <div className="space-y-1">
            {chart.slice(-5).map((point, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-400">
                  {new Date(point.time).toLocaleTimeString()}
                </span>
                <span className="font-semibold">
                  ${parseFloat(point.priceUsd).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
