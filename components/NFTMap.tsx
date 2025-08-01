// components/NFTMap.tsx
import React from "react";

interface NFT {
  tokenId: string;
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface NFTMapProps {
  nfts?: NFT[];
  className?: string;
}

export default function NFTMap({ nfts = [], className = "" }: NFTMapProps) {
  if (!nfts.length) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>Nenhum NFT encontrado no mapa.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {nfts.map((nft) => (
        <div 
          key={nft.tokenId} 
          className="rounded-xl bg-gray-800 p-4 hover:bg-gray-700 transition-colors duration-200"
        >
          <h3 className="font-semibold text-white mb-2 truncate">{nft.name}</h3>
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-32 object-cover rounded mb-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/img/nft-placeholder.png';
            }}
          />
          <p className="text-sm text-gray-400">Token ID: {nft.tokenId}</p>
          {nft.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {nft.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}