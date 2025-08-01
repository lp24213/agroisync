import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { format, subDays } from 'date-fns';
import { logger } from '../utils/logger';

// Real blockchain data fetching functions
const fetchNFTSalesHistory = async (connection: any, publicKey: PublicKey): Promise<NFTSale[]> => {
  try {
    // Fetch NFT sales events from blockchain
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 100 });
    
    const sales: NFTSale[] = [];
    for (const sig of signatures) {
      const tx = await connection.getTransaction(sig.signature);
      if (tx?.meta?.logMessages?.some(log => log.includes('NFT_SALE'))) {
        // Parse NFT sale event
        const saleEvent = parseNFTSaleEvent(tx);
        if (saleEvent) {
          sales.push(saleEvent);
        }
      }
    }
    
    return sales;
  } catch (error) {
    logger.error('Error fetching NFT sales history:', error);
    return [];
  }
};

const fetchNFTValuationHistory = async (connection: any, publicKey: PublicKey): Promise<NFTValuationHistory[]> => {
  try {
    // Fetch NFT valuation data from blockchain analytics
    const response = await fetch(`/api/nft/valuation-history?address=${publicKey.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch valuation history');
    }
    
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    logger.error('Error fetching NFT valuation history:', error);
    return [];
  }
};

const parseNFTSaleEvent = (transaction: any): NFTSale | null => {
  try {
    // Parse transaction logs to extract NFT sale information
    const logs = transaction.meta?.logMessages || [];
    const saleLog = logs.find(log => log.includes('NFT_SALE'));
    
    if (saleLog) {
      // Extract sale data from log
      const saleData = JSON.parse(saleLog.split('NFT_SALE:')[1] || '{}');
      return {
        id: saleData.id || `sale_${Date.now()}`,
        nftId: saleData.nftId || '',
        nftName: saleData.nftName || 'Unknown NFT',
        nftType: saleData.nftType || 'Unknown',
        price: saleData.price || 0,
        date: format(new Date(saleData.timestamp || Date.now()), 'yyyy-MM-dd'),
        buyer: saleData.buyer || 'Unknown',
        seller: saleData.seller || 'Unknown'
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Error parsing NFT sale event:', error);
    return null;
  }
};

interface NFTSale {
  id: string;
  nftId: string;
  nftName: string;
  nftType: string;
  price: number;
  date: string;
  buyer: string;
  seller: string;
}

interface NFTValuationHistory {
  date: string;
  averageValue: number;
  totalValue: number;
  farmValue: number;
  machineryValue: number;
  grainLotsValue: number;
  certificatesValue: number;
}

interface UseNFTHistoryReturn {
  sales: NFTSale[];
  valuationHistory: NFTValuationHistory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Generate mock sales data
const generateMockSales = (): NFTSale[] => {
  const sales: NFTSale[] = [];
  const nftTypes = ['Fazenda', 'Maquinário', 'Lote de Grãos', 'Certificado'];
  const nftNames = {
    'Fazenda': ['Fazenda São João', 'Fazenda Vista Alegre', 'Fazenda Boa Esperança', 'Fazenda Santa Maria'],
    'Maquinário': ['Trator John Deere', 'Colheitadeira Case IH', 'Pulverizador Jacto', 'Plantadeira Semeato'],
    'Lote de Grãos': ['Lote de Soja Premium', 'Lote de Milho', 'Lote de Trigo', 'Lote de Algodão'],
    'Certificado': ['Certificado Orgânico', 'Certificado Rainforest', 'Certificado Fair Trade', 'Certificado UTZ']
  };
  
  for (let i = 0; i < 50; i++) {
    const type = nftTypes[Math.floor(Math.random() * nftTypes.length)] as keyof typeof nftNames;
    const name = nftNames[type][Math.floor(Math.random() * nftNames[type].length)];
    const basePrice = type === 'Fazenda' ? 1000000 : type === 'Maquinário' ? 500000 : type === 'Lote de Grãos' ? 50000 : 10000;
    
    sales.push({
      id: `sale_${i + 1}`,
      nftId: `nft_${i + 1}`,
      nftName: name,
      nftType: type,
      price: basePrice + Math.floor(Math.random() * basePrice * 0.5),
      date: format(subDays(new Date(), Math.floor(Math.random() * 90)), 'yyyy-MM-dd'),
      buyer: `Comprador ${i + 1}`,
      seller: `Vendedor ${i + 1}`
    });
  }
  
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock valuation history
const generateMockValuationHistory = (): NFTValuationHistory[] => {
  const history: NFTValuationHistory[] = [];
  const baseValues = {
    farm: 8000000,
    machinery: 2500000,
    grainLots: 800000,
    certificates: 150000
  };
  
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const variation = 1 + (Math.random() * 0.2 - 0.1); // ±10% variation
    
    const farmValue = Math.floor(baseValues.farm * variation);
    const machineryValue = Math.floor(baseValues.machinery * variation);
    const grainLotsValue = Math.floor(baseValues.grainLots * variation);
    const certificatesValue = Math.floor(baseValues.certificates * variation);
    const totalValue = farmValue + machineryValue + grainLotsValue + certificatesValue;
    
    history.push({
      date,
      averageValue: Math.floor(totalValue / 156), // Assuming 156 total NFTs
      totalValue,
      farmValue,
      machineryValue,
      grainLotsValue,
      certificatesValue
    });
  }
  
  return history;
};

export const useNFTHistory = (): UseNFTHistoryReturn => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [sales, setSales] = useState<NFTSale[]>([]);
  const [valuationHistory, setValuationHistory] = useState<NFTValuationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (connected && publicKey) {
        // Fetch real NFT sales history from blockchain
        const salesData = await fetchNFTSalesHistory(connection, publicKey);
        setSales(salesData);
        
        // Fetch real valuation history from blockchain analytics
        const valuationData = await fetchNFTValuationHistory(connection, publicKey);
        setValuationHistory(valuationData);
      } else {
        setSales([]);
        setValuationHistory([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTHistory();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchNFTHistory();
  };

  return {
    sales,
    valuationHistory,
    loading,
    error,
    refetch
  };
};