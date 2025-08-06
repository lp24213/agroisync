'use client';

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function Contact() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('contactTitle')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('contactSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="text-green-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('email')}</h3>
                            <p className="text-gray-400 mb-6">contato@agrotm.com.br</p>
            <p className="text-gray-400">Suporte 24/7</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Chat</h3>
            <p className="text-gray-400 mb-6">Chat ao vivo</p>
            <p className="text-gray-400">Resposta instantânea</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Phone className="text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{t('phone')}</h3>
                            <p className="text-gray-400 mb-6">+55 (66) 99236-2830</p>
            <p className="text-gray-400">Seg-Sex 9h-18h</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}