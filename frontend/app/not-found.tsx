import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
} 