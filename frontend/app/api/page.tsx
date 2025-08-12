'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { Code, Database, Zap, Shield, Globe, Download, BookOpen, Terminal } from 'lucide-react';

export default function APIPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-[#ffffff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-[#00FF7F] mb-4">
                API AGROTM
              </h1>
              <p className="text-[#cccccc] text-lg max-w-3xl mx-auto">
                Acesse nossa API RESTful para integrar a plataforma AGROTM em suas aplicações. 
                Documentação completa, exemplos de código e ferramentas de desenvolvimento.
              </p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <Code className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">RESTful</h3>
                <p className="text-[#cccccc] text-sm">API REST completa com endpoints padronizados</p>
              </div>

              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <Shield className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Segura</h3>
                <p className="text-[#cccccc] text-sm">Autenticação JWT e criptografia avançada</p>
              </div>

              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <Zap className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Rápida</h3>
                <p className="text-[#cccccc] text-sm">Resposta em tempo real com cache otimizado</p>
              </div>

              <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center">
                <Globe className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Global</h3>
                <p className="text-[#cccccc] text-sm">Disponível em múltiplas regiões</p>
              </div>
            </motion.div>

            {/* Quick Start */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-6">
                Início Rápido
              </h2>
              <div className="space-y-4">
                <div className="bg-[#000000]/30 border border-[#00FF7F]/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#ffffff] mb-2">1. Obtenha sua API Key</h3>
                  <p className="text-[#cccccc] text-sm mb-3">
                    Registre-se na plataforma e gere sua chave de API no painel de controle.
                  </p>
                  <code className="bg-[#000000]/50 text-[#00FF7F] px-3 py-1 rounded text-sm">
                    curl -X POST https://api.agrotm.com/auth/register
                  </code>
                </div>

                <div className="bg-[#000000]/30 border border-[#00FF7F]/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#ffffff] mb-2">2. Faça sua primeira requisição</h3>
                  <p className="text-[#cccccc] text-sm mb-3">
                    Teste a API com um endpoint simples:
                  </p>
                  <code className="bg-[#000000]/50 text-[#00FF7F] px-3 py-1 rounded text-sm">
                    curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agrotm.com/v1/status
                  </code>
                </div>

                <div className="bg-[#000000]/30 border border-[#00FF7F]/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#ffffff] mb-2">3. Explore os endpoints</h3>
                  <p className="text-[#cccccc] text-sm mb-3">
                    Consulte a documentação completa para todos os endpoints disponíveis.
                  </p>
                  <code className="bg-[#000000]/50 text-[#00FF7F] px-3 py-1 rounded text-sm">
                    https://api.agrotm.com/docs
                  </code>
                </div>
              </div>
            </motion.div>

            {/* Endpoints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-orbitron font-bold text-[#00FF7F] text-center mb-8">
                Principais Endpoints
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-4">Autenticação</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/auth/login</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/auth/register</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/auth/refresh</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-4">Staking</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">GET</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/staking/pools</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/staking/stake</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/staking/unstake</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-4">NFTs</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">GET</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/nfts/collection</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/nfts/mint</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">GET</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/nfts/{'{id}'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-4">Smart Farming</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">GET</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/farming/sensors</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">POST</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/farming/automate</span>
                    </div>
                    <div>
                      <span className="text-[#00FF7F] font-mono text-sm">GET</span>
                      <span className="text-[#cccccc] font-mono text-sm ml-2">/farming/analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SDKs and Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-orbitron font-bold text-[#00FF7F] text-center mb-8">
                SDKs e Ferramentas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <Terminal className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-2">JavaScript SDK</h3>
                  <p className="text-[#cccccc] text-sm mb-4">SDK oficial para Node.js e navegadores</p>
                  <button className="bg-[#00FF7F] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00cc66] transition-colors">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download
                  </button>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <BookOpen className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-2">Documentação</h3>
                  <p className="text-[#cccccc] text-sm mb-4">Guias completos e exemplos de código</p>
                  <button className="bg-[#00FF7F] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00cc66] transition-colors">
                    Acessar Docs
                  </button>
                </div>

                <div className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-6 backdrop-blur-sm text-center hover:border-[#00FF7F]/40 transition-colors">
                  <Database className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#ffffff] mb-2">Postman Collection</h3>
                  <p className="text-[#cccccc] text-sm mb-4">Coleção pronta para testar a API</p>
                  <button className="bg-[#00FF7F] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00cc66] transition-colors">
                    <Download className="w-4 h-4 inline mr-2" />
                    Importar
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Rate Limits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-[#000000]/50 border border-[#00FF7F]/20 rounded-xl p-8 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-6">
                Limites de Uso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#00FF7F] mb-2">1,000</h3>
                  <p className="text-[#cccccc]">Requisições por hora (Free)</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#00FF7F] mb-2">10,000</h3>
                  <p className="text-[#cccccc]">Requisições por hora (Pro)</p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#00FF7F] mb-2">100,000</h3>
                  <p className="text-[#cccccc]">Requisições por hora (Enterprise)</p>
                </div>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-[#888888] text-sm border-t border-[#00FF7F]/20 pt-8"
            >
              <p>Precisa de ajuda com a API? Entre em contato: <span className="text-[#00FF7F]">api@agroisync.com</span></p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
