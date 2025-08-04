'use client';

import React, { useState, useEffect } from 'react';
// import { useWeb3 } from '@/contexts/Web3Context';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Coins, Image, Percent, AlertCircle, Loader } from 'lucide-react';

interface BuyWithCommissionProps {
  type: 'token' | 'nft';
  tokenAddress?: string;
  nftAddress?: string;
  sellerAddress: string;
  tokenId?: number;
  amount?: string;
  price: string;
  tokenURI?: string;
  onSuccess?: () => void;
}

const BuyWithCommission: React.FC<BuyWithCommissionProps> = ({
  type,
  tokenAddress,
  nftAddress,
  sellerAddress,
  tokenId,
  amount,
  price,

  onSuccess,
}) => {
  // const { contracts, signer, isConnected } = useWeb3();
  // TODO: Substitua pelos tipos corretos do seu contexto Web3
  type BuyWithCommissionContract = {
    commissionRate?: () => Promise<number>;
    connect?: (signer: unknown) => BuyWithCommissionContract;
    buyTokenWithCommission?: (
      tokenAddress: string,
      sellerAddress: string,
      amount: bigint,
      options: { value: bigint },
    ) => Promise<unknown>;
    buyNFTWithCommission?: (
      nftAddress: string,
      sellerAddress: string,
      tokenId: bigint,
      options: { value: bigint },
    ) => Promise<unknown>;
  };
  const contracts: { buyWithCommission?: BuyWithCommissionContract } = {};
  const signer: unknown = null;
  const isConnected = false;
  const [isLoading, setIsLoading] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number>(0);
  const [commissionAmount, setCommissionAmount] = useState<string>('0');
  const [sellerAmount, setSellerAmount] = useState<string>('0');

  // Calcular comissão e valores
  useEffect(() => {
    if (price && commissionRate) {
      const priceWei = ethers.parseEther(price);
      const commissionWei = (priceWei * BigInt(commissionRate)) / BigInt(10000);
      const sellerWei = priceWei - commissionWei;

      setCommissionAmount(ethers.formatEther(commissionWei));
      setSellerAmount(ethers.formatEther(sellerWei));
    }
  }, [price, commissionRate]);

  // Buscar taxa de comissão do contrato
  useEffect(() => {
    const fetchCommissionRate = async () => {
      if (contracts.buyWithCommission) {
        try {
          const rate = await contracts.buyWithCommission.commissionRate();
          setCommissionRate(Number(rate));
        } catch {
          // console.error('Erro ao buscar taxa de comissão:', error);
        }
      }
    };

    fetchCommissionRate();
  }, [contracts.buyWithCommission]);

  const handlePurchase = async () => {
    if (!isConnected) {
      toast.error('Conecte sua carteira primeiro!');
      return;
    }

    if (!signer || !contracts.buyWithCommission) {
      toast.error('Carteira não conectada ou contratos não disponíveis');
      return;
    }

    setIsLoading(true);

    try {
      const priceWei = ethers.parseEther(price);
      let tx;

      if (type === 'token' && tokenAddress && amount) {
        // Compra de token
        const contract = contracts.buyWithCommission;
        tx = await contract
          ?.connect?.(signer)
          ?.buyTokenWithCommission?.(tokenAddress, sellerAddress, ethers.parseEther(amount), {
            value: priceWei,
          });
      } else if (type === 'nft' && nftAddress && tokenId) {
        // Compra de NFT
        const contract = contracts.buyWithCommission;
        tx = await contract
          ?.connect?.(signer)
          ?.buyNFTWithCommission?.(nftAddress, sellerAddress, BigInt(tokenId), { value: priceWei });
      } else {
        throw new Error('Parâmetros inválidos para compra');
      }

      toast.success('Transação enviada! Aguardando confirmação...');

      // Aguardar confirmação
      await tx.wait();

      toast.success('Compra realizada com sucesso!');

      if (onSuccess) {
        onSuccess();
      }

      // console.log('Transação confirmada:', receipt.transactionHash);
    } catch {
      // console.error('Erro na compra:', error);

      toast.error('Erro na compra. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1) {
      return `${numPrice.toFixed(2)} ETH`;
    } else {
      return `${(numPrice * 1000).toFixed(2)} mETH`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'
    >
      <div className='flex items-center gap-3 mb-4'>
        {type === 'token' ? (
          <Coins className='w-6 h-6 text-blue-600' />
        ) : (
          <Image className='w-6 h-6 text-purple-600' alt="NFT Icon" />
        )}
        <h3 className='text-lg font-semibold text-gray-900'>
          Comprar {type === 'token' ? 'Tokens' : 'NFT'}
        </h3>
      </div>

      {/* Informações da compra */}
      <div className='space-y-3 mb-6'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>Preço:</span>
          <span className='font-medium text-gray-900'>{formatPrice(price)}</span>
        </div>

        {type === 'token' && amount && (
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Quantidade:</span>
            <span className='font-medium text-gray-900'>{amount} tokens</span>
          </div>
        )}

        {type === 'nft' && tokenId && (
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Token ID:</span>
            <span className='font-medium text-gray-900'>#{tokenId}</span>
          </div>
        )}

        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-600'>Vendedor:</span>
          <span className='font-mono text-sm text-gray-900'>
            {sellerAddress.slice(0, 6)}...{sellerAddress.slice(-4)}
          </span>
        </div>
      </div>

      {/* Detalhes da comissão */}
      <div className='bg-gray-50 rounded-lg p-4 mb-6'>
        <h4 className='text-sm font-medium text-gray-900 mb-3 flex items-center gap-2'>
          <Percent className='w-4 h-4' />
          Detalhes da Comissão
        </h4>

        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Taxa de comissão:</span>
            <span className='text-sm font-medium text-gray-900'>
              {(commissionRate / 100).toFixed(1)}%
            </span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Comissão (AGROTM):</span>
            <span className='text-sm font-medium text-green-600'>
              {formatPrice(commissionAmount)}
            </span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>Para o vendedor:</span>
            <span className='text-sm font-medium text-blue-600'>{formatPrice(sellerAmount)}</span>
          </div>
        </div>
      </div>

      {/* Aviso sobre comissão */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6'>
        <div className='flex items-start gap-2'>
          <AlertCircle className='w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0' />
          <p className='text-sm text-blue-800'>
            <strong>Comissão automática:</strong> {formatPrice(commissionAmount)} será enviado
            automaticamente para a plataforma AGROTM como comissão pela transação.
          </p>
        </div>
      </div>

      {/* Botão de compra */}
      <button
        onClick={handlePurchase}
        disabled={isLoading || !isConnected}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
          isLoading || !isConnected
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className='w-4 h-4 animate-spin' />
            Processando...
          </>
        ) : !isConnected ? (
          <>
            <AlertCircle className='w-4 h-4' />
            Conecte sua carteira
          </>
        ) : (
          <>
            <ShoppingCart className='w-4 h-4' />
            Comprar por {formatPrice(price)}
          </>
        )}
      </button>

      {/* Informações adicionais */}
      <div className='mt-4 text-xs text-gray-500 text-center'>
        <p>Transação segura via smart contract</p>
        <p>Comissão automática de {(commissionRate / 100).toFixed(1)}%</p>
      </div>
    </motion.div>
  );
};

export default BuyWithCommission;
