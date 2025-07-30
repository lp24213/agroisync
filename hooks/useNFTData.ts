import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// Mock NFT data interface
interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  type: 'Fazenda' | 'Maquinário' | 'Lote de Grãos' | 'Certificado';
  location: string;
  area?: number;
  crop?: string;
  quantity?: number;
  estimatedValue: number;
  lastValuation: string;
  owner: string;
  tokenId: string;
  metadata: {
    latitude?: number;
    longitude?: number;
    yieldHistory?: Array<{period: string, yield: number}>;
    certifications?: string[];
    [key: string]: any;
  };
}

interface UseNFTDataReturn {
  nfts: NFT[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock data for demonstration
const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Fazenda São João',
    imageUrl: '/assets/img/farm1.jpg',
    type: 'Fazenda',
    location: 'Mato Grosso, Brasil',
    area: 500,
    crop: 'Soja',
    estimatedValue: 2500000,
    lastValuation: '2024-01-15',
    owner: 'João Silva',
    tokenId: 'FARM001',
    metadata: {
      latitude: -15.6014,
      longitude: -56.0979,
      yieldHistory: [
        { period: '2023', yield: 3200 },
        { period: '2022', yield: 3100 },
        { period: '2021', yield: 2900 }
      ],
      certifications: ['Orgânico', 'Rainforest Alliance']
    }
  },
  {
    id: '2',
    name: 'Trator John Deere 8R',
    imageUrl: '/assets/img/tractor1.jpg',
    type: 'Maquinário',
    location: 'São Paulo, Brasil',
    estimatedValue: 850000,
    lastValuation: '2024-01-10',
    owner: 'Maria Santos',
    tokenId: 'MACH001',
    metadata: {
      model: 'John Deere 8R 370',
      year: 2022,
      hours: 1200,
      condition: 'Excelente'
    }
  },
  {
    id: '3',
    name: 'Lote de Milho Premium',
    imageUrl: '/assets/img/corn1.jpg',
    type: 'Lote de Grãos',
    location: 'Goiás, Brasil',
    quantity: 10000,
    crop: 'Milho',
    estimatedValue: 45000,
    lastValuation: '2024-01-12',
    owner: 'Carlos Oliveira',
    tokenId: 'GRAIN001',
    metadata: {
      quality: 'Premium',
      moisture: 14.5,
      protein: 8.2,
      harvestDate: '2024-01-05'
    }
  },
  {
    id: '4',
    name: 'Certificado Orgânico',
    imageUrl: '/assets/img/certificate1.jpg',
    type: 'Certificado',
    location: 'Minas Gerais, Brasil',
    estimatedValue: 15000,
    lastValuation: '2024-01-08',
    owner: 'Ana Costa',
    tokenId: 'CERT001',
    metadata: {
      issuer: 'IBD Certificações',
      validUntil: '2025-01-08',
      scope: 'Produção Orgânica de Café',
      area: 100
    }
  }
];

export const useNFTData = (): UseNFTDataReturn => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (connected && publicKey) {
        // In a real implementation, you would fetch NFTs from the blockchain
        // For now, we'll use mock data
        setNfts(mockNFTs);
      } else {
        setNfts([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar NFTs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTData();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchNFTData();
  };

  return {
    nfts,
    loading,
    error,
    refetch
  };
};