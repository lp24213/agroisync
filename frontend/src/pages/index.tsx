import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>AgroSync - Plataforma de Agricultura Inteligente</title>
        <meta name="description" content="Plataforma de agricultura inteligente e tokenização com Web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            🌱 AgroSync
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Plataforma de Agricultura Inteligente
          </p>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800">✅ Frontend Funcionando</h2>
              <p className="text-green-600">Next.js 13.4.19 + TypeScript + Tailwind</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800">🚀 Backend Integrado</h2>
              <p className="text-blue-600">API Routes + AWS Amplify</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800">🔧 Deploy Otimizado</h2>
              <p className="text-purple-600">Build limpo sem conflitos</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
