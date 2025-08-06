'use client';

import { Layout } from '../components/layout/Layout';
import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { About } from '../components/sections/About';
import { Stats } from '../components/sections/Stats';
import { Contact } from '../components/sections/Contact';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <About />
      <Stats />
      <Contact />
    </Layout>
  );
}
