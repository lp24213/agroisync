import { getApiUrl } from '../utils/apiHelper';

/**
 * Serviço de Cotações em Tempo Real
 * Integra com CEPEA, Agrolink e outras fontes
 */
class CotacoesService {
  constructor() {
    this.subscribers = new Map(); // Para real-time updates
  }

  /**
   * Buscar cotações em tempo real (sempre busca dados frescos)
   */
  async getCotacoesFresh(produtos = ['soja', 'milho', 'cafe']) {
    return this.getCotacoes(produtos);
  }

  /**
   * Buscar cotações (alias para getCotacoesFresh)
   */
  async getCotacoes(produtos = ['soja', 'milho', 'cafe']) {
    try {
      const apiUrl = getApiUrl('cotacoes');
      const response = await fetch(`${apiUrl}?produtos=${produtos.join(',')}&t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        // Usar data.cotacoes ou data.data dependendo do formato da resposta
        const cotacoes = data.data || data.cotacoes || {};
        
        // Notificar subscribers
        this.notifySubscribers(cotacoes);
        return {
          success: true,
          data: cotacoes,
          cached: false,
          timestamp: Date.now()
        };
      }
      throw new Error(data.error || 'Falha ao buscar cotações');
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      throw error;
    }
  }

  /**
   * Buscar cotação de um produto específico
   */
  async getCotacao(produto) {
    const result = await this.getCotacoesFresh([produto]);
    return result.data[produto] || null;
  }

  /**
   * Buscar histórico de preços
   */
  async getHistorico(produto, dias = 30) {
    const apiUrl = getApiUrl(`cotacoes/historico/${produto}`);
    const response = await fetch(`${apiUrl}?dias=${dias}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao buscar histórico');
    return {
      success: true,
      data: data.historico
    };
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
      // Silenciar erro - retornar erro estruturado
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
      // Silenciar erro - retornar lista vazia
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
      // Silenciar erro - retornar falha
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
    if (!this.subscribers) {
      this.subscribers = new Map();
    }
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
    if (!this.subscribers) {
      return;
    }
    Object.entries(cotacoes).forEach(([produto, dados]) => {
      const subs = this.subscribers.get(produto);
      if (subs) {
        subs.forEach(callback => callback(dados));
      }
    });
  }

  /**
   * Dados de fallback (quando API falhar)
   * Fallback removido: apenas dados reais disponíveis.
   */
  getFallbackData() {
    throw new Error('Fallback removido: apenas dados reais disponíveis.');
  }

  /**
   * Limpar cache
   */
  clearCache() {
    // Nenhuma ação, cache removido
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

