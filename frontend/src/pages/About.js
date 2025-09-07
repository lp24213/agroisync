import React from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const About = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5566992362830";
    const message = "Olá! Gostaria de saber mais sobre o AgroSync.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Sobre o AgroSync
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Conectando o agronegócio brasileiro através de tecnologia inovadora e soluções inteligentes.
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Texto Institucional */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Nossa Missão
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                O AgroSync nasceu da necessidade de modernizar e digitalizar o agronegócio brasileiro. 
                Somos uma plataforma completa que conecta produtores, compradores, transportadores 
                e investidores em um ecossistema integrado e eficiente.
              </p>
              <p>
                Nossa tecnologia permite transações seguras, rastreamento em tempo real, 
                análise de mercado e acesso a dados precisos sobre commodities agrícolas, 
                clima e tendências do setor.
              </p>
              <p>
                Com sede em Sinop, Mato Grosso, estamos no coração do agronegócio brasileiro, 
                entendendo as necessidades reais dos produtores e oferecendo soluções práticas 
                e inovadoras.
              </p>
            </div>
          </div>

          {/* Dados de Contato */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Entre em Contato
            </h3>
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <a 
                    href="mailto:contato@agroisync.com"
                    className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    contato@agroisync.com
                  </a>
                </div>
              </div>

              {/* Telefone/WhatsApp */}
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-gray-900 dark:text-white font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-2"
                  >
                    <span>(66) 99236-2830</span>
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Localização */}
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Localização</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Sinop - MT, Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa Interativo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Nossa Localização
          </h3>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Mapa interativo de Sinop - MT
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                (Integração com Google Maps em desenvolvimento)
              </p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Inovação
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Tecnologia de ponta para revolucionar o agronegócio
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Conexão
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Conectamos todos os elos da cadeia produtiva
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Transparência
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Dados precisos e rastreabilidade completa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
