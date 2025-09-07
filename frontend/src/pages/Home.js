import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  TrendingUp,
  Smartphone,
  Truck,
  BarChart3
} from 'lucide-react';

const Home = () => {
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
      link: '/marketplace'
    },
    {
      icon: Truck,
      title: 'AgroConecta',
      description: 'Intermediação inteligente de fretes agrícolas',
      link: '/agroconecta'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Dados em tempo real sobre preços, tendências e oportunidades',
      link: '/analytics'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Usuários Ativos' },
    { number: 'R$ 50M+', label: 'Volume Transacionado' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Premium' }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-futuristic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                O Futuro do{' '}
                <span className="text-white">Agronegócio</span>{' '}
                é <span className="text-yellow-300">Agora</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/90 mb-8 leading-relaxed"
              >
                A plataforma mais avançada e futurista do mundo para conectar produtores, 
                compradores e transportadores. Tecnologia de ponta, segurança máxima e 
                performance extrema.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/cadastro"
                  className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  Começar Agora
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/sobre"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
                >
                  Saiba Mais
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-8 text-center">
                <div className="w-32 h-32 bg-primary-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Performance em Tempo Real
                </h3>
                <p className="text-white/80">
                  Dados atualizados a cada segundo para decisões mais inteligentes
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tecnologia que <span className="text-yellow-300">Impressiona</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Recursos avançados que colocam o AgroSync anos à frente da concorrência
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
                className="glass-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
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
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Soluções completas para todas as necessidades do agronegócio moderno
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="product-card group"
              >
                <div className="w-16 h-16 bg-primary-gradient rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {service.title}
                </h3>
                <p className="text-secondary mb-6">
                  {service.description}
                </p>
                <Link
                  to={service.link}
                  className="btn-futuristic w-full text-center"
                >
                  Conhecer
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient">
        <div className="container-futuristic text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para o <span className="text-yellow-300">Futuro</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais do agronegócio que já descobriram 
              o poder da tecnologia AgroSync
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cadastro"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                Começar Gratuitamente
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contato"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
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