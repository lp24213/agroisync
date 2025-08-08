'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('agrotm-language', langCode);
  };

  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
    >
      <Globe className="w-4 h-4 text-premium-neon-blue" />
      <select 
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-premium-black/50 border border-premium-neon-blue/30 rounded-lg px-3 py-2 text-premium-neon-blue font-orbitron text-sm 
                   hover:border-premium-neon-green/50 focus:border-premium-neon-green focus:outline-none 
                   transition-all duration-300 cursor-pointer backdrop-blur-sm"
      >
        {languages.map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            className="bg-premium-black text-premium-neon-blue font-orbitron"
          >
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export { LanguageSelector };
export default LanguageSelector; 