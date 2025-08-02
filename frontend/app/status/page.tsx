export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🚀 AGROTM.SOL</h1>
        <p className="text-2xl mb-8">Status do Deploy</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-semibold mb-2">Frontend</h3>
              <p className="text-sm">Next.js Online</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-semibold mb-2">Build</h3>
              <p className="text-sm">Compilação OK</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-semibold mb-2">Deploy</h3>
              <p className="text-sm">Vercel Online</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-semibold mb-2">Rotas</h3>
              <p className="text-sm">Funcionando</p>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <a 
            href="/" 
            className="block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ir para Home
          </a>
          <a 
            href="/test" 
            className="block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Página de Teste
          </a>
        </div>
      </div>
    </div>
  );
} 