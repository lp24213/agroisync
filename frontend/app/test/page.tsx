export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🚀 AGROTM.SOL</h1>
        <p className="text-2xl mb-8">Deploy Funcionando!</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
          <p className="text-lg">✅ Frontend Online</p>
          <p className="text-lg">✅ Next.js Funcionando</p>
          <p className="text-lg">✅ Vercel Deploy OK</p>
          <p className="text-lg">✅ Rotas Funcionando</p>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ir para Home
          </a>
        </div>
      </div>
    </div>
  );
} 