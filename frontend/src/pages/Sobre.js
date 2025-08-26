import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Users, Target, Award, Clock, Globe, 
  TrendingUp, Shield, Lightbulb, CheckCircle,
  ArrowRight, Star, MapPin, Phone, Mail
} from 'lucide-react';
// Componente removido - já renderizado pelo Layout global

const Sobre = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Sobre - ${t('about.title')}`;
  }, [t]);

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      color: 'from-slate-600 to-slate-700'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('about.values.global.title'),
      description: t('about.values.global.description'),
      color: 'from-slate-700 to-slate-800'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      color: 'from-slate-800 to-slate-900'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: t('about.timeline.2020.title'),
      description: t('about.timeline.2020.description'),
      icon: <Target className="w-6 h-6" />
    },
    {
      year: '2021',
      title: t('about.timeline.2021.title'),
      description: t('about.timeline.2021.description'),
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      year: '2022',
      title: t('about.timeline.2022.title'),
      description: t('about.timeline.2022.description'),
      icon: <Globe className="w-6 h-6" />
    },
    {
      year: '2023',
      title: t('about.timeline.2023.title'),
      description: t('about.timeline.2023.description'),
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      year: '2024',
      title: t('about.timeline.2024.title'),
      description: t('about.timeline.2024.description'),
      icon: <Award className="w-6 h-6" />
    }
  ];

  const team = [
    {
      name: 'Luis Paulo Oliveira',
      role: t('about.team.ceo.role'),
      description: t('about.team.ceo.description'),
      avatar: 'LPO'
    },
    {
      name: 'Equipe de Desenvolvimento',
      role: t('about.team.developers.role'),
      description: t('about.team.developers.description'),
      avatar: 'DEV'
    },
    {
      name: 'Consultores Agrícolas',
      role: t('about.team.consultants.role'),
      description: t('about.team.consultants.description'),
      avatar: 'CON'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}
          >
            Sobre o Agroisync
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl max-w-4xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}
          >
            Conectando o agronegócio brasileiro através de tecnologia inovadora e soluções sustentáveis
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
          >
            Somos uma plataforma completa que revoluciona a forma como produtores, transportadores e compradores se conectam no mercado agrícola
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="w-20 h-20 mx-auto lg:mx-0 mb-6 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
                <Target className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-6">{t('about.mission.title')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {t('about.mission.description')}
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('about.mission.point1')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('about.mission.point2')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('about.mission.point3')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{t('about.mission.point4')}</span>
                </li>
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="w-20 h-20 mx-auto lg:mx-0 mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-6">{t('about.mission.vision')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about.mission.vision')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Nossos Valores
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Princípios que guiam nossa missão de transformar o agronegócio
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
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Nossa Jornada
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Marcos importantes na história do Agroisync
            </p>
          </motion.div>

          <div className="space-y-12">
            {timeline.map((item, index) => (
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Nossa Equipe
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Profissionais dedicados e experientes que fazem a diferença
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
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

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">10K+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t('about.mission.users')}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t('about.mission.products')}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">25+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Estados</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">99.9%</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Disponibilidade</p>
            </motion.div>
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
            Faça parte da nossa história
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-200 mb-8"
          >
            Junte-se a milhares de usuários que já transformaram seus negócios com o Agroisync
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors duration-300">
              Começar Agora
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-slate-700 transition-colors duration-300">
              Falar Conosco
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
