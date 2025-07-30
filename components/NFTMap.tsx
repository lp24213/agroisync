// components/NFTMap.tsx
import React from "react";

export default function NFTMap({ nfts = [] }) {
  if (!nfts.length) return <div>Nenhum NFT no mapa.</div>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {nfts.map((nft) => (
        <div key={nft.tokenId} className="rounded-xl bg-gray-800 p-4">
          <h3>{nft.name}</h3>
          <img src={nft.image} alt={nft.name} className="w-full h-32 object-cover rounded" />
          <p className="text-sm text-gray-400 mt-2">Token ID: {nft.tokenId}</p>
        </div>
      ))}
    </div>
  );
}