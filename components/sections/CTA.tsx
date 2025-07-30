'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-agro-blue to-agro-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Pronto para começar?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Junte-se à revolução da agricultura DeFi e comece a ganhar recompensas
          enquanto apoia projetos sustentáveis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg">
            Conectar Carteira
          </Button>
          <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Saiba Mais
          </Button>
        </div>
      </div>
    </section>
  );
} 