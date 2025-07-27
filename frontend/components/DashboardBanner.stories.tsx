import React from "react";

export default {
  title: "Premium Assets/Dashboard Banner",
  component: DashboardBannerExample,
};

export function DashboardBannerExample() {
  return (
    <picture>
      <source srcSet="/assets/img/dashboard-interactive-neon.png" type="image/png" />
      <img
        src="/assets/img/dashboard-interactive-neon.png"
        alt="AGROTM Dashboard Interativo Neon"
        title="Dashboard Interativo AGROTM"
        className="w-full max-w-3xl rounded-2xl shadow-xl object-cover animate-fade-in"
        loading="eager"
      />
    </picture>
  );
}
