'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, Locale } from '../../lib/i18n';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const { changeLanguage } = useLanguage();

  const languages: Record<Locale, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇺🇸' },
    pt: { name: 'Português', flag: '🇧🇷' },
    zh: { name: '中文', flag: '🇨🇳' },
  };

  const currentLanguage = i18n.language as Locale;

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as Locale;
    changeLanguage(newLanguage);
  };

  return (
    <div className='relative'>
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        className='appearance-none bg-transparent border border-cyber-purple rounded-lg px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:border-transparent'
      >
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <option key={code} value={code} className='bg-gray-900 text-white'>
            {flag} {name}
          </option>
        ))}
      </select>
      <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
        <svg
          className='w-4 h-4 text-cyber-purple'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
