import React from 'react';
import { Layout } from '../src/components/layout/layout';

export default function IBGEDataPage() {
  return (
    <Layout>
      <div className='min-h-screen bg-black p-6 text-white'>
        <div className='mx-auto max-w-7xl'>
          {/* Header */}
          <div className='mb-12 text-center'>
            <h1 className='mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-5xl font-bold text-transparent'>
              Dados IBGE
            </h1>
            <p className='mx-auto max-w-3xl text-xl text-gray-300'>
              Estatísticas oficiais e dados demográficos integrados diretamente do Instituto Brasileiro de Geografia e
              Estatística
            </p>
          </div>

          {/* Content Placeholder */}
          <div className='rounded-lg bg-gray-900/50 p-12 text-center backdrop-blur-sm'>
            <h2 className='mb-4 text-3xl font-bold text-white'>Integração IBGE em Desenvolvimento</h2>
            <p className='mb-6 text-lg text-gray-400'>
              Esta funcionalidade está sendo desenvolvida para integrar com as APIs oficiais do IBGE
            </p>
            <div className='mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>Demografia</h3>
                <p className='text-sm text-gray-400'>Dados populacionais e sociais</p>
              </div>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>Economia</h3>
                <p className='text-sm text-gray-400'>Indicadores econômicos</p>
              </div>
              <div className='rounded-lg bg-gray-800/50 p-4'>
                <h3 className='mb-2 text-lg font-semibold text-white'>Agricultura</h3>
                <p className='text-sm text-gray-400'>Estatísticas agrícolas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
