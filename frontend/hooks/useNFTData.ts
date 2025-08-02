import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

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
  getUserNFTs: (walletAddress: string) => Promise<NFT[]>;
  getNFTByTokenId: (tokenId: string) => Promise<NFT | null>;
}

/**
 * AGROTM Premium NFT Data Service
 * Enterprise-grade NFT data integration with multi-chain support
 */
class PremiumNFTDataService {
  private nftCache: Map<string, { data: NFT; timestamp: number }> = new Map();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

  private apis = [
    {
      name: 'Helius',
      apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY,
      baseUrl: 'https://api.helius.xyz/v0'
    },
    {
      name: 'Jupiter',
      apiKey: process.env.NEXT_PUBLIC_JUPITER_API_KEY,
      baseUrl: 'https://price.jup.ag/v4'
    },
    {
      name: 'Tensor',
      apiKey: process.env.NEXT_PUBLIC_TENSOR_API_KEY,
      baseUrl: 'https://api.tensor.so/api/v1'
    }
  ];

  async getNFTs(walletAddress?: string): Promise<NFT[]> {
    try {
      const cacheKey = `nfts_${walletAddress || 'all'}`;
      const cached = this.nftCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return [cached.data];
      }

      // Fetch from multiple NFT APIs
      const nfts = await this.fetchFromNFTAPIs(walletAddress);
      
      // Cache results
      nfts.forEach(nft => {
        this.nftCache.set(`nft_${nft.tokenId}`, { data: nft, timestamp: Date.now() });
      });

      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }

  async getUserNFTs(walletAddress: string): Promise<NFT[]> {
    return this.getNFTs(walletAddress);
  }

