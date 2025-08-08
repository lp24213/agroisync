'use client';

import { motion } from "framer-motion";
import { Logo } from "../../components/ui/Logo";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-800">

      {/* Hero Section */}
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Documentação Completa
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Guia completo para integrar e utilizar a plataforma AGROTM
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
              📚 Documentação Técnica
            </span>
            <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
              🔧 API Reference
            </span>
            <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm">
              🛡️ Segurança
            </span>
          </div>
        </motion.div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Visão Geral</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              AGROTM é uma plataforma revolucionária que combina agricultura tradicional 
              com tecnologia blockchain para criar um ecossistema sustentável e lucrativo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-green-400 text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Staking & Farming</h3>
              <p className="text-gray-400 mb-6">
                Stake seus tokens AGROTM e participe do farming de liquidez para 
                maximizar seus retornos com APRs atrativos.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  APR até 32.8%
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Staking flexível
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Rewards automáticos
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-blue-400 text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">NFTs Agrícolas</h3>
              <p className="text-gray-400 mb-6">
                Crie, compre e venda NFTs únicos representando ativos agrícolas 
                reais com valor intrínseco.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Minting a partir de 0.1 SOL
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Marketplace integrado
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Verificação de autenticidade
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-purple-400 text-2xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Governança</h3>
              <p className="text-gray-400 mb-6">
                Participe da governança descentralizada e vote em propostas 
                que moldam o futuro da plataforma.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Votação transparente
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Propostas da comunidade
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  Execução automática
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="getting-started" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Começando</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Siga este guia passo a passo para começar a usar a plataforma AGROTM
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">1. Configuração da Carteira</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Instale o Phantom</h4>
                    <p className="text-gray-400 text-sm">
                      Baixe e instale a carteira Phantom para Solana
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Crie sua conta</h4>
                    <p className="text-gray-400 text-sm">
                      Configure sua carteira e guarde suas chaves privadas
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Adicione SOL</h4>
                    <p className="text-gray-400 text-sm">
                      Compre SOL e adicione à sua carteira para transações
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">2. Primeiros Passos</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Conecte sua carteira</h4>
                    <p className="text-gray-400 text-sm">
                      Clique em "Conectar Carteira" no site
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Compre AGROTM</h4>
                    <p className="text-gray-400 text-sm">
                      Use SOL para comprar tokens AGROTM
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Comece a fazer stake</h4>
                    <p className="text-gray-400 text-sm">
                      Stake seus tokens e comece a ganhar recompensas
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">API Reference</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Documentação completa da API para desenvolvedores
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Endpoints Principais</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded">
                  <code className="text-green-400 text-sm">
                    GET /api/staking/stats
                  </code>
                  <p className="text-gray-400 text-sm mt-2">
                    Retorna estatísticas de staking
                  </p>
                </div>
                <div className="bg-gray-900 p-4 rounded">
                  <code className="text-green-400 text-sm">
                    POST /api/staking/stake
                  </code>
                  <p className="text-gray-400 text-sm mt-2">
                    Faz stake de tokens AGROTM
                  </p>
                </div>
                <div className="bg-gray-900 p-4 rounded">
                  <code className="text-green-400 text-sm">
                    GET /api/nfts/collection
                  </code>
                  <p className="text-gray-400 text-sm mt-2">
                    Lista NFTs da coleção
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-lg border border-green-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Autenticação</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-white text-sm mb-2">Header de Autorização:</p>
                  <code className="text-green-400 text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-white text-sm mb-2">Rate Limiting:</p>
                  <code className="text-green-400 text-sm">
                    1000 requests/hour
                  </code>
                </div>
                <div className="bg-yellow-500/20 p-4 rounded border border-yellow-500/30">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400 font-semibold">⚠️ Importante</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    Mantenha suas chaves API seguras e nunca as exponha no código do cliente.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Segurança</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nossa prioridade é manter sua segurança e a integridade da plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-400 text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Contracts Auditados</h3>
              <p className="text-gray-400 text-sm">
                Todos os contratos passaram por auditorias de segurança rigorosas
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-400 text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Criptografia de Ponta</h3>
              <p className="text-gray-400 text-sm">
                Dados protegidos com criptografia AES-256
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-400 text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Governança Multi-Sig</h3>
              <p className="text-gray-400 text-sm">
                Controle descentralizado com múltiplas assinaturas
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-yellow-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-yellow-400 text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Monitoramento 24/7</h3>
              <p className="text-gray-400 text-sm">
                Sistema de monitoramento contínuo para detectar ameaças
              </p>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
} 