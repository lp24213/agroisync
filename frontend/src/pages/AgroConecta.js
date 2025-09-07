import React from 'react';
import { motion } from 'framer-motion';

const AgroConecta = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            <span className="text-gradient">AgroConecta</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            <strong>Intermediação inteligente de fretes agrícolas.</strong> Conectamos cargas com transportadores 
            através de nossa plataforma. <strong>Não transportamos, facilitamos conexões.</strong>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="card-futuristic p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Como Funciona Nossa <span className="text-gradient">Intermediação</span> de Fretes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-neon-blue to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Publica a Carga</h3>
              <p className="text-gray-400">
                Anunciantes cadastram suas cargas com origem, destino, peso e prazo
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-neon-green to-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">IA Conecta</h3>
              <p className="text-gray-400">
                Nossa IA encontra transportadores disponíveis na rota e envia propostas
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-neon-purple to-violet-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Frete Fechado</h3>
              <p className="text-gray-400">
                <strong>Anunciante e transportador negociam diretamente</strong> através de nossa mensageria privada
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para <span className="text-gradient">Intermediar</span> Seus Fretes?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Seja você anunciante ou transportador, nossa plataforma conecta você com os melhores parceiros de frete.
            <strong> Vocês negociam diretamente, nós só facilitamos a conexão!</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-4">
              Tenho Carga
            </button>
            <button className="btn-secondary px-8 py-4">
              Sou Transportador
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AgroConecta;
