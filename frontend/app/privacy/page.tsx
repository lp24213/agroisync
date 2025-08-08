'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Settings } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Política de Privacidade
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sua privacidade é importante para nós. Saiba como protegemos e utilizamos suas informações.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Introdução */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-400" />
                Introdução
              </h2>
              <p className="text-gray-300 leading-relaxed">
                A AGROTM Solana está comprometida em proteger sua privacidade. Esta política descreve como coletamos, 
                usamos e protegemos suas informações pessoais quando você utiliza nossa plataforma.
              </p>
            </motion.section>

            {/* Cookies */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" />
                Uso de Cookies
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies Necessários</h3>
                  <p className="text-gray-300 mb-2">
                    Essenciais para o funcionamento básico do site. Incluem:
                  </p>
                  <ul className="text-gray-400 space-y-1 ml-4">
                    <li>• Autenticação de usuários</li>
                    <li>• Preferências de idioma</li>
                    <li>• Segurança da sessão</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies Analíticos</h3>
                  <p className="text-gray-300 mb-2">
                    Nos ajudam a entender como você usa o site para melhorar a experiência:
                  </p>
                  <ul className="text-gray-400 space-y-1 ml-4">
                    <li>• Análise de tráfego</li>
                    <li>• Métricas de performance</li>
                    <li>• Comportamento do usuário</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies de Marketing</h3>
                  <p className="text-gray-300 mb-2">
                    Usados para personalizar anúncios e conteúdo relevante:
                  </p>
                  <ul className="text-gray-400 space-y-1 ml-4">
                    <li>• Publicidade personalizada</li>
                    <li>• Campanhas de marketing</li>
                    <li>• Redes sociais</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Cookies Funcionais</h3>
                  <p className="text-gray-300 mb-2">
                    Melhoram a funcionalidade e personalização:
                  </p>
                  <ul className="text-gray-400 space-y-1 ml-4">
                    <li>• Preferências de interface</li>
                    <li>• Funcionalidades avançadas</li>
                    <li>• Lembretes e notificações</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Coleta de Dados */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-400" />
                Coleta de Dados
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Informações que Coletamos</h3>
                  <ul className="text-gray-300 space-y-2 ml-4">
                    <li>• Informações de conta (nome, email, endereço)</li>
                    <li>• Dados de transação e staking</li>
                    <li>• Informações técnicas (IP, navegador, dispositivo)</li>
                    <li>• Dados de uso e interação</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Como Usamos suas Informações</h3>
                  <ul className="text-gray-300 space-y-2 ml-4">
                    <li>• Fornecer e melhorar nossos serviços</li>
                    <li>• Processar transações e staking</li>
                    <li>• Comunicar atualizações importantes</li>
                    <li>• Garantir segurança e prevenir fraudes</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Segurança */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                Segurança e Proteção
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Implementamos medidas de segurança robustas para proteger suas informações:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Criptografia de ponta a ponta</li>
                  <li>• Autenticação de dois fatores</li>
                  <li>• Monitoramento 24/7</li>
                  <li>• Auditorias regulares de segurança</li>
                  <li>• Conformidade com LGPD e GDPR</li>
                </ul>
              </div>
            </motion.section>

            {/* Seus Direitos */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Seus Direitos</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Acesso e Controle</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Acessar seus dados pessoais</li>
                    <li>• Corrigir informações incorretas</li>
                    <li>• Solicitar exclusão de dados</li>
                    <li>• Revogar consentimento</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Portabilidade</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Exportar seus dados</li>
                    <li>• Transferir para outro serviço</li>
                    <li>• Backup de informações</li>
                    <li>• Formato legível</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Contato */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Entre em Contato</h2>
              <p className="text-gray-300 mb-6">
                Tem dúvidas sobre nossa política de privacidade? Entre em contato conosco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Fale Conosco
                  </button>
                </Link>
                <a href="mailto:privacy@agrotm.com">
                  <button className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors">
                    privacy@agrotm.com
                  </button>
                </a>
              </div>
            </motion.section>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-400 text-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            <Link href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
              ← Voltar ao Início
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 