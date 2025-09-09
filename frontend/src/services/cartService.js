import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cart service
const cartService = {
  // Get cart from localStorage or API
  getCart() {
    try {
      const cart = localStorage.getItem('agroisync_cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      return [];
    }
  },

  // Save cart to localStorage
  saveCart(cart) {
    try {
      localStorage.setItem('agroisync_cart', JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      return cart;
    }
  },

  // Add item to cart
  addToCart(product, quantity = 1) {
    try {
      const cart = this.getCart();
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          totalPrice: product.price * quantity,
          image: product.image,
          category: product.category,
          seller: product.seller,
          location: product.location,
          addedAt: new Date().toISOString()
        };
        cart.push(cartItem);
      }

      return this.saveCart(cart);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      return this.getCart();
    }
  },

  // Remove item from cart
  removeFromCart(productId) {
    try {
      const cart = this.getCart();
      const updatedCart = cart.filter(item => item.id !== productId);
      return this.saveCart(updatedCart);
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      return this.getCart();
    }
  },

  // Update item quantity
  updateQuantity(productId, quantity) {
    try {
      const cart = this.getCart();
      const item = cart.find(item => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          return this.removeFromCart(productId);
        }
        
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.price;
      }

      return this.saveCart(cart);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      return this.getCart();
    }
  },

  // Clear cart
  clearCart() {
    try {
      return this.saveCart([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      return [];
    }
  },

  // Get cart total
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  },

  // Get cart item count
  getCartItemCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Calculate shipping
  calculateShipping(cart, destination) {
    try {
      // Mock shipping calculation
      const baseShipping = 50; // R$ 50 base
      const weightFactor = cart.length * 10; // R$ 10 per item
      const distanceFactor = this.getDistanceFactor(destination);
      
      const shippingCost = baseShipping + weightFactor + distanceFactor;

      return {
        cost: shippingCost,
        estimatedDays: this.getEstimatedDelivery(destination),
        carrier: 'Transportadora AgroSync'
      };
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      return {
        cost: 0,
        estimatedDays: 0,
        carrier: 'Não disponível'
      };
    }
  },

  // Get distance factor for shipping
  getDistanceFactor(destination) {
    const distanceMap = {
      'same_state': 0,
      'neighboring_state': 25,
      'far_state': 50,
      'north_region': 75,
      'northeast_region': 100,
      'south_region': 60,
      'southeast_region': 40,
      'center_west_region': 80
    };
    
    return distanceMap[destination] || 50;
  },

  // Get estimated delivery days
  getEstimatedDelivery(destination) {
    const deliveryMap = {
      'same_state': 2,
      'neighboring_state': 3,
      'far_state': 5,
      'north_region': 7,
      'northeast_region': 8,
      'south_region': 4,
      'southeast_region': 3,
      'center_west_region': 6
    };
    
    return deliveryMap[destination] || 5;
  },

  // Sync cart with server
  async syncCart() {
    try {
      const cart = this.getCart();
      const response = await api.post('/cart/sync', { cart });
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
      return { success: false, error: error.message };
    }
  },

  // Create purchase intent
  async createPurchaseIntent(cart, shippingInfo) {
    try {
      const total = this.getCartTotal();
      const shipping = this.calculateShipping(cart, shippingInfo.destination);
      
      const purchaseData = {
        items: cart,
        total: total,
        shipping: shipping,
        shippingInfo: shippingInfo,
        timestamp: new Date().toISOString()
      };

      const response = await api.post('/cart/purchase-intent', purchaseData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar intenção de compra:', error);
      return { success: false, error: error.message };
    }
  }
};

export default cartService;
