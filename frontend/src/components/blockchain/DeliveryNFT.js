import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Download,
  Eye,
  Shield,
  Zap,
  Star,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react'

const DeliveryNFT = ({ deliveryId, onNFTMinted }) => {
  const [nft, setNft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [minting, setMinting] = useState(false)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    if (deliveryId) {
      loadDeliveryData()
    }
  }, [deliveryId])

  const loadDeliveryData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/deliveries/${deliveryId}`)
      const data = await response.json()

      if (data.success) {
        setNft(data.delivery)
        if (data.delivery.nftTokenId) {
          loadNFTMetadata(data.delivery.nftTokenId)
        }
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar dados da entrega')
    } finally {
      setLoading(false)
    }
  }, [deliveryId])

  const loadNFTMetadata = useCallback(async (tokenId) => {
    try {
      const response = await fetch(`/api/blockchain/nft/${tokenId}/metadata`)
      const data = await response.json()

      if (data.success) {
        setMetadata(data.metadata)
      }
    } catch (err) {
      console.error('Erro ao carregar metadados do NFT:', err)
    }
  }, [])

  const mintNFT = async () => {
    try {
      setMinting(true)
      setError('')
      
      const response = await fetch(`/api/blockchain/nft/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deliveryId,
          metadata: {
            name: `Entrega #${deliveryId}`,
            description: `NFT de entrega para ${nft?.recipient?.name}`,
            image: nft?.image || '/images/delivery-nft.png',
            attributes: [
              { trait_type: 'Delivery ID', value: deliveryId },
              { trait_type: 'Status', value: nft?.status },
              { trait_type: 'Distance', value: nft?.distance },
              { trait_type: 'Weight', value: nft?.weight }
            ]
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setNft(prev => ({
          ...prev,
          nftTokenId: data.tokenId,
          nftContractAddress: data.contractAddress
        }))
        setMetadata(data.metadata)
        onNFTMinted?.(data.tokenId)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao criar NFT')
    } finally {
      setMinting(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 dark:text-green-400'
      case 'in_transit':
        return 'text-blue-600 dark:text-blue-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />
      case 'in_transit':
        return <Truck className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="text-center py-8">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Entrega não encontrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="w-5 h-5 mr-2 text-agro-emerald" />
          NFT de Entrega
        </h2>
        {nft.nftTokenId && (
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
              NFT Criado
            </span>
          </div>
        )}
      </div>

      {/* Informações da entrega */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Informações da Entrega
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  #{nft.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor(nft.status)}`}>
                  {getStatusIcon(nft.status)}
                  <span className="text-sm font-medium capitalize">
                    {nft.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(nft.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Detalhes do Produto
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Produto:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {nft.product?.name || 'Produto'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Peso:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {nft.weight} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Distância:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {nft.distance} km
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Destinatário
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {nft.recipient?.name || 'Nome não informado'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {nft.recipient?.address || 'Endereço não informado'}
                </span>
              </div>
              {nft.recipient?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {nft.recipient.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Entregador
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {nft.driver?.name || 'Nome não informado'}
                </span>
              </div>
              {nft.driver?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {nft.driver.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NFT */}
      {nft.nftTokenId ? (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              NFT Criado
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(nft.nftContractAddress)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                {metadata?.image ? (
                  <img
                    src={metadata.image}
                    alt={metadata.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {metadata?.name || 'NFT de Entrega'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metadata?.description || 'NFT representando uma entrega no AgroSync'}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  Atributos
                </h5>
                <div className="space-y-2">
                  {metadata?.attributes?.map((attr, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {attr.trait_type}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Verificado na blockchain
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Criar NFT de Entrega
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Transforme esta entrega em um NFT único na blockchain
          </p>
          <button
            onClick={mintNFT}
            disabled={minting}
            className="px-6 py-3 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {minting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Criando NFT...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Criar NFT</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default DeliveryNFT