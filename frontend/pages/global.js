import React from 'react';
import { Layout } from '../src/components/layout/layout';


export default function GlobalPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent mb-4">
              Mercado Global
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Análise de tendências internacionais e exportações com dados da FAO e outras fontes globais
            </p>
          </div>

          {/* Content Placeholder */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Análise Global em Desenvolvimento
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Esta funcionalidade está sendo desenvolvida para integrar com APIs globais de commodities
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">FAO</h3>
                <p className="text-sm text-gray-400">Dados da Organização das Nações Unidas para Alimentação</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Mercado Futuro</h3>
                <p className="text-sm text-gray-400">Dados de bolsas internacionais</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Exportações</h3>
                <p className="text-sm text-gray-400">Dados de comércio internacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
