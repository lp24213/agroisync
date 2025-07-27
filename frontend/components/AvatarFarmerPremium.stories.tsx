import React from "react";

export default {
  title: "Premium Assets/Avatar Farmer Premium",
  component: AvatarFarmerPremiumExample,
};

export function AvatarFarmerPremiumExample() {
  return (
    <picture>
      <source srcSet="/assets/img/avatar-farmer-premium.png" type="image/png" />
      <img
        src="/assets/img/avatar-farmer-premium.png"
        alt="Avatar Farmer Premium Neon"
        title="Avatar Farmer Premium - AGROTM"
        className="w-full max-w-xs rounded-full shadow-lg object-cover animate-fade-in"
        loading="lazy"
      />
    </picture>
  );
}
