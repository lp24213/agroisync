'use client';

import { motion } from "framer-motion";
import { Contact } from "../components/sections/Contact";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="grid-animation opacity-10"></div>
          <div className="scanlines opacity-5"></div>
        </div>
        
        {/* Subtle Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-cyan-400/5 blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 30, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "easeInOut" 
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Logo AGROTM Principal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <motion.div 
              className="w-32 h-32 mx-auto mb-8 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Logo AGROTM - Estilizada "A" com elementos integrados */}
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] relative overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Letra "A" estilizada */}
                  <div className="relative">
                    {/* "A" principal */}
                    <div className="text-6xl font-bold text-white relative">
                      A
                      {/* Folha no lado esquerdo */}
                      <div className="absolute -top-2 -left-4 text-lg text-cyan-300">🍃</div>
                      {/* Hexágono no topo direito */}
                      <div className="absolute -top-2 -right-4 text-lg text-blue-300">⬡</div>
                      {/* Pontos de conexão na base */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Título Principal */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 text-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            AGROTM
            <motion.span 
              className="block text-2xl md:text-3xl text-cyan-400 mt-4 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              SOLANA
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Revolucione a Agricultura com DeFi
          </motion.p>

          {/* Descrição */}
          <motion.p 
            className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.
          </motion.p>

          {/* Botões de Ação */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Entrar na Plataforma
            </motion.button>
            <motion.button 
              className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Saiba Mais
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16 text-glow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Recursos Principais
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Staking Sustentável */}
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 text-center relative group hover:border-blue-500/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
              
              <motion.div 
                className="text-5xl mb-6 text-glow"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                🌾
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4">Staking Sustentável</h3>
              <p className="text-gray-400 leading-relaxed">
                Stake seus tokens e participe de projetos agrícolas sustentáveis com retornos atrativos e impacto positivo no meio ambiente.
              </p>
            </motion.div>

            {/* NFTs Agrícolas */}
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-8 text-center relative group hover:border-cyan-400/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>
              
              <motion.div 
                className="text-5xl mb-6 text-glow"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                🎨
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4">NFTs Agrícolas</h3>
              <p className="text-gray-400 leading-relaxed">
                Crie, compre e venda NFTs únicos representando propriedades agrícolas, colheitas e ativos do agronegócio.
              </p>
            </motion.div>

            {/* Governança */}
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 text-center relative group hover:border-blue-500/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
              
              <motion.div 
                className="text-5xl mb-6 text-glow"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                🏛️
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4">Governança Descentralizada</h3>
              <p className="text-gray-400 leading-relaxed">
                Participe das decisões da plataforma através de votação descentralizada e propostas da comunidade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">Dashboard Interativo</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Monitore seus investimentos, acompanhe o desempenho dos projetos agrícolas e gerencie seus ativos DeFi em tempo real.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10 border border-blue-500/20 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-1">DeFi</h3>
              <p className="text-gray-400 text-sm">Protocolos Financeiros</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-cyan-400/10 to-green-400/10 border border-cyan-400/20 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-1">Crescimento</h3>
              <p className="text-gray-400 text-sm">Análise de Performance</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-500/10 to-purple-400/10 border border-blue-500/20 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-1">Analytics</h3>
              <p className="text-gray-400 text-sm">Dados em Tempo Real</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 border border-cyan-400/20 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-1">Rede</h3>
              <p className="text-gray-400 text-sm">Conectividade Global</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cyber Defense Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">Defesa Cibernética</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Proteção avançada para seus ativos digitais com inteligência artificial e blockchain seguro.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-6">DEFESA CIBERNÉTICA</h3>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Proteção Avançada</h3>
                  <p className="text-gray-400">Sistemas de segurança de última geração para proteger seus ativos digitais.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">IA Inteligente</h3>
                  <p className="text-gray-400">Detecção de ameaças em tempo real com inteligência artificial avançada.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Blockchain Seguro</h3>
                  <p className="text-gray-400">Infraestrutura blockchain robusta e auditável para máxima segurança.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Staking & Farming Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">Staking & Farming</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Maximize seus retornos com estratégias avançadas de staking e farming sustentável.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 border border-cyan-400/20 rounded-lg p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">STAKING & FARMING</h3>
              <div className="space-y-8">
                <div className="bg-black/30 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold text-white mb-4">Staking Sustentável</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Stake seus tokens em projetos agrícolas sustentáveis e receba recompensas baseadas no impacto ambiental positivo.
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold text-white mb-4">Farming de Liquidez</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Forneça liquidez para pools agrícolas e ganhe tokens de recompensa enquanto apoia o ecossistema.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NFT Minting Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">Criação de NFTs</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Crie NFTs únicos representando ativos agrícolas e participe do mercado de tokens não fungíveis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gradient-to-br from-blue-400/10 to-purple-400/10 border border-blue-400/20 rounded-lg p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-6">CRIAÇÃO DE NFTS</h3>
              <div className="space-y-8">
                <div className="bg-black/30 rounded-lg p-6">
                  <h3 className="text-3xl font-semibold text-white mb-6">Crie NFTs Únicos</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Transforme propriedades agrícolas, colheitas e ativos do agronegócio em NFTs colecionáveis e negociáveis.
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all duration-300">
                    Criar NFT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
