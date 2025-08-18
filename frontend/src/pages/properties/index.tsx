import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon
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
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.data.properties)
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || property.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800'
      case 'inativo': return 'bg-gray-100 text-gray-800'
      case 'manutenção': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Property['status']) => {
    switch (status) {
      case 'ativo': return 'Ativo'
      case 'inativo': return 'Inativo'
      case 'manutenção': return 'Manutenção'
      default: return 'Desconhecido'
    }
  }

  const getCategoryLabel = (category: Property['category']) => {
    switch (category) {
      case 'fazenda': return 'Fazenda'
      case 'sítio': return 'Sítio'
      case 'chácara': return 'Chácara'
      case 'haras': return 'Haras'
      case 'equipamento': return 'Equipamento'
      default: return 'Outro'
    }
  }

  const handleCreateProperty = async () => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      if (data.success) {
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
        fetchProperties()
      }
    } catch (error) {
      console.error('Erro ao criar propriedade:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando propriedades...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Propriedades - AgroSync</title>
        <meta name="description" content="Gerencie suas propriedades rurais e equipamentos agrícolas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Propriedades Rurais</h1>
                <p className="text-gray-600">Gerencie suas propriedades e equipamentos agrícolas</p>
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Cadastrar Propriedade
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar propriedades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="fazenda">Fazenda</option>
                  <option value="sítio">Sítio</option>
                  <option value="chácara">Chácara</option>
                  <option value="haras">Haras</option>
                  <option value="equipamento">Equipamento</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="manutenção">Manutenção</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedStatus('all')
                }} variant="outline" className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-4">Nenhuma propriedade encontrada</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Cadastrar Primeira Propriedade
                </Button>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                      {getCategoryLabel(property.category)}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 inline mr-1" />
                        {property.views}
                      </span>
                      <span className="text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        {property.likes}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{property.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {property.metadata?.hectares && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Área:</span>
                          <span className="ml-2">{property.metadata.hectares} hectares</span>
                        </div>
                      )}
                      {property.metadata?.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Localização:</span>
                          <span className="ml-2">{property.metadata.location}</span>
                        </div>
                      )}
                      {property.metadata?.cropType && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Cultura:</span>
                          <span className="ml-2">{property.metadata.cropType}</span>
                        </div>
                      )}
                      {property.metadata?.brand && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Marca:</span>
                          <span className="ml-2">{property.metadata.brand}</span>
                        </div>
                      )}
                      {property.metadata?.model && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Modelo:</span>
                          <span className="ml-2">{property.metadata.model}</span>
                        </div>
                      )}
                      {property.metadata?.year && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Ano:</span>
                          <span className="ml-2">{property.metadata.year}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="text-2xl font-bold text-green-600">{property.price}</div>
                      <span className="text-sm text-gray-500">Proprietário: {property.owner}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Create Property Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cadastrar Nova Propriedade</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Propriedade</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome da Propriedade"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva sua propriedade..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as Property['category']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="fazenda">Fazenda</option>
                      <option value="sítio">Sítio</option>
                      <option value="chácara">Chácara</option>
                      <option value="haras">Haras</option>
                      <option value="equipamento">Equipamento</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área (hectares)</label>
                    <Input
                      type="number"
                      value={formData.hectares}
                      onChange={(e) => setFormData({...formData, hectares: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Cidade, Estado"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                  <Input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProperty}>
                  Cadastrar Propriedade
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Properties
