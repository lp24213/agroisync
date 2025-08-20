import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
  owner: string
  location: string
  inStock: boolean
  isFavorite: boolean
  tags: string[]
}

const Marketplace: NextPage = () => {
  const { t } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  // Dados simulados de produtos
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Sementes de Soja Premium',
      description: 'Sementes de soja certificadas com alta produtividade, resistentes a pragas e doenças.',
      price: 89.90,
      originalPrice: 119.90,
      category: 'seeds',
      image: '/images/products/soy-seeds.jpg',
      rating: 4.8,
      reviews: 156,
      owner: 'Fazenda Santa Clara',
      location: 'Sinop, MT',
      inStock: true,
      isFavorite: false,
      tags: ['premium', 'certificado', 'alta-produtividade']
    },
    {
      id: '2',
      name: 'Fertilizante NPK 20-10-10',
      description: 'Fertilizante balanceado com micronutrientes essenciais para todas as culturas.',
      price: 45.50,
      category: 'fertilizers',
      image: '/images/products/npk-fertilizer.jpg',
      rating: 4.6,
      reviews: 89,
      owner: 'AgroQuímica Brasil',
      location: 'Lucas do Rio Verde, MT',
      inStock: true,
      isFavorite: false,
      tags: ['balanceado', 'micronutrientes', 'todas-culturas']
    },
    {
      id: '3',
      name: 'Pulverizador Manual 20L',
      description: 'Pulverizador manual de 20 litros com bico regulável e pressão constante.',
      price: 189.90,
      category: 'equipment',
      image: '/images/products/sprayer.jpg',
      rating: 4.4,
      reviews: 67,
      owner: 'Máquinas Agrícolas MT',
      location: 'Sorriso, MT',
      inStock: true,
      isFavorite: false,
      tags: ['manual', '20l', 'bico-regulável']
    },
    {
      id: '4',
      name: 'Trator Massey Ferguson 275',
      description: 'Trator 75cv com cabine climatizada, GPS integrado e sistema de telemetria.',
      price: 125000.00,
      category: 'machinery',
      image: '/images/products/tractor.jpg',
      rating: 4.9,
      reviews: 23,
      owner: 'Concessionária MT',
      location: 'Cuiabá, MT',
      inStock: true,
      isFavorite: false,
      tags: ['75cv', 'cabine-climatizada', 'gps', 'telemetria']
    },
    {
      id: '5',
      name: 'Sementes de Milho Híbrido',
      description: 'Sementes de milho híbrido com potencial de rendimento superior a 200 sacas/hectare.',
      price: 67.80,
      category: 'seeds',
      image: '/images/products/corn-seeds.jpg',
      rating: 4.7,
      reviews: 134,
      owner: 'Sementes Premium',
      location: 'Rondonópolis, MT',
      inStock: true,
      isFavorite: false,
      tags: ['híbrido', 'alta-produtividade', '200-sacas']
    },
    {
      id: '6',
      name: 'Sistema de Irrigação por Gotejamento',
      description: 'Sistema completo de irrigação por gotejamento para 5 hectares com controle automático.',
      price: 8900.00,
      category: 'equipment',
      image: '/images/products/irrigation.jpg',
      rating: 4.5,
      reviews: 45,
      owner: 'Irrigação Brasil',
      location: 'Nova Mutum, MT',
      inStock: true,
      isFavorite: false,
      tags: ['gotejamento', '5-hectares', 'controle-automático']
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/marketplace')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setProducts(data.data || [])
            setFilteredProducts(data.data || [])
          } else {
            // Fallback para dados mock se a API falhar
            setProducts(mockProducts)
            setFilteredProducts(mockProducts)
          }
        } else {
          // Fallback para dados mock se a API falhar
          setProducts(mockProducts)
          setFilteredProducts(mockProducts)
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        // Fallback para dados mock em caso de erro
        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [searchTerm, selectedCategory, sortBy, products])

  const filterAndSortProducts = () => {
    let filtered = products

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Ordenar produtos
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const toggleFavorite = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const categories = [
    { id: 'all', name: t('marketplace_filter_all'), icon: '🌾' },
    { id: 'seeds', name: t('marketplace_filter_seeds'), icon: '🌱' },
    { id: 'fertilizers', name: t('marketplace_filter_fertilizers'), icon: '🧪' },
    { id: 'equipment', name: t('marketplace_filter_equipment'), icon: '🔧' },
    { id: 'machinery', name: t('marketplace_filter_machinery'), icon: '🚜' }
  ]

  const sortOptions = [
    { id: 'newest', name: t('marketplace_sort_newest') },
    { id: 'popular', name: t('marketplace_sort_popular') },
    { id: 'price_low', name: t('marketplace_sort_price_low') },
    { id: 'price_high', name: t('marketplace_sort_price_high') }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white text-xl mt-4">{t('marketplace_loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{t('marketplace_main_title')} - {t('app_name')}</title>
        <meta name="description" content={t('marketplace_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header da Página */}
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('marketplace_main_title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t('marketplace_subtitle')}
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
                  placeholder={t('marketplace_search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filtro de Categoria */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
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

        {/* Lista de Produtos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {t('marketplace_no_products')}
              </h3>
              <p className="text-gray-400">
                Tente ajustar os filtros ou termos de busca
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-gray-800/50 rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group"
                >
                  {/* Imagem do Produto */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl text-gray-600">
                      {product.category === 'seeds' && '🌱'}
                      {product.category === 'fertilizers' && '🧪'}
                      {product.category === 'equipment' && '🔧'}
                      {product.category === 'machinery' && '🚜'}
                    </div>
                    
                    {/* Badge de Desconto */}
                    {product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                    
                    {/* Botão Favorito */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                        product.isFavorite
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <HeartIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Informações do Produto */}
                  <div className="p-6">
                    {/* Categoria */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">
                        {categories.find(c => c.id === product.category)?.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Nome e Descrição */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Preço */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Informações Adicionais */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <UserIcon className="h-4 w-4" />
                        <span>{product.owner}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{product.location}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>{t('marketplace_product_buy')}</span>
                      </button>
                      <button className="bg-gray-700/50 text-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                        <span>🌱</span>
                        <span>{t('marketplace_product_stake')}</span>
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

export default Marketplace
