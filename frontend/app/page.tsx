'use client';

import { About } from '@/components/sections/About';
import { CTA } from '@/components/sections/CTA';
import { Contact } from '@/components/sections/Contact';
import { PremiumAnalytics } from '@/components/sections/PremiumAnalytics';
import { PremiumFeatures } from '@/components/sections/PremiumFeatures';
import { PremiumHero } from '@/components/sections/PremiumHero';
import { Roadmap } from '@/components/sections/Roadmap';

export default function HomePage() {
  return (
    <div className='space-y-0'>
      <PremiumHero />
      <PremiumAnalytics />
      <PremiumFeatures />
      <About />
      <Roadmap />
      <CTA />
      <Contact />
    </div>
  );
}
