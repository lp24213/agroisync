import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  UserGroupIcon, 
  HomeIcon, 
  ShoppingBagIcon, 
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useI18n } from '../../i18n/I18nProvider'
import { useAuth } from '../../hooks/useAuth'
import ProtectedRoute from '../../components/auth/ProtectedRoute'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  verified: boolean
  createdAt: Date
  lastLogin: Date
}

interface Property {
  id: string
  name: string
  owner: string
  price: number
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
}

interface Product {
  id: string
  name: string
  seller: string
  price: number
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
}

interface Transaction {
  id: string
  type: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  createdAt: Date
}

export default function AdminPage() {
  const { t } = useI18n()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Verificar se o usuário é admin
  useEffect(() => {
    if (authLoading) return

    if (!user || !isAdmin) {
      router.push('/')
      return
    }

    loadAdminData()
  }, [user, isAdmin, authLoading, router])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Simular dados de admin (em produção, viriam das APIs)
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'luispaulodeoliveira@agrotm.com.br',
          name: 'Luis Paulo de Oliveira',
          role: 'admin',
          verified: true,
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        },
        {
          id: '2',
          email: 'usuario1@agrotm.com.br',
          name: 'João Silva',
          role: 'user',
          verified: true,
          createdAt: new Date('2024-02-01'),
          lastLogin: new Date('2024-08-18')
        },
        {
          id: '3',
          email: 'usuario2@agrotm.com.br',
          name: 'Maria Santos',
          role: 'user',
          verified: false,
          createdAt: new Date('2024-03-01'),
          lastLogin: new Date('2024-08-17')
        }
      ]

      const mockProperties: Property[] = [
        {
          id: '1',
          name: 'Fazenda São João',
          owner: 'João Silva',
          price: 2500000,
          status: 'active',
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'Sítio Boa Vista',
          owner: 'Maria Santos',
          price: 1800000,
          status: 'pending',
          createdAt: new Date('2024-02-20')
        }
      ]

      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Trator John Deere',
          seller: 'João Silva',
          price: 150000,
          status: 'active',
          createdAt: new Date('2024-01-10')
        },
        {
          id: '2',
          name: 'Sementes de Soja',
          seller: 'Maria Santos',
          price: 5000,
          status: 'pending',
          createdAt: new Date('2024-02-15')
        }
      ]

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'Compra de Propriedade',
          amount: 2500000,
          status: 'completed',
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          type: 'Venda de Produto',
          amount: 150000,
          status: 'pending',
          createdAt: new Date('2024-02-10')
        }
      ]

      setUsers(mockUsers)
      setProperties(mockProperties)
      setProducts(mockProducts)
      setTransactions(mockTransactions)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'verify':
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, verified: true } : user
        ))
        break
      case 'delete':
        setUsers(prev => prev.filter(user => user.id !== userId))
        break
    }
  }

  const handlePropertyAction = (action: string, propertyId: string) => {
    switch (action) {
      case 'approve':
        setProperties(prev => prev.map(prop => 
          prop.id === propertyId ? { ...prop, status: 'active' } : prop
        ))
        break
      case 'reject':
        setProperties(prev => prev.map(prop => 
          prop.id === propertyId ? { ...prop, status: 'inactive' } : prop
        ))
        break
    }
  }

  const handleProductAction = (action: string, productId: string) => {
    switch (action) {
      case 'approve':
        setProducts(prev => prev.map(prod => 
          prod.id === productId ? { ...prod, status: 'active' } : prod
        ))
        break
      case 'reject':
        setProducts(prev => prev.map(prod => 
          prod.id === productId ? { ...prod, status: 'inactive' } : prod
        ))
        break
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAuth requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Admin: luispaulodeoliveira@agrotm.com.br
                </span>
                <button
                  onClick={() => router.push('/')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Voltar ao Site
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
                { id: 'users', name: 'Usuários', icon: UserGroupIcon },
                { id: 'properties', name: 'Propriedades', icon: HomeIcon },
                { id: 'marketplace', name: 'Marketplace', icon: ShoppingBagIcon },
                { id: 'transactions', name: 'Transações', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'dashboard' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Visão Geral</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total de Usuários</p>
                        <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <HomeIcon className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-600">Propriedades</p>
                        <p className="text-2xl font-bold text-green-900">{properties.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-600">Produtos</p>
                        <p className="text-2xl font-bold text-purple-900">{products.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CogIcon className="h-8 w-8 text-orange-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-orange-600">Transações</p>
                        <p className="text-2xl font-bold text-orange-900">{transactions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h2>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Adicionar Usuário
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Usuário'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.verified ? 'Sim' : 'Não'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {!user.verified && (
                                <button
                                  onClick={() => handleUserAction('verify', user.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Verificar
                                </button>
                              )}
                              <button
                                onClick={() => handleUserAction('delete', user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gerenciar Propriedades</h2>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Adicionar Propriedade
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proprietário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProperties.map((property) => (
                        <tr key={property.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.owner}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {property.price.toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              property.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : property.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {property.status === 'active' ? 'Ativo' : property.status === 'pending' ? 'Pendente' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePropertyAction('approve', property.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handlePropertyAction('reject', property.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Rejeitar
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Gerenciar Marketplace</h2>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Adicionar Produto
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.seller}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleProductAction('approve', product.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleProductAction('reject', product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Rejeitar
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Transações</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {transaction.amount.toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status === 'completed' ? 'Concluída' : transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.createdAt.toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
