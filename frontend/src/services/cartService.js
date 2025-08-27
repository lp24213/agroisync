import { toast } from 'react-hot-toast';

class CartService {
  constructor() {
    this.cartKey = 'agroisync_cart';
    this.wishlistKey = 'agroisync_wishlist';
  }

  // Carrinho de compras
  getCart() {
    try {
      const cart = localStorage.getItem(this.cartKey);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      return [];
    }
  }

  addToCart(product, quantity = 1) {
    try {
      const cart = this.getCart();
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        cart.push({
          ...product,
          quantity,
          totalPrice: product.price * quantity,
          addedAt: new Date().toISOString()
        });
      }

      localStorage.setItem(this.cartKey, JSON.stringify(cart));
      toast.success(`${product.name} adicionado ao carrinho!`);
      return cart;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar ao carrinho');
      return this.getCart();
    }
  }

  updateQuantity(productId, quantity) {
    try {
      const cart = this.getCart();
      const item = cart.find(item => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          return this.removeFromCart(productId);
        }
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
      }

      return cart;
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      return this.getCart();
    }
  }

  removeFromCart(productId) {
    try {
      const cart = this.getCart();
      const updatedCart = cart.filter(item => item.id !== productId);
      localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
      toast.success('Item removido do carrinho');
      return updatedCart;
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      return this.getCart();
    }
  }

  clearCart() {
    try {
      localStorage.removeItem(this.cartKey);
      toast.success('Carrinho limpo');
      return [];
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      return [];
    }
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  }

  getCartItemCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Wishlist
  getWishlist() {
    try {
      const wishlist = localStorage.getItem(this.wishlistKey);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Erro ao carregar wishlist:', error);
      return [];
    }
  }

  addToWishlist(product) {
    try {
      const wishlist = this.getWishlist();
      const exists = wishlist.find(item => item.id === product.id);

      if (!exists) {
        wishlist.push({
          ...product,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
        toast.success(`${product.name} adicionado aos favoritos!`);
      } else {
        toast.info(`${product.name} já está nos favoritos`);
      }

      return wishlist;
    } catch (error) {
      console.error('Erro ao adicionar à wishlist:', error);
      toast.error('Erro ao adicionar aos favoritos');
      return this.getWishlist();
    }
  }

  removeFromWishlist(productId) {
    try {
      const wishlist = this.getWishlist();
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      localStorage.setItem(this.wishlistKey, JSON.stringify(updatedWishlist));
      toast.success('Item removido dos favoritos');
      return updatedWishlist;
    } catch (error) {
      console.error('Erro ao remover da wishlist:', error);
      return this.getWishlist();
    }
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.id === productId);
  }

  // Processamento de intenção de compra (intermediação)
  async processPurchaseIntent(purchaseData) {
    try {
      // Criar intenção de compra para intermediação
      const purchaseIntent = {
        id: `INTENT_${Date.now()}`,
        items: this.getCart(),
        total: this.getCartTotal(),
        buyer: purchaseData.buyer,
        seller: purchaseData.seller,
        shipping: purchaseData.shipping,
        status: 'pending_negotiation',
        type: 'purchase_intent',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
      };

      // Simular envio para o banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Limpar carrinho após criar intenção
      this.clearCart();

      return {
        success: true,
        purchaseIntent,
        message: 'Intenção de compra registrada! O vendedor será notificado.'
      };
    } catch (error) {
      console.error('Erro ao processar intenção de compra:', error);
      return {
        success: false,
        message: 'Erro ao registrar intenção de compra'
      };
    }
  }

  // Processamento de intenção de frete (intermediação)
  async processFreightIntent(freightData) {
    try {
      // Criar intenção de frete para intermediação
      const freightIntent = {
        id: `FREIGHT_${Date.now()}`,
        freight: freightData.freight,
        total: freightData.total,
        shipper: freightData.shipper,
        carrier: freightData.carrier,
        route: freightData.route,
        status: 'pending_negotiation',
        type: 'freight_intent',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 dias
      };

      // Simular envio para o banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        freightIntent,
        message: 'Intenção de frete registrada! O transportador será notificado.'
      };
    } catch (error) {
      console.error('Erro ao processar intenção de frete:', error);
      return {
        success: false,
        message: 'Erro ao registrar intenção de frete'
      };
    }
  }

  // Validação de estoque
  validateStock(cart) {
    const errors = [];
    
    cart.forEach(item => {
      if (item.quantity > item.stock) {
        errors.push(`${item.name}: Quantidade solicitada (${item.quantity}) excede estoque disponível (${item.stock})`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Cálculo de frete
  calculateShipping(cart, destination) {
    // Simulação de cálculo de frete baseado no peso e distância
    const totalWeight = cart.reduce((weight, item) => {
      // Estimativa de peso por unidade (kg)
      const itemWeight = item.unit === 'kg' ? item.quantity : 
                        item.unit === 'sacos' ? item.quantity * 50 :
                        item.unit === 'unidade' ? item.quantity * 1000 : item.quantity;
      return weight + itemWeight;
    }, 0);

    // Frete base: R$ 0,50 por kg + R$ 10,00 fixo
    const baseShipping = (totalWeight * 0.5) + 10;
    
    // Ajuste por região (simulado)
    const regionMultiplier = {
      'MT': 1.0, 'PR': 1.2, 'SP': 1.1, 'GO': 1.0,
      'RS': 1.3, 'MG': 1.1, 'BA': 1.4, 'MS': 1.0
    };

    const region = destination?.split(', ')[1] || 'MT';
    const shippingCost = baseShipping * (regionMultiplier[region] || 1.0);

    return {
      cost: Math.round(shippingCost * 100) / 100,
      estimatedDays: this.estimateDeliveryDays(region),
      weight: totalWeight
    };
  }

  estimateDeliveryDays(region) {
    const deliveryDays = {
      'MT': 3, 'PR': 5, 'SP': 4, 'GO': 3,
      'RS': 7, 'MG': 4, 'BA': 8, 'MS': 3
    };
    return deliveryDays[region] || 5;
  }

  // Exportar dados do carrinho
  exportCart() {
    const cart = this.getCart();
    const dataStr = JSON.stringify(cart, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `carrinho_agroisync_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Importar dados do carrinho
  importCart(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const cart = JSON.parse(e.target.result);
          if (Array.isArray(cart)) {
            localStorage.setItem(this.cartKey, JSON.stringify(cart));
            toast.success('Carrinho importado com sucesso!');
            resolve(cart);
          } else {
            reject(new Error('Formato de arquivo inválido'));
          }
        } catch (error) {
          reject(new Error('Erro ao ler arquivo'));
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }
}

export default new CartService();
