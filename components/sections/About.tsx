'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export function About() {
  return (
    <section id="about" className="py-20 bg-agro-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Sobre a AGROTM
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              A AGROTM é uma plataforma inovadora que combina tecnologia blockchain
              com agricultura sustentável, criando oportunidades únicas de investimento
              em DeFi.
            </p>
            <p className="text-lg text-gray-400 mb-6">
              Nossa missão é democratizar o acesso ao financiamento agrícola
              através da tecnologia blockchain, conectando investidores diretamente
              a projetos agrícolas sustentáveis.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-agro-green mb-2">25K+</h3>
                <p className="text-gray-400">Usuários Ativos</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-agro-blue mb-2">$12.5M</h3>
                <p className="text-gray-400">Total Value Locked</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">🌱</div>
                <h3 className="text-xl font-bold text-white mb-2">Sustentabilidade</h3>
                <p className="text-gray-400">
                  Apoiamos projetos agrícolas que promovem práticas sustentáveis
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">Segurança</h3>
                <p className="text-gray-400">
                  Todas as transações são seguras e transparentes na blockchain
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-xl font-bold text-white mb-2">Crescimento</h3>
                <p className="text-gray-400">
                  Oportunidades de retorno atrativas para investidores
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="text-xl font-bold text-white mb-2">Impacto</h3>
                <p className="text-gray-400">
                  Contribuímos para um futuro mais sustentável e justo
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 