'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Shield, Leaf, Zap, Target, Eye, Heart, Award, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useTranslation('common');

  const values = [
    {
      icon: Shield,
      title: 'Transparência',
      description: 'Todas as operações são transparentes e auditáveis, garantindo confiança total em nossas transações.',
      color: 'text-[#00FF7F]'
    },
    {
      icon: Zap,
      title: 'Inovação',
      description: 'Sempre na vanguarda da tecnologia, desenvolvendo soluções inovadoras para o agronegócio.',
      color: 'text-[#00FF7F]'
    },
    {
      icon: Globe,
      title: 'Sustentabilidade',
      description: 'Comprometidos com práticas agrícolas sustentáveis e responsabilidade ambiental.',
      color: 'text-[#00FF7F]'
    },
    {
      icon: Heart,
      title: 'Confiança',
      description: 'Construindo relacionamentos duradouros baseados em confiança e resultados.',
      color: 'text-[#00FF7F]'
    }
  ];

  const team = [
    {
      name: 'Dr. Carlos Silva',
      role: 'CEO & Fundador',
      description: 'Especialista em agronegócio com mais de 15 anos de experiência em tecnologia e inovação.',
      image: '/assets/images/team/ceo.jpg'
    },
    {
      name: 'Maria Santos',
      role: 'CTO',
      description: 'Líder em desenvolvimento de tecnologias avançadas para o setor agrícola.',
      image: '/assets/images/team/cto.jpg'
    },
    {
      name: 'João Oliveira',
      role: 'Diretor de Operações',
      description: 'Especialista em operações e logística com foco em eficiência e qualidade.',
      image: '/assets/images/team/operations.jpg'
    },
    {
      name: 'Ana Costa',
      role: 'Diretora de Marketing',
      description: 'Estratégica de marketing digital com expertise em crescimento de startups.',
      image: '/assets/images/team/marketing.jpg'
    }
  ];

  const impact = [
    {
      icon: TrendingUp,
      title: 'Crescimento Exponencial',
      value: '300%',
      description: 'Crescimento anual em volume de transações'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      value: '50K+',
      description: 'Usuários ativos na plataforma'
    },
    {
      icon: Globe,
      title: 'Alcance Global',
      value: '25+',
      description: 'Países atendidos'
    },
    {
      icon: Award,
      title: 'Reconhecimento',
      value: '15+',
      description: 'Prêmios e certificações'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-[#ffffff] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-animation"></div>
        </div>
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanlines opacity-10"></div>

        {/* Hero Section */}
        <section className="pt-32 pb-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold gradient-text mb-6">
                Sobre a <span className="text-[#00FF7F]">AGROTM</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-orbitron">
                Revolucionando o agronegócio através da tecnologia avançada e inovação sustentável
              </p>
            </motion.div>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-8">
                  Nossa <span className="text-[#00FF7F]">Missão</span>
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  A AGROTM é uma empresa de tecnologia especializada em soluções digitais para o agronegócio. 
                  Nossa missão é modernizar e democratizar o acesso ao mercado agrícola através de tecnologia 
                  avançada e inovação sustentável.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Conectamos produtores, compradores e investidores em uma plataforma segura e transparente, 
                  criando um ecossistema financeiro inovador que impulsiona o crescimento do setor agrícola.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Transparência total nas operações</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Inovação tecnológica constante</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Sustentabilidade ambiental</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Crescimento inclusivo</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <Image 
                    src="/assets/images/about/mission.jpg" 
                    alt="Nossa Missão" 
                    width={500} 
                    height={400}
                    className="rounded-3xl shadow-neon-green"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-[500px] h-[400px] bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon-green">
                    <div className="text-center">
                      <Target className="text-[#00FF7F] mx-auto mb-4" size={64} />
                      <div className="text-[#00FF7F] font-orbitron text-2xl">Nossa Missão</div>
                      <div className="text-gray-300 text-lg">Inovação e Sustentabilidade</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Nossa Visão */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:order-2"
              >
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-8">
                  Nossa <span className="text-[#00FF7F]">Visão</span>
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Ser a plataforma líder global em soluções digitais para o agronegócio, conectando milhões 
                  de produtores e investidores em um ecossistema inovador e sustentável.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Vislumbramos um futuro onde a tecnologia democratiza o acesso ao mercado agrícola, 
                  criando oportunidades iguais para todos os participantes da cadeia produtiva.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Liderança global no setor</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Tecnologia de ponta</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Impacto social positivo</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-gray-300 font-orbitron">Sustentabilidade ambiental</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:order-1 flex justify-center"
              >
                <div className="relative">
                  <Image 
                    src="/assets/images/about/vision.jpg" 
                    alt="Nossa Visão" 
                    width={500} 
                    height={400}
                    className="rounded-3xl shadow-neon-green"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-[500px] h-[400px] bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon-green">
                    <div className="text-center">
                      <Eye className="text-[#00FF7F] mx-auto mb-4" size={64} />
                      <div className="text-[#00FF7F] font-orbitron text-2xl">Nossa Visão</div>
                      <div className="text-gray-300 text-lg">Futuro Sustentável</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Nossos <span className="text-[#00FF7F]">Valores</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-orbitron">
                Construindo o futuro do agronegócio com princípios sólidos e inovação responsável
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="cyberpunk-card text-center p-8 backdrop-blur-sm">
                    <value.icon className={`w-16 h-16 mx-auto mb-6 ${value.color}`} />
                    <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipe AGROTM */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Equipe <span className="text-[#00FF7F]">AGROTM</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-orbitron">
                Conheça os profissionais que estão revolucionando o agronegócio
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="cyberpunk-card text-center p-6 backdrop-blur-sm">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={128} 
                        height={128}
                        className="rounded-full object-cover"
                        unoptimized={true}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-32 h-32 bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-full flex items-center justify-center shadow-neon-green">
                        <Users className="text-[#00FF7F]" size={48} />
                      </div>
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-[#00FF7F] mb-2">{member.name}</h3>
                    <p className="text-gray-400 font-orbitron mb-3">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impacto Tecnológico */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Impacto <span className="text-[#00FF7F]">Tecnológico</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-orbitron">
                Transformando o agronegócio através da inovação e tecnologia
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impact.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="cyberpunk-card text-center p-8 backdrop-blur-sm">
                    <item.icon className="w-16 h-16 mx-auto mb-6 text-[#00FF7F]" />
                    <div className="text-4xl font-orbitron font-bold text-[#00FF7F] mb-2">{item.value}</div>
                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 