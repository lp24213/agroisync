import { CryptoTicker, FXRate, GrainPrice } from '@/types'

interface TickerState {
  crypto: CryptoTicker[]
  fx: FXRate[]
  grains: GrainPrice[]
  lastUpdate: Date | null
  isConnected: boolean
  error: string | null
}

class RealtimeTicker {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private state: TickerState = {
    crypto: [],
    fx: [],
    grains: [],
    lastUpdate: null,
    isConnected: false,
    error: null,
  }
  private listeners: Set<(state: TickerState) => void> = new Set()
  private fallbackInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeWebSocket()
    this.startFallbackPolling()
  }

  private initializeWebSocket() {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.agrosync.com/ws'
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        this.state.isConnected = true
        this.state.error = null
        this.reconnectAttempts = 0
        this.notifyListeners()
        this.subscribeToChannels()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        this.state.isConnected = false
        this.notifyListeners()
        this.scheduleReconnect()
      }

      this.ws.onerror = (error) => {
        this.state.error = 'WebSocket connection error'
        this.notifyListeners()
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      this.state.error = 'Failed to initialize connection'
      this.notifyListeners()
    }
  }

  private subscribeToChannels() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const subscribeMessage = {
        type: 'subscribe',
        channels: ['crypto', 'fx', 'grains']
      }
      this.ws.send(JSON.stringify(subscribeMessage))
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'crypto_update':
        this.state.crypto = data.data
        break
      case 'fx_update':
        this.state.fx = data.data
        break
      case 'grains_update':
        this.state.grains = data.data
        break
      case 'heartbeat':
        break
      default:
        console.warn('Unknown message type:', data.type)
    }

    this.state.lastUpdate = new Date()
    this.notifyListeners()
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      setTimeout(() => {
        this.initializeWebSocket()
      }, delay)
    } else {
      this.state.error = 'Maximum reconnection attempts reached'
      this.notifyListeners()
    }
  }

  private startFallbackPolling() {
    this.fallbackInterval = setInterval(async () => {
      if (!this.state.isConnected) {
        await this.fetchFallbackData()
      }
    }, 30000)
  }

  private async fetchFallbackData() {
    try {
      const [cryptoResponse, fxResponse, grainsResponse] = await Promise.allSettled([
        fetch('/api/realtime/crypto'),
        fetch('/api/realtime/fx'),
        fetch('/api/realtime/grains')
      ])

      if (cryptoResponse.status === 'fulfilled' && cryptoResponse.value.ok) {
        const cryptoData = await cryptoResponse.value.json()
        this.state.crypto = cryptoData
      }

      if (fxResponse.status === 'fulfilled' && fxResponse.value.ok) {
        const fxData = await fxResponse.value.json()
        this.state.fx = fxData
      }

      if (grainsResponse.status === 'fulfilled' && grainsResponse.value.ok) {
        const grainsData = await grainsResponse.value.json()
        this.state.grains = grainsData
      }

      this.state.lastUpdate = new Date()
      this.notifyListeners()
    } catch (error) {
      console.error('Fallback data fetch error:', error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  public subscribe(listener: (state: TickerState) => void) {
    this.listeners.add(listener)
    listener(this.state)
    
    return () => {
      this.listeners.delete(listener)
    }
  }

  public getState(): TickerState {
    return { ...this.state }
  }

  public requestUpdate(channel: 'crypto' | 'fx' | 'grains') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'request_update',
        channel
      }
      this.ws.send(JSON.stringify(message))
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close()
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval)
    }
  }
}

export const ticker = new RealtimeTicker()

export function useTicker() {
  return ticker.getState()
}

export function subscribeToTicker(listener: (state: TickerState) => void) {
  return ticker.subscribe(listener)
}
