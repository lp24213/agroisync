import { ethers } from 'ethers'
import { WalletConnection } from '@/types'

export class WalletManager {
  private ethereum: any = null
  private solana: any = null
  private currentConnection: WalletConnection | null = null

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    if (typeof window !== 'undefined') {
      this.ethereum = (window as any).ethereum
      this.solana = (window as any).solana
    }
  }

  async connectMetamask(): Promise<WalletConnection> {
    if (!this.ethereum) {
      throw new Error('MetaMask não está instalado')
    }

    try {
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts'
      })

      const account = accounts[0]
      const provider = new ethers.BrowserProvider(this.ethereum)
      const network = await provider.getNetwork()
      
      const message = `Conecte sua carteira AgroSync\n\nTimestamp: ${Date.now()}`
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(message)

      const connection: WalletConnection = {
        id: Date.now().toString(),
        userId: 'user',
        user: { id: 'user', name: 'Usuário', email: '', role: 'produtor', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
        type: 'metamask',
        address: account,
        network: network.name || 'ethereum',
        connected: true,
        lastConnected: new Date(),
        createdAt: new Date(),
        signature,
        provider: 'metamask'
      }

      this.currentConnection = connection
      return connection
    } catch (error) {
      throw new Error(`Erro ao conectar MetaMask: ${error}`)
    }
  }

  async connectPhantom(): Promise<WalletConnection> {
    if (!this.solana) {
      throw new Error('Phantom não está instalado')
    }

    try {
      const response = await this.solana.connect()
      const publicKey = response.publicKey.toString()
      
      const message = `Conecte sua carteira AgroSync\n\nTimestamp: ${Date.now()}`
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await this.solana.signMessage(encodedMessage, 'utf8')
      
      const connection: WalletConnection = {
        id: Date.now().toString(),
        userId: 'user',
        user: { id: 'user', name: 'Usuário', email: '', role: 'produtor', status: 'active', profile: { documents: [] }, preferences: { language: 'pt', theme: 'auto', notifications: { email: false, push: false, sms: false, marketing: false, priceAlerts: false, freightUpdates: false, orderUpdates: false }, privacy: { profileVisibility: 'public', showLocation: false, showContactInfo: false, allowAnalytics: false, allowCookies: false } }, reputation: { overall: 0, reliability: 0, communication: 0, punctuality: 0, quality: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 }, createdAt: new Date(), updatedAt: new Date() },
        type: 'phantom',
        address: publicKey,
        network: 'solana',
        connected: true,
        lastConnected: new Date(),
        createdAt: new Date(),
        signature: Buffer.from(signature.signature).toString('hex'),
        provider: 'phantom'
      }

      this.currentConnection = connection
      return connection
    } catch (error) {
      throw new Error(`Erro ao conectar Phantom: ${error}`)
    }
  }

  async disconnect(): Promise<void> {
    if (this.currentConnection?.type === 'metamask' && this.ethereum) {
      try {
        await this.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        })
      } catch (error) {
        console.warn('Erro ao desconectar MetaMask:', error)
      }
    }

    if (this.currentConnection?.type === 'phantom' && this.solana) {
      try {
        await this.solana.disconnect()
      } catch (error) {
        console.warn('Erro ao desconectar Phantom:', error)
      }
    }

    this.currentConnection = null
  }

  async signMessage(message: string): Promise<string> {
    if (!this.currentConnection) {
      throw new Error('Nenhuma carteira conectada')
    }

    if (this.currentConnection.type === 'metamask') {
      const provider = new ethers.BrowserProvider(this.ethereum)
      const signer = await provider.getSigner()
      return await signer.signMessage(message)
    }

    if (this.currentConnection.type === 'phantom') {
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await this.solana.signMessage(encodedMessage, 'utf8')
      return Buffer.from(signature.signature).toString('hex')
    }

    throw new Error('Tipo de carteira não suportado')
  }

  async sendTransaction(transaction: any): Promise<string> {
    if (!this.currentConnection) {
      throw new Error('Nenhuma carteira conectada')
    }

    if (this.currentConnection.type === 'metamask') {
      const provider = new ethers.BrowserProvider(this.ethereum)
      const signer = await provider.getSigner()
      const tx = await signer.sendTransaction(transaction)
      return tx.hash
    }

    if (this.currentConnection.type === 'phantom') {
      const signature = await this.solana.sendTransaction(transaction)
      return signature
    }

    throw new Error('Tipo de carteira não suportado')
  }

  async getBalance(): Promise<string> {
    if (!this.currentConnection) {
      throw new Error('Nenhuma carteira conectada')
    }

    if (this.currentConnection.type === 'metamask') {
      const provider = new ethers.BrowserProvider(this.ethereum)
      const balance = await provider.getBalance(this.currentConnection.address)
      return ethers.formatEther(balance)
    }

    if (this.currentConnection.type === 'phantom') {
      const balance = await this.solana.getBalance()
      return (balance / 1e9).toString()
    }

    throw new Error('Tipo de carteira não suportado')
  }

  getCurrentConnection(): WalletConnection | null {
    return this.currentConnection
  }

  isConnected(): boolean {
    return this.currentConnection !== null
  }

  getProvider(): 'metamask' | 'phantom' | null {
    return this.currentConnection?.provider || null
  }

  async switchNetwork(chainId: string): Promise<void> {
    if (!this.ethereum) {
      throw new Error('MetaMask não está instalado')
    }

    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      })
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Rede não suportada. Adicione-a ao MetaMask.')
      }
      throw error
    }
  }

  async addNetwork(network: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }): Promise<void> {
    if (!this.ethereum) {
      throw new Error('MetaMask não está instalado')
    }

    try {
      await this.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [network]
      })
    } catch (error) {
      throw new Error(`Erro ao adicionar rede: ${error}`)
    }
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', callback)
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if (this.ethereum) {
      this.ethereum.on('chainChanged', callback)
    }
  }

  onDisconnect(callback: () => void): void {
    if (this.ethereum) {
      this.ethereum.on('disconnect', callback)
    }
  }

  removeAllListeners(): void {
    if (this.ethereum) {
      this.ethereum.removeAllListeners()
    }
  }
}

export const walletManager = new WalletManager()
