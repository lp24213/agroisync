import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Image, Loader2, CheckCircle, Clock, AlertCircle, Plus, Eye, Share } from 'lucide-react';

const NFTManager = ({ userId }) => {
  const { t } = useTranslation();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);

  const fetchNFTs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blockchain/nfts?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setNfts(data.nfts);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('nfts.error', 'Erro ao carregar NFTs'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const mintNFT = useCallback(async metadata => {
    try {
      const response = await fetch(getApiUrl('blockchain/nfts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ ...metadata, userId })
      });

      const data = await response.json();

      if (data.success) {
        setNfts(prev => [...prev, data.nft]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('nfts.mintError', 'Erro ao criar NFT'));
    }
  }, [userId, t]);

  const getStatusIcon = status => {
    switch (status) {
      case 'minted':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-600' />;
      case 'failed':
        return <AlertCircle className='h-5 w-5 text-red-600' />;
      default:
        return <Clock className='h-5 w-5 text-gray-600' />;
    }
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='text-agro-emerald h-8 w-8 animate-spin' />
        <span className='ml-3 text-gray-600 dark:text-gray-300'>{t('nfts.loading', 'Carregando NFTs...')}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'
    >
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='flex items-center text-2xl font-bold text-gray-900 dark:text-white'>
          <Image className='text-agro-emerald mr-2 h-6 w-6' />
          {t('nfts.title', 'Meus NFTs')}
        </h2>

        <button
          onClick={() => mintNFT({ name: 'Novo NFT', description: 'NFT criado no AGROISYNC' })}
          className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          <Plus className='h-4 w-4' />
          <span>{t('nfts.mint', 'Criar NFT')}</span>
        </button>
      </div>

      {error && (
        <div className='mb-4 flex items-center text-red-500'>
          <AlertCircle className='mr-2 h-5 w-5' />
          {error}
        </div>
      )}

      {nfts.length === 0 ? (
        <div className='py-8 text-center'>
          <Image className='mx-auto mb-4 h-16 w-16 text-gray-400' />
          <p className='mb-4 text-gray-600 dark:text-gray-400'>{t('nfts.noNFTs', 'Nenhum NFT encontrado')}</p>
          <button
            onClick={() => mintNFT({ name: 'Primeiro NFT', description: 'Meu primeiro NFT no AGROISYNC' })}
            className='rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700'
          >
            {t('nfts.mintFirst', 'Criar Primeiro NFT')}
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {nfts.map(nft => (
            <div key={nft.id} className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'>
              <div className='flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-700'>
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} className='h-full w-full object-cover' />
                ) : (
                  <Image className='h-16 w-16 text-gray-400' />
                )}
              </div>

              <div className='p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>{nft.name}</h3>
                  {getStatusIcon(nft.status)}
                </div>

                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>{nft.description}</p>

                <div className='mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                  <span>
                    {t('nfts.tokenId', 'Token ID')}: {nft.tokenId}
                  </span>
                  <span>{nft.date}</span>
                </div>

                <div className='flex space-x-2'>
                  <button className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                    <Eye className='h-4 w-4' />
                    <span>{t('nfts.view', 'Ver')}</span>
                  </button>
                  <button className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'>
                    <Share className='h-4 w-4' />
                    <span>{t('nfts.share', 'Compartilhar')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NFTManager;
