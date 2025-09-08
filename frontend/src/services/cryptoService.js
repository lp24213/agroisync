import axios from 'axios'

// Configurações das APIs
const BINANCE_API_URL = 'https://api.binance.com/api/v3'
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

// Tipos de criptomoedas
export const CRYPTO_TYPES = {
  BITCOIN: 'Bitcoin',
  ETHEREUM: 'Ethereum',
  BINANCE_COIN: 'Binance Coin',
  CARDANO: 'Cardano',
  SOLANA: 'Solana',
  POLKADOT: 'Polkadot',
  DOGECOIN: 'Dogecoin',
  AVALANCHE: 'Avalanche',
  CHAINLINK: 'Chainlink',
  POLYGON: 'Polygon'
}

// Estados de transação
export const TRANSACTION_STATUS = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelada'
}

// Tipos de transação
export const TRANSACTION_TYPES = {
  BUY: 'Compra',
  SELL: 'Venda',
  TRANSFER: 'Transferência',
  STAKE: 'Staking',
  UNSTAKE: 'Unstaking',
  REWARDS: 'Recompensas'
}

// Configurações de rede
export const NETWORKS = {
  ETHEREUM: {
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    explorer: 'https://etherscan.io'
  },
  BINANCE_SMART_CHAIN: {
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com'
  },
  POLYGON: {
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com'
  }
}

class CryptoService {
  constructor() {
    this.isConnected = false
    this.currentAccount = null
    this.currentNetwork = null
    this.prices = new Map()
    this.priceUpdateInterval = null
    this.subscribers = new Set()
  }

