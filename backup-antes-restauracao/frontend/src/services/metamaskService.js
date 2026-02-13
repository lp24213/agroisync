import { ethers } from 'ethers';

class MetamaskService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }

  // Obter contas conectadas
  async getAccounts() {
    try {
      if (!this.isMetamaskInstalled()) {
        return [];
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      return accounts;
    } catch (error) {
      console.error('Erro ao obter contas:', error);
      return [];
    }
  }

  // Verificar se Metamask está instalado
  isMetamaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum;
  }

  // Conectar ao Metamask
  async connect() {
    try {
      if (!this.isMetamaskInstalled()) {
        throw new Error('Metamask não está instalado. Por favor, instale a extensão Metamask.');
      }

      // Solicitar conexão
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada. Por favor, conecte uma conta no Metamask.');
      }

      this.account = accounts[0];

      // Obter provider e signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Obter chainId
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId;

      // Escutar mudanças de conta
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.account = accounts[0];
        }
      });

      // Escutar mudanças de rede
      window.ethereum.on('chainChanged', chainId => {
        this.chainId = parseInt(chainId, 16);
      });

      return {
        account: this.account,
        chainId: this.chainId,
        provider: this.provider
      };
    } catch (error) {
      console.error('Erro ao conectar Metamask:', error);
      throw error;
    }
  }

  // Desconectar
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }

  // Obter saldo da conta
  async getBalance() {
    try {
      if (!this.provider || !this.account) {
        throw new Error('Metamask não está conectado');
      }

      const balance = await this.provider.getBalance(this.account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      throw error;
    }
  }

  // Enviar pagamento
  async sendPayment(toAddress, amount, planId) {
    try {
      if (!this.signer || !this.account) {
        throw new Error('Metamask não está conectado');
      }

      // Validar endereço de destino
      if (!ethers.isAddress(toAddress)) {
        throw new Error('Endereço de destino inválido');
      }

      // Converter valor para wei
      const amountWei = ethers.parseEther(amount.toString());

      // Verificar saldo
      const balance = await this.provider.getBalance(this.account);
      if (balance < amountWei) {
        throw new Error('Saldo insuficiente');
      }

      // Criar transação
      const tx = {
        to: toAddress,
        value: amountWei,
        data: this.encodePlanData(planId)
      };

      // Enviar transação
      const transaction = await this.signer.sendTransaction(tx);

      return {
        hash: transaction.hash,
        from: this.account,
        to: toAddress,
        value: amount,
        planId: planId
      };
    } catch (error) {
      console.error('Erro ao enviar pagamento:', error);
      throw error;
    }
  }

  // Codificar dados do plano na transação
  encodePlanData(planId) {
    try {
      // Criar uma interface simples para codificar os dados
      const abi = ['function activatePlan(string planId)'];

      const iface = new ethers.Interface(abi);
      return iface.encodeFunctionData('activatePlan', [planId]);
    } catch (error) {
      // Se falhar a codificação, retornar dados vazios
      return '0x';
    }
  }

  // Verificar status da transação
  async getTransactionStatus(hash) {
    try {
      if (!this.provider) {
        throw new Error('Metamask não está conectado');
      }

      const receipt = await this.provider.getTransactionReceipt(hash);

      if (!receipt) {
        return { status: 'pending', confirmations: 0 };
      }

      const confirmations = receipt.confirmations;
      let status = 'pending';

      if (confirmations >= 12) {
        status = 'confirmed';
      } else if (confirmations >= 1) {
        status = 'processing';
      }

      return {
        status,
        confirmations,
        receipt
      };
    } catch (error) {
      console.error('Erro ao verificar status da transação:', error);
      throw error;
    }
  }

  // Obter informações da rede atual
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Metamask não está conectado');
      }

      const network = await this.provider.getNetwork();
      const gasPrice = await this.provider.getFeeData();

      return {
        chainId: network.chainId,
        name: network.name,
        gasPrice: gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : null
      };
    } catch (error) {
      console.error('Erro ao obter informações da rede:', error);
      throw error;
    }
  }

  // Trocar rede (se necessário)
  async switchNetwork(chainId) {
    try {
      if (!this.isMetamaskInstalled()) {
        throw new Error('Metamask não está instalado');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('Erro ao trocar rede:', error);
      throw error;
    }
  }

  // Assinar mensagem para autenticação
  async signMessage(message) {
    try {
      if (!this.signer || !this.account) {
        throw new Error('Metamask não está conectado');
      }

      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Erro ao assinar mensagem:', error);
      throw error;
    }
  }

  // Verificar se está conectado
  isConnected() {
    return !!this.account && !!this.provider;
  }

  // Obter estado atual
  getState() {
    return {
      account: this.account,
      chainId: this.chainId,
      isConnected: this.isConnected(),
      provider: !!this.provider,
      signer: !!this.signer
    };
  }
}

// Criar instância única
const metamaskService = new MetamaskService();

export default metamaskService;
