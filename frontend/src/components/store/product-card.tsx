'use client'

import { motion } from 'framer-motion'
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react'
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

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card p-6 border border-border/50 hover:border-primary/50 transition-all duration-300"
    >
      <div className="relative mb-4">
        <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center mb-3">
          <div className="text-muted-foreground text-center">
            <div className="text-4xl mb-2">🌾</div>
            <div className="text-sm">{product.name}</div>
          </div>
        </div>
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
            Esgotado
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-card/80 hover:bg-card"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-card/80 hover:bg-card"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-foreground">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          size="sm"
          className="bg-gradient-to-r from-neon-blue to-neon-cyan disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Adicionar' : 'Esgotado'}
        </Button>
      </div>
    </motion.div>
  )
}
