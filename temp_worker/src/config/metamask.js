import { ethers } from 'ethers';
import { createSecurityLog } from '../utils/securityLogger.js';

import logger from '../utils/logger.js';
// ===== CONFIGURAÃ‡ÃƒO DO METAMASK =====

// EndereÃ§os das redes suportadas
export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id',
    explorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  binance: {
    chainId: 56,
    name: 'Binance Smart Chain',
    rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

// ===== FUNÃ‡Ã•ES DE VALIDAÃ‡ÃƒO =====

// Validar endereÃ§o Ethereum
export const isValidEthereumAddress = address => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

// Validar assinatura
export const isValidSignature = (message, signature, address) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    return false;
  }
};

// Validar hash de transaÃ§Ã£o
export const isValidTransactionHash = hash => {
  try {
    return ethers.isHexString(hash, 32);
  } catch (error) {
    return false;
  }
};

// ===== FUNÃ‡Ã•ES DE AUTENTICAÃ‡ÃƒO =====

// Gerar mensagem para assinatura
export const generateAuthMessage = (address, nonce) => {
  const timestamp = Date.now();
  const message = `AGROTM Authentication\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${timestamp}\n\nPlease sign this message to authenticate with AGROTM.`;

  return {
    message,
    timestamp,
    nonce
  };
};

// Verificar autenticaÃ§Ã£o Metamask
export const verifyMetamaskAuth = (address, signature, nonce, timestamp) => {
  try {
    // Verificar se o timestamp nÃ£o Ã© muito antigo (5 minutos)
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return {
        valid: false,
        error: 'Timestamp expired'
      };
    }

    // Verificar se o endereÃ§o Ã© vÃ¡lido
    if (!isValidEthereumAddress(address)) {
      return {
        valid: false,
        error: 'Invalid Ethereum address'
      };
    }

    // Verificar se a assinatura Ã© vÃ¡lida
    const authMessage = generateAuthMessage(address, nonce);
    if (!isValidSignature(authMessage.message, signature, address)) {
      return {
        valid: false,
        error: 'Invalid signature'
      };
    }

    return {
      valid: true,
      address: address.toLowerCase()
    };
  } catch (error) {
    // Console log removido (dados sensÃ­veis)
    return {
      valid: false,
      error: 'Verification failed'
    };
  }
};

// ===== FUNÃ‡Ã•ES DE PAGAMENTO =====

// Criar transaÃ§Ã£o de pagamento
export const createPaymentTransaction = async (
  fromAddress,
  toAddress,
  amount,
  network = 'ethereum'
) => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    // Conectar ao provedor
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    // Obter nonce atual
    const nonce = await provider.getTransactionCount(fromAddress);

    // Obter preÃ§o do gas
    const gasPrice = await provider.getFeeData();

    // Criar transaÃ§Ã£o
    const transaction = {
      to: toAddress,
      value: ethers.parseEther(amount.toString()),
      nonce,
      gasLimit: 21000, // Gas limit padrÃ£o para transferÃªncias
      gasPrice: gasPrice.gasPrice
    };

    return {
      transaction,
      network: networkConfig,
      estimatedGas: transaction.gasLimit * Number(transaction.gasPrice)
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error creating payment transaction:', error);
    }
    throw error;
  }
};

// Verificar status da transaÃ§Ã£o
export const checkTransactionStatus = async (txHash, network = 'ethereum') => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    // Obter receita da transaÃ§Ã£o
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return {
        status: 'pending',
        confirmations: 0,
        blockNumber: null
      };
    }

    // Obter bloco atual
    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - receipt.blockNumber;

    return {
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      confirmations,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice.toString()
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error checking transaction status:', error);
    }
    throw error;
  }
};

// ===== FUNÃ‡Ã•ES DE CARTEIRA =====

// Obter saldo da carteira
export const getWalletBalance = async (address, network = 'ethereum') => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const balance = await provider.getBalance(address);

    return {
      address,
      network: networkConfig.name,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
      currency: networkConfig.nativeCurrency.symbol
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error getting wallet balance:', error);
    }
    throw error;
  }
};

