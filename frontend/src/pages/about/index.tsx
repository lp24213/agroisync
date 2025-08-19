import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';

const About: NextPage = () => {
  const features = [
    {
      icon: <RocketLaunchIcon className="h-8 w-8" />,
      title: 'Revolução Digital',
      description: 'Primeira criptomoeda do agronegócio para revolucionar os investimentos e facilitar pagamentos internacionais.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: 'Pagamentos Globais',
      description: 'Facilita pagamentos de produtos voltados ao agronegócio no mundo todo, eliminando burocracias.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: 'Internacionalização',
      description: 'Plataforma que permite a internacionalização sem burocracia, conectando produtores globais.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Segurança Blockchain',
      description: 'Tecnologia blockchain avançada para garantir transparência e segurança em todas as operações.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const team = [
    {
      name: 'Equipe AGROISYNC',
      role: 'Especialistas em Agronegócio & Blockchain',
      description: 'Nossa equipe combina décadas de experiência em agricultura com expertise em tecnologia blockchain.',
      image: '/images/team-agroisync.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>Sobre - AGROISYNC</title>
        <meta name="description" content="Conheça a AGROISYNC, a primeira criptomoeda do agronegócio para revolucionar investimentos e facilitar pagamentos internacionais." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/10 to-cyan-900/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-900 py-32">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fade-in">
                <h1 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Sobre AGROISYNC
                </h1>
                
                <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
                  A <span className="text-cyan-400 font-bold">primeira criptomoeda do agronegócio</span> para 
                  <span className="text-blue-400 font-bold"> revolucionar os investimentos</span> e 
                  <span className="text-purple-400 font-bold"> facilitar os pagamentos</span> de produtos voltados ao 
                  agronegócio no mundo, permitindo a <span className="text-emerald-400 font-bold">internacionalização sem burocracia</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-600">
                  <Link href="/contact" className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                    <span className="relative z-10 flex items-center space-x-3">
                      <EnvelopeIcon className="h-6 w-6 group-hover:animate-bounce" />
                      <span>Entre em Contato</span>
                    </span>
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                  
                  <Link href="/marketplace" className="group border-2 border-cyan-400 text-cyan-400 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden">
                    <span className="relative z-10 flex items-center space-x-3">
                      <RocketLaunchIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Explorar Plataforma</span>
                    </span>
                    <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-24 bg-black relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-blue-900/5 to-purple-900/5"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-gray-100 mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Nossa Missão
                </h2>
                <p className="text-xl text-gray-400 max-w-4xl mx-auto">
                  Transformar o agronegócio através da tecnologia blockchain, criando uma ponte digital 
                  entre produtores rurais e investidores globais
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group">
                    <Card className="h-full hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500/50 overflow-hidden">
                      <div className="text-center p-8">
                        <div className={`mb-6 inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location & Contact Section */}
          <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-5xl font-black text-gray-100 mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Nossa Localização
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                          <MapPinIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-2">Sinop, Mato Grosso</h3>
                        <p className="text-gray-400 text-lg leading-relaxed">
                          Localizada no coração do agronegócio brasileiro, Sinop é um dos principais 
                          polos agrícolas do país, estratégica para nossa missão de revolucionar 
                          o setor através da tecnologia blockchain.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                          <PhoneIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-2">Telefone</h3>
                        <p className="text-gray-400 text-lg">
                          <a href="tel:+5566992362830" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                            +55 (66) 99236-2830
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                          <EnvelopeIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-100 mb-2">Email</h3>
                        <p className="text-gray-400 text-lg">
                          <a href="mailto:contato@agroisync.com" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                            contato@agroisync.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Card className="enhanced-shadow bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8">
                    <div className="text-center">
                      <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl">
                        <BuildingOfficeIcon className="h-16 w-16 text-cyan-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-100 mb-4">AGROISYNC</h3>
                      <p className="text-gray-400 text-lg mb-6">
                        A primeira criptomoeda do agronegócio para revolucionar os investimentos e 
                        facilitar os pagamentos de produtos voltados ao agronegócio no mundo, 
                        permitindo a internacionalização sem burocracia.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">+2000</div>
                          <div className="text-gray-400">Fazendeiros Ativos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">+150%</div>
                          <div className="text-gray-400">Aumento Produtividade</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-5xl font-black text-gray-100 mb-8">
                Pronto para Revolucionar sua Agricultura?
              </h2>
              <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Junte-se à revolução agrícola digital e transforme seus ativos rurais em 
                oportunidades de investimento com tecnologia blockchain de ponta
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/marketplace" className="group relative bg-white text-black px-12 py-6 rounded-2xl text-2xl font-bold hover:shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105 transform overflow-hidden">
                  <span className="relative z-10 flex items-center space-x-4">
                    <RocketLaunchIcon className="h-8 w-8 group-hover:animate-bounce" />
                    <span>Criar Conta</span>
                  </span>
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-gray-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
                <Link href="/contact" className="group border-2 border-white text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden">
                  <span className="relative z-10">Saiba Mais</span>
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default About;
