'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCoinCap } from '../hooks/useCoinCap';
import { useMoralis } from '../hooks/useMoralis';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface CryptoChartProps {
  walletAddress?: string;
  defaultAssetId?: string;
}

export default function CryptoChart({ walletAddress, defaultAssetId = 'bitcoin' }: CryptoChartProps) {
  const { 
    cryptoPrice, 
    cryptoPriceLoading, 
    cryptoPriceError, 
    fetchCryptoPrice,
    marketChart,
    marketChartLoading,
    marketChartError,
    fetchMarketChart
  } = useCoinCap();

  const {
    nfts,
    nftsLoading,
    nftsError,
    fetchNfts,
    transactions,
    transactionsLoading,
    transactionsError,
    fetchTransactions
  } = useMoralis();

  const [selectedAsset, setSelectedAsset] = useState(defaultAssetId);
  const [chartInterval, setChartInterval] = useState('h1');

  useEffect(() => {
    if (selectedAsset) {
      fetchCryptoPrice(selectedAsset);
      fetchMarketChart(selectedAsset, chartInterval);
    }
  }, [selectedAsset, chartInterval, fetchCryptoPrice, fetchMarketChart]);

  useEffect(() => {
    if (walletAddress) {
      fetchNfts(walletAddress);
      fetchTransactions(walletAddress);
    }
  }, [walletAddress, fetchNfts, fetchTransactions]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1) {
      return `$${numPrice.toFixed(2)}`;
    } else {
      return `$${(numPrice * 1000).toFixed(2)}`;
    }
  };

  const formatPercentage = (change: string) => {
    const numChange = parseFloat(change);
    return `${numChange >= 0 ? '+' : ''}${numChange.toFixed(2)}%`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Seção de Preços */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Preços de Criptomoedas</h2>
          
          {/* Seletor de Ativo */}
          <div className="flex gap-2 mb-4">
            {['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot'].map((asset) => (
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

          {/* Informações do Preço */}
          {cryptoPriceLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ) : cryptoPriceError ? (
            <div className="text-red-400">{cryptoPriceError}</div>
          ) : cryptoPrice ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-black/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm">Preço Atual</h3>
                <p className="text-2xl font-bold text-[#00bfff]">
                  {formatPrice(cryptoPrice.priceUsd)}
                </p>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm">Variação 24h</h3>
                <p className={`text-xl font-bold ${
                  parseFloat(cryptoPrice.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatPercentage(cryptoPrice.changePercent24Hr)}
                </p>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm">Volume 24h</h3>
                <p className="text-xl font-bold text-white">
                  ${parseFloat(cryptoPrice.volumeUsd24Hr).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ) : null}
        </div>
      </Card>

      {/* Seção de Gráfico */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Histórico de Preços</h2>
          
          {/* Seletor de Intervalo */}
          <div className="flex gap-2 mb-4">
            {[
              { value: 'm1', label: '1 min' },
              { value: 'm5', label: '5 min' },
              { value: 'h1', label: '1 hora' },
              { value: 'd1', label: '1 dia' }
            ].map((interval) => (
              <Button
                key={interval.value}
                variant={chartInterval === interval.value ? 'primary' : 'secondary'}
                onClick={() => setChartInterval(interval.value)}
              >
                {interval.label}
              </Button>
            ))}
          </div>

          {/* Dados do Gráfico */}
          {marketChartLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          ) : marketChartError ? (
            <div className="text-red-400">{marketChartError}</div>
          ) : marketChart.length > 0 ? (
            <div className="bg-black/50 rounded-lg p-4">
              <div className="max-h-64 overflow-y-auto">
                {marketChart.slice(-10).map((point, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                    <span className="text-gray-400">{formatDate(point.time)}</span>
                    <span className="text-white font-semibold">
                      {formatPrice(point.priceUsd)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Nenhum dado disponível</div>
          )}
        </div>
      </Card>

      {/* Seção de NFTs (se walletAddress fornecido) */}
      {walletAddress && (
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">NFTs da Carteira</h2>
            
            {nftsLoading ? (
              <div className="animate-pulse">
                <div className="h-32 bg-gray-700 rounded mb-2"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
            ) : nftsError ? (
              <div className="text-red-400">{nftsError}</div>
            ) : nfts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts.slice(0, 6).map((nft, index) => (
                  <motion.div
                    key={`${nft.token_address}-${nft.token_id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#00bfff] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">NFT</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
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
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">ID: {nft.token_id}</Badge>
                      <span className="text-gray-400 text-sm">
                        {nft.contract_type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum NFT encontrado nesta carteira</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Seção de Transações (se walletAddress fornecido) */}
      {walletAddress && (
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Transações Recentes</h2>
            
            {transactionsLoading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-gray-700 rounded mb-2"></div>
                <div className="h-16 bg-gray-700 rounded mb-2"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
              </div>
            ) : transactionsError ? (
              <div className="text-red-400">{transactionsError}</div>
            ) : transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx, index) => (
                  <motion.div
                    key={tx.hash}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(parseInt(tx.block_timestamp))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">
                          {parseFloat(tx.value) > 0 ? `${parseFloat(tx.value).toFixed(4)} ETH` : '0 ETH'}
                        </p>
                        <Badge variant={tx.receipt_status === '1' ? 'success' : 'error'}>
                          {tx.receipt_status === '1' ? 'Sucesso' : 'Falha'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
