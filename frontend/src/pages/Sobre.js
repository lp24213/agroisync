import React from 'react';
import { motion } from 'framer-motion';

const Sobre = () => {
  const stats = [
    { number: '50K+', label: 'Usuários Ativos', icon: '👥' },
    { number: '100K+', label: 'Transações', icon: '💼' },
    { number: '25+', label: 'Estados', icon: '🗺️' },
    { number: '99.9%', label: 'Uptime', icon: '⚡' }
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Inovação Sustentável',
      description: 'Promovemos práticas agrícolas sustentáveis e tecnologias inovadoras para o futuro do agronegócio.'
    },
    {
      icon: '🤝',
      title: 'Transparência Total',
      description: 'Acreditamos na transparência em todas as transações e relacionamentos comerciais.'
    },
    {
      icon: '🚀',
      title: 'Crescimento Tecnológico',
      description: 'Integramos as mais avançadas tecnologias para impulsionar o desenvolvimento do setor agrícola.'
    },
    {
      icon: '🌍',
      title: 'Impacto Global',
      description: 'Nossa missão é conectar produtores e compradores em todo o mundo, criando oportunidades globais.'
    }
  ];

  const team = [
    {
      name: 'Dr. Carlos Silva',
      role: 'CEO & Fundador',
      bio: 'Especialista em agronegócio com mais de 20 anos de experiência no setor.',
      avatar: '👨‍💼'
    },
    {
      name: 'Dra. Ana Costa',
      role: 'CTO',
      bio: 'Especialista em blockchain e tecnologias Web3 para o agronegócio.',
      avatar: '👩‍💻'
    },
    {
      name: 'Eng. Roberto Santos',
      role: 'Diretor de Operações',
      bio: 'Especialista em logística e cadeia de suprimentos agrícolas.',
      avatar: '👨‍🔬'
    },
    {
      name: 'Dra. Maria Oliveira',
      role: 'Diretora de Marketing',
      bio: 'Especialista em marketing digital e relacionamento com clientes.',
      avatar: '👩‍🎨'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Fundação',
      description: 'AgroConecta foi fundada com a missão de revolucionar o agronegócio brasileiro.'
    },
    {
      year: '2021',
      title: 'Primeira Plataforma',
      description: 'Lançamento da primeira versão da plataforma com funcionalidades básicas de marketplace.'
    },
    {
      year: '2022',
      title: 'Expansão Regional',
      description: 'Expansão para 15 estados brasileiros e integração com APIs de cotações.'
    },
    {
      year: '2023',
      title: 'Tecnologia Web3',
      description: 'Integração com blockchain, DeFi e carteiras digitais para transações seguras.'
    },
    {
      year: '2024',
      title: 'Liderança Nacional',
      description: 'AgroConecta se torna a principal plataforma de agronegócio do Brasil.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent"
          >
            Sobre o AgroConecta
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-4xl mx-auto"
          >
            Somos a plataforma líder em inteligência agrícola, conectando produtores, 
            compradores e investidores através de tecnologia de ponta e inovação sustentável.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  Nossa Missão
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Democratizar o acesso ao agronegócio, fornecendo ferramentas tecnológicas 
                  avançadas que permitam a todos os participantes do setor prosperar e crescer 
                  de forma sustentável e transparente.
                </p>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                  Nossa Visão
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Ser a plataforma global de referência em agronegócio, integrando 
                  tecnologias emergentes como blockchain, IA e IoT para criar um 
                  ecossistema agrícola inteligente e conectado.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Nossos Valores
                </h2>
                <div className="space-y-6">
                  {values.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-6 bg-neutral-900/30 backdrop-blur-xl border border-neutral-700 rounded-xl hover:border-blue-500/50 transition-all duration-300 group"
                    >
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-300">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
          >
            Números que Impressionam
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
          >
            Nossa Jornada
          </motion.h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-gradient-to-b from-blue-500 to-green-500"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-black z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 p-6 bg-neutral-900/50 backdrop-blur-xl border border-neutral-700 rounded-2xl ${
                    index % 2 === 0 ? 'mr-auto' : 'ml-auto'
                  }`}>
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
          >
            Nossa Equipe
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-neutral-800/50 backdrop-blur-xl border border-neutral-700 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-blue-400 font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-gray-300 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
          >
            Tecnologias de Ponta
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto"
          >
            Utilizamos as mais avançadas tecnologias para criar uma plataforma 
            robusta, segura e escalável.
          </motion.p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Blockchain', icon: '⛓️', color: 'from-blue-500 to-cyan-500' },
              { name: 'Inteligência Artificial', icon: '🤖', color: 'from-purple-500 to-pink-500' },
              { name: 'Cloud Computing', icon: '☁️', color: 'from-green-500 to-blue-500' },
              { name: 'IoT', icon: '📡', color: 'from-yellow-500 to-orange-500' }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-neutral-900/50 backdrop-blur-xl border border-neutral-700 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {tech.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/50 to-green-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6 text-white"
          >
            Junte-se ao Futuro do Agronegócio
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Faça parte da revolução que está transformando o agronegócio brasileiro 
            através da tecnologia e inovação.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105">
              Começar Agora
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
              Saber Mais
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
