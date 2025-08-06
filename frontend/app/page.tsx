'use client';

import { Layout } from '../components/layout/Layout';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { About } from '../components/sections/About';
import { DashboardSection } from '../components/sections/DashboardSection';
import { SecuritySection } from '../components/sections/SecuritySection';
import { StakingSection } from '../components/sections/StakingSection';
import { NFTSection } from '../components/sections/NFTSection';
import { FarmSection } from '../components/sections/FarmSection';
import { Stats } from '../components/sections/Stats';
import { Contact } from '../components/sections/Contact';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <About />
      <DashboardSection />
      <SecuritySection />
      <StakingSection />
      <NFTSection />
      <FarmSection />
      <Stats />
      <Contact />
    </Layout>
  );
}
