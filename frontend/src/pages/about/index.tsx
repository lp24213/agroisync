import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  RocketLaunchIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  StarIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/Chatbot'

const About: NextPage = () => {
  const { t } = useI18n()

  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-purple-400" />,
      title: 'Segurança Blockchain',
      description: 'Tecnologia blockchain de última geração para transações seguras e transparentes'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-cyan-400" />,
      title: 'Análise Inteligente',
      description: 'IA avançada para análise de dados agrícolas e previsões de mercado'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-green-400" />,
      title: 'Sustentabilidade',
      description: 'Compromisso com práticas agrícolas sustentáveis e responsabilidade ambiental'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-blue-400" />,
      title: 'Comunidade Global',
      description: 'Rede internacional de produtores, investidores e consumidores'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Lançamento da Plataforma',
      description: 'AgroSync é oficialmente lançado com funcionalidades completas de marketplace e staking'
    },
    {
      year: '2023',
      title: 'Desenvolvimento Beta',
      description: 'Fase de desenvolvimento e testes com produtores selecionados'
    },
    {
      year: '2022',
      title: 'Conceituação',
      description: 'Idealização do projeto e formação da equipe fundadora'
    }
  ]

  const team = [
    {
      name: 'Dr. Carlos Silva',
      role: 'CEO & Fundador',
      description: 'Especialista em agronegócio com 15+ anos de experiência em tecnologia blockchain',
      avatar: '👨‍💼'
    },
    {
      name: 'Dra. Ana Costa',
      role: 'CTO',
      description: 'Engenheira de software com expertise em IA e sistemas distribuídos',
      avatar: '👩‍💻'
    },
    {
      name: 'Prof. Roberto Santos',
      role: 'Diretor de Pesquisa',
      description: 'Pesquisador em agricultura sustentável e tecnologias verdes',
      avatar: '👨‍🔬'
    },
    {
      name: 'Mariana Lima',
      role: 'Diretora de Operações',
      description: 'Especialista em operações agrícolas e gestão de cadeias de suprimento',
      avatar: '👩‍🌾'
    }
  ]

  const values = [
    {
      icon: <HeartIcon className="h-6 w-6 text-red-400" />,
      title: 'Paixão pela Inovação',
      description: 'Buscamos constantemente novas soluções para os desafios do agronegócio'
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6 text-blue-400" />,
      title: 'Transparência Total',
      description: 'Todas as transações são transparentes e auditáveis na blockchain'
    },
    {
      icon: <GlobeAltIcon className="h-6 w-6 text-green-400" />,
      title: 'Sustentabilidade',
      description: 'Compromisso com o futuro do planeta e das próximas gerações'
    },
    {
      icon: <UserGroupIcon className="h-6 w-6 text-purple-400" />,
      title: 'Comunidade',
      description: 'Construímos juntos uma rede global de produtores e investidores'
    }
  ]

  return (
    <>
      <Head>
        <title>{t('about_main_title')} - {t('app_name')}</title>
        <meta name="description" content={t('about_subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header da Página */}
        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t('about_main_title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {t('about_subtitle')}
              </p>
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2 text-purple-400">
                  <SparklesIcon className="h-6 w-6" />
                  <span className="text-lg font-medium">Revolucionando o Agronegócio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Missão e Visão */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <RocketLaunchIcon className="h-8 w-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Nossa Missão</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                Transformar o agronegócio global através da tecnologia blockchain e inteligência artificial, 
                conectando produtores, investidores e consumidores em uma plataforma segura, transparente e sustentável.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Acreditamos que a tecnologia pode democratizar o acesso ao agronegócio, criando oportunidades 
                para pequenos produtores e investidores de todo o mundo, enquanto promovemos práticas agrícolas 
                responsáveis e sustentáveis.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <LightBulbIcon className="h-8 w-8 text-cyan-400" />
                <h2 className="text-3xl font-bold text-white">Nossa Visão</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                Ser a plataforma líder mundial em agronegócio digital, estabelecendo novos padrões de 
                transparência, eficiência e sustentabilidade no setor.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Visualizamos um futuro onde cada produtor tem acesso direto aos mercados globais, 
                cada investidor pode participar do crescimento do agronegócio, e cada consumidor 
                conhece a origem e qualidade dos produtos que consome.
              </p>
            </div>
          </div>

          {/* Características Principais */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Por que escolher o AgroSync?</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Nossa plataforma combina as melhores tecnologias disponíveis para criar uma experiência 
                única no agronegócio digital
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group"
                >
                  <div className="mb-4 p-3 bg-gray-700/30 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Linha do Tempo */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Nossa Jornada</h2>
              <p className="text-lg text-gray-400">
                Desde a concepção até o lançamento, cada passo foi cuidadosamente planejado
              </p>
            </div>

            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                        <div className="text-2xl font-bold text-purple-400 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-400">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Ponto na linha */}
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-gray-900"></div>
                    </div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipe */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Nossa Equipe</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Especialistas apaixonados por tecnologia e agronegócio, trabalhando juntos para 
                transformar o futuro da agricultura
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group text-center"
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Valores */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Nossos Valores</h2>
              <p className="text-lg text-gray-400">
                Princípios que guiam cada decisão e ação em nossa empresa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-700/30 rounded-lg">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tecnologias */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Tecnologias Utilizadas</h2>
              <p className="text-lg text-gray-400">
                Stack tecnológico de ponta para garantir segurança, escalabilidade e performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-semibold text-white mb-3">Blockchain</h3>
                <p className="text-gray-400">
                  Solana, Ethereum e redes personalizadas para transações seguras e rápidas
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-white mb-3">Inteligência Artificial</h3>
                <p className="text-gray-400">
                  Machine Learning para análise de dados agrícolas e previsões de mercado
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-6 border border-purple-500/20 text-center">
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-xl font-semibold text-white mb-3">Cloud Computing</h3>
                <p className="text-gray-400">
                  Infraestrutura escalável e confiável para suportar milhões de usuários
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl p-12 border border-purple-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">Pronto para fazer parte do futuro?</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de produtores e investidores que já estão transformando 
                o agronegócio com o AgroSync
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105">
                  Começar Agora
                </button>
                <button className="bg-gray-700/50 text-gray-300 py-3 px-8 rounded-xl font-semibold hover:bg-gray-600/50 transition-all duration-300 hover:scale-105 border border-gray-600">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Chatbot */}
      <Chatbot />
    </>
  )
}

export default About
