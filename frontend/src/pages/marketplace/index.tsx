import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingCartIcon,
  StarIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  category: string
  price: string
  description: string
  seller: string
  rating: number
  stock: number
  image?: string
  discount?: number
  isNew?: boolean
  isFeatured?: boolean
}

const Marketplace: NextPage = () => {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Sementes de Soja Premium BRS 7580',
      category: 'Sementes',
      price: 'R$ 89,90',
      description: 'Sementes certificadas de soja de alta produtividade, resistentes a pragas e doenças. Rendimento superior a 80 sacas/hectare.',
      seller: 'AgroSementes Brasil',
      rating: 4.8,
      stock: 1500,
      image: '/images/futuristic-farm.svg',
      discount: 15,
      isNew: true,
      isFeatured: true
    },
    {
      id: '2',
      name: 'Fertilizante NPK 20-10-10 Plus',
      category: 'Fertilizantes',
      price: 'R$ 245,00',
      description: 'Fertilizante balanceado com micronutrientes essenciais para todas as fases do desenvolvimento vegetal.',
      seller: 'NutriAgro Ltda',
      rating: 4.6,
      stock: 800,
      image: '/images/staking-farming.svg',
      discount: 10
    },
    {
      id: '3',
      name: 'Pulverizador Costal Manual 20L',
      category: 'Equipamentos',
      price: 'R$ 189,90',
      description: 'Pulverizador costal com bico regulável, ideal para aplicação de defensivos em pequenas áreas.',
      seller: 'Máquinas Agrícolas Express',
      rating: 4.4,
      stock: 120,
      image: '/images/cyber-defense.svg'
    },
    {
      id: '4',
      name: 'Defensivo Biológico Bacillus Thuringiensis',
      category: 'Pesticidas',
      price: 'R$ 156,00',
      description: 'Controle biológico eficaz contra lagartas, seguro para o meio ambiente e certificado orgânico.',
      seller: 'BioDefensivos Naturais',
      rating: 4.9,
      stock: 300,
      image: '/images/futuristic-farm.svg',
      isNew: true
    },
    {
      id: '5',
      name: 'Trator Agrícola Massey Ferguson 6713',
      category: 'Maquinário',
      price: 'R$ 285.000,00',
      description: 'Trator de 130cv com cabine climatizada, GPS integrado e sistema de telemetria avançado.',
      seller: 'Máquinas Pesadas MT',
      rating: 4.7,
      stock: 3,
      image: '/images/staking-farming.svg',
      isFeatured: true
    },
    {
      id: '6',
      name: 'Sistema de Irrigação por Gotejamento',
      category: 'Equipamentos',
      price: 'R$ 2.890,00',
      description: 'Sistema completo de irrigação automatizada com sensores de umidade e controle via smartphone.',
      seller: 'Irrigação Inteligente',
      rating: 4.5,
      stock: 45,
      image: '/images/cyber-defense.svg',
      discount: 20
    },
    {
      id: '7',
      name: 'Adubo Orgânico Compostado',
      category: 'Fertilizantes',
      price: 'R$ 78,50',
      description: 'Adubo 100% orgânico rico em matéria orgânica e nutrientes essenciais para o solo.',
      seller: 'Orgânicos do Brasil',
      rating: 4.8,
      stock: 2000,
      image: '/images/futuristic-farm.svg'
    },
    {
      id: '8',
      name: 'Monitor de Solo Digital',
      category: 'Equipamentos',
      price: 'R$ 1.250,00',
      description: 'Sensor avançado para monitoramento de pH, umidade e temperatura do solo em tempo real.',
      seller: 'Tecnologia Agrícola',
      rating: 4.6,
      stock: 67,
      image: '/images/staking-farming.svg',
      isNew: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Sementes', 'Fertilizantes', 'Equipamentos', 'Pesticidas', 'Maquinário']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen cosmic-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
          </div>
                     <p className="mt-6 text-cosmic text-xl">{t('marketplace_loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{t('marketplace_title')} - {t('app_name')}</title>
        <meta name="description" content={t('marketplace_description')} />
      </Head>

      <div className="min-h-screen cosmic-background">
        {/* Partículas cósmicas */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="cosmic-particle w-2 h-2 top-20 left-10 animate-float"></div>
          <div className="cosmic-particle w-1 h-1 top-40 right-20 animate-float-reverse animation-delay-1000"></div>
          <div className="cosmic-particle w-3 h-3 top-60 left-1/4 animate-float animation-delay-2000"></div>
          <div className="cosmic-particle w-1 h-1 top-80 right-1/3 animate-float-reverse animation-delay-3000"></div>
          <div className="cosmic-particle w-2 h-2 bottom-40 left-1/3 animate-float animation-delay-1500"></div>
          <div className="cosmic-particle w-1 h-1 bottom-20 right-10 animate-float-reverse animation-delay-2500"></div>
        </div>

        {/* Header Section */}
        <section className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-b border-purple-500/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <RocketLaunchIcon className="h-16 w-16 text-purple-400 animate-pulse" />
                <h1 className="text-5xl md:text-6xl font-bold text-cosmic-glow">
                  {t('marketplace_main_title')}
                </h1>
                <SparklesIcon className="h-16 w-16 text-cyan-400 animate-pulse" />
              </div>
                             <p className="text-2xl text-purple-silver max-w-3xl mx-auto leading-relaxed">
                 {t('marketplace_subtitle')}
               </p>
              <div className="flex items-center justify-center gap-4 text-purple-silver">
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                                     <span>{t('marketplace_stats_ratings')}</span>
                </div>
                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-5 w-5 text-cyan-400" />
                                     <span>{t('marketplace_stats_sales')}</span>
                </div>
                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-purple-400" />
                                     <span>{t('marketplace_stats_secure')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="cosmic-card p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                                         placeholder={t('marketplace_search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="cosmic-input w-full pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-3">
                  <FunnelIcon className="h-5 w-5 text-purple-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="cosmic-input"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                                                 {category === 'all' ? t('marketplace_category_all') : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <ShoppingCartIcon className="h-16 w-16 text-purple-400" />
                </div>
                                 <p className="text-purple-silver text-xl">{t('marketplace_no_results')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="cosmic-card group hover:scale-105 transition-all duration-500 animation-delay-100"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="relative overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-t-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                                     <span className="text-purple-400 text-lg">{t('marketplace_no_image')}</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                                                         {t('marketplace_badge_new')}
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30">
                                                         {t('marketplace_badge_featured')}
                          </span>
                        )}
                      </div>
                      
                      {product.discount && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30">
                            -{product.discount}%
                          </span>
                        </div>
                      )}
                      
                      <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-purple-silver font-medium">{product.rating}</span>
                        </div>
                                                 <span className="text-sm text-purple-silver/70">{t('marketplace_stock_label')}: {product.stock}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-cosmic mb-3 line-clamp-2">{product.name}</h3>
                      <p className="text-purple-silver text-sm mb-4 line-clamp-3 leading-relaxed">{product.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                          {product.discount ? (
                            <>
                              <div className="text-2xl font-bold text-purple-silver">{product.price}</div>
                              <div className="text-sm text-purple-silver/70 line-through">
                                R$ {(parseFloat(product.price.replace('R$ ', '').replace(',', '.')) * (1 + product.discount / 100)).toFixed(2).replace('.', ',')}
                              </div>
                            </>
                          ) : (
                            <div className="text-2xl font-bold text-purple-silver">{product.price}</div>
                          )}
                        </div>
                      </div>
                      
                                             <div className="text-sm text-purple-silver/70 mb-4">{t('marketplace_sold_by')}: {product.seller}</div>
                      
                      <div className="flex gap-3">
                        <button className="cosmic-button flex-1 flex items-center justify-center gap-2 group">
                          <ShoppingCartIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                     {t('marketplace_buy_button')}
                        </button>
                        <button className="cosmic-button bg-gradient-to-r from-gray-600 to-gray-500 flex items-center justify-center gap-2 group">
                          <StarIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                     {t('marketplace_favorite_button')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Marketplace
