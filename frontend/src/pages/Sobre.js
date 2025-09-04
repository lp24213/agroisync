import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Users, Target, Award, Globe, 
  TrendingUp, Shield, Lightbulb,
  Star, Package, Truck, DollarSign, Zap
} from 'lucide-react';
import StockMarketTicker from '../components/StockMarketTicker';
// Componente removido - já renderizado pelo Layout global

const Sobre = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Agroisync - ${t('about.title')}`;
  }, [t]);

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: 'from-amber-500 to-emerald-500'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      color: 'from-emerald-500 to-blue-500'
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: t('about.values.global.title'),
      description: t('about.values.global.description'),
      color: 'from-blue-500 to-emerald-500'
    },
    {
      icon: <Users className="w-8 h-8 text-amber-600" />,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      color: 'from-amber-600 to-yellow-500'
    }
  ];

  // const timeline = [
  //   {
  //     year: '2020',
  //     title: t('about.timeline.2020.title'),
  //     description: t('about.timeline.2020.description'),
  //     icon: <Target className="w-6 h-6" />
  //   },
  //   {
  //     year: '2021',
  //     title: t('about.timeline.2021.title'),
  //     description: t('about.timeline.2021.description'),
  //     icon: <TrendingUp className="w-6 h-6" />
  //   },
  //   {
  //     year: '2022',
  //     title: t('about.timeline.2022.title'),
  //     description: t('about.timeline.2022.description'),
  //     icon: <Globe className="w-6 h-6" />
  //   },
  //   {
  //     year: '2023',
  //     title: t('about.timeline.2023.title'),
  //     description: t('about.timeline.2023.description'),
  //     icon: <Lightbulb className="w-6 h-6" />
  //   },
  //   {
  //     year: '2024',
  //     title: t('about.timeline.2024.title'),
  //     description: t('about.timeline.2024.description'),
  //     icon: <Award className="w-6 h-6" />
  //   }
  // ];

  // const team = [
  //   {
  //     name: 'Luis Paulo Oliveira',
  //     role: t('about.team.ceo.role'),
  //     description: t('about.team.ceo.description'),
  //     avatar: 'L'
  //   },
  //   {
  //     name: 'Equipe de Desenvolvimento',
  //     role: t('about.team.developers.role'),
  //     description: t('about.team.developers.description'),
  //     avatar: 'D'
  //   },
  //   {
  //     name: 'Consultores Agrícolas',
  //     role: t('about.team.consultants.role'),
  //     description: t('about.team.consultants.description'),
  //     avatar: 'C'
  //   }
  // ];

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-16">
      {/* Cotação da Bolsa */}
      <StockMarketTicker />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-gray-900"
          >
            {t('about.title')}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-600"
          >
            {t('about.subtitle')}
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg max-w-3xl mx-auto text-gray-500"
          >
            {t('about.mission.description')}
          </motion.p>
        </div>
      </section>

      {/* Nossa Missão Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              {t('about.mission.title')}
            </h2>
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                {t('about.mission.description')}
              </p>
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t('about.mission.point1')}
                </h3>
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                {t('about.mission.vision')}
              </p>
              </div>
              <div className="text-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-lg"
                >
                  <Globe className="w-12 h-12" />
                </motion.div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  {t('about.mission.platform')}
                </p>
              </div>
            </div>
            </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {t('about.values.title')}
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {t('about.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {value.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {t('about.timeline.title')}
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {t('about.timeline.subtitle')}
            </p>
          </motion.div>
            
            <div className="space-y-12">
            {[
              {
                year: '2020',
                title: t('about.timeline.2020.title'),
                description: t('about.timeline.2020.description'),
                icon: <Target className="w-8 h-8" />
              },
              {
                year: '2021',
                title: t('about.timeline.2021.title'),
                description: t('about.timeline.2021.description'),
                icon: <Award className="w-8 h-8" />
              },
              {
                year: '2022',
                title: t('about.timeline.2022.title'),
                description: t('about.timeline.2022.description'),
                icon: <TrendingUp className="w-8 h-8" />
              },
              {
                year: '2023',
                title: t('about.timeline.2023.title'),
                description: t('about.timeline.2023.description'),
                icon: <Zap className="w-8 h-8" />
              },
              {
                year: '2024',
                title: t('about.timeline.2024.title'),
                description: t('about.timeline.2024.description'),
                icon: <Star className="w-8 h-8" />
              }
            ].map((item, index) => (
                <motion.div
                  key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-4 border-slate-200 ${isDark ? 'text-gray-800' : 'text-slate-600'}`}>
                          {item.icon}
                        </div>
                </div>
                
                <div className="flex-1 px-8">
                  <div className={`text-center ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-3 ${isDark ? 'bg-gray-700 text-white' : 'bg-slate-600 text-white'}`}>
                      {item.year}
                      </div>
                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {item.title}
                    </h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      {item.description}
                    </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t('about.team.title')}
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                avatar: 'L',
                role: t('about.team.ceo.role'),
                description: t('about.team.ceo.description'),
                name: t('about.team.ceo.name')
              },
              {
                avatar: 'D',
                role: t('about.team.developers.role'),
                description: t('about.team.developers.description'),
                name: t('about.team.developers.name')
              },
              {
                avatar: 'C',
                role: t('about.team.consultants.role'),
                description: t('about.team.consultants.description'),
                name: t('about.team.consultants.name')
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {member.name}
                </h3>
                <p className={`text-slate-600 mb-3 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  {member.role}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-500'}`}>
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {t('about.stats.title')}
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {t('about.stats.subtitle')}
            </p>
            </motion.div>
            
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: t('about.stats.users'), icon: <Users className="w-8 h-8" /> },
              { value: '5K+', label: t('about.stats.products'), icon: <Package className="w-8 h-8" /> },
              { value: '2K+', label: t('about.stats.freights'), icon: <Truck className="w-8 h-8" /> },
              { value: 'R$ 50M+', label: t('about.stats.transactions'), icon: <DollarSign className="w-8 h-8" /> }
            ].map((stat, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              className="text-center"
            >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-lg"
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">
                  {stat.label}
                </div>
            </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-600 to-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            {t('about.cta.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-200 mb-8"
          >
            {t('about.cta.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-premium px-8 py-4 text-lg"
            >
              {t('about.cta.primary')}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-premium-secondary px-8 py-4 text-lg"
            >
              {t('about.cta.secondary')}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
