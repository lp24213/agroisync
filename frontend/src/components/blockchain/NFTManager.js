import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Image, Loader2, CheckCircle, Clock, AlertCircle, Plus, Eye, Share } from 'lucide-react';

const NFTManager = ({ userId }) => {
  const { t } = useTranslation();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
fetchNFTs();
  }, [userId]);

  const fetchNFTs = async () => {
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
  };

  const mintNFT = async (metadata) => {
    try {
      const response = await fetch('/api/blockchain/nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ ...metadata, userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNfts([...nfts, data.nft]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('nfts.mintError', 'Erro ao criar NFT'));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'minted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-agro-emerald" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {t('nfts.loading', 'Carregando NFTs...')}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Image className="w-6 h-6 mr-2 text-agro-emerald" />
          {t('nfts.title', 'Meus NFTs')}
        </h2>
        
        <button
          onClick={() => mintNFT({ name: 'Novo NFT', description: 'NFT criado no AGROISYNC' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('nfts.mint', 'Criar NFT')}</span>
        </button>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {nfts.length === 0 ? (
        <div className="text-center py-8">
          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('nfts.noNFTs', 'Nenhum NFT encontrado')}
          </p>
          <button
            onClick={() => mintNFT({ name: 'Primeiro NFT', description: 'Meu primeiro NFT no AGROISYNC' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            {t('nfts.mintFirst', 'Criar Primeiro NFT')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-16 h-16 text-gray-400" />
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {nft.name}
                  </h3>
                  {getStatusIcon(nft.status)}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {nft.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{t('nfts.tokenId', 'Token ID')}: {nft.tokenId}</span>
                  <span>{nft.date}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{t('nfts.view', 'Ver')}</span>
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                    <Share className="w-4 h-4" />
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


