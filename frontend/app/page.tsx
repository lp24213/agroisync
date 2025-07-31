'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          AGROTM.SOL
        </h1>
        <p className="text-2xl mb-2 text-cyan-300">Next-Generation DeFi Platform</p>
        <p className="text-lg text-gray-300 mb-8">Deploy realizado com sucesso na Vercel!</p>
        <div className="flex justify-center space-x-4">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
            ✅ Frontend Online
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            🚀 Vercel Deploy
          </div>
          <div className="bg-purple-500 text-white px-4 py-2 rounded-lg">
            🔒 SSL Ativo
          </div>
        </div>
      </div>
    </div>
  );
}
