'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  date: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: '1',
    phase: 'Fase 1',
    title: 'Lançamento da Plataforma',
    description: 'Staking básico e pools de liquidez iniciais',
    status: 'completed',
    date: 'Q1 2024',
  },
  {
    id: '2',
    phase: 'Fase 2',
    title: 'Yield Farming Avançado',
    description: 'Estratégias de yield farming e otimização de retornos',
    status: 'completed',
    date: 'Q2 2024',
  },
  {
    id: '3',
    phase: 'Fase 3',
    title: 'Governança DAO',
    description: 'Sistema de governança descentralizada e votação',
    status: 'in-progress',
    date: 'Q3 2024',
  },
  {
    id: '4',
    phase: 'Fase 4',
    title: 'Expansão Global',
    description: 'Integração com outras blockchains e mercados globais',
    status: 'upcoming',
    date: 'Q4 2024',
  },
  {
    id: '5',
    phase: 'Fase 5',
    title: 'Ecosystem Completo',
    description: 'Marketplace de NFTs agrícolas e metaverso',
    status: 'upcoming',
    date: 'Q1 2025',
  },
];

export function Roadmap() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'upcoming':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Progresso';
      case 'upcoming':
        return 'Próximo';
      default:
        return 'Próximo';
    }
  };

  return (
    <section className="py-20 bg-agro-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Roadmap
          </h2>
          <p className="text-xl text-gray-400">
            Nossa jornada de desenvolvimento e crescimento
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-700"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div key={item.id} className={`relative flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}>
                {/* Timeline dot */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${getStatusColor(item.status)}`}></div>

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-agro-blue">{item.phase}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 mb-3">{item.description}</p>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 