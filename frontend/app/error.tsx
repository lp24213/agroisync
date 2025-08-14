'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Erro interno</h2>
        <p className="text-gray-600 mb-8">Algo deu errado. Tente novamente.</p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
          <a 
            href="/" 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
} 