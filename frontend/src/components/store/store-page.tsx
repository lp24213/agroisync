'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Package,
  Truck,
  Shield
} from 'lucide-react'
import { ProductCard } from './product-card'
import { CartSidebar } from './cart-sidebar'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  tags: string[]
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Semente de Soja Premium',
    description: 'Semente de soja de alta qualidade para plantio',
    price: 89.90,
    originalPrice: 119.90,
    image: '/api/placeholder/300/300',
    category: 'Sementes',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    tags: ['Premium', 'Soja', 'Alta Produtividade'],
  },
  {
    id: '2',
    name: 'Fertilizante NPK 20-20-20',
    description: 'Fertilizante balanceado para todas as culturas',
    price: 45.50,
    image: '/api/placeholder/300/300',
    category: 'Fertilizantes',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ['NPK', 'Balanceado', 'Universal'],
  },
  {
    id: '3',
    name: 'Pulverizador Manual 20L',
    description: 'Pulverizador manual para aplicação de defensivos',
    price: 189.90,
    image: '/api/placeholder/300/300',
    category: 'Equipamentos',
    rating: 4.4,
    reviews: 67,
    inStock: true,
    tags: ['Manual', '20L', 'Defensivos'],
  },
  {
    id: '4',
    name: 'Defensivo Biológico',
    description: 'Controle biológico para pragas e doenças',
    price: 78.90,
    image: '/api/placeholder/300/300',
    category: 'Defensivos',
    rating: 4.7,
    reviews: 234,
    inStock: false,
    tags: ['Biológico', 'Natural', 'Seguro'],
  },
  {
    id: '5',
    name: 'Semente de Milho Híbrido',
    description: 'Semente de milho híbrido para alta produtividade',
    price: 156.90,
    image: '/api/placeholder/300/300',
    category: 'Sementes',
    rating: 4.9,
    reviews: 189,
    inStock: true,
    tags: ['Híbrido', 'Milho', 'Alta Produtividade'],
  },
  {
    id: '6',
    name: 'Adubo Orgânico 50kg',
    description: 'Adubo orgânico rico em nutrientes',
    price: 67.90,
    image: '/api/placeholder/300/300',
    category: 'Fertilizantes',
    rating: 4.5,
    reviews: 123,
    inStock: true,
    tags: ['Orgânico', '50kg', 'Nutrientes'],
  },
]

const categories = ['Todos', 'Sementes', 'Fertilizantes', 'Equipamentos', 'Defensivos']
const priceRanges = ['Todos', 'Até R$ 50', 'R$ 50 - R$ 100', 'R$ 100 - R$ 200', 'Acima de R$ 200']

export function StorePage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedPriceRange, setSelectedPriceRange] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product])
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const getFilteredProducts = () => {
    let filtered = products

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (selectedPriceRange !== 'Todos') {
      switch (selectedPriceRange) {
        case 'Até R$ 50':
          filtered = filtered.filter(product => product.price <= 50)
          break
        case 'R$ 50 - R$ 100':
          filtered = filtered.filter(product => product.price > 50 && product.price <= 100)
          break
        case 'R$ 100 - R$ 200':
          filtered = filtered.filter(product => product.price > 100 && product.price <= 200)
          break
        case 'Acima de R$ 200':
          filtered = filtered.filter(product => product.price > 200)
          break
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'name':
      default:
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                <span className="gradient-text">Loja Online</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Catálogo completo de produtos agrícolas
              </p>
            </div>
            <Button
              onClick={() => setShowCart(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-neon-blue to-neon-cyan"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Carrinho ({cart.length})</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="glass-card p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="name">Nome</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="rating">Melhor Avaliação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou buscar por outros termos.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Filtros
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Categoria
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Faixa de Preço
                    </label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {priceRanges.map(range => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Informações
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Frete grátis acima de R$ 200</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Garantia de 30 dias</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Entrega em até 5 dias úteis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showCart && (
        <CartSidebar
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          total={cartTotal}
        />
      )}
    </div>
  )
}
