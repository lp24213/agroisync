import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-agro-darker via-agro-dark to-agro-darker">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">The Future of</span>
            <br />
            <span className="gradient-text">Agriculture DeFi</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Revolucionando a agricultura sustentável através da blockchain. 
            Stake, farm e ganhe enquanto apoia práticas agrícolas eco-friendly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="primary" size="lg" className="animate-slide-up">
              Começar Agora
            </Button>
            <Button variant="outline" size="lg" className="animate-slide-up">
              Saiba Mais
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="animate-slide-up">
            <div className="text-center">
              <div className="text-3xl font-bold text-agro-blue mb-2">$12.5M</div>
              <div className="text-gray-400">Total Value Locked</div>
            </div>
          </Card>
          
          <Card className="animate-slide-up">
            <div className="text-center">
              <div className="text-3xl font-bold text-agro-green mb-2">25K+</div>
              <div className="text-gray-400">Usuários Ativos</div>
            </div>
          </Card>
          
          <Card className="animate-slide-up">
            <div className="text-center">
              <div className="text-3xl font-bold text-agro-purple mb-2">18.5%</div>
              <div className="text-gray-400">APR Médio</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
} 