// Simulação da biblioteca ethers.js para demonstração
// Em produção, instale: npm install ethers

export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask não encontrado. Instale a extensão MetaMask.');
  }

  try {
    // Solicitar acesso à conta
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (accounts.length === 0) {
      throw new Error('Nenhuma conta encontrada');
    }

    const address = accounts[0];

    // Simular obtenção do saldo (em produção, usar ethers.js)
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });

    return {
      address,
      balance: parseInt(balance, 16) / Math.pow(10, 18), // Converter de wei para ETH
      provider: window.ethereum
    };
  } catch (error) {
    throw new Error(`Erro ao conectar MetaMask: ${error.message}`);
  }
}

export async function buyWithMetaMask(amount, recipientAddress) {
  if (!window.ethereum) {
    throw new Error('MetaMask não encontrado');
  }

  try {
    // Simular transação de compra
    const transactionParameters = {
      to: recipientAddress || '', // Endereço do contrato (REMOVIDO POR SEGURANÇA)
      from: window.ethereum.selectedAddress,
      value: '0x' + (amount * Math.pow(10, 18)).toString(16), // Converter para wei
      data: '0x' // Dados da transação
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters]
    });

    return txHash;
  } catch (error) {
    throw new Error(`Erro na transação: ${error.message}`);
  }
}

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance) {
  if (!balance) return '0.00';
  return parseFloat(balance).toFixed(4);
}
