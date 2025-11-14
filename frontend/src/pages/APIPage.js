import React from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Key, Zap, Shield, BookOpen, ExternalLink } from 'lucide-react';
import AgroisyncHeader from '../components/AgroisyncHeader';
import AgroisyncFooter from '../components/AgroisyncFooter';

const APIPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <AgroisyncHeader />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <Key className="h-5 w-5" />
              <span className="font-semibold">API Agroisync</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Integre com a <span className="text-green-600">Agroisync</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('api.description') || 'Acesse dados do agronegócio em tempo real através da nossa API RESTful.'}
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rápida e Confiável</h3>
              <p className="text-gray-600">
                Respostas em milissegundos com 99.9% de uptime garantido.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Segura</h3>
              <p className="text-gray-600">
                Autenticação via token JWT e criptografia TLS 1.3.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Documentação</h3>
              <p className="text-gray-600">
                Docs completas com exemplos em várias linguagens.
              </p>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-xl mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <Code className="h-5 w-5" />
                <span className="font-semibold">Exemplo de Uso</span>
              </div>
              <span className="text-xs text-gray-400">JavaScript</span>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{`// Buscar produtos
const response = await fetch('https://agroisync.com/api/v1/produtos', {
  headers: {
    'Authorization': 'Bearer SEU_TOKEN_AQUI',
    'Content-Type': 'application/json'
  }
});

const produtos = await response.json();
console.log(produtos);`}</code>
            </pre>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-lg mb-6 opacity-90">
              Entre em contato para solicitar acesso à API
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              <ExternalLink className="h-5 w-5" />
              Solicitar Acesso
            </a>
          </div>
        </div>
      </main>

      <AgroisyncFooter />
    </div>
  );
};

export default APIPage;

