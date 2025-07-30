'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

// Tipos
interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  contracts: {
    agrotmToken: ethers.Contract | null;
    nftAgro: ethers.Contract | null;
    buyWithCommission: ethers.Contract | null;
    staking: ethers.Contract | null;
  };
}

// ABIs (simplificados para exemplo)
const AGROTM_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

const NFT_AGRO_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function setApprovalForAll(address operator, bool approved)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function mint(address to, uint256 tokenId, string memory tokenURI)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)'
];

const BUY_WITH_COMMISSION_ABI = [
  'function commissionRate() view returns (uint256)',
  'function adminAddress() view returns (address)',
  'function buyTokenWithCommission(address tokenAddress, address seller, uint256 amount) payable',
  'function buyNFTWithCommission(address nftAddress, address seller, uint256 tokenId) payable',
  'function buyERC1155WithCommission(address nftAddress, address seller, uint256 tokenId, uint256 amount, bytes calldata data) payable',
  'event TokenPurchased(address indexed buyer, address indexed tokenAddress, uint256 amount, uint256 commission)',
  'event NFTPurchased(address indexed buyer, address indexed nftAddress, uint256 tokenId, uint256 amount, uint256 commission, uint256 nftType)'
];

const STAKING_ABI = [
  'function agrotmToken() view returns (address)',
  'function totalStaked() view returns (uint256)',
  'function totalRewardsDistributed() view returns (uint256)',
  'function minStakeAmount() view returns (uint256)',
  'function maxStakeAmount() view returns (uint256)',
  'function stake(uint256 amount, uint256 lockPeriodIndex)',
  'function unstake(uint256 stakeId)',
  'function claimRewards(uint256 stakeId)',
  'function getStakeInfo(uint256 stakeId) view returns (tuple(uint256,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,bool), uint256)',
  'function getUserStakes(address user) view returns (uint256[])',
  'function getPendingRewards(uint256 stakeId) view returns (uint256)',
  'function getLockPeriodInfo(uint256 lockPeriodIndex) view returns (tuple(uint256,uint256,bool))',
  'event Staked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 lockPeriod, uint256 apr)',
  'event Unstaked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 rewards)',
  'event RewardsClaimed(address indexed user, uint256 indexed stakeId, uint256 rewards)'
];

// Configurações de rede
const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://etherscan.io'
  },
  bsc: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    explorer: 'https://bscscan.com'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com'
  }
};

// Contexto
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Provider
export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contracts, setContracts] = useState({
    agrotmToken: null as ethers.Contract | null,
    nftAgro: null as ethers.Contract | null,
    buyWithCommission: null as ethers.Contract | null,
    staking: null as ethers.Contract | null
  });

  // Verificar se MetaMask está instalado
  const checkIfWalletIsInstalled = () => {
    if (typeof window !== 'undefined') {
      return typeof window.ethereum !== 'undefined';
    }
    return false;
  };

  // Conectar carteira
  const connect = async () => {
    if (!checkIfWalletIsInstalled()) {
      toast.error('MetaMask não está instalado!');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Solicitar conexão
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
      setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);

        // Inicializar contratos
        await initializeContracts(provider, accounts[0]);

      toast.success('Carteira conectada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      toast.error('Erro ao conectar carteira');
    } finally {
      setIsConnecting(false);
    }
  };

  // Desconectar carteira
  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setContracts({
      agrotmToken: null,
      nftAgro: null,
      buyWithCommission: null,
      staking: null
    });

    toast.success('Carteira desconectada');
  };

  // Trocar rede
  const switchNetwork = async (chainId: number) => {
    if (!checkIfWalletIsInstalled()) {
      toast.error('MetaMask não está instalado!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
      
      toast.success('Rede alterada com sucesso!');
    } catch (error: any) {
      if (error.code === 4902) {
        // Rede não encontrada, adicionar
        try {
          const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
          if (network) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.explorer]
              }]
            });
            toast.success('Rede adicionada e conectada!');
          }
        } catch (addError) {
          toast.error('Erro ao adicionar rede');
        }
      } else {
        toast.error('Erro ao trocar rede');
      }
    }
  };

  // Inicializar contratos
  const initializeContracts = async (provider: ethers.BrowserProvider, account: string) => {
    try {
      // Endereços dos contratos (devem vir do .env)
      const contractAddresses = {
        agrotmToken: process.env.NEXT_PUBLIC_AGROTM_TOKEN_ADDRESS,
        nftAgro: process.env.NEXT_PUBLIC_NFT_AGRO_ADDRESS,
        buyWithCommission: process.env.NEXT_PUBLIC_BUY_WITH_COMMISSION_ADDRESS,
        staking: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS
      };

      if (contractAddresses.agrotmToken) {
        const agrotmToken = new ethers.Contract(
          contractAddresses.agrotmToken,
          AGROTM_TOKEN_ABI,
          provider
        );
        setContracts(prev => ({ ...prev, agrotmToken }));
    }

      if (contractAddresses.nftAgro) {
        const nftAgro = new ethers.Contract(
          contractAddresses.nftAgro,
          NFT_AGRO_ABI,
          provider
        );
        setContracts(prev => ({ ...prev, nftAgro }));
      }

      if (contractAddresses.buyWithCommission) {
        const buyWithCommission = new ethers.Contract(
          contractAddresses.buyWithCommission,
          BUY_WITH_COMMISSION_ABI,
          provider
        );
        setContracts(prev => ({ ...prev, buyWithCommission }));
      }

      if (contractAddresses.staking) {
        const staking = new ethers.Contract(
          contractAddresses.staking,
          STAKING_ABI,
          provider
        );
        setContracts(prev => ({ ...prev, staking }));
      }
    } catch (error) {
      console.error('Erro ao inicializar contratos:', error);
    }
  };

  // Listener para mudanças de conta
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (account !== accounts[0]) {
          setAccount(accounts[0]);
          toast.success('Conta alterada');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  // Verificar conexão existente
  useEffect(() => {
    const checkConnection = async () => {
      if (checkIfWalletIsInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            setAccount(accounts[0]);
            setProvider(provider);
            setSigner(signer);
            setIsConnected(true);
            
            await initializeContracts(provider, accounts[0]);
          }
        } catch (error) {
          console.error('Erro ao verificar conexão:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
    contracts
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Hook para usar o contexto
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 deve ser usado dentro de um Web3Provider');
  }
  return context;
};

// Declaração global para TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}