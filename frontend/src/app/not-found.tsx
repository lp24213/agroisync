export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
        <h2 className="text-2xl mb-4">Página não encontrada</h2>
        <p className="text-gray-400 mb-8">A página que você está procurando não existe.</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  )
}
