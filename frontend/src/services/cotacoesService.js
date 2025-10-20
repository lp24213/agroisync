import { getApiUrl } from '../utils/apiHelper';

/**
 * Serviço de Cotações em Tempo Real
 * Integra com CEPEA, Agrolink e outras fontes
 */
class CotacoesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    this.subscribers = new Map(); // Para real-time updates
  }

  /**
   * Buscar cotações em tempo real
   */
  async getCotacoes(produtos = ['soja', 'milho', 'cafe']) {
    const cacheKey = `cotacoes_${produtos.join('_')}`;
    
    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return {
          success: true,
          data: cached.data,
          cached: true,
          timestamp: cached.timestamp
        };
      }
    }

    try {
      const apiUrl = getApiUrl('cotacoes');
      const response = await fetch(`${apiUrl}?produtos=${produtos.join(',')}`);
      const data = await response.json();
      
      if (data.success) {
        // Salvar no cache
        this.cache.set(cacheKey, {
          data: data.cotacoes,
          timestamp: Date.now()
        });
        
        // Notificar subscribers
        this.notifySubscribers(data.cotacoes);
        
        return {
          success: true,
          data: data.cotacoes,
          cached: false,
          timestamp: Date.now()
        };
      }
      
      throw new Error(data.error || 'Erro ao buscar cotações');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao buscar cotações:', error);
      
      // Retornar dados em cache ou fallback
      const cached = this.cache.get(cacheKey);
      return {
        success: false,
        data: cached?.data || this.getFallbackData(),
        error: error.message,
        cached: true
      };
    }
  }

  /**
   * Buscar cotação de um produto específico
   */
  async getCotacao(produto) {
    const result = await this.getCotacoes([produto]);
    return result.data[produto] || null;
  }

  /**
   * Buscar histórico de preços
   */
  async getHistorico(produto, dias = 30) {
    try {
      const apiUrl = getApiUrl(`cotacoes/historico/${produto}`);
      const response = await fetch(`${apiUrl}?dias=${dias}`);
      const data = await response.json();
      
      return {
        success: true,
        data: data.historico
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao buscar histórico:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Criar alerta de preço
   */
  async createAlert(produto, precoAlvo, condition = 'below') {
    try {
      const apiUrl = getApiUrl('price-alerts');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          produto, 
          precoAlvo: parseFloat(precoAlvo), 
          condition 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar alerta');
      }

      return {
        success: true,
        data: data.alert
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao criar alerta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Listar alertas do usuário
   */
  async getMyAlerts() {
    try {
      const apiUrl = getApiUrl('price-alerts');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      return {
        success: true,
        data: data.alerts || []
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao listar alertas:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Deletar alerta
   */
  async deleteAlert(alertId) {
    try {
      const apiUrl = getApiUrl(`price-alerts/${alertId}`);
      const token = localStorage.getItem('token');

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao deletar alerta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar se preço é oportunidade
   */
  isOportunidade(precoAnuncio, precoMercado, limitePercentual = -5) {
    if (!precoMercado || !precoAnuncio) {
      return {
        isOportunidade: false,
        percentual: 0,
        economia: 0
      };
    }

    const diferenca = ((precoAnuncio - precoMercado) / precoMercado) * 100;
    const economia = precoMercado - precoAnuncio;
    
    return {
      isOportunidade: diferenca < limitePercentual,
      percentual: diferenca.toFixed(2),
      economia: economia.toFixed(2),
      economiaTotal: economia > 0 ? economia : 0
    };
  }

  /**
   * Calcular variação de preço
   */
  calculateVariation(precoAtual, precoAnterior) {
    if (!precoAnterior || precoAnterior === 0) return 0;
    
    return ((precoAtual - precoAnterior) / precoAnterior) * 100;
  }

  /**
   * Subscribe para updates em tempo real
   */
  subscribe(produto, callback) {
    if (!this.subscribers.has(produto)) {
      this.subscribers.set(produto, []);
    }
    
    this.subscribers.get(produto).push(callback);
    
    // Retornar função de unsubscribe
    return () => {
      const subs = this.subscribers.get(produto);
      const index = subs.indexOf(callback);
      if (index > -1) {
        subs.splice(index, 1);
      }
    };
  }

  /**
   * Notificar subscribers
   */
  notifySubscribers(cotacoes) {
    Object.entries(cotacoes).forEach(([produto, dados]) => {
      const subs = this.subscribers.get(produto);
      if (subs) {
        subs.forEach(callback => callback(dados));
      }
    });
  }

  /**
   * Dados de fallback (quando API falhar)
   */
  getFallbackData() {
    return {
      soja: { 
        preco: 120.00, 
        variacao: 0, 
        fonte: 'cache',
        timestamp: new Date().toISOString()
      },
      milho: { 
        preco: 85.00, 
        variacao: 0, 
        fonte: 'cache',
        timestamp: new Date().toISOString()
      },
      cafe: { 
        preco: 1200.00, 
        variacao: 0, 
        fonte: 'cache',
        timestamp: new Date().toISOString()
      },
      trigo: { 
        preco: 95.00, 
        variacao: 0, 
        fonte: 'cache',
        timestamp: new Date().toISOString()
      },
      'boi-gordo': {
        preco: 320.00,
        variacao: 0,
        fonte: 'cache',
        unidade: '@', // Arroba
        timestamp: new Date().toISOString()
      },
      leite: {
        preco: 2.50,
        variacao: 0,
        fonte: 'cache',
        unidade: 'L',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Limpar cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Formatar preço para exibição
   */
  formatPrice(preco, unidade = 'saca') {
    const unidades = {
      'saca': '/sc',
      'kg': '/kg',
      'ton': '/t',
      '@': '/@', // Arroba
      'L': '/L',
      'cabeça': '/cab',
      'm³': '/m³'
    };

    return `R$ ${preco.toFixed(2)}${unidades[unidade] || ''}`;
  }
}

export default new CotacoesService();

