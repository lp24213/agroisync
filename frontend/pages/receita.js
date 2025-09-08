import React from 'react';
import { Layout } from '../src/components/layout/layout';

export default function ReceitaPage() {
  return (
    <Layout>
      <div className='min-h-screen bg-black p-6 text-white'>
        <div className='mx-auto max-w-7xl'>
          {/* Header */}
          <div className='mb-12 text-center'>
            <h1 className='mb-4 bg-gradient-to-r from-green-400 via-yellow-500 to-orange-600 bg-clip-text text-5xl font-bold text-transparent'>
              Receita Federal
            </h1>
            <p className='mx-auto max-w-3xl text-xl text-gray-300'>
              Dados fiscais e informações empresariais verificadas diretamente da Receita Federal do Brasil
            </p>
          </div>

          {/* Content Placeholder */}
          <div className='rounded-lg bg-gray-900/50 p-12 text-center backdrop-blur-sm'>
            <h2 className='mb-4 text-3xl font-bold text-white'>Integração Receita Federal em Desenvolvimento</h2>
            <p className='mb-6 text-lg text-gray-400'>
              Esta funcionalidade está sendo desenvolvida para integrar com os sistemas oficiais da Receita Federal
            </p>
            <div className='mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>CNPJ</h3>
                <p className='text-sm text-gray-400'>Consulta de empresas</p>
              </div>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>CPF</h3>
                <p className='text-sm text-gray-400'>Verificação de pessoas físicas</p>
              </div>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>Fiscal</h3>
                <p className='text-sm text-gray-400'>Dados fiscais e tributários</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
