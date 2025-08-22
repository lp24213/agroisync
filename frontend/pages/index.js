import React from 'react';
import { Layout } from '../src/components/layout/layout';
import { HeroSection } from '../src/components/sections/hero-section';


export default function Home() {
  return (
    <Layout transparent>
      <HeroSection />
      
      {/* Additional sections can be added here */}
      <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Mais conteúdo em desenvolvimento
          </h2>
          <p className="text-xl text-neutral-400">
            Plataforma AgroSync em construção
          </p>
        </div>
      </div>
    </Layout>
  );
}
