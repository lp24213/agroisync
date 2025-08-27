import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, X, Plus, Minus, Trash, Package, 
  Truck, CreditCard, ArrowRight, Download, Upload,
  MessageSquare
} from 'lucide-react';
import cartService from '../services/cartService';

const CartWidget = ({ isOpen, onClose, onCheckout }) => {
  const [cart, setCart] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    destination: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = () => {
    const currentCart = cartService.getCart();
    setCart(currentCart);
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartService.updateQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cartService.removeFromCart(productId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    const updatedCart = cartService.clearCart();
    setCart(updatedCart);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const calculateShipping = () => {
    if (!shippingInfo.destination) return 0;
    const shipping = cartService.calculateShipping(cart, shippingInfo.destination);
    return shipping.cost;
  };

  const getGrandTotal = () => {
    return getTotal() + calculateShipping();
  };

  const handlePurchaseIntent = () => {
    if (cart.length === 0) return;
    
    const purchaseData = {
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
      }
    };

    if (onCheckout) {
      onCheckout(purchaseData);
    }
  };

  const exportCart = () => {
    cartService.exportCart();
  };

  const importCart = (event) => {
    const file = event.target.files[0];
    if (file) {
      cartService.importCart(file).then(updatedCart => {
        setCart(updatedCart);
      }).catch(error => {
        console.error('Erro ao importar carrinho:', error);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Carrinho */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
                         <div>
               <h2 className="text-xl font-bold text-slate-800">Carrinho de Interesse</h2>
               <p className="text-sm text-slate-600">{getItemCount()} item(s) para negociação</p>
             </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Carrinho vazio</h3>
              <p className="text-slate-500">Adicione produtos para começar suas compras</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Lista de produtos */}
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-4 p-4 bg-slate-50 rounded-lg"
                >
                  {/* Imagem */}
                  <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">{item.name}</h4>
                    <p className="text-sm text-slate-600">{item.category}</p>
                    <p className="text-lg font-bold text-emerald-600">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Informações de frete */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Informações de Frete</h4>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Destino (ex: São Paulo, SP)"
                    value={shippingInfo.destination}
                    onChange={(e) => setShippingInfo({...shippingInfo, destination: e.target.value})}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  
                  {shippingInfo.destination && (
                    <div className="text-sm text-blue-700">
                      <p>Frete: R$ {calculateShipping().toFixed(2).replace('.', ',')}</p>
                      <p>Prazo estimado: {cartService.estimateDeliveryDays(shippingInfo.destination.split(', ')[1])} dias</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Resumo */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {getTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>R$ {calculateShipping().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between font-bold text-lg">
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
          <div className="border-t border-slate-200 p-6 space-y-4">
            {/* Ações */}
            <div className="flex space-x-2">
              <button
                onClick={exportCart}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              
              <label className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importCart}
                  className="hidden"
                />
              </label>
            </div>

            {/* Botões principais */}
            <div className="flex space-x-3">
              <button
                onClick={clearCart}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
              >
                <Trash className="w-4 h-4" />
                <span>Limpar</span>
              </button>
              
                             <button
                 onClick={handlePurchaseIntent}
                 disabled={!shippingInfo.destination}
                 className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <MessageSquare className="w-4 h-4" />
                 <span>Registrar Intenção</span>
                 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartWidget;
