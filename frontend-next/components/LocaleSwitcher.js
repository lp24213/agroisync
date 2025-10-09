import { useRouter } from 'next/router';
import { useI18n } from '../lib/i18n';

export default function LocaleSwitcher() {
  const router = useRouter();
  const { locale } = useI18n();
  
  const locales = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const changeLocale = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="locale-switcher" role="navigation" aria-label="Seletor de idioma">
      <select
        value={locale}
        onChange={(e) => changeLocale(e.target.value)}
        aria-label="Selecione o idioma"
        className="locale-select"
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.name}
          </option>
        ))}
      </select>
      <style jsx>{`
        .locale-switcher {
          display: inline-block;
        }
        .locale-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
        }
        .locale-select:hover {
          border-color: #4caf50;
        }
        .locale-select:focus {
          outline: 2px solid #4caf50;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

