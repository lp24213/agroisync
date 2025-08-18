import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { 
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface NFT {
  id: string
  name: string
  description: string
  image: string
  price: string
  owner: string
  metadata: {
    hectares?: number
    location?: string
    cropType?: string
    brand?: string
    model?: string
    year?: number
  }
  category: 'farm' | 'equipment' | 'crop' | 'land'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  mintDate: string
  likes: number
  views: number
}

const NFTs: NextPage = () => {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const categories = ['all', 'farm', 'equipment', 'crop', 'land']
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary']

  useEffect(() => {
    fetchNFTs()
  }, [])

  const fetchNFTs = async () => {
    try {
      const response = await fetch('/api/nfts')
      const data = await response.json()
      if (data.success) {
        setNfts(data.data.nfts)
      }
    } catch (error) {
      console.error('Erro ao carregar NFTs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory
    const matchesRarity = selectedRarity === 'all' || nft.rarity === selectedRarity
    return matchesSearch && matchesCategory && matchesRarity
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600'
      case 'rare': return 'text-blue-600'
      case 'epic': return 'text-purple-600'
      case 'legendary': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Comum'
      case 'rare': return 'Raro'
      case 'epic': return 'Épico'
      case 'legendary': return 'Lendário'
      default: return 'Comum'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'farm': return 'Fazenda'
      case 'equipment': return 'Equipamento'
      case 'crop': return 'Colheita'
      case 'land': return 'Terreno'
      default: return category
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>NFTs - AgroSync</title>
        <meta name="description" content="Explore e crie NFTs agrícolas únicos" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                NFTs Agrícolas
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tokenize suas propriedades rurais, equipamentos e colheitas como NFTs únicos e negociáveis
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Todas as categorias' : getCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {rarities.map(rarity => (
                      <option key={rarity} value={rarity}>
                        {rarity === 'all' ? 'Todas as raridades' : getRarityLabel(rarity)}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={() => setShowCreateModal(true)}>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Criar NFT
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* NFTs Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredNFTs.length === 0 ? (
              <div className="text-center py-12">
                <CubeIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">Nenhum NFT encontrado</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Criar Primeiro NFT
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft) => (
                  <Card key={nft.id} className="hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Rarity Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/90 ${getRarityColor(nft.rarity)}`}>
                          {getRarityLabel(nft.rarity)}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                          {getCategoryLabel(nft.category)}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                          <EyeIcon className="h-4 w-4" />
                          <span>{nft.views}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                          <HeartIcon className="h-4 w-4" />
                          <span>{nft.likes}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{nft.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{nft.description}</p>
                      
                      {/* Metadata */}
                      <div className="space-y-2 mb-4">
                        {nft.metadata.hectares && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Hectares:</span>
                            <span className="font-medium">{nft.metadata.hectares}</span>
                          </div>
                        )}
                        {nft.metadata.location && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Localização:</span>
                            <span className="font-medium">{nft.metadata.location}</span>
                          </div>
                        )}
                        {nft.metadata.cropType && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Cultura:</span>
                            <span className="font-medium">{nft.metadata.cropType}</span>
                          </div>
                        )}
                        {nft.metadata.brand && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Marca:</span>
                            <span className="font-medium">{nft.metadata.brand}</span>
                          </div>
                        )}
                        {nft.metadata.model && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Modelo:</span>
                            <span className="font-medium">{nft.metadata.model}</span>
                          </div>
                        )}
                        {nft.metadata.year && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Ano:</span>
                            <span className="font-medium">{nft.metadata.year}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-green-600">{nft.price}</span>
                        <span className="text-sm text-gray-500">Proprietário: {nft.owner}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          Comprar
                        </Button>
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Create NFT Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Novo NFT</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do NFT
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Fazenda São João"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Descreva seu NFT..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Selecione uma categoria</option>
                    <option value="farm">Fazenda</option>
                    <option value="equipment">Equipamento</option>
                    <option value="crop">Colheita</option>
                    <option value="land">Terreno</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (AGRO)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1">
                  Criar NFT
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NFTs
