import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  User, 
  Hash, 
  ExternalLink,
  Download,
  Share2,
  Eye,
  Copy,
  Camera,
  FileText,
  Shield,
  Zap,
  Coins,
  Award,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const DeliveryNFT = ({ deliveryId, onMint, onView }) => {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const [delivery, setDelivery] = useState(null);
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [metadata, setMetadata] = useState(null);

  // Carregar dados da entrega
  const loadDelivery = useCallback(async () => {
    if (!deliveryId) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setDelivery(data.delivery);
        
        // Verificar se já existe NFT
        if (data.delivery.nft) {
          setNft(data.delivery.nft);
          loadNFTMetadata(data.delivery.nft.tokenId);
        }
      }
    } catch (error) {
      console.error('Error loading delivery:', error);
    } finally {
      setIsLoading(false);
    }
  }, [deliveryId]);

  // Carregar metadados do NFT
  const loadNFTMetadata = useCallback(async (tokenId) => {
    try {
      const response = await fetch(`/api/blockchain/nft/${tokenId}/metadata`);
      const data = await response.json();

      if (data.success) {
        setMetadata(data.metadata);
      }
    } catch (error) {
      console.error('Error loading NFT metadata:', error);
    }
  }, []);

  // Cunhar NFT
  const mintNFT = useCallback(async () => {
    if (!delivery) return;

    setIsMinting(true);

    try {
      const response = await fetch('/api/blockchain/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          deliveryId: delivery.id,
          metadata: {
            name: `Entrega #${delivery.id}`,
            description: `Comprovante de entrega para ${delivery.productName}`,
            image: delivery.proofImage,
            attributes: [
              { trait_type: 'Produto', value: delivery.productName },
              { trait_type: 'Quantidade', value: delivery.quantity },
              { trait_type: 'Destino', value: delivery.destination },
              { trait_type: 'Data', value: delivery.deliveryDate },
              { trait_type: 'Status', value: delivery.status },
              { trait_type: 'Valor', value: delivery.value }
            ]
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setNft(data.nft);
        setMetadata(data.metadata);
        
        analytics.trackEvent('delivery_nft_minted', {
          delivery_id: delivery.id,
          token_id: data.nft.tokenId,
          network: data.nft.network
        });

        if (onMint) {
          onMint(data.nft);
        }
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsMinting(false);
    }
  }, [delivery, analytics, onMint]);

  // Compartilhar NFT
  const shareNFT = useCallback(async () => {
    if (!nft) return;

    const shareData = {
      title: t('nft.shareTitle', 'NFT de Entrega - AgroSync'),
      text: t('nft.shareText', 'Confira meu NFT de comprovante de entrega'),
      url: `${window.location.origin}/nft/${nft.tokenId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        analytics.trackEvent('delivery_nft_shared', {
          token_id: nft.tokenId
        });
      } catch (error) {
        console.error('Error sharing NFT:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert(t('nft.linkCopied', 'Link copiado para a área de transferência'));
    }
  }, [nft, t, analytics]);

  // Copiar endereço do contrato
  const copyContractAddress = useCallback(() => {
    if (nft?.contractAddress) {
      navigator.clipboard.writeText(nft.contractAddress);
      analytics.trackEvent('nft_contract_address_copied');
    }
  }, [nft, analytics]);

  // Carregar dados iniciais
  useEffect(() => {
    loadDelivery();
  }, [loadDelivery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-agro-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            {t('nft.loading', 'Carregando dados da entrega...')}
          </p>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {t('nft.deliveryNotFound', 'Entrega não encontrada')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('nft.deliveryNotFoundDescription', 'A entrega especificada não foi encontrada')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('nft.deliveryNFT', 'NFT de Entrega')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('nft.deliveryNFTSubtitle', 'Comprovante digital de entrega na blockchain')}
          </p>
        </div>

        {nft && (
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={shareNFT}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
              title={t('nft.share', 'Compartilhar')}
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
              title={t('nft.details', 'Detalhes')}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Informações da entrega */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t('nft.deliveryInfo', 'Informações da Entrega')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('nft.deliveryId', 'ID da Entrega')}: #{delivery.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nft.product', 'Produto')}
              </label>
              <p className="text-gray-900 dark:text-white">{delivery.productName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nft.quantity', 'Quantidade')}
              </label>
              <p className="text-gray-900 dark:text-white">{delivery.quantity}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nft.destination', 'Destino')}
              </label>
              <p className="text-gray-900 dark:text-white">{delivery.destination}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nft.deliveryDate', 'Data de Entrega')}
              </label>
              <p className="text-gray-900 dark:text-white">
                {new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nft.driver', 'Motorista')}
              </label>
              <p className="text-gray-900 dark:text-white">{delivery.driverName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('nft.value', 'Valor')}
              </label>
              <p className="text-gray-900 dark:text-white">R$ {delivery.value.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Comprovante de entrega */}
        {delivery.proofImage && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('nft.proofImage', 'Comprovante de Entrega')}
            </label>
            <div className="relative">
              <img
                src={delivery.proofImage}
                alt="Comprovante de entrega"
                className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                <Camera className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NFT */}
      {nft ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Coins className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('nft.nftInfo', 'Informações do NFT')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('nft.tokenId', 'Token ID')}: #{nft.tokenId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagem do NFT */}
            <div>
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {metadata?.image ? (
                  <img
                    src={metadata.image}
                    alt={metadata.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes do NFT */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {metadata?.name || `Entrega #${delivery.id}`}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {metadata?.description || t('nft.defaultDescription', 'Comprovante de entrega digital')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('nft.network', 'Rede')}:
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    {nft.network.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('nft.contractAddress', 'Contrato')}:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-gray-900 dark:text-white">
                      {nft.contractAddress?.slice(0, 8)}...{nft.contractAddress?.slice(-8)}
                    </span>
                    <button
                      onClick={copyContractAddress}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('nft.mintedAt', 'Cunhado em')}:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(nft.mintedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <a
                  href={`https://explorer.solana.com/address/${nft.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('nft.viewOnExplorer', 'Ver no Explorer')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Atributos do NFT */}
          {metadata?.attributes && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                {t('nft.attributes', 'Atributos')}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {attr.trait_type}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Botão para cunhar NFT */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('nft.mintNFT', 'Cunhar NFT de Entrega')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('nft.mintNFTDescription', 'Crie um NFT único como comprovante de entrega na blockchain')}
          </p>
          <button
            onClick={mintNFT}
            disabled={isMinting}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          >
            {isMinting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>
              {isMinting ? t('nft.minting', 'Cunhando...') : t('nft.mint', 'Cunhar NFT')}
            </span>
          </button>
        </div>
      )}

      {/* Detalhes técnicos */}
      <AnimatePresence>
        {showDetails && nft && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('nft.technicalDetails', 'Detalhes Técnicos')}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('nft.tokenId', 'Token ID')}:
                </span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {nft.tokenId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('nft.contractAddress', 'Endereço do Contrato')}:
                </span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {nft.contractAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('nft.transactionHash', 'Hash da Transação')}:
                </span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {nft.transactionHash}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('nft.blockNumber', 'Número do Bloco')}:
                </span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {nft.blockNumber}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryNFT;