// Obter histÃ³rico de transaÃ§Ãµes
export const getTransactionHistory = (address, network = 'ethereum', limit = 50) => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    // Obter bloco atual
    const currentBlock = await provider.getBlockNumber();

    // Buscar transaÃ§Ãµes (limitado pela API)
    const transactions = [];

    // Buscar transaÃ§Ãµes de entrada
    const incomingTxs = await provider.getLogs({
      address,
      fromBlock: currentBlock - 10000, // Ãšltimos 10k blocos
      toBlock: currentBlock,
      topics: [
        null, // Qualquer evento
        `0x000000000000000000000000${address.slice(2)}` // Para endereÃ§o
      ]
    });

    // Buscar transaÃ§Ãµes de saÃ­da
    const outgoingTxs = await provider.getLogs({
      address,
      fromBlock: currentBlock - 10000,
      toBlock: currentBlock,
      topics: [
        null,
        address.slice(2).padStart(64, '0') // De endereÃ§o
      ]
    });

    // Combinar e ordenar transaÃ§Ãµes
    const allTxs = [...incomingTxs, ...outgoingTxs];
    allTxs.sort((a, b) => b.blockNumber - a.blockNumber);

    // Limitar resultados
    return allTxs.slice(0, limit).map(tx => ({
      hash: tx.transactionHash,
      blockNumber: tx.blockNumber,
      from: tx.address,
      to: tx.topics[1] ? `0x${tx.topics[1].slice(26)}` : null,
      value: ethers.formatEther(tx.data || '0'),
      timestamp: Date.now() // Seria melhor obter do bloco
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error getting transaction history:', error);
    }
    throw error;
  }
};

// ===== FUNÃ‡Ã•ES DE TOKEN =====

// ABI bÃ¡sico para tokens ERC-20
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

// Obter informaÃ§Ãµes do token
export const getTokenInfo = async (tokenAddress, network = 'ethereum') => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals),
      network: networkConfig.name
    };
  } catch (error) {
    // Console log removido (dados sensÃ­veis)
    throw error;
  }
};

// Obter saldo do token
export const getTokenBalance = (tokenAddress, walletAddress, network = 'ethereum') => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals(),
      contract.symbol()
    ]);

    return {
      tokenAddress,
      walletAddress,
      balance: ethers.formatUnits(balance, decimals),
      balanceRaw: balance.toString(),
      symbol,
      network: networkConfig.name
    };
  } catch (error) {
    // Console log removido (dados sensÃ­veis)
    throw error;
  }
};

// ===== FUNÃ‡Ã•ES DE SEGURANÃ‡A =====

// Verificar se o endereÃ§o estÃ¡ na lista de permissÃµes
export const isAddressWhitelisted = (address, whitelist) => {
  if (!whitelist || !Array.isArray(whitelist)) {
    return false;
  }

  return whitelist.some(
    whitelistedAddress => whitelistedAddress.toLowerCase() === address.toLowerCase()
  );
};

// Verificar se o endereÃ§o Ã© um contrato
export const isContractAddress = (address, network = 'ethereum') => {
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const code = await provider.getCode(address);

    return code !== '0x';
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error checking if address is contract:', error);
    }
    return false;
  }
};

// ===== FUNÃ‡Ã•ES DE UTILIDADE =====

// Converter valor para Wei
export const toWei = (amount, decimals = 18) => {
  try {
    return ethers.parseUnits(amount.toString(), decimals);
  } catch (error) {
    throw new Error('Invalid amount format');
  }
};

// Converter Wei para valor
export const fromWei = (amount, decimals = 18) => {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch (error) {
    throw new Error('Invalid amount format');
  }
};

// Formatar endereÃ§o para exibiÃ§Ã£o
export const formatAddress = (address, start = 6, end = 4) => {
  if (!address || address.length < start + end) {
    return address;
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

// Verificar se o Metamask estÃ¡ disponÃ­vel
export const isMetamaskAvailable = () => {
  return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
};

// Obter endereÃ§o conectado
export const getConnectedAddress = async () => {
  try {
    if (!isMetamaskAvailable()) {
      throw new Error('Metamask not available');
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error getting connected address:', error);
    }
    return null;
  }
};

// Conectar carteira
export const connectWallet = async () => {
  try {
    if (!isMetamaskAvailable()) {
      throw new Error('Metamask not available');
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    return accounts[0] || null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error connecting wallet:', error);
    }
    throw error;
  }
};

// Trocar rede
export const switchNetwork = async chainId => {
  try {
    if (!isMetamaskAvailable()) {
      throw new Error('Metamask not available');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    });

    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Error switching network:', error);
    }
    throw error;
  }
};

export default {
  SUPPORTED_NETWORKS,
  isValidEthereumAddress,
  isValidSignature,
  isValidTransactionHash,
  generateAuthMessage,
  verifyMetamaskAuth,
  createPaymentTransaction,
  checkTransactionStatus,
  getWalletBalance,
  getTransactionHistory,
  getTokenInfo,
  getTokenBalance,
  isAddressWhitelisted,
  isContractAddress,
  toWei,
  fromWei,
  formatAddress,
  isMetamaskAvailable,
  getConnectedAddress,
  connectWallet,
  switchNetwork
};
