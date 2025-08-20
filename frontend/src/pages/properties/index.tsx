import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

interface Property {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  size: number
  type: string
  location: string
  owner: string
  image: string
  rating: number
  reviews: number
  isFavorite: boolean
  soilType: string
  climate: string
  infrastructure: string[]
  waterResources: string[]
  access: string
  documents: string[]
  tags: string[]
}

const Properties: NextPage = () => {
  const { t } = useI18n()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  // Dados simulados de propriedades
  const mockProperties: Property[] = [
    {
      id: '1',
      name: 'Fazenda Santa Clara',
      description: 'Propriedade rural de 500 hectares com solo fértil, infraestrutura completa e acesso asfaltado. Ideal para soja, milho e algodão.',
      price: 2500000.00,
      originalPrice: 2800000.00,
      size: 500,
      type: 'farm',
      location: 'Sinop, Mato Grosso',
      owner: 'AgroInvestimentos LTDA',
      image: '/images/properties/farm-1.jpg',
      rating: 4.8,
      reviews: 45,
      isFavorite: false,
      soilType: 'Latossolo Vermelho',
      climate: 'Tropical úmido',
      infrastructure: ['Casa sede', 'Galpão', 'Silos', 'Pivô central'],
      waterResources: ['Rio', 'Poço artesiano', 'Lagoa'],
      access: 'Asfaltado',
      documents: ['Matrícula', 'ITR', 'Licença ambiental'],
      tags: ['soja', 'milho', 'algodão', 'infraestrutura-completa']
    },
    {
      id: '2',
      name: 'Sítio Boa Vista',
      description: 'Propriedade de 50 hectares com área de preservação, nascentes e potencial para turismo rural e agricultura orgânica.',
      price: 450000.00,
      size: 50,
      type: 'ranch',
      location: 'Nova Mutum, Mato Grosso',
      owner: 'Família Silva',
      image: '/images/properties/ranch-1.jpg',
      rating: 4.6,
      reviews: 23,
      isFavorite: false,
      soilType: 'Argissolo',
      climate: 'Tropical',
      infrastructure: ['Casa', 'Churrasqueira', 'Área de lazer'],
      waterResources: ['Nascentes', 'Córrego', 'Poço'],
      access: 'Estrada de terra',
      documents: ['Matrícula', 'ITR'],
      tags: ['turismo-rural', 'orgânico', 'preservação', 'nascentes']
    },
    {
      id: '3',
      name: 'Plantação Vale Verde',
      description: 'Área de 200 hectares dedicada ao cultivo de eucalipto com certificação FSC e potencial para exploração madeireira sustentável.',
      price: 1800000.00,
      size: 200,
      type: 'plantation',
      location: 'Lucas do Rio Verde, Mato Grosso',
      owner: 'Florestas Sustentáveis SA',
      image: '/images/properties/plantation-1.jpg',
      rating: 4.7,
      reviews: 34,
      isFavorite: false,
      soilType: 'Latossolo',
      climate: 'Tropical úmido',
      infrastructure: ['Escritório', 'Viveiro', 'Estrada interna'],
      waterResources: ['Rio', 'Poços'],
      access: 'Asfaltado',
      documents: ['Matrícula', 'ITR', 'Certificação FSC', 'Licença ambiental'],
      tags: ['eucalipto', 'sustentável', 'fsc', 'madeira']
    },
    {
      id: '4',
      name: 'Reserva Florestal Amazônica',
      description: 'Propriedade de 1000 hectares com mata nativa preservada, rica biodiversidade e potencial para créditos de carbono.',
      price: 3500000.00,
      size: 1000,
      type: 'forest',
      location: 'Colniza, Mato Grosso',
      owner: 'Conservação Ambiental LTDA',
      image: '/images/properties/forest-1.jpg',
      rating: 4.9,
      reviews: 28,
      isFavorite: false,
      soilType: 'Argissolo',
      climate: 'Tropical úmido',
      infrastructure: ['Posto de vigilância', 'Trilhas', 'Torre de observação'],
      waterResources: ['Rios', 'Igarapés', 'Lagos'],
      access: 'Estrada de terra',
      documents: ['Matrícula', 'ITR', 'Licença ambiental', 'Plano de manejo'],
      tags: ['mata-nativa', 'biodiversidade', 'crédito-carbono', 'preservação']
    },
    {
      id: '5',
      name: 'Fazenda Modelo',
      description: 'Propriedade de 300 hectares com tecnologia de precisão, irrigação por pivô e alta produtividade para grãos.',
      price: 3200000.00,
      size: 300,
      type: 'farm',
      location: 'Sorriso, Mato Grosso',
      owner: 'AgroTecnologia Brasil',
      image: '/images/properties/farm-2.jpg',
      rating: 4.8,
      reviews: 56,
      isFavorite: false,
      soilType: 'Latossolo Vermelho',
      climate: 'Tropical úmido',
      infrastructure: ['Casa sede', 'Galpões', 'Silos', 'Pivôs', 'Laboratório'],
      waterResources: ['Rio', 'Poços artesianos', 'Reservatórios'],
      access: 'Asfaltado',
      documents: ['Matrícula', 'ITR', 'Licença ambiental', 'Certificações'],
      tags: ['tecnologia-precisa', 'irrigação', 'alta-produtividade', 'grãos']
    },
    {
      id: '6',
      name: 'Sítio Recanto das Águas',
      description: 'Propriedade de 25 hectares com lago natural, área de preservação e potencial para piscicultura e lazer.',
      price: 280000.00,
      size: 25,
      type: 'ranch',
      location: 'Rondonópolis, Mato Grosso',
      owner: 'Lazer e Turismo LTDA',
      image: '/images/properties/ranch-2.jpg',
      rating: 4.5,
      reviews: 19,
      isFavorite: false,
      soilType: 'Argissolo',
      climate: 'Tropical',
      infrastructure: ['Casa', 'Quiosques', 'Píer', 'Área de camping'],
      waterResources: ['Lago natural', 'Poço'],
      access: 'Estrada de terra',
      documents: ['Matrícula', 'ITR', 'Licença ambiental'],
      tags: ['lago', 'piscicultura', 'lazer', 'turismo']
    }
  ]

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/properties')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setProperties(data.data || [])
            setFilteredProperties(data.data || [])
          } else {
            // Fallback para dados mock se a API falhar
            setProperties(mockProperties)
            setFilteredProperties(mockProperties)
          }
        } else {
          // Fallback para dados mock se a API falhar
          setProperties(mockProperties)
          setFilteredProperties(mockProperties)
        }
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error)
        // Fallback para dados mock em caso de erro
        setProperties(mockProperties)
        setFilteredProperties(mockProperties)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    filterAndSortProperties()
  }, [searchTerm, selectedType, sortBy, properties])

  const filterAndSortProperties = () => {
    let filtered = properties

    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Ordenar propriedades
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'size_low':
        filtered.sort((a, b) => a.size - b.size)
        break
      case 'size_high':
        filtered.sort((a, b) => b.size - a.size)
        break
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      default:
        break
    }

    setFilteredProperties(filtered)
  }

  const toggleFavorite = (propertyId: string) => {
    setProperties(prev => prev.map(property =>
      property.id === propertyId 
        ? { ...property, isFavorite: !property.isFavorite }
        : property
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatSize = (size: number) => {
    if (size >= 1000) {
      return `${(size / 1000).toFixed(1)} mil hectares`
    }
    return `${size} hectares`
  }

  const propertyTypes = [
    { id: 'all', name: t('properties_filter_all'), icon: '🏞️' },
    { id: 'farm', name: t('properties_filter_farm'), icon: '🚜' },
    { id: 'ranch', name: t('properties_filter_ranch'), icon: '🏡' },
    { id: 'plantation', name: t('properties_filter_plantation'), icon: '🌳' },
    { id: 'forest', name: t('properties_filter_forest'), icon: '🌲' }
  ]

  const sortOptions = [
    { id: 'newest', name: t('properties_sort_newest') },
    { id: 'price_low', name: t('properties_sort_price_low') },
    { id: 'price_high', name: t('properties_sort_price_high') },
    { id: 'size_low', name: t('properties_sort_size_low') },
    { id: 'size_high', name: t('properties_sort_size_high') }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white text-xl mt-4">{t('properties_loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{t('properties_main_title')} - {t('app_name')}</title>
        <meta name="description" content={t('properties_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header da Página */}
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('properties_main_title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t('properties_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Campo de Busca */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('properties_search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filtro de Tipo */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Propriedades */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏞️</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {t('properties_no_properties')}
              </h3>
              <p className="text-gray-400">
                Tente ajustar os filtros ou termos de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProperties.map(property => (
                <div
                  key={property.id}
                  className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group"
                >
                  {/* Imagem da Propriedade */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center text-8xl text-gray-600">
                      {property.type === 'farm' && '🚜'}
                      {property.type === 'ranch' && '🏡'}
                      {property.type === 'plantation' && '🌳'}
                      {property.type === 'forest' && '🌲'}
                    </div>
                    
                    {/* Badge de Desconto */}
                    {property.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)}%
                      </div>
                    )}
                    
                    {/* Botão Favorito */}
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                        property.isFavorite
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <HeartIcon className="h-5 w-5" />
                    </button>

                    {/* Informações Rápidas */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-medium">{formatSize(property.size)}</span>
                          <span className="text-lg font-bold">{formatPrice(property.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Propriedade */}
                  <div className="p-6">
                    {/* Tipo e Localização */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">
                        {propertyTypes.find(t => t.id === property.type)?.name}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>

                    {/* Nome e Descrição */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                      {property.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    {/* Características Principais */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <EyeIcon className="h-4 w-4 text-green-400" />
                          <span>{property.soilType}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <GlobeAltIcon className="h-4 w-4 text-blue-400" />
                          <span>{property.climate}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <StarIcon className="h-4 w-4 text-cyan-400" />
                          <span>{property.waterResources.length} recursos</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <EyeIcon className="h-4 w-4 text-yellow-400" />
                          <span>{property.access}</span>
                        </div>
                      </div>
                    </div>

                    {/* Infraestrutura */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-2">Infraestrutura</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.infrastructure.slice(0, 4).map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                          >
                            {item}
                          </span>
                        ))}
                        {property.infrastructure.length > 4 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-500/30">
                            +{property.infrastructure.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Documentação */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-2">Documentação</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.documents.slice(0, 3).map((doc, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30 flex items-center space-x-1"
                          >
                            <EyeIcon className="h-3 w-3" />
                            <span>{doc}</span>
                          </span>
                        ))}
                        {property.documents.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-500/30">
                            +{property.documents.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {property.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Informações do Proprietário */}
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                      <UserIcon className="h-4 w-4" />
                      <span>{property.owner}</span>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                        <CurrencyDollarIcon className="h-5 w-5" />
                        <span>{t('properties_property_invest')}</span>
                      </button>
                      <button className="bg-gray-700/50 text-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                        <span>👁️</span>
                        <span>{t('properties_property_view')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Chatbot */}
      <Chatbot />
    </>
  )
}

export default Properties
