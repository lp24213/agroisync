import React from "react";

export default {
  title: "Premium Assets/Staking Farming Banner",
  component: StakingFarmingBannerExample,
};

export function StakingFarmingBannerExample() {
  return (
    <picture>
      <source srcSet="/assets/img/staking-farming-neon.png" type="image/png" />
      <img
        src="/assets/img/staking-farming-neon.png"
        alt="AGROTM Staking Farming Neon"
        title="Staking Farming Neon - AGROTM"
        className="w-full max-w-xs rounded-xl shadow-lg object-cover animate-fade-in"
        loading="lazy"
      />
    </picture>
  );
}