  async getNFTByTokenId(tokenId: string): Promise<NFT | null> {
    try {
      const cacheKey = `nft_${tokenId}`;
      const cached = this.nftCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }

      // Fetch specific NFT from APIs
      const nft = await this.fetchNFTByTokenId(tokenId);
      
      if (nft) {
        this.nftCache.set(cacheKey, { data: nft, timestamp: Date.now() });
      }

      return nft;
    } catch (error) {
      console.error('Error fetching NFT by token ID:', error);
      return null;
    }
  }

  private async fetchFromNFTAPIs(walletAddress?: string): Promise<NFT[]> {
    const allNFTs: NFT[] = [];

    for (const api of this.apis) {
      if (!api.apiKey) continue;
      
      try {
        const nfts = await this.fetchFromAPI(api, walletAddress);
        allNFTs.push(...nfts);
      } catch (error) {
        console.error(`Failed to fetch from ${api.name}:`, error);
        continue;
      }
    }

    // Add AGROTM-specific NFTs
    const agrotmNFTs = await this.getAGROTMNFTs(walletAddress);
    allNFTs.push(...agrotmNFTs);

    return this.deduplicateAndSortNFTs(allNFTs);
  }

  private async fetchFromAPI(api: any, walletAddress?: string): Promise<NFT[]> {
    let url: string;
    let response: Response;

    switch (api.name) {
      case 'Helius':
        url = walletAddress 
          ? `${api.baseUrl}/addresses/${walletAddress}/nfts?api-key=${api.apiKey}`
          : `${api.baseUrl}/nfts?api-key=${api.apiKey}`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Helius: ${response.statusText}`);
        
        const heliusData = await response.json();
        return this.transformHeliusData(heliusData);

      case 'Tensor':
        url = walletAddress 
          ? `${api.baseUrl}/nfts/owner/${walletAddress}`
          : `${api.baseUrl}/nfts`;
        response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${api.apiKey}` }
        });
        if (!response.ok) throw new Error(`Tensor: ${response.statusText}`);
        
        const tensorData = await response.json();
        return this.transformTensorData(tensorData);

      default:
        return [];
    }
  }

  private async fetchNFTByTokenId(tokenId: string): Promise<NFT | null> {
    for (const api of this.apis) {
      if (!api.apiKey) continue;
      
      try {
        const nft = await this.fetchNFTFromAPI(api, tokenId);
        if (nft) return nft;
      } catch (error) {
        console.error(`Failed to fetch NFT from ${api.name}:`, error);
        continue;
      }
    }

    return null;
  }

  private async fetchNFTFromAPI(api: any, tokenId: string): Promise<NFT | null> {
    let url: string;
    let response: Response;

    switch (api.name) {
      case 'Helius':
        url = `${api.baseUrl}/nfts/${tokenId}?api-key=${api.apiKey}`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Helius: ${response.statusText}`);
        
        const heliusData = await response.json();
        return this.transformHeliusNFT(heliusData);

      case 'Tensor':
        url = `${api.baseUrl}/nfts/${tokenId}`;
        response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${api.apiKey}` }
        });
        if (!response.ok) throw new Error(`Tensor: ${response.statusText}`);
        
        const tensorData = await response.json();
        return this.transformTensorNFT(tensorData);

      default:
        return null;
    }
  }

  private async getAGROTMNFTs(walletAddress?: string): Promise<NFT[]> {
    // AGROTM-specific NFTs with real blockchain data
    const agrotmNFTs: NFT[] = [];

    try {
      // Fetch AGROTM NFTs from Solana program
      const connection = new (await import('@solana/web3.js')).Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      );

      const agrotmProgramId = new PublicKey(process.env.NEXT_PUBLIC_AGROTM_PROGRAM_ID || '');
      
      if (walletAddress) {
        // Get NFTs owned by specific wallet
        const accounts = await connection.getParsedProgramAccounts(agrotmProgramId, {
          filters: [
            { dataSize: 165 }, // Size of AGROTM NFT account
            { memcmp: { offset: 32, bytes: walletAddress } }
          ]
        });

        for (const account of accounts) {
          const nft = await this.parseAGROTMNFT(account);
          if (nft) agrotmNFTs.push(nft);
        }
      } else {
        // Get all AGROTM NFTs
        const accounts = await connection.getParsedProgramAccounts(agrotmProgramId, {
          filters: [{ dataSize: 165 }]
        });

        for (const account of accounts) {
          const nft = await this.parseAGROTMNFT(account);
          if (nft) agrotmNFTs.push(nft);
        }
      }
    } catch (error) {
      console.error('Error fetching AGROTM NFTs:', error);
    }

    return agrotmNFTs;
  }

  private async parseAGROTMNFT(account: any): Promise<NFT | null> {
    try {
      const data = account.account.data.parsed;
      
      return {
        id: account.pubkey.toString(),
        name: data.info.name || 'AGROTM Asset',
        imageUrl: data.info.image || '/assets/img/default-nft.jpg',
        type: this.mapAGROTMType(data.info.type),
        location: data.info.location || 'Brazil',
        area: data.info.area,
        crop: data.info.crop,
        quantity: data.info.quantity,
        estimatedValue: data.info.estimatedValue || 0,
        lastValuation: data.info.lastValuation || new Date().toISOString(),
        owner: data.info.owner,
        tokenId: account.pubkey.toString(),
        metadata: {
          latitude: data.info.latitude,
          longitude: data.info.longitude,
          yieldHistory: data.info.yieldHistory || [],
          certifications: data.info.certifications || [],
          ...data.info.metadata
        }
      };
    } catch (error) {
      console.error('Error parsing AGROTM NFT:', error);
      return null;
    }
  }

  private mapAGROTMType(type: string): 'Fazenda' | 'Maquinário' | 'Lote de Grãos' | 'Certificado' {
    switch (type) {
      case 'farm': return 'Fazenda';
      case 'machinery': return 'Maquinário';
      case 'grain': return 'Lote de Grãos';
      case 'certificate': return 'Certificado';
      default: return 'Fazenda';
    }
  }

  private transformHeliusData(data: any): NFT[] {
    return data.map((nft: any) => ({
      id: nft.mint,
      name: nft.onChainMetadata?.metadata?.data?.name || 'Unknown NFT',
      imageUrl: nft.offChainMetadata?.metadata?.image || '/assets/img/default-nft.jpg',
      type: 'Fazenda', // Default for non-AGROTM NFTs
      location: 'Unknown',
      estimatedValue: nft.offChainMetadata?.metadata?.attributes?.find((attr: any) => attr.trait_type === 'value')?.value || 0,
      lastValuation: new Date().toISOString(),
      owner: nft.owner,
      tokenId: nft.mint,
      metadata: {
        ...nft.offChainMetadata?.metadata?.attributes
      }
    }));
  }

  private transformTensorData(data: any): NFT[] {
    return data.nfts?.map((nft: any) => ({
      id: nft.mint,
      name: nft.name || 'Unknown NFT',
      imageUrl: nft.image || '/assets/img/default-nft.jpg',
      type: 'Fazenda', // Default for non-AGROTM NFTs
      location: 'Unknown',
      estimatedValue: nft.floorPrice || 0,
      lastValuation: new Date().toISOString(),
      owner: nft.owner,
      tokenId: nft.mint,
      metadata: {
        ...nft.attributes
      }
    })) || [];
  }

  private transformHeliusNFT(data: any): NFT | null {
    if (!data) return null;
    
    return {
      id: data.mint,
      name: data.onChainMetadata?.metadata?.data?.name || 'Unknown NFT',
      imageUrl: data.offChainMetadata?.metadata?.image || '/assets/img/default-nft.jpg',
      type: 'Fazenda', // Default for non-AGROTM NFTs
      location: 'Unknown',
      estimatedValue: data.offChainMetadata?.metadata?.attributes?.find((attr: any) => attr.trait_type === 'value')?.value || 0,
      lastValuation: new Date().toISOString(),
      owner: data.owner,
      tokenId: data.mint,
      metadata: {
        ...data.offChainMetadata?.metadata?.attributes
      }
    };
  }

  private transformTensorNFT(data: any): NFT | null {
    if (!data) return null;
    
    return {
      id: data.mint,
      name: data.name || 'Unknown NFT',
      imageUrl: data.image || '/assets/img/default-nft.jpg',
      type: 'Fazenda', // Default for non-AGROTM NFTs
      location: 'Unknown',
      estimatedValue: data.floorPrice || 0,
      lastValuation: new Date().toISOString(),
      owner: data.owner,
      tokenId: data.mint,
      metadata: {
        ...data.attributes
      }
    };
  }

  private deduplicateAndSortNFTs(nfts: NFT[]): NFT[] {
    const uniqueNFTs = new Map<string, NFT>();
    
    nfts.forEach(nft => {
      if (!uniqueNFTs.has(nft.tokenId)) {
        uniqueNFTs.set(nft.tokenId, nft);
      }
    });
    
    return Array.from(uniqueNFTs.values())
      .sort((a, b) => b.estimatedValue - a.estimatedValue);
  }
}

const nftDataService = new PremiumNFTDataService();

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

      const walletAddress = publicKey?.toString();
      const nftData = await nftDataService.getNFTs(walletAddress);
      
      setNfts(nftData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading NFT data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTData();
  }, [publicKey, connected]);

  const refetch = () => {
    fetchNFTData();
  };

  const getUserNFTs = async (walletAddress: string): Promise<NFT[]> => {
    return await nftDataService.getUserNFTs(walletAddress);
  };

  const getNFTByTokenId = async (tokenId: string): Promise<NFT | null> => {
    return await nftDataService.getNFTByTokenId(tokenId);
  };

  return {
    nfts,
    loading,
    error,
    refetch,
    getUserNFTs,
    getNFTByTokenId
  };
};