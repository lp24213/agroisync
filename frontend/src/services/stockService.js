import axios from 'axios'

class StockService {
  constructor() {
    this.alphaVantageApiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'your_alpha_vantage_api_key'
    this.iexApiKey = process.env.REACT_APP_IEX_API_KEY || 'your_iex_api_key'
    this.baseUrl = 'https://www.alphavantage.co/query'
    this.iexUrl = 'https://cloud.iexapis.com/stable'
  }

  // Obter cotações em tempo real
  async getRealTimeQuotes(symbols = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3']) {
    try {
      const quotes = []

      for (const symbol of symbols) {
        try {
          const quote = await this.getQuote(symbol)
          if (quote) {
            quotes.push(quote)
          }
        } catch (error) {
          console.error(`Erro ao obter cotação para ${symbol}:`, error)
        }
      }

      return quotes
    } catch (error) {
      console.error('Erro ao obter cotações:', error)
      throw new Error('Não foi possível obter cotações em tempo real')
    }
  }

  // Obter cotação individual
  async getQuote(symbol) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.alphaVantageApiKey
        }
      })

      if (response.data['Global Quote']) {
        const data = response.data['Global Quote']
        return this.formatQuote(data, symbol)
      } else {
        throw new Error('Dados de cotação não encontrados')
      }
    } catch (error) {
      console.error(`Erro ao obter cotação para ${symbol}:`, error)
      return null
    }
  }

  // Obter dados históricos
  async getHistoricalData(symbol, interval = 'daily', outputsize = 'compact') {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: symbol,
          interval: interval,
          outputsize: outputsize,
          apikey: this.alphaVantageApiKey
        }
      })

      if (response.data['Time Series (1min)']) {
        return this.formatHistoricalData(response.data['Time Series (1min)'])
      } else {
        throw new Error('Dados históricos não encontrados')
      }
    } catch (error) {
      console.error(`Erro ao obter dados históricos para ${symbol}:`, error)
      throw error
    }
  }

  // Obter dados de mercado brasileiro (B3)
  async getBrazilianMarketData() {
    try {
      // Usar dados simulados para B3 (devido a limitações da API gratuita)
      const brazilianStocks = [
        {
          symbol: 'PETR4',
          name: 'Petrobras PN',
          price: 28.45,
          change: 0.85,
          changePercent: 3.08,
          volume: 45678900,
          marketCap: 184500000000
        },
        {
          symbol: 'VALE3',
          name: 'Vale ON',
          price: 67.23,
          change: -1.27,
          changePercent: -1.85,
          volume: 23456700,
          marketCap: 156800000000
        },
        {
          symbol: 'ITUB4',
          name: 'Itaú PN',
          price: 32.18,
          change: 0.42,
          changePercent: 1.32,
          volume: 34567800,
          marketCap: 98700000000
        },
        {
          symbol: 'BBDC4',
          name: 'Bradesco PN',
          price: 15.67,
          change: -0.23,
          changePercent: -1.45,
          volume: 56789000,
          marketCap: 45600000000
        },
        {
          symbol: 'ABEV3',
          name: 'Ambev ON',
          price: 12.34,
          change: 0.18,
          changePercent: 1.48,
          volume: 78901200,
          marketCap: 23400000000
        }
      ]

      // Simular variações em tempo real
      return brazilianStocks.map(stock => ({
        ...stock,
        price: this.simulatePriceChange(stock.price, stock.changePercent),
        change: this.simulateChange(stock.change),
        changePercent: this.simulateChangePercent(stock.changePercent),
        volume: this.simulateVolume(stock.volume)
      }))
    } catch (error) {
      console.error('Erro ao obter dados do mercado brasileiro:', error)
      throw error
    }
  }

  // Obter dados de commodities agrícolas
  async getAgriculturalCommodities() {
    try {
      const commodities = [
        {
          symbol: 'SOJA',
          name: 'Soja',
          price: 125.67,
          change: 2.34,
          changePercent: 1.9,
          unit: 'USD/bushel',
          exchange: 'CBOT'
        },
        {
          symbol: 'MILHO',
          name: 'Milho',
          price: 4.89,
          change: -0.12,
          changePercent: -2.4,
          unit: 'USD/bushel',
          exchange: 'CBOT'
        },
        {
          symbol: 'CAFE',
          name: 'Café',
          price: 1.85,
          change: 0.08,
          changePercent: 4.52,
          unit: 'USD/lb',
          exchange: 'ICE'
        },
        {
          symbol: 'ACUCAR',
          name: 'Açúcar',
          price: 0.23,
          change: 0.01,
          changePercent: 4.55,
          unit: 'USD/lb',
          exchange: 'ICE'
        },
        {
          symbol: 'ALGODAO',
          name: 'Algodão',
          price: 0.89,
          change: -0.03,
          changePercent: -3.26,
          unit: 'USD/lb',
          exchange: 'ICE'
        }
      ]

      // Simular variações em tempo real
      return commodities.map(commodity => ({
        ...commodity,
        price: this.simulatePriceChange(commodity.price, commodity.changePercent),
        change: this.simulateChange(commodity.change),
        changePercent: this.simulateChangePercent(commodity.changePercent)
      }))
    } catch (error) {
      console.error('Erro ao obter dados de commodities:', error)
      throw error
    }
  }

  // Obter dados de câmbio
  async getExchangeRates() {
    try {
      const rates = [
        {
          symbol: 'USD/BRL',
          name: 'Dólar/Real',
          rate: 5.23,
          change: 0.08,
          changePercent: 1.55
        },
        {
          symbol: 'EUR/BRL',
          name: 'Euro/Real',
          rate: 5.67,
          change: 0.12,
          changePercent: 2.16
        },
        {
          symbol: 'GBP/BRL',
          name: 'Libra/Real',
          rate: 6.45,
          change: -0.05,
          changePercent: -0.77
        }
      ]

      // Simular variações em tempo real
      return rates.map(rate => ({
        ...rate,
        rate: this.simulatePriceChange(rate.rate, rate.changePercent),
        change: this.simulateChange(rate.change),
        changePercent: this.simulateChangePercent(rate.changePercent)
      }))
    } catch (error) {
      console.error('Erro ao obter taxas de câmbio:', error)
      throw error
    }
  }

  // Formatar cotação
  formatQuote(data, symbol) {
    return {
      symbol: symbol,
      price: parseFloat(data['05. price']) || 0,
      change: parseFloat(data['09. change']) || 0,
      changePercent: parseFloat(data['10. change percent'].replace('%', '')) || 0,
      volume: parseInt(data['06. volume']) || 0,
      previousClose: parseFloat(data['08. previous close']) || 0,
      open: parseFloat(data['02. open']) || 0,
      high: parseFloat(data['03. high']) || 0,
      low: parseFloat(data['04. low']) || 0,
      timestamp: new Date()
    }
  }

  // Formatar dados históricos
  formatHistoricalData(timeSeriesData) {
    const formattedData = []

    Object.keys(timeSeriesData).forEach(timestamp => {
      const data = timeSeriesData[timestamp]
      formattedData.push({
        timestamp: new Date(timestamp),
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      })
    })

    return formattedData.sort((a, b) => a.timestamp - b.timestamp)
  }

  // Simular variação de preço
  simulatePriceChange(basePrice, changePercent) {
    const variation = (Math.random() - 0.5) * 0.02; // ±1%
    return parseFloat((basePrice * (1 + variation)).toFixed(2))
  }

  // Simular variação
  simulateChange(baseChange) {
    const variation = (Math.random() - 0.5) * 0.1; // ±5%
    return parseFloat((baseChange * (1 + variation)).toFixed(2))
  }

  // Simular percentual de variação
  simulateChangePercent(baseChangePercent) {
    const variation = (Math.random() - 0.5) * 0.2; // ±10%
    return parseFloat((baseChangePercent * (1 + variation)).toFixed(2))
  }

  // Simular volume
  simulateVolume(baseVolume) {
    const variation = (Math.random() - 0.5) * 0.15; // ±7.5%
    return Math.round(baseVolume * (1 + variation))
  }

  // Obter dados completos do mercado
  async getMarketOverview() {
    try {
      const [stocks, commodities, rates] = await Promise.all([
        this.getBrazilianMarketData(),
        this.getAgriculturalCommodities(),
        this.getExchangeRates()
      ])

      return {
        stocks,
        commodities,
        rates,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Erro ao obter visão geral do mercado:', error)
      throw error
    }
  }

  // Buscar símbolo
  async searchSymbol(query) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: this.alphaVantageApiKey
        }
      })

      if (response.data.bestMatches) {
        return response.data.bestMatches.map(match => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          marketOpen: match['5. marketOpen'],
          marketClose: match['6. marketClose'],
          timezone: match['7. timezone'],
          currency: match['8. currency']
        }))
      }

      return []
    } catch (error) {
      console.error('Erro na busca de símbolos:', error)
      return []
    }
  }
}

const stockService = new StockService()
export default stockService
