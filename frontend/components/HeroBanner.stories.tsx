import React from "react";

export default {
  title: "Premium Assets/Hero Banner",
  component: HeroBannerExample,
};

export function HeroBannerExample() {
  return (
    <picture>
      <source srcSet="/assets/img/hero-banner-agro-neon.png" type="image/png" />
      <img
        src="/assets/img/hero-banner-agro-neon.png"
        alt="AGROTM Hero Banner - Agricultura Digital Neon"
        title="AGROTM - Agricultura Digital Futurista"
        className="w-full max-w-4xl rounded-3xl shadow-2xl object-cover animate-fade-in"
        loading="eager"
      />
    </picture>
  );
}