  // Conectar à carteira Web3 (Metamask)
  async connectWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Metamask não encontrado. Instale a extensão Metamask.')
      }

      // Solicitar conexão
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada.')
      }

      this.currentAccount = accounts[0]
      this.currentNetwork = await this.getCurrentNetwork()
      this.isConnected = true

      // Escutar mudanças de conta
      window.ethereum.on('accountsChanged', accounts => {
        this.currentAccount = accounts[0] || null
        this.notifySubscribers()
      })

      // Escutar mudanças de rede
      window.ethereum.on('chainChanged', chainId => {
        this.currentNetwork = this.getNetworkByChainId(chainId)
        this.notifySubscribers()
      })

      console.log('🔗 Carteira conectada:', {
        account: this.currentAccount,
        network: this.currentNetwork
      })

      return {
        success: true,
        account: this.currentAccount,
        network: this.currentNetwork
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error)
      throw error
    }
  }

  // Desconectar carteira
  disconnectWallet() {
    this.isConnected = false
    this.currentAccount = null
    this.currentNetwork = null
    this.notifySubscribers()

    console.log('🔌 Carteira desconectada')
  }

  // Obter rede atual
  async getCurrentNetwork() {
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      })
      return this.getNetworkByChainId(chainId)
    } catch (error) {
      console.error('Erro ao obter rede atual:', error)
      return NETWORKS.ETHEREUM
    }
  }

  // Obter rede por Chain ID
  getNetworkByChainId(chainId) {
    const chainIdHex = typeof chainId === 'string' ? chainId : `0x${chainId.toString(16)}`

    switch (chainIdHex) {
      case '0x1':
        return NETWORKS.ETHEREUM
      case '0x38':
        return NETWORKS.BINANCE_SMART_CHAIN
      case '0x89':
        return NETWORKS.POLYGON
      default:
        return NETWORKS.ETHEREUM
    }
  }

  // Obter saldo da carteira
  async getWalletBalance() {
    if (!this.isConnected || !this.currentAccount) {
      throw new Error('Carteira não conectada')
    }

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.currentAccount, 'latest']
      })

      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18)

      return {
        success: true,
        balance: balanceInEth,
        symbol: this.currentNetwork.symbol,
        account: this.currentAccount
      }
    } catch (error) {
      console.error('Erro ao obter saldo:', error)
      throw error
    }
  }

  // Obter preços das criptomoedas via CoinGecko
  async getCryptoPrices(symbols = ['bitcoin', 'ethereum', 'binancecoin']) {
    try {
      const response = await axios.get(
        `${COINGECKO_API_URL}/simple/price?ids=${symbols.join(',')}&vs_currencies=usd,brl&include_24hr_change=true&include_market_cap=true`
      )

      const prices = {}
      symbols.forEach(symbol => {
        if (response.data[symbol]) {
          prices[symbol] = {
            usd: response.data[symbol].usd,
            brl: response.data[symbol].brl,
            change24h: response.data[symbol].usd_24h_change,
            marketCap: response.data[symbol].usd_market_cap
          }
        }
      })

      // Atualizar cache local
      this.prices = new Map(Object.entries(prices))
      this.notifySubscribers()

      return {
        success: true,
        prices: prices,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Erro ao obter preços:', error)
      throw error
    }
  }

  // Obter dados históricos para gráficos
  async getHistoricalData(coinId, days = 30, currency = 'usd') {
    try {
      const response = await axios.get(
        `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
      )

      const prices = response.data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
        date: new Date(timestamp).toISOString()
      }))

      const volumes = response.data.total_volumes.map(([timestamp, volume]) => ({
        timestamp,
        volume,
        date: new Date(timestamp).toISOString()
      }))

      return {
        success: true,
        prices,
        volumes,
        marketCaps: response.data.market_caps
      }
    } catch (error) {
      console.error('Erro ao obter dados históricos:', error)
      throw error
    }
  }

  // Obter informações detalhadas da criptomoeda
  async getCryptoInfo(coinId) {
    try {
      const response = await axios.get(
        `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=false`
      )

      return {
        success: true,
        info: {
          id: response.data.id,
          name: response.data.name,
          symbol: response.data.symbol.toUpperCase(),
          description: response.data.description.en,
          image: response.data.image.large,
          currentPrice: response.data.market_data.current_price,
          marketCap: response.data.market_data.market_cap,
          volume24h: response.data.market_data.total_volume,
          change24h: response.data.market_data.price_change_percentage_24h,
          ath: response.data.market_data.ath,
          athDate: response.data.market_data.ath_date,
          atl: response.data.market_data.atl,
          atlDate: response.data.market_data.atl_date,
          circulatingSupply: response.data.market_data.circulating_supply,
          totalSupply: response.data.market_data.total_supply,
          maxSupply: response.data.market_data.max_supply
        }
      }
    } catch (error) {
      console.error('Erro ao obter informações da cripto:', error)
      throw error
    }
  }

  // Obter dados do mercado via Binance
  async getBinanceMarketData(symbol = 'BTCUSDT') {
    try {
      const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr?symbol=${symbol}`)

      return {
        success: true,
        data: {
          symbol: response.data.symbol,
          priceChange: parseFloat(response.data.priceChange),
          priceChangePercent: parseFloat(response.data.priceChangePercent),
          weightedAvgPrice: parseFloat(response.data.weightedAvgPrice),
          prevClosePrice: parseFloat(response.data.prevClosePrice),
          lastPrice: parseFloat(response.data.lastPrice),
          lastQty: parseFloat(response.data.lastQty),
          bidPrice: parseFloat(response.data.bidPrice),
          askPrice: parseFloat(response.data.askPrice),
          openPrice: parseFloat(response.data.openPrice),
          highPrice: parseFloat(response.data.highPrice),
          lowPrice: parseFloat(response.data.lowPrice),
          volume: parseFloat(response.data.volume),
          quoteVolume: parseFloat(response.data.quoteVolume),
          openTime: response.data.openTime,
          closeTime: response.data.closeTime,
          count: response.data.count
        }
      }
    } catch (error) {
      console.error('Erro ao obter dados Binance:', error)
      throw error
    }
  }

  // Obter ordem book da Binance
  async getBinanceOrderBook(symbol = 'BTCUSDT', limit = 20) {
    try {
      const response = await axios.get(`${BINANCE_API_URL}/depth?symbol=${symbol}&limit=${limit}`)

      return {
        success: true,
        orderBook: {
          bids: response.data.bids.map(([price, quantity]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity)
          })),
          asks: response.data.asks.map(([price, quantity]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity)
          })),
          lastUpdateId: response.data.lastUpdateId
        }
      }
    } catch (error) {
      console.error('Erro ao obter order book:', error)
      throw error
    }
  }

  // Simular compra de criptomoeda
  async simulateBuy(amount, cryptoId, price) {
    try {
      // Em produção, integrar com DEX ou exchange
      const transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'BUY',
        cryptoId,
        amount,
        price,
        total: amount * price,
        status: 'PENDING',
        timestamp: Date.now(),
        network: this.currentNetwork?.name || 'Unknown'
      }

      console.log('🔄 Simulando compra:', transaction)

      return {
        success: true,
        transaction
      }
    } catch (error) {
      console.error('Erro ao simular compra:', error)
      throw error
    }
  }

  // Simular venda de criptomoeda
  async simulateSell(amount, cryptoId, price) {
    try {
      const transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'SELL',
        cryptoId,
        amount,
        price,
        total: amount * price,
        status: 'PENDING',
        timestamp: Date.now(),
        network: this.currentNetwork?.name || 'Unknown'
      }

      console.log('🔄 Simulando venda:', transaction)

      return {
        success: true,
        transaction
      }
    } catch (error) {
      console.error('Erro ao simular venda:', error)
      throw error
    }
  }

  // Simular staking
  async simulateStake(amount, cryptoId, apy) {
    try {
      const transaction = {
        id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'STAKE',
        cryptoId,
        amount,
        apy,
        estimatedRewards: (amount * apy) / 100,
        status: 'PENDING',
        timestamp: Date.now(),
        network: this.currentNetwork?.name || 'Unknown'
      }

      console.log('🔒 Simulando staking:', transaction)

      return {
        success: true,
        transaction
      }
    } catch (error) {
      console.error('Erro ao simular staking:', error)
      throw error
    }
  }

  // Obter portfólio do usuário
  async getUserPortfolio() {
    try {
      // Em produção, buscar do backend
      const portfolio = {
        totalValue: 0,
        totalChange24h: 0,
        assets: [
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            amount: 0.5,
            avgPrice: 45000,
            currentPrice: 50000,
            value: 25000,
            change24h: 11.11,
            allocation: 50
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            amount: 5,
            avgPrice: 3000,
            currentPrice: 3500,
            value: 17500,
            change24h: 16.67,
            allocation: 35
          },
          {
            id: 'binancecoin',
            symbol: 'BNB',
            name: 'Binance Coin',
            amount: 20,
            avgPrice: 400,
            currentPrice: 450,
            value: 9000,
            change24h: 12.5,
            allocation: 15
          }
        ]
      }

      // Calcular totais
      portfolio.totalValue = portfolio.assets.reduce((sum, asset) => sum + asset.value, 0)
      portfolio.totalChange24h = portfolio.assets.reduce(
        (sum, asset) => sum + (asset.value * asset.change24h) / 100,
        0
      )

      return {
        success: true,
        portfolio
      }
    } catch (error) {
      console.error('Erro ao obter portfólio:', error)
      throw error
    }
  }

  // Obter histórico de transações
  async getTransactionHistory() {
    try {
      // Em produção, buscar do backend
      const transactions = [
        {
          id: 'tx_001',
          type: 'BUY',
          cryptoId: 'bitcoin',
          symbol: 'BTC',
          amount: 0.1,
          price: 45000,
          total: 4500,
          status: 'CONFIRMED',
          timestamp: Date.now() - 86400000, // 1 dia atrás
          network: 'Ethereum'
        },
        {
          id: 'tx_002',
          type: 'SELL',
          cryptoId: 'ethereum',
          symbol: 'ETH',
          amount: 2,
          price: 3200,
          total: 6400,
          status: 'CONFIRMED',
          timestamp: Date.now() - 172800000, // 2 dias atrás
          network: 'Ethereum'
        },
        {
          id: 'tx_003',
          type: 'STAKE',
          cryptoId: 'cardano',
          symbol: 'ADA',
          amount: 1000,
          apy: 5.5,
          status: 'CONFIRMED',
          timestamp: Date.now() - 259200000, // 3 dias atrás
          network: 'Cardano'
        }
      ]

      return {
        success: true,
        transactions
      }
    } catch (error) {
      console.error('Erro ao obter histórico:', error)
      throw error
    }
  }

  // Iniciar atualizações de preço em tempo real
  startPriceUpdates(intervalMs = 30000) {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
    }

    this.priceUpdateInterval = setInterval(async () => {
      try {
        await this.getCryptoPrices()
      } catch (error) {
        console.error('Erro na atualização de preços:', error)
      }
    }, intervalMs)

    console.log('📊 Atualizações de preço iniciadas:', intervalMs + 'ms')
  }

  // Parar atualizações de preço
  stopPriceUpdates() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval)
      this.priceUpdateInterval = null
      console.log('📊 Atualizações de preço paradas')
    }
  }

  // Sistema de notificações para mudanças de preço
  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback({
          isConnected: this.isConnected,
          currentAccount: this.currentAccount,
          currentNetwork: this.currentNetwork,
          prices: Object.fromEntries(this.prices)
        })
      } catch (error) {
        console.error('Erro ao notificar subscriber:', error)
      }
    })
  }

  // Limpar dados de desenvolvimento
  clearDevelopmentData() {
    this.prices.clear()
    this.subscribers.clear()
    this.stopPriceUpdates()
    console.log('Dados de desenvolvimento limpos')
  }

  // Verificar se Metamask está disponível
  isMetamaskAvailable() {
    return typeof window.ethereum !== 'undefined'
  }

  // Obter status da conexão
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      currentAccount: this.currentAccount,
      currentNetwork: this.currentNetwork,
      metamaskAvailable: this.isMetamaskAvailable()
    }
  }

  // Obter top criptomoedas
  async getTopCryptos() {
    try {
      // Simular dados de top criptomoedas
      const topCryptos = [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 45000 + (Math.random() - 0.5) * 5000,
          change24h: (Math.random() - 0.5) * 10,
          marketCap: '850B',
          volume: '25B',
          dominance: '48.2%'
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          price: 2800 + (Math.random() - 0.5) * 300,
          change24h: (Math.random() - 0.5) * 8,
          marketCap: '340B',
          volume: '18B',
          dominance: '19.1%'
        },
        {
          id: 'binancecoin',
          symbol: 'BNB',
          name: 'BNB',
          price: 320 + (Math.random() - 0.5) * 40,
          change24h: (Math.random() - 0.5) * 6,
          marketCap: '52B',
          volume: '2.1B',
          dominance: '2.9%'
        },
        {
          id: 'cardano',
          symbol: 'ADA',
          name: 'Cardano',
          price: 0.45 + (Math.random() - 0.5) * 0.1,
          change24h: (Math.random() - 0.5) * 5,
          marketCap: '16B',
          volume: '890M',
          dominance: '0.9%'
        },
        {
          id: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          price: 95 + (Math.random() - 0.5) * 15,
          change24h: (Math.random() - 0.5) * 7,
          marketCap: '42B',
          volume: '3.2B',
          dominance: '2.4%'
        }
      ]

      return topCryptos
    } catch (error) {
      console.error('Erro ao obter top criptomoedas:', error)
      throw error
    }
  }

  // Obter dados do gráfico
  async getChartData(cryptoId, timeframe = '24h') {
    try {
      // Simular dados de gráfico baseados no timeframe
      const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 30
      const chartData = []

      let basePrice = 45000; // Preço base do Bitcoin
      if (cryptoId === 'ethereum') basePrice = 2800
      else if (cryptoId === 'binancecoin') basePrice = 320
      else if (cryptoId === 'cardano') basePrice = 0.45
      else if (cryptoId === 'solana') basePrice = 95

      for (let i = 0; i < dataPoints; i++) {
        const timestamp =
          Date.now() - (dataPoints - i) * (timeframe === '24h' ? 3600000 : timeframe === '7d' ? 3600000 : 86400000)
        const volatility = 0.02; // 2% de volatilidade
        const change = (Math.random() - 0.5) * volatility
        basePrice = basePrice * (1 + change)

        chartData.push({
          timestamp,
          price: basePrice,
          volume: Math.random() * 1000000 + 500000
        })
      }

      return chartData
    } catch (error) {
      console.error('Erro ao obter dados do gráfico:', error)
      throw error
    }
  }
}

const cryptoService = new CryptoService()
export default cryptoService
