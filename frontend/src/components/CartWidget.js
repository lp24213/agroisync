import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash,
  Package,
  Truck,
  ArrowRight,
  Download,
  Upload,
  MessageSquare
} from 'lucide-react'
import cartService from '../services/cartService'

const CartWidget = ({ isOpen, onClose, onCheckout }) => {
  const [cart, setCart] = useState([])

  const [shippingInfo, setShippingInfo] = useState({
    destination: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  const loadCart = () => {
    const currentCart = cartService.getCart()
    setCart(currentCart)
  }

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartService.updateQuantity(productId, quantity)
    setCart(updatedCart)
  }

  const removeItem = productId => {
    const updatedCart = cartService.removeFromCart(productId)
    setCart(updatedCart)
  }

  const clearCart = () => {
    const updatedCart = cartService.clearCart()
    setCart(updatedCart)
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0)
  }

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const calculateShipping = () => {
    if (!shippingInfo.destination) return 0
    const shipping = cartService.calculateShipping(cart, shippingInfo.destination)
    return shipping.cost
  }

  const getGrandTotal = () => {
    return getTotal() + calculateShipping()
  }

  const handlePurchaseIntent = () => {
    if (cart.length === 0) return

    // Transformar em modelo de intermediação - "Solicitar Cotação"
    const quotationData = {
      buyer: {
        id: 'buyer_id', // Será obtido do contexto de autenticação
        name: 'Comprador',
        email: 'comprador@email.com'
      },
      seller: {
        id: cart[0]?.seller?.id || 'seller_id', // ID do vendedor do primeiro produto
        name: cart[0]?.seller?.name || 'Vendedor'
      },
      shipping: {
        ...shippingInfo,
        cost: calculateShipping()
      },
      type: 'quotation', // Indicar que é uma cotação
      status: 'pending' // Status inicial da cotação
    }

    if (onCheckout) {
      onCheckout(quotationData)
    }
  }

  const exportCart = () => {
    cartService.exportCart()
  }

  const importCart = event => {
    const file = event.target.files[0]
    if (file) {
      cartService
        .importCart(file)
        .then(updatedCart => {
          setCart(updatedCart)
        })
        .catch(error => {
          console.error('Erro ao importar carrinho:', error)
        })
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 overflow-hidden'>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Carrinho */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className='absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl'
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-200 p-6'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white'>
              <ShoppingCart className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-slate-800'>Pedido de Cotação</h2>
              <p className='text-sm text-slate-600'>{getItemCount()} item(s) para cotação</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Conteúdo */}
        <div className='flex-1 overflow-y-auto p-6'>
          {cart.length === 0 ? (
            <div className='py-12 text-center'>
              <Package className='mx-auto mb-4 h-16 w-16 text-slate-300' />
              <h3 className='mb-2 text-lg font-medium text-slate-600'>Nenhum produto selecionado</h3>
              <p className='text-slate-500'>Adicione produtos para solicitar cotação</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {/* Lista de produtos */}
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex space-x-4 rounded-lg bg-slate-50 p-4'
                >
                  {/* Imagem */}
                  <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200'>
                    <img src={item.image} alt={item.name} className='h-full w-full object-cover' />
                  </div>

                  {/* Informações */}
                  <div className='min-w-0 flex-1'>
                    <h4 className='truncate font-medium text-slate-800'>{item.name}</h4>
                    <p className='text-sm text-slate-600'>{item.category}</p>
                    <p className='text-lg font-bold text-emerald-600'>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>

                  {/* Controles */}
                  <div className='flex flex-col items-end space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300'
                      >
                        <Minus className='h-3 w-3' />
                      </button>
                      <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300'
                      >
                        <Plus className='h-3 w-3' />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className='flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200'
                    >
                      <Trash className='h-3 w-3' />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Informações de frete */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='rounded-lg border border-blue-200 bg-blue-50 p-4'
              >
                <div className='mb-3 flex items-center space-x-2'>
                  <Truck className='h-5 w-5 text-blue-600' />
                  <h4 className='font-medium text-blue-800'>Informações de Frete</h4>
                </div>

                <div className='space-y-2'>
                  <input
                    type='text'
                    placeholder='Destino (ex: São Paulo, SP)'
                    value={shippingInfo.destination}
                    onChange={e => setShippingInfo({ ...shippingInfo, destination: e.target.value })}
                    className='w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  />

                  {shippingInfo.destination && (
                    <div className='text-sm text-blue-700'>
                      <p>Frete: R$ {calculateShipping().toFixed(2).replace('.', ',')}</p>
                      <p>
                        Prazo estimado: {cartService.estimateDeliveryDays(shippingInfo.destination.split(', ')[1])} dias
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Resumo */}
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Subtotal:</span>
                  <span>R$ {getTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Frete:</span>
                  <span>R$ {calculateShipping().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className='border-t border-slate-200 pt-2'>
                  <div className='flex justify-between text-lg font-bold'>
                    <span>Total:</span>
                    <span>R$ {getGrandTotal().toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className='space-y-4 border-t border-slate-200 p-6'>
            {/* Ações */}
            <div className='flex space-x-2'>
              <button
                onClick={exportCart}
                className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-200'
              >
                <Download className='h-4 w-4' />
                <span>Exportar</span>
              </button>

              <label className='flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-600 transition-colors hover:bg-slate-200'>
                <Upload className='h-4 w-4' />
                <span>Importar</span>
                <input type='file' accept='.json' onChange={importCart} className='hidden' />
              </label>
            </div>

            {/* Botões principais */}
            <div className='flex space-x-3'>
              <button
                onClick={clearCart}
                className='flex items-center space-x-2 rounded-lg bg-red-100 px-4 py-3 text-red-600 transition-colors hover:bg-red-200'
              >
                <Trash className='h-4 w-4' />
                <span>Limpar</span>
              </button>

              <button
                onClick={handlePurchaseIntent}
                disabled={!shippingInfo.destination}
                className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-emerald-600 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <MessageSquare className='h-4 w-4' />
                <span>Solicitar Cotação</span>
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default CartWidget
