import React from "react";

export default {
  title: "Premium Assets/NFT Minting Banner",
  component: NFTMintingBannerExample,
};

export function NFTMintingBannerExample() {
  return (
    <picture>
      <source srcSet="/assets/img/nft-minting-neon.png" type="image/png" />
      <img
        src="/assets/img/nft-minting-neon.png"
        alt="NFT Minting AGROTM Neon"
        title="NFT Minting - AGROTM"
        className="w-full max-w-xs rounded-xl shadow-lg object-cover animate-fade-in"
        loading="lazy"
      />
    </picture>
  );
}
