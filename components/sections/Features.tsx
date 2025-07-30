'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    id: '1',
    title: 'Staking Inteligente',
    description: 'Stake seus tokens AGRO e ganhe recompensas automáticas com APR otimizado.',
    icon: '🌱',
  },
  {
    id: '2',
    title: 'Yield Farming',
    description: 'Participe de pools de liquidez e maximize seus retornos com estratégias avançadas.',
    icon: '🚀',
  },
  {
    id: '3',
    title: 'Analytics em Tempo Real',
    description: 'Monitore seu portfólio com dados em tempo real e insights de mercado.',
    icon: '📊',
  },
  {
    id: '4',
    title: 'Segurança Blockchain',
    description: 'Todas as transações são seguras e transparentes na blockchain Solana.',
    icon: '🔒',
  },
  {
    id: '5',
    title: 'Governança DAO',
    description: 'Participe das decisões da plataforma através do sistema de governança.',
    icon: '🏛️',
  },
  {
    id: '6',
    title: 'Agricultura Sustentável',
    description: 'Apoie projetos de agricultura sustentável enquanto investe em DeFi.',
    icon: '🌍',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-agro-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Por que escolher a AGROTM?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Nossa plataforma combina inovação DeFi com sustentabilidade agrícola,
            oferecendo oportunidades únicas de investimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="text-center hover:transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 