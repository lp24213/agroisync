'use client';

import { motion } from "framer-motion";
import { Contact } from "../components/sections/Contact";
import { Logo } from "../components/ui/Logo";
import { HeroLogo } from "../components/ui/HeroLogo";
import { Hero } from "../components/sections/Hero";
import { PremiumAnalytics } from "../components/sections/PremiumAnalytics";
import { SecuritySection } from "../components/sections/SecuritySection";
import { StakingSection } from "../components/sections/StakingSection";
import { NFTMintingSection } from "../components/sections/NFTMintingSection";
import { SmartFarmSection } from "../components/sections/SmartFarmSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Dashboard Analytics Section */}
      <PremiumAnalytics />

      {/* Security Section */}
      <SecuritySection />

      {/* Staking & Farming Section */}
      <StakingSection />

      {/* NFT Minting Section */}
      <NFTMintingSection />

      {/* Smart Farm Section */}
      <SmartFarmSection />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
