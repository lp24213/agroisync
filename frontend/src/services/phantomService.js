class PhantomService {
  constructor() {
    this.provider = null;
    this.publicKey = null;
    this.connected = false;
  }

  // Verificar se Phantom está instalado
  isPhantomInstalled() {
    return typeof window !== 'undefined' && window.solana && window.solana.isPhantom;
  }

  // Conectar ao Phantom
  async connect() {
    try {
      if (!this.isPhantomInstalled()) {
        throw new Error('Phantom não está instalado. Por favor, instale a extensão Phantom.');
      }

      // Solicitar conexão
      const response = await window.solana.connect();

      this.publicKey = response.publicKey.toString();
      this.connected = true;
      this.provider = window.solana;

      // Escutar desconexão
      window.solana.on('disconnect', () => {
        this.disconnect();
      });

      // Escutar mudanças de conta
      window.solana.on('accountChanged', publicKey => {
        if (publicKey) {
          this.publicKey = publicKey.toString();
        } else {
          this.disconnect();
        }
      });

      return {
        publicKey: this.publicKey,
        connected: this.connected,
        provider: this.provider
      };
    } catch (error) {
      console.error('Erro ao conectar Phantom:', error);
      throw error;
    }
  }

  // Desconectar
  disconnect() {
    try {
      if (this.provider) {
        this.provider.disconnect();
      }
    } catch (error) {
      console.error('Erro ao desconectar Phantom:', error);
    } finally {
      this.provider = null;
      this.publicKey = null;
      this.connected = false;
    }
  }

  // Obter saldo da conta
  async getBalance() {
    try {
      if (!this.provider || !this.publicKey) {
        throw new Error('Phantom não está conectado');
      }

      const balance = await this.provider.getBalance();
      return balance / 1e9; // Converter de lamports para SOL
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      throw error;
    }
  }

  // Obter informações da conta
  async getAccountInfo() {
    try {
      if (!this.provider || !this.publicKey) {
        throw new Error('Phantom não está conectado');
      }

      const balance = await this.getBalance();

      return {
        publicKey: this.publicKey,
        balance: balance,
        connected: this.connected
      };
    } catch (error) {
      console.error('Erro ao obter informações da conta:', error);
      throw error;
    }
  }

  // Enviar transação
  async sendTransaction(transaction) {
    try {
      if (!this.provider || !this.publicKey) {
        throw new Error('Phantom não está conectado');
      }

      const signature = await this.provider.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
      throw error;
    }
  }

  // Assinar mensagem
  async signMessage(message) {
    try {
      if (!this.provider || !this.publicKey) {
        throw new Error('Phantom não está conectado');
      }

      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await this.provider.signMessage(encodedMessage, 'utf8');

      return {
        signature: signedMessage.signature,
        publicKey: signedMessage.publicKey.toString()
      };
    } catch (error) {
      console.error('Erro ao assinar mensagem:', error);
      throw error;
    }
  }

  // Verificar se está conectado
  isConnected() {
    return this.connected && this.publicKey !== null;
  }

  // Obter status da conexão
  getConnectionStatus() {
    return {
      installed: this.isPhantomInstalled(),
      connected: this.isConnected(),
      publicKey: this.publicKey
    };
  }
}

// Instância global do serviço Phantom
const phantomService = new PhantomService();

export default phantomService;
