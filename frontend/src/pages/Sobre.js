import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Users, Target, TrendingUp, Shield, Globe, Award, 
  CheckCircle, ArrowRight, Star, Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalTicker from '../components/GlobalTicker';
import WeatherWidget from '../components/WeatherWidget';
import Chatbot from '../components/Chatbot';

const Sobre = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('about.values.global.title'),
      description: t('about.values.global.description'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: t('about.milestones.2020.title'),
      description: t('about.milestones.2020.description')
    },
    {
      year: '2021',
      title: t('about.milestones.2021.title'),
      description: t('about.milestones.2021.description')
    },
    {
      year: '2022',
      title: t('about.milestones.2022.title'),
      description: t('about.milestones.2022.description')
    },
    {
      year: '2023',
      title: t('about.milestones.2023.title'),
      description: t('about.milestones.2023.description')
    },
    {
      year: '2024',
      title: t('about.milestones.2024.title'),
      description: t('about.milestones.2024.description')
    }
  ];

  const team = [
    {
      name: 'Luis Paulo Oliveira',
      role: t('about.team.ceo.role'),
      description: t('about.team.ceo.description'),
      avatar: '👨‍💼'
    },
    {
      name: 'Equipe AgroISync',
      role: t('about.team.developers.role'),
      description: t('about.team.developers.description'),
      avatar: '👨‍💻'
    },
    {
      name: 'Consultores Agrícolas',
      role: t('about.team.consultants.role'),
      description: t('about.team.consultants.description'),
      avatar: '👨‍🌾'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Global Ticker */}
      <GlobalTicker />
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-blue-100 opacity-30"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>

          {/* Weather Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <WeatherWidget />
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {t('about.mission.description')}
              </p>
              <div className="space-y-4">
                {[
                  t('about.mission.point1'),
                  t('about.mission.point2'),
                  t('about.mission.point3'),
                  t('about.mission.point4')
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className={`p-8 rounded-2xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">A</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">AgroISync</h3>
                  <p className="text-gray-600 mb-6">
                    {t('about.mission.vision')}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">50K+</div>
                      <div className="text-sm text-gray-600">{t('about.mission.users')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">100K+</div>
                      <div className="text-sm text-gray-600">{t('about.mission.products')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.timeline.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.timeline.subtitle')}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-blue-600"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full border-4 border-white shadow-lg"></div>

                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`p-6 rounded-2xl shadow-lg ${
                      isDark ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl shadow-lg ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contato"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
              >
                {t('about.cta.primary')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/planos"
                className="px-8 py-4 bg-transparent border-2 border-green-600 text-green-600 font-bold rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105"
              >
                {t('about.cta.secondary')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Sobre;
