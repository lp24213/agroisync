import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWeb3 } from '../contexts/Web3Context';

interface NFTData {
  id: string;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
  collection: {
    verified: boolean;
    key: string;
  };
  uses: {
    useMethod: string;
    remaining: number;
    total: number;
  };
}

interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    files: Array<{
      type: string;
      uri: string;
    }>;
    category: string;
  };
}

export const useNFTData = () => {
  const { isConnected, publicKey } = useWeb3();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [metadata, setMetadata] = useState<Record<string, NFTMetadata>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock Solana connection
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const fetchNFTs = useCallback(async () => {
    if (!isConnected || !publicKey) {
      setNfts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock NFT data
      const mockNFTs: NFTData[] = [
        {
          id: '1',
          name: 'AGRO Farm #001',
          symbol: 'AGROFARM',
          uri: 'https://example.com/metadata/1.json',
          sellerFeeBasisPoints: 500,
          creators: [
            {
              address: publicKey,
              verified: true,
              share: 100
            }
          ],
          collection: {
            verified: true,
            key: 'agro-collection'
          },
          uses: {
            useMethod: 'Single',
            remaining: 1,
            total: 1
          }
        },
        {
          id: '2',
          name: 'Crop Token #042',
          symbol: 'CROP',
          uri: 'https://example.com/metadata/2.json',
          sellerFeeBasisPoints: 250,
          creators: [
            {
              address: publicKey,
              verified: true,
              share: 100
            }
          ],
          collection: {
            verified: true,
            key: 'crop-collection'
          },
          uses: {
            useMethod: 'Multiple',
            remaining: 5,
            total: 10
          }
        }
      ];

      setNfts(mockNFTs);

      // Fetch metadata for each NFT
      const metadataPromises = mockNFTs.map(async (nft) => {
        try {
          // Mock metadata
          const mockMetadata: NFTMetadata = {
            name: nft.name,
            symbol: nft.symbol,
            description: `This is a ${nft.name} NFT representing agricultural assets.`,
            image: `https://example.com/images/${nft.id}.png`,
            attributes: [
              { trait_type: 'Type', value: 'Agricultural' },
              { trait_type: 'Rarity', value: 'Common' },
              { trait_type: 'Season', value: 'Spring' }
            ],
            properties: {
              files: [
                {
                  type: 'image/png',
                  uri: `https://example.com/images/${nft.id}.png`
                }
              ],
              category: 'image'
            }
          };

          return { id: nft.id, metadata: mockMetadata };
        } catch (err) {
          console.error(`Failed to fetch metadata for NFT ${nft.id}:`, err);
          return null;
        }
      });

      const metadataResults = await Promise.all(metadataPromises);
      const metadataMap: Record<string, NFTMetadata> = {};

      metadataResults.forEach((result) => {
        if (result) {
          metadataMap[result.id] = result.metadata;
        }
      });

      setMetadata(metadataMap);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(errorMessage);
      console.error('Failed to fetch NFTs:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey, connection]);

  const fetchNFTByMint = useCallback(async (mintAddress: string) => {
    try {
      setLoading(true);
      setError(null);

      const mintPubkey = new PublicKey(mintAddress);

      // Mock NFT data for specific mint
      const mockNFT: NFTData = {
        id: mintAddress,
        name: 'AGRO Farm #001',
        symbol: 'AGROFARM',
        uri: 'https://example.com/metadata/1.json',
        sellerFeeBasisPoints: 500,
        creators: [
          {
            address: publicKey || '',
            verified: true,
            share: 100
          }
        ],
        collection: {
          verified: true,
          key: 'agro-collection'
        },
        uses: {
          useMethod: 'Single',
          remaining: 1,
          total: 1
        }
      };

      return mockNFT;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFT';
      setError(errorMessage);
      console.error('Failed to fetch NFT:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    metadata,
    loading,
    error,
    fetchNFTs,
    fetchNFTByMint,
    refetch: fetchNFTs
  };
};