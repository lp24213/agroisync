import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function getConsent() {
  try {
    const match = document.cookie.match(/consent=([^;]+)/);
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function setConsent(value) {
  try {
    const json = encodeURIComponent(JSON.stringify(value));
    const maxAge = 60 * 60 * 24 * 180; // 180 days
    // SameSite=Lax; add Secure only when https to avoid localhost issues
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "; Secure"
        : "";
    document.cookie = `consent=${json}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  } catch {
    // no-op
  }
}

export default function ConsentBanner({ onChange }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    } else if (onChange) {
      onChange(existing);
    }
  }, [onChange]);

  function accept() {
    const value = { analytics: true, marketing };
    setConsent(value);
    setVisible(false);
    onChange?.(value);
  }

  function reject() {
    const value = { analytics: false, marketing: false };
    setConsent(value);
    setVisible(false);
    onChange?.(value);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Preferências de privacidade"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-6"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          {t('consent.title', 'Privacidade e Cookies')}
        </h2>
        <p className="text-gray-700 mb-4">
          {t(
            'consent.body',
            'Usamos cookies para medir audiência (analytics) e, opcionalmente, marketing. Você pode aceitar apenas analytics ou rejeitar tudo. Suas preferências serão salvas por 180 dias.'
          )}
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">{t('consent.analytics', 'Analytics')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">{t('consent.marketing', 'Marketing')}</span>
          </label>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={reject} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('consent.reject', 'Rejeitar')}
          </button>
          <button 
            onClick={accept} 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {t('consent.accept', 'Aceitar')}
          </button>
        </div>
      </div>
    </div>
  );
}
