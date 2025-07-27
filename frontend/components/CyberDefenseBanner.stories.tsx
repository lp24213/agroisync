import React from "react";

export default {
  title: "Premium Assets/Cyber Defense Banner",
  component: CyberDefenseBannerExample,
};

export function CyberDefenseBannerExample() {
  return (
    <picture>
      <source srcSet="/assets/img/cyber-defense-neon.png" type="image/png" />
      <img
        src="/assets/img/cyber-defense-neon.png"
        alt="AGROTM Cyber Defense Neon"
        title="Cyber Defense Neon - AGROTM"
        className="w-full max-w-2xl rounded-2xl shadow-xl object-cover animate-fade-in"
        loading="lazy"
      />
    </picture>
  );
}
