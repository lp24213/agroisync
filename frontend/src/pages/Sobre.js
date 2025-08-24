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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('about.values.global.title'),
      description: t('about.values.global.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      color: 'from-orange-500 to-red-500'
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Global Ticker */}
      {/* Navbar */}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
          }`}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            {t('about.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            {t('about.subtitle')}
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.values.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('about.values.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.timeline.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('about.timeline.subtitle')}</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-gradient-to-b from-green-500 to-blue-600"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline Item */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`p-6 rounded-xl shadow-lg ${
                      isDark ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.team.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('about.team.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.cta.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('about.cta.subtitle')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contato"
                className="group bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>{t('about.cta.primary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <a
                href="/planos"
                className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{t('about.cta.secondary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      

      {/* Chatbot */}
      {/* WeatherWidget */}
    </div>
  );
};

export default Sobre;
