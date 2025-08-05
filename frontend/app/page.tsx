'use client';

import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { Layout } from '../components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <About />
      <Contact />
    </Layout>
  );
}
