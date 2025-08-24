import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, Search, HelpCircle, MessageCircle, 
  FileText, Phone, Mail, Globe, Clock,
  Shield, Coins, Truck, ShoppingCart
} from 'lucide-react';

const FAQ = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'general',
      title: t('faq.categories.general.title'),
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          question: t('faq.categories.general.items.whatIs.question'),
          answer: t('faq.categories.general.items.whatIs.answer')
        },
        {
          question: t('faq.categories.general.items.payment.question'),
          answer: t('faq.categories.general.items.payment.answer')
        },
        {
          question: t('faq.categories.general.items.security.question'),
          answer: t('faq.categories.general.items.security.answer')
        },
        {
          question: t('faq.categories.general.items.nftRights.question'),
          answer: t('faq.categories.general.items.nftRights.answer')
        },
        {
          question: t('faq.categories.general.items.support.question'),
          answer: t('faq.categories.general.items.support.answer')
        }
      ]
    },
    {
      id: 'marketplace',
      title: t('faq.categories.marketplace.title'),
      icon: <ShoppingCart className="w-5 h-5" />,
      items: [
        {
          question: t('faq.categories.marketplace.items.products.question'),
          answer: t('faq.categories.marketplace.items.products.answer')
        },
        {
          question: t('faq.categories.marketplace.items.categories.question'),
          answer: t('faq.categories.marketplace.items.categories.answer')
        },
        {
          question: t('faq.categories.marketplace.items.payments.question'),
          answer: t('faq.categories.marketplace.items.payments.answer')
        }
      ]
    },
    {
      id: 'freight',
      title: t('faq.categories.freight.title'),
      icon: <Truck className="w-5 h-5" />,
      items: [
        {
          question: t('faq.categories.freight.items.register.question'),
          answer: t('faq.categories.freight.items.register.answer')
        },
        {
          question: t('faq.categories.freight.items.cargoTypes.question'),
          answer: t('faq.categories.freight.items.cargoTypes.answer')
        },
        {
          question: t('faq.categories.freight.items.search.question'),
          answer: t('faq.categories.freight.items.search.answer')
        }
      ]
    },
    {
      id: 'crypto',
      title: t('faq.categories.crypto.title'),
      icon: <Coins className="w-5 h-5" />,
      items: [
        {
          question: t('faq.categories.crypto.items.accepted.question'),
          answer: t('faq.categories.crypto.items.accepted.answer')
        },
        {
          question: t('faq.categories.crypto.items.wallets.question'),
          answer: t('faq.categories.crypto.items.wallets.answer')
        },
        {
          question: t('faq.categories.crypto.items.security.question'),
          answer: t('faq.categories.crypto.items.security.answer')
        }
      ]
    },
    {
      id: 'technical',
      title: t('faq.categories.technical.title'),
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          question: t('faq.categories.technical.items.mobile.question'),
          answer: t('faq.categories.technical.items.mobile.answer')
        },
        {
          question: t('faq.categories.technical.items.notifications.question'),
          answer: t('faq.categories.technical.items.notifications.answer')
        },
        {
          question: t('faq.categories.technical.items.availability.question'),
          answer: t('faq.categories.technical.items.availability.answer')
        }
      ]
    }
  ];

  const toggleItem = (categoryId, itemIndex) => {
    const key = `${categoryId}-${itemIndex}`;
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      
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
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <div className={`flex items-center space-x-3 mb-6 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                {category.icon}
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const key = `${category.id}-${itemIndex}`;
                  const isOpen = openItems.has(key);

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                      className={`border rounded-xl overflow-hidden ${
                        isDark 
                          ? 'border-gray-700 bg-gray-800' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(category.id, itemIndex)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors duration-200 ${
                          isDark 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{item.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`px-6 pb-4 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
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
            {t('faq.contactTitle')}
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
              <h3 className="font-bold mb-2">{t('faq.contact.phone.title')}</h3>
              <p className="text-sm">{t('faq.contact.phone.number')}</p>
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
              <h3 className="font-bold mb-2">{t('faq.contact.email.title')}</h3>
              <p className="text-sm">{t('faq.contact.email.address')}</p>
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
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-bold mb-2">{t('faq.contact.chat.title')}</h3>
              <p className="text-sm">{t('faq.contact.chat.description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FAQ;
