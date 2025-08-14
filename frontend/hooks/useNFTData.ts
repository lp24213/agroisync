import { useState, useEffect, useCallback } from 'react';

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
    description?: string;
    [key: string]: any;
  };
}

interface UseNFTDataReturn {
  nfts: NFT[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  getNFTsByType: (type: string) => NFT[];
  getNFTsByLocation: (location: string) => NFT[];
  searchNFTs: (query: string) => NFT[];
}

const useNFTData = (): UseNFTDataReturn => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mock para demonstração
  const generateMockNFTs = (): NFT[] => {
    const mockNFTs: NFT[] = [
        {
          id: '1',
        name: 'Fazenda Santa Maria',
        type: 'Fazenda',
        location: 'Goiás, Brasil',
        crop: 'Soja',
        area: 1500,
        estimatedValue: 50000000,
        lastValuation: '2024-12-15',
        owner: '0x1234...5678',
        tokenId: 'token_001',
        quantity: 1,
        imageUrl: '/images/farm1.jpg',
        metadata: {
          description: 'Fazenda de soja premium com certificação orgânica',
          latitude: -16.6864,
          longitude: -49.2653,
          yieldHistory: [
            { period: '2023', yield: 4500 },
            { period: '2024', yield: 5200 }
          ],
          certifications: ['Orgânico', 'Rainforest Alliance']
          }
        },
        {
          id: '2',
        name: 'Trator John Deere 5075E',
        type: 'Maquinário',
        location: 'Mato Grosso, Brasil',
        area: 0,
        estimatedValue: 15000000,
        lastValuation: '2024-12-14',
        owner: '0x8765...4321',
        tokenId: 'token_002',
        quantity: 1,
        imageUrl: '/images/tractor1.jpg',
        metadata: {
          description: 'Trator agrícola profissional com 75HP',
          latitude: -15.6014,
          longitude: -56.0979,
          certifications: ['ISO 9001', 'CE']
        }
      },
      {
        id: '3',
        name: 'Lote de Soja Premium',
        type: 'Lote de Grãos',
        location: 'Paraná, Brasil',
        crop: 'Soja',
        area: 100,
        quantity: 500,
        estimatedValue: 8000000,
        lastValuation: '2024-12-13',
        owner: '0x9876...5432',
        tokenId: 'token_003',
        imageUrl: '/images/soybean1.jpg',
        metadata: {
          description: 'Lote de soja de alta qualidade para exportação',
          latitude: -25.4289,
          longitude: -49.2671,
          yieldHistory: [
            { period: '2023', yield: 480 },
            { period: '2024', yield: 520 }
          ],
          certifications: ['Non-GMO', 'Premium Grade']
        }
      },
      {
        id: '4',
        name: 'Certificado de Sustentabilidade',
        type: 'Certificado',
        location: 'São Paulo, Brasil',
        area: 0,
        estimatedValue: 2000000,
        lastValuation: '2024-12-12',
        owner: '0x5432...1098',
        tokenId: 'token_004',
        quantity: 1,
        imageUrl: '/images/certificate1.jpg',
        metadata: {
          description: 'Certificado de práticas sustentáveis agrícolas',
          latitude: -23.5505,
          longitude: -46.6333,
          certifications: ['Sustentável', 'ISO 14001']
        }
      },
      {
        id: '5',
        name: 'Fazenda Boa Vista',
        type: 'Fazenda',
        location: 'Minas Gerais, Brasil',
        crop: 'Café',
        area: 800,
        estimatedValue: 35000000,
        lastValuation: '2024-12-11',
        owner: '0x1111...2222',
        tokenId: 'token_005',
        quantity: 1,
        imageUrl: '/images/farm2.jpg',
        metadata: {
          description: 'Fazenda de café arábica de altitude',
          latitude: -20.1445,
          longitude: -44.8939,
          yieldHistory: [
            { period: '2023', yield: 2800 },
            { period: '2024', yield: 3200 }
          ],
          certifications: ['Orgânico', 'Fair Trade']
        }
      }
    ];

    return mockNFTs;
  };

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch('/api/nft/data');
      // const data = await response.json();

      const mockNFTs = generateMockNFTs();
      setNfts(mockNFTs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados dos NFTs');
      console.error('Erro ao carregar dados dos NFTs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar NFTs por tipo
  const getNFTsByType = useCallback((type: string): NFT[] => {
    if (type === 'all') return nfts;
    return nfts.filter(nft => nft.type === type);
  }, [nfts]);

  // Filtrar NFTs por localização
  const getNFTsByLocation = useCallback((location: string): NFT[] => {
    if (!location) return nfts;
    return nfts.filter(nft => 
      nft.location.toLowerCase().includes(location.toLowerCase())
    );
  }, [nfts]);

  // Pesquisar NFTs
  const searchNFTs = useCallback((query: string): NFT[] => {
    if (!query) return nfts;
    const lowerQuery = query.toLowerCase();
    
    return nfts.filter(nft => 
      nft.name.toLowerCase().includes(lowerQuery) ||
      nft.location.toLowerCase().includes(lowerQuery) ||
      (nft.crop && nft.crop.toLowerCase().includes(lowerQuery)) ||
      nft.type.toLowerCase().includes(lowerQuery) ||
      (nft.metadata.description && nft.metadata.description.toLowerCase().includes(lowerQuery))
    );
  }, [nfts]);

  // Função para atualizar dados
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Simular atualizações em tempo real (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && nfts.length > 0) {
        // Simular pequenas variações nos valores
        setNfts(prev => prev.map(nft => ({
          ...nft,
          estimatedValue: Math.round(nft.estimatedValue * (0.98 + Math.random() * 0.04)),
          lastValuation: new Date().toISOString().split('T')[0]
        })));
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [loading, nfts]);

  return {
    nfts,
    loading,
    error,
    refreshData,
    getNFTsByType,
    getNFTsByLocation,
    searchNFTs
  };
};

export default useNFTData;