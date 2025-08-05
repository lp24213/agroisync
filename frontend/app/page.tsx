'use client';

import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <Contact />
    </>
  );
}
