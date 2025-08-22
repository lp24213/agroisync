'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Package, 
  Truck, 
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  UserPlus,
  PackagePlus,
  TruckIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type AdminTab = 'overview' | 'users' | 'products' | 'freights' | 'system'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  lastLogin: Date
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: Date
}

interface Freight {
  id: string
  title: string
  origin: string
  destination: string
  status: 'available' | 'in_transit' | 'completed'
  price: number
  createdAt: Date
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@agrosync.com.br',
    role: 'Admin',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@agrosync.com.br',
    role: 'Produtor',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-12-20'),
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro.costa@agrosync.com.br',
    role: 'Transportador',
    status: 'inactive',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date('2024-12-15'),
  },
]

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Semente de Soja Premium',
    category: 'Sementes',
    price: 89.90,
    stock: 150,
    status: 'active',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Fertilizante NPK 20-20-20',
    category: 'Fertilizantes',
    price: 45.50,
    stock: 0,
    status: 'out_of_stock',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '3',
    name: 'Pulverizador Manual 20L',
    category: 'Equipamentos',
    price: 189.90,
    stock: 25,
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
]

const mockFreights: Freight[] = [
  {
    id: '1',
    title: 'Frete Soja MT → SP',
    origin: 'Cuiabá, MT',
    destination: 'São Paulo, SP',
    status: 'available',
    price: 4500,
    createdAt: new Date('2024-12-20'),
  },
  {
    id: '2',
    title: 'Frete Milho PR → RS',
    origin: 'Curitiba, PR',
    destination: 'Porto Alegre, RS',
    status: 'in_transit',
    price: 3200,
    createdAt: new Date('2024-12-19'),
  },
  {
    id: '3',
    title: 'Frete Trigo RS → MG',
    origin: 'Pelotas, RS',
    destination: 'Belo Horizonte, MG',
    status: 'completed',
    price: 3800,
    createdAt: new Date('2024-12-18'),
  },
]

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const tabs: Array<{ id: AdminTab; label: string; icon: any }> = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'freights', label: 'Fretes', icon: Truck },
    { id: 'system', label: 'Sistema', icon: Settings },
  ]

  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Produtos Ativos',
      value: '89',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Fretes em Andamento',
      value: '23',
      change: '-3%',
      changeType: 'negative' as const,
      icon: Truck,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 125K',
      change: '+18%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-muted text-muted-foreground border-border'
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in_transit': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'out_of_stock': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'inactive': return 'Inativo'
      case 'suspended': return 'Suspenso'
      case 'available': return 'Disponível'
      case 'in_transit': return 'Em Trânsito'
      case 'completed': return 'Concluído'
      case 'out_of_stock': return 'Sem Estoque'
      default: return status
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6 border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Atividade Recente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Novo usuário registrado</div>
                      <div className="text-xs text-muted-foreground">Há 2 horas</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Produto atualizado</div>
                      <div className="text-xs text-muted-foreground">Há 4 horas</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Frete concluído</div>
                      <div className="text-xs text-muted-foreground">Há 6 horas</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Ações Rápidas
                </h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600">
                    <PackagePlus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-600">
                    <TruckIcon className="w-4 h-4 mr-2" />
                    Gerenciar Fretes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-neon-blue to-neon-cyan">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            <div className="glass-card border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Usuário</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Função</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Último Login</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/20 hover:bg-secondary/20">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">{user.role}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                            {getStatusLabel(user.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">
                            {user.lastLogin.toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="out_of_stock">Sem Estoque</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-neon-blue to-neon-cyan">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            <div className="glass-card border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Produto</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Categoria</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Preço</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Estoque</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border/20 hover:bg-secondary/20">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-foreground">{product.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {product.id}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">{product.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">{product.stock}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            {getStatusLabel(product.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'freights':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar fretes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todos os Status</option>
                  <option value="available">Disponível</option>
                  <option value="in_transit">Em Trânsito</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>
              <Button className="bg-gradient-to-r from-neon-blue to-neon-cyan">
                <Plus className="w-4 h-4 mr-2" />
                Novo Frete
              </Button>
            </div>

            <div className="glass-card border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Frete</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Origem → Destino</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Preço</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFreights.map((freight) => (
                      <tr key={freight.id} className="border-b border-border/20 hover:bg-secondary/20">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-foreground">{freight.title}</div>
                            <div className="text-sm text-muted-foreground">ID: {freight.id}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">
                            {freight.origin} → {freight.destination}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">
                            R$ {freight.price.toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(freight.status)}`}>
                            {getStatusLabel(freight.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'system':
        return (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Configurações do Sistema
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Manutenção</div>
                    <div className="text-sm text-muted-foreground">Modo de manutenção ativo</div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Backup</div>
                    <div className="text-sm text-muted-foreground">Último backup: há 2 horas</div>
                  </div>
                  <Button variant="outline">Executar Backup</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Logs</div>
                    <div className="text-sm text-muted-foreground">Visualizar logs do sistema</div>
                  </div>
                  <Button variant="outline">Visualizar</Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              <span className="gradient-text">Administração</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Painel administrativo para gestão completa da plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card p-6 border border-border/50">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="glass-card p-8 border border-border/50">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                </div>

                {renderTabContent()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
