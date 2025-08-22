import React from 'react';
import { Layout } from '../src/components/layout/layout';


export default function IBGEDataPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
              Dados IBGE
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Estatísticas oficiais e dados demográficos integrados diretamente do Instituto Brasileiro de Geografia e Estatística
            </p>
          </div>

          {/* Content Placeholder */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Integração IBGE em Desenvolvimento
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Esta funcionalidade está sendo desenvolvida para integrar com as APIs oficiais do IBGE
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Demografia</h3>
                <p className="text-sm text-gray-400">Dados populacionais e sociais</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Economia</h3>
                <p className="text-sm text-gray-400">Indicadores econômicos</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Agricultura</h3>
                <p className="text-sm text-gray-400">Estatísticas agrícolas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
