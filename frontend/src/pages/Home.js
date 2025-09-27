import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import CryptoHash from '../components/CryptoHash';
// import Noticias from '../components/Noticias'; // Componente removido
// import Ticker from '../components/Ticker'; // Componente removido
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
  const { t } = useTranslation();
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
      title: 'Produtos Digitais',
      description: 'Plataforma completa para compra e venda de produtos agrícolas',
      link: '/marketplace',
      status: 'Projeto em andamento futuro'
    },
    {
      icon: Truck,
      title: 'Fretes',
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
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-600">{t('home.ticker.title', 'Ticker de Cotações em Desenvolvimento')}</h3>
        <p className="text-gray-500 mt-2">{t('home.ticker.description', 'Em breve teremos ticker de cotações disponível!')}</p>
      </div>
      
      {/* Imagem Ultrarealista 4K - Campo de Soja */}
      <section 
        className="w-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q0FNUE8lMjBERSUyMFNPSkF8ZW58MHx8MHx8fDA%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          width: '100%',
          height: '100vh',
          minHeight: '800px',
          zIndex: 1,
          display: 'flex',
          position: 'relative',
          backgroundColor: 'transparent'
        }}
      >
        {/* Overlay sutil para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Imagem de fallback para mobile */}
        <img 
          src="https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q0FNUE8lMjBERSUyMFNPSkF8ZW58MHx8MHx8fDA%3D"
          alt="Campo de Soja"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          style={{ zIndex: -1 }}
        />
        
        {/* Conteúdo Centralizado */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-800">
{t('home.partner.title', 'Seja Nosso')} <span className="text-green-600">{t('home.partner.highlight', 'Parceiro')}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
              {t('home.partner.description', 'Junte-se à revolução do agronegócio brasileiro e faça parte da maior plataforma de conectividade rural do país.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 text-xl font-semibold rounded-xl shadow-lg transition-colors"
              >
                Explorar Plataforma
                <ArrowRight size={24} className="ml-3 inline" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-10 py-5 text-xl font-semibold rounded-xl transition-colors"
              >
                Saiba Mais
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    
      
      {/* Hero Section com Imagem Agrícola */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Imagem de Fundo Agrícola */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/agricultural-field.jpg"
            alt="Campo de soja ao pôr do sol"
            className="w-full h-full object-cover"
            loading="lazy"
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
                  Explorar Plataforma
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

      {/* Campo de Soja 4K - Performance em Tempo Real */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "url('/images/inicio.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          minHeight: '80vh'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
{t('home.performance.title', 'Performance em')} <span className="text-yellow-300">{t('home.performance.highlight', 'Tempo Real')}</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
              {t('home.performance.description', 'Dados atualizados a cada segundo para decisões mais inteligentes')}
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
                className="bg-white/90 backdrop-blur-sm rounded-2xl text-center p-8 hover:scale-105 transition-transform shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-800 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
{t('home.services.title', 'Nossos')} <span className="text-gradient">{t('home.services.highlight', 'Serviços')}</span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              {t('home.services.description', 'Soluções completas para todas as necessidades do agronegócio moderno')}
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
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-600">{t('home.news.title', 'Notícias em Desenvolvimento')}</h3>
        <p className="text-gray-500 mt-2">{t('home.news.description', 'Em breve teremos notícias do agronegócio disponíveis!')}</p>
      </div>

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
{t('home.cta.title', 'Pronto para o')} <span className="text-gradient">{t('home.cta.highlight', 'Futuro')}</span>?
            </h2>
            <p className={`text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('home.cta.description', 'Junte-se a milhares de profissionais do agronegócio que já descobriram o poder da tecnologia Agroisync. Transforme seu negócio hoje mesmo.')}
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
            <div className="mt-8 flex justify-center">
              <CryptoHash pageName="home" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
