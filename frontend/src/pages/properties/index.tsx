import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface Property {
  id: string
  name: string
  description: string
  image: string
  category: 'fazenda' | 'sítio' | 'chácara' | 'haras' | 'equipamento'
  status: 'ativo' | 'inativo' | 'manutenção'
  hectares: number
  location: string
  cropType?: string
  brand?: string
  model?: string
  year?: number
  price: string
  owner: string
  views: number
  likes: number
  createdAt: string
}

const Properties: NextPage = () => {
  const { t } = useI18n();
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'Fazenda Santa Maria',
      description: 'Propriedade agrícola de excelência com solo fértil e infraestrutura completa para produção de grãos e pecuária.',
      image: '/images/futuristic-farm.svg',
      category: 'fazenda',
      status: 'ativo',
      hectares: 1500,
      location: 'Mato Grosso, Brasil',
      cropType: 'Soja, Milho, Algodão',
      price: 'R$ 15.000.000',
      owner: 'AgroTech Ltda',
      views: 1247,
      likes: 89,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sítio Boa Vista',
      description: 'Propriedade familiar com produção orgânica de hortaliças e frutas, ideal para agricultura sustentável.',
      image: '/images/staking-farming.svg',
      category: 'sítio',
      status: 'ativo',
      hectares: 25,
      location: 'São Paulo, Brasil',
      cropType: 'Hortaliças, Frutas',
      price: 'R$ 850.000',
      owner: 'Família Silva',
      views: 892,
      likes: 156,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Chácara Vale Verde',
      description: 'Propriedade com foco em turismo rural e produção de vinhos artesanais, com paisagens deslumbrantes.',
      image: '/images/cyber-defense.svg',
      category: 'chácara',
      status: 'ativo',
      hectares: 8,
      location: 'Rio Grande do Sul, Brasil',
      cropType: 'Uvas, Vinhos',
      price: 'R$ 1.200.000',
      owner: 'Vinhos Artesanais RS',
      views: 1567,
      likes: 234,
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      name: 'Haras Estrela do Sul',
      description: 'Haras de elite com infraestrutura para criação e treinamento de cavalos de raça, com pista de treinamento.',
      image: '/images/futuristic-farm.svg',
      category: 'haras',
      status: 'ativo',
      hectares: 45,
      location: 'Minas Gerais, Brasil',
      cropType: 'Criação de Cavalos',
      price: 'R$ 2.800.000',
      owner: 'Haras Elite Brasil',
      views: 2034,
      likes: 312,
      createdAt: '2024-01-01'
    },
    {
      id: '5',
      name: 'Trator John Deere 8R 370',
      description: 'Trator de alta potência com tecnologia de precisão, GPS integrado e sistema de telemetria avançado.',
      image: '/images/staking-farming.svg',
      category: 'equipamento',
      status: 'ativo',
      brand: 'John Deere',
      model: '8R 370',
      year: 2023,
      price: 'R$ 1.850.000',
      owner: 'Máquinas Agrícolas MT',
      views: 3456,
      likes: 445,
      createdAt: '2023-12-20'
    },
    {
      id: '6',
      name: 'Fazenda Nova Esperança',
      description: 'Propriedade com certificação orgânica, foco em agricultura regenerativa e produção sustentável.',
      image: '/images/cyber-defense.svg',
      category: 'fazenda',
      status: 'ativo',
      hectares: 800,
      location: 'Goiás, Brasil',
      cropType: 'Orgânicos, Biodiversidade',
      price: 'R$ 8.500.000',
      owner: 'Agricultura Sustentável Ltda',
      views: 1789,
      likes: 267,
      createdAt: '2023-12-15'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fazenda' as Property['category'],
    hectares: '',
    location: '',
    cropType: '',
    price: ''
  })

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'ativo': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
      case 'inativo': return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30'
      case 'manutenção': return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30'
      default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30'
    }
  }

  const getStatusLabel = (status: Property['status']) => {
    switch (status) {
      case 'ativo': return t('properties_status_active')
      case 'inativo': return t('properties_status_inactive')
      case 'manutenção': return t('properties_status_maintenance')
      default: return t('properties_status_unknown')
    }
  }

  const getCategoryLabel = (category: Property['category']) => {
    switch (category) {
      case 'fazenda': return t('properties_category_farm')
      case 'sítio': return t('properties_category_small_farm')
      case 'chácara': return t('properties_category_country_house')
      case 'haras': return t('properties_category_horse_farm')
      case 'equipamento': return t('properties_category_equipment')
      default: return t('properties_category_other')
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || property.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCreateProperty = async () => {
    try {
      const newProperty: Property = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        image: '/images/futuristic-farm.svg',
        category: formData.category,
        status: 'ativo',
        hectares: parseFloat(formData.hectares) || 0,
        location: formData.location,
        cropType: formData.cropType,
        price: formData.price,
                 owner: t('properties_current_user'),
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setProperties(prev => [newProperty, ...prev])
      setShowCreateModal(false)
      setFormData({
        name: '',
        description: '',
        category: 'fazenda',
        hectares: '',
        location: '',
        cropType: '',
        price: ''
      })
    } catch (error) {
             console.error(t('properties_create_error'), error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen cosmic-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
          </div>
                     <p className="mt-6 text-cosmic text-xl">{t('properties_loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{t('properties_title')} - {t('app_name')}</title>
        <meta name="description" content={t('properties_description')} />
        <link rel="icon" href="/favicon.ico" />
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

        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-b border-purple-500/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-cosmic-glow flex items-center gap-3">
                  <SparklesIcon className="h-10 w-10 text-purple-400 animate-pulse" />
                  {t('properties_main_title')}
                </h1>
                <p className="text-xl text-purple-silver">{t('properties_subtitle')}</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="cosmic-button flex items-center gap-2 group"
              >
                <PlusIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {t('properties_create_button')}
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="cosmic-card p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-silver mb-3">{t('properties_search_label')}</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    placeholder={t('properties_search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="cosmic-input w-full pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-silver mb-3">{t('properties_category_label')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="cosmic-input w-full"
                >
                  <option value="all">{t('properties_category_all')}</option>
                  <option value="fazenda">{t('properties_category_farm')}</option>
                  <option value="sítio">{t('properties_category_small_farm')}</option>
                  <option value="chácara">{t('properties_category_country_house')}</option>
                  <option value="haras">{t('properties_category_horse_farm')}</option>
                  <option value="equipamento">{t('properties_category_equipment')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-silver mb-3">{t('properties_status_label')}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="cosmic-input w-full"
                >
                  <option value="all">{t('properties_status_all')}</option>
                  <option value="ativo">{t('properties_status_active')}</option>
                  <option value="inativo">{t('properties_status_inactive')}</option>
                  <option value="manutenção">{t('properties_status_maintenance')}</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedStatus('all')
                  }} 
                  className="cosmic-button w-full bg-gradient-to-r from-gray-600 to-gray-500"
                >
                  {t('properties_clear_filters')}
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <MapPinIcon className="h-16 w-16 text-purple-400" />
                </div>
                <p className="text-purple-silver text-xl mb-6">{t('properties_no_results')}</p>
                <button onClick={() => setShowCreateModal(true)} className="cosmic-button">
                  {t('properties_create_first')}
                </button>
              </div>
            ) : (
              filteredProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  className="cosmic-card group hover:scale-105 transition-all duration-500 animation-delay-100"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30">
                      {getCategoryLabel(property.category)}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-purple-silver flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {property.views.toLocaleString()}
                      </span>
                      <span className="text-sm text-purple-silver flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        {property.likes}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-cosmic mb-3 line-clamp-1">{property.name}</h3>
                    <p className="text-purple-silver text-sm mb-4 line-clamp-2">{property.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {property.hectares > 0 && (
                        <div className="flex items-center text-sm text-purple-silver">
                          <span className="font-medium text-purple-300">{t('properties_area_label')}:</span>
                                                     <span className="ml-2">{property.hectares.toLocaleString()} {t('properties_hectares_unit')}</span>
                        </div>
                      )}
                      {property.location && (
                        <div className="flex items-center text-sm text-purple-silver">
                          <span className="font-medium text-purple-300">{t('properties_location_label')}:</span>
                          <span className="ml-2">{property.location}</span>
                        </div>
                      )}
                      {property.cropType && (
                        <div className="flex items-center text-sm text-purple-silver">
                          <span className="font-medium text-purple-300">{t('properties_crop_type_label')}:</span>
                          <span className="ml-2">{property.cropType}</span>
                        </div>
                      )}
                      {property.brand && (
                        <div className="flex items-center text-sm text-purple-silver">
                          <span className="font-medium text-purple-300">{t('properties_brand_label')}:</span>
                          <span className="ml-2">{property.brand}</span>
                        </div>
                      )}
                      {property.model && (
                        <div className="flex items-center text-sm text-purple-silver">
                          <span className="font-medium text-purple-300">{t('properties_model_label')}:</span>
                          <span className="ml-2">{property.model}</span>
                        </div>
                      )}
                      {property.year && (
                        <div className="flex items-center text-sm text-purple-silver">
                          <span className="font-medium text-purple-300">{t('properties_year_label')}:</span>
                          <span className="ml-2">{property.year}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-purple-500/20 pt-4">
                      <div className="text-2xl font-bold text-purple-silver mb-2">{property.price}</div>
                      <span className="text-sm text-purple-silver/70">{t('properties_owner_label')}: {property.owner}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Property Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="cosmic-card p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-cosmic-glow mb-6 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-purple-400" />
                {t('properties_create_new_title')}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-silver mb-2">{t('properties_form_name_label')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('properties_form_name_placeholder')}
                    className="cosmic-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-silver mb-2">{t('properties_form_description_label')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder={t('properties_form_description_placeholder')}
                    className="cosmic-input w-full resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-silver mb-2">{t('properties_form_category_label')}</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as Property['category']})}
                      className="cosmic-input w-full"
                    >
                      <option value="fazenda">{t('properties_category_farm')}</option>
                      <option value="sítio">{t('properties_category_small_farm')}</option>
                      <option value="chácara">{t('properties_category_country_house')}</option>
                      <option value="haras">{t('properties_category_horse_farm')}</option>
                      <option value="equipamento">{t('properties_category_equipment')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-silver mb-2">{t('properties_form_area_label')}</label>
                    <input
                      type="number"
                      value={formData.hectares}
                      onChange={(e) => setFormData({...formData, hectares: e.target.value})}
                      placeholder={t('properties_form_area_placeholder')}
                      className="cosmic-input w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-silver mb-2">{t('properties_form_location_label')}</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder={t('properties_form_location_placeholder')}
                    className="cosmic-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-silver mb-2">{t('properties_form_price_label')}</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder={t('properties_form_price_placeholder')}
                    className="cosmic-input w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="cosmic-button bg-gradient-to-r from-gray-600 to-gray-500"
                >
                  {t('properties_form_cancel_button')}
                </button>
                <button onClick={handleCreateProperty} className="cosmic-button">
                  {t('properties_form_submit_button')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Properties
