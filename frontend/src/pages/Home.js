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
import Ticker from '../components/Ticker';
import { 
  PremiumScrollReveal, 
  PremiumFloatingCard, 
  Premium3DButton, 
  PremiumStaggeredContainer,
  PremiumGradientText,
  PremiumRevealText,
  MouseTracker
} from '../components/animations/PremiumAnimations';

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
    <div className="min-h-screen">
      {/* Bolsa de Valores Ticker */}
      <Ticker />
      
      {/* Hero Section com Imagem Agrícola */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Imagem de Fundo Agrícola */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/agricultural-field.jpg"
            alt="Campo de soja ao pôr do sol"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Conteúdo Centralizado sobre a Imagem */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <PremiumScrollReveal delay={0.2} parallax={true}>
            <PremiumRevealText 
              text="Junte-se à AGROISYNC e faça parte da revolução do agronegócio brasileiro"
              className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white drop-shadow-2xl"
              delay={0.5}
            />
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <MouseTracker intensity={0.1}>
                <Premium3DButton variant="primary" size="lg" className="px-10 py-5 text-xl font-semibold bg-white text-gray-900 hover:bg-gray-100">
                  Explorar Marketplace
                  <ArrowRight size={24} className="ml-3" />
                </Premium3DButton>
              </MouseTracker>
              <MouseTracker intensity={0.1}>
                <Premium3DButton variant="secondary" size="lg" className="px-10 py-5 text-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900">
                  Saiba Mais
                </Premium3DButton>
              </MouseTracker>
            </div>
          </PremiumScrollReveal>
        </div>
      </section>

      {/* Hero Section - Premium Futuristic */}
      <section className="py-32 relative min-h-screen flex items-center">
        <div className="container-premium">
          <PremiumScrollReveal delay={0.2} parallax={true}>
            <div className="text-center max-w-6xl mx-auto">
              <PremiumRevealText 
                text="O Futuro do Agronegócio é Agora"
                className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
                delay={0.5}
              />
              
              <PremiumGradientText 
                className="text-2xl md:text-3xl mb-12 max-w-5xl mx-auto leading-relaxed"
                gradient="metallic"
              >
                A plataforma mais futurista e sofisticada do mundo para conectar produtores, 
                compradores e transportadores. Design premium, tecnologia de ponta e 
                performance excepcional.
              </PremiumGradientText>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <MouseTracker intensity={0.1}>
                  <Premium3DButton variant="primary" size="lg" className="px-10 py-5 text-xl font-semibold">
                    Começar Agora
                    <ArrowRight size={24} className="ml-3" />
                  </Premium3DButton>
                </MouseTracker>
                <MouseTracker intensity={0.1}>
                  <Premium3DButton variant="secondary" size="lg" className="px-10 py-5 text-xl font-semibold">
                    Ver Demonstração
                  </Premium3DButton>
                </MouseTracker>
              </div>
            </div>
          </PremiumScrollReveal>
        </div>
      </section>

      {/* Stats Section - Premium Cards */}
      <section className="py-32 relative">
        <div className="container-premium">
          <PremiumScrollReveal delay={0.2}>
            <div className="text-center mb-20">
              <PremiumGradientText 
                className="text-5xl md:text-6xl font-bold mb-8"
                gradient="cosmic"
              >
                Nossos Números
              </PremiumGradientText>
              <p className="text-xl max-w-4xl mx-auto text-pearl">
                Resultados que comprovam nossa excelência e impacto no agronegócio
              </p>
            </div>
          </PremiumScrollReveal>
          
          <PremiumStaggeredContainer staggerDelay={0.2} className="grid-premium grid-4">
            {stats.map((stat, index) => (
              <MouseTracker key={stat.label} intensity={0.05}>
                <PremiumFloatingCard delay={index * 0.1} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold mb-4">
                    <PremiumGradientText gradient="metallic">
                      {stat.number}
                    </PremiumGradientText>
                  </div>
                  <div className="font-semibold text-lg text-pearl">
                    {stat.label}
                  </div>
                </PremiumFloatingCard>
              </MouseTracker>
            ))}
          </PremiumStaggeredContainer>
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
