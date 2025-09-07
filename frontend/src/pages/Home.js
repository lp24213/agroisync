import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Star, 
  Users, 
  Package, 
  Truck,
  Zap,
  BarChart3,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    freights: 0,
    uptime: 0
  });

  const { t } = useLanguage();

  useEffect(() => {
    const targetStats = {
      users: 12500,
      products: 8500,
      freights: 3200,
      uptime: 99.9
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        users: Math.floor(targetStats.users * progress),
        products: Math.floor(targetStats.products * progress),
        freights: Math.floor(targetStats.freights * progress),
        uptime: Number((targetStats.uptime * progress).toFixed(1))
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const testimonials = [
      {
        name: "João Silva",
        role: "Produtor Rural",
        content: "O AgroSync revolucionou minha forma de vender produtos. Aumentei 300% nas vendas!",
        rating: 5
      },
      {
        name: "Maria Santos",
        role: "Compradora",
        content: "Encontro sempre os melhores preços e produtos de qualidade. Interface incrível!",
        rating: 5
      },
      {
        name: "Carlos Oliveira",
        role: "Transportador",
        content: "O AgroConecta me conectou com clientes de todo o Brasil. Sistema perfeito!",
        rating: 5
      }
    ];

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Package,
      title: t('home.features.products.title'),
      description: t('home.features.products.description'),
      color: "neon-blue",
      link: "/marketplace"
    },
    {
      icon: Truck,
      title: t('home.features.freights.title'),
      description: t('home.features.freights.description'),
      color: "neon-green",
      link: "/agroconecta"
    },
    {
      icon: CreditCard,
      title: t('home.features.crypto.title'),
      description: t('home.features.crypto.description'),
      color: "neon-purple",
      link: "/crypto"
    },
    {
      icon: MessageCircle,
      title: t('home.features.messaging.title'),
      description: t('home.features.messaging.description'),
      color: "neon-gold",
      link: "/messaging"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Produtor Rural",
      content: "O AgroSync revolucionou minha forma de vender produtos. Aumentei 300% nas vendas!",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Compradora",
      content: "Encontro sempre os melhores preços e produtos de qualidade. Interface incrível!",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Transportador",
      content: "O AgroConecta me conectou com clientes de todo o Brasil. Sistema perfeito!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary">
          <div className="absolute inset-0 cyber-grid opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-blue rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green rounded-full flex items-center justify-center"
                >
                  <Zap className="w-12 h-12 text-white" />
                </motion.div>
                <div className="absolute inset-0 border-2 border-transparent border-t-neon-blue rounded-full animate-spin"></div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="text-gradient">{t('home.title')}</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              {t('home.subtitle')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              {t('home.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-xl hover:from-neon-purple hover:to-neon-blue transition-all duration-300 transform hover:scale-105 hover:shadow-neon flex items-center space-x-2"
              >
                <span>{t('home.getStarted')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>{t('home.watchDemo')}</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {[
                { label: "Usuários Ativos", value: stats.users, icon: Users, color: "neon-blue" },
                { label: "Produtos", value: stats.products, icon: Package, color: "neon-green" },
                { label: "Fretes", value: stats.freights, icon: Truck, color: "neon-purple" },
                { label: "Uptime", value: `${stats.uptime}%`, icon: BarChart3, color: "neon-gold" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-${stat.color} to-${stat.color}/50 rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link to={feature.link}>
                  <div className="card-futuristic h-full text-center space-y-4 hover:shadow-neon transition-all duration-300">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r from-${feature.color} to-${feature.color}/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    <div className="flex items-center justify-center text-neon-blue group-hover:text-neon-purple transition-colors">
                      <span className="text-sm font-medium">Saiba mais</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </motion.div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card-futuristic text-center space-y-6">
              <div className="flex justify-center space-x-1">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-neon-gold fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-300 italic leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div>
                <div className="text-white font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-neon-blue text-sm">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-xl hover:from-neon-purple hover:to-neon-blue transition-all duration-300 transform hover:scale-105 hover:shadow-neon"
              >
                {t('home.cta.startFree')}
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 glass-effect text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                {t('home.cta.talkExpert')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
