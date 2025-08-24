import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Video, FileText, MessageCircle, 
  Phone, Mail, Clock, Users, Shield, Zap
} from 'lucide-react';
import { 
  BookOpen, Video, FileText, MessageCircle, 
  Phone, Mail, Clock, Users, Shield, Zap,
  Truck, Coins, ShoppingCart, Settings,
  HelpCircle, Star, Award, Bookmark
} from 'lucide-react';

const Ajuda = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tutoriais');

  const helpSections = [
    {
      id: 'primeiros-passos',
      title: t('help.sections.firstSteps.title'),
      icon: <BookOpen className="w-6 h-6" />,
      description: t('help.sections.firstSteps.description'),
      items: [
        {
          title: t('help.sections.firstSteps.items.account.title'),
          description: t('help.sections.firstSteps.items.account.description'),
          duration: '5 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.firstSteps.items.marketplace.title'),
          description: t('help.sections.firstSteps.items.marketplace.description'),
          duration: '8 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.firstSteps.items.freight.title'),
          description: t('help.sections.firstSteps.items.freight.description'),
          duration: '6 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.firstSteps.items.crypto.title'),
          description: t('help.sections.firstSteps.items.crypto.description'),
          duration: '10 min',
          type: 'video',
          link: '#'
        }
      ]
    },
    {
      id: 'nft-staking',
      title: t('help.sections.nftStaking.title'),
      icon: <Coins className="w-6 h-6" />,
      description: t('help.sections.nftStaking.description'),
      items: [
        {
          title: t('help.sections.nftStaking.items.minting.title'),
          description: t('help.sections.nftStaking.items.minting.description'),
          duration: '7 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.nftStaking.items.staking.title'),
          description: t('help.sections.nftStaking.items.staking.description'),
          duration: '9 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.nftStaking.items.rewards.title'),
          description: t('help.sections.nftStaking.items.rewards.description'),
          duration: '5 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.nftStaking.items.security.title'),
          description: t('help.sections.nftStaking.items.security.description'),
          duration: '8 min',
          type: 'video',
          link: '#'
        }
      ]
    },
    {
      id: 'pagamentos-seguranca',
      title: t('help.sections.paymentsSecurity.title'),
      icon: <Shield className="w-6 h-6" />,
      description: t('help.sections.paymentsSecurity.description'),
      items: [
        {
          title: t('help.sections.paymentsSecurity.items.pix.title'),
          description: t('help.sections.paymentsSecurity.items.pix.description'),
          duration: '3 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.paymentsSecurity.items.crypto.title'),
          description: t('help.sections.paymentsSecurity.items.crypto.description'),
          duration: '6 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.paymentsSecurity.items.security.title'),
          description: t('help.sections.paymentsSecurity.items.security.description'),
          duration: '4 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.paymentsSecurity.items.verification.title'),
          description: t('help.sections.paymentsSecurity.items.verification.description'),
          duration: '5 min',
          type: 'video',
          link: '#'
        }
      ]
    },
    {
      id: 'chatbot-ia',
      title: t('help.sections.chatbotAI.title'),
      icon: <MessageCircle className="w-6 h-6" />,
      description: t('help.sections.chatbotAI.description'),
      items: [
        {
          title: t('help.sections.chatbotAI.items.basic.title'),
          description: t('help.sections.chatbotAI.items.basic.description'),
          duration: '4 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.chatbotAI.items.advanced.title'),
          description: t('help.sections.chatbotAI.items.advanced.description'),
          duration: '7 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.chatbotAI.items.integration.title'),
          description: t('help.sections.chatbotAI.items.integration.description'),
          duration: '6 min',
          type: 'video',
          link: '#'
        },
        {
          title: t('help.sections.chatbotAI.items.troubleshooting.title'),
          description: t('help.sections.chatbotAI.items.troubleshooting.description'),
          duration: '5 min',
          type: 'video',
          link: '#'
        }
      ]
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'help':
        return <BookOpen className="w-5 h-5 text-orange-500" />;
      case 'community':
        return <Users className="w-5 h-5 text-cyan-500" />;
      case 'status':
        return <Shield className="w-5 h-5 text-red-500" />;
      default:
        return <Zap className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'document':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'chat':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'help':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'community':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'status':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <GlobalTicker />
      <Navbar />
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {t('help.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('help.subtitle')}
          </p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {helpSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                  activeTab === section.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : isDark
                    ? 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {section.icon}
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {helpSections.map((section) => (
            activeTab === section.id && (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-12">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                          <p className={`text-sm mb-3 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                              {item.type}
                            </span>
                            <span className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {item.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            {t('help.contactTitle')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Phone className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">{t('help.contact.phone.title')}</h3>
              <p className="text-sm">{t('help.contact.phone.number')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('help.contact.phone.schedule')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Mail className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">{t('help.contact.email.title')}</h3>
              <p className="text-sm">{t('help.contact.email.address')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('help.contact.email.response')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Clock className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">{t('help.contact.chat.title')}</h3>
              <p className="text-sm">{t('help.contact.chat.description')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('help.contact.chat.availability')}</p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Ajuda;
