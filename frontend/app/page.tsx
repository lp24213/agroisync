'use client';

import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { About } from '@/components/sections/About';
import { Roadmap } from '@/components/sections/Roadmap';
import { CTA } from '@/components/sections/CTA';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <div className="space-y-20">
      <Hero />
      <Stats />
      <Features />
      <About />
      <Roadmap />
      <CTA />
      <Contact />
    </div>
  );
} 