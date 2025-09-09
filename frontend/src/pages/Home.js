import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Smartphone,
  Truck,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Noticias from '../components/Noticias';

const Home = () => {
  const { isDarkMode } = useTheme();
  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de dados com criptografia de nível bancário e autenticação 2FA'
    },
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: 'Tecnologia de ponta para transações instantâneas e processamento em tempo real'
    },
    {
      icon: Globe,
      title: 'Global & Local',
      description: 'Conectividade mundial com foco no agronegócio brasileiro e internacional'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Rede de produtores, compradores e transportadores em constante crescimento'
    }
  ];

  const services = [
    {
      icon: Smartphone,
      title: 'Marketplace Digital',
      description: 'Plataforma completa para compra e venda de produtos agrícolas',
      link: '/marketplace',
      status: 'Projeto em andamento futuro'
    },
    {
      icon: Truck,
      title: 'AgroConecta',
      description: 'Intermediação inteligente de fretes agrícolas',
      link: '/agroconecta',
      status: 'Disponível'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Dados em tempo real sobre preços, tendências e oportunidades',
      link: '/analytics',
      status: 'Disponível'
    },
    {
      icon: Globe,
      title: 'Notícias',
      description: 'Fique por dentro das últimas notícias do agronegócio',
      link: '/news',
      status: 'Disponível'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: 'R$ 50M+', label: 'Volume Transacionado' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Premium' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
      {/* Hero Section - Centralizado e Premium */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50'}`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              O Futuro do{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Agronegócio</span>{' '}
              é <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Agora</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              A plataforma mais futurista e sofisticada do mundo para conectar produtores, 
              compradores e transportadores. Design premium, tecnologia de ponta e 
              performance excepcional.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/register"
                className="bg-black text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 transition-all duration-200 flex items-center gap-3"
              >
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-200"
              >
                Saiba Mais
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Cards Organizados em Grid */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Nossos <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Números</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Resultados que comprovam nossa excelência e impacto no agronegócio
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}
              >
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-4">
                  {stat.number}
                </div>
                <div className={`font-semibold text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance em Tempo Real */}
      <section className="py-20 bg-gradient-accent">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Performance em <span className="text-gradient">Tempo Real</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Dados atualizados a cada segundo para decisões mais inteligentes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium text-center p-8 hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Cards Uniformes com Gradientes */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Nossos <span className="text-gradient">Serviços</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Soluções completas para todas as necessidades do agronegócio moderno
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium group p-8 text-center hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform mx-auto">
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {service.title}
                </h3>
                <p className="text-muted mb-6 leading-relaxed">
                  {service.description}
                </p>
                {service.status === 'Projeto em andamento futuro' ? (
                  <div className="bg-gradient-warning text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    {service.status}
                  </div>
                ) : (
                  <Link
                    to={service.link}
                    className="btn-premium w-full text-center flex items-center justify-center gap-2"
                  >
                    Conhecer
                    <ArrowRight size={16} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section - Discreta e elegante */}
      <Noticias />

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-hero">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Pronto para o <span className="text-gradient">Futuro</span>?
            </h2>
            <p className={`text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Junte-se a milhares de profissionais do agronegócio que já descobriram 
              o poder da tecnologia Agroisync. Transforme seu negócio hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="btn-premium px-8 py-4 text-lg font-semibold flex items-center gap-3"
              >
                Começar Gratuitamente
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="btn-premium-secondary px-8 py-4 text-lg font-semibold"
              >
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
