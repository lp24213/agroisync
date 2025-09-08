import React from 'react';
import { Layout } from '../src/components/layout/layout';

export default function GlobalPage() {
  return (
    <Layout>
      <div className='min-h-screen bg-black p-6 text-white'>
        <div className='mx-auto max-w-7xl'>
          {/* Header */}
          <div className='mb-12 text-center'>
            <h1 className='mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-5xl font-bold text-transparent'>
              Mercado Global
            </h1>
            <p className='mx-auto max-w-3xl text-xl text-gray-300'>
              Análise de tendências internacionais e exportações com dados da FAO e outras fontes globais
            </p>
          </div>

          {/* Content Placeholder */}
          <div className='rounded-lg bg-gray-900/50 p-12 text-center backdrop-blur-sm'>
            <h2 className='mb-4 text-3xl font-bold text-white'>Análise Global em Desenvolvimento</h2>
            <p className='mb-6 text-lg text-gray-400'>
              Esta funcionalidade está sendo desenvolvida para integrar com APIs globais de commodities
            </p>
            <div className='mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>FAO</h3>
                <p className='text-sm text-gray-400'>Dados da Organização das Nações Unidas para Alimentação</p>
              </div>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>Mercado Futuro</h3>
                <p className='text-sm text-gray-400'>Dados de bolsas internacionais</p>
              </div>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>Exportações</h3>
                <p className='text-sm text-gray-400'>Dados de comércio internacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
