'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Trash2, CreditCard, Truck } from 'lucide-react'
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

interface CartSidebarProps {
  cart: Product[]
  onClose: () => void
  onRemoveItem: (productId: string) => void
  total: number
}

export function CartSidebar({ cart, onClose, onRemoveItem, total }: CartSidebarProps) {
  const shipping = total > 200 ? 0 : 15.90
  const finalTotal = total + shipping

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Carrinho</h2>
                  <p className="text-sm text-muted-foreground">{cart.length} itens</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Carrinho vazio
                  </h3>
                  <p className="text-muted-foreground">
                    Adicione produtos para começar suas compras.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-lg">🌾</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-muted-foreground text-xs truncate">
                          {item.category}
                        </p>
                        <p className="font-semibold text-foreground text-sm">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border/50 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-foreground">
                      {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold border-t border-border/30 pt-2">
                    <span>Total</span>
                    <span className="text-primary">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-neon-blue to-neon-cyan"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Finalizar Compra
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Continuar Comprando
                  </Button>
                </div>

                {total < 200 && (
                  <div className="text-center p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary">
                      Adicione mais R$ {(200 - total).toFixed(2).replace('.', ',')} para frete grátis!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
