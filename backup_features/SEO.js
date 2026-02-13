
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, image, url, type }) => {
  // Proteção extra: nunca passar undefined/null para Helmet
  const { t, i18n } = useTranslation();
  const currentLang = i18n?.language || 'pt-BR';
  const defaultTitle = t('seo.defaultTitle', 'AgroiSync - Plataforma de Agronegócio');
  const defaultDescription = t('seo.defaultDescription', 'AgroiSync: A plataforma de agronegócio mais futurista do mundo. Conectando produtores, compradores e transportadores com tecnologia blockchain.');
  const safeTitle = typeof title === 'string' && title.trim() ? title : '';
  const safeDescription = typeof description === 'string' && description.trim() ? description : '';
  const safeImage = typeof image === 'string' && image.trim() ? image : 'https://agroisync.com/logo.png';
  // Garante que safeUrl seja sempre absoluto e sem duplicar domínio
  let safeUrl;
  if (typeof url === 'string' && url.trim()) {
    safeUrl = url.startsWith('http') ? url : `https://agroisync.com${url}`;
  } else if (typeof window !== 'undefined' && window.location?.href) {
    safeUrl = window.location.href;
  } else {
    safeUrl = 'https://agroisync.com/';
  }
  const safeType = typeof type === 'string' && type.trim() ? type : 'website';
  const finalTitle = safeTitle ? `${safeTitle} | AgroiSync` : defaultTitle;
  const finalDescription = safeDescription || defaultDescription;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={safeType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={safeImage} />
      <meta property="og:url" content={safeUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={safeImage} />

      {/* Hreflang Tags - hrefLang deve ser 'hreflang' */}
      <link rel="alternate" hrefLang="pt-BR" href={safeUrl.replace('https://en.agroisync.com', 'https://agroisync.com').replace('https://es.agroisync.com', 'https://agroisync.com')} />
      <link rel="alternate" hrefLang="en" href={safeUrl.replace('https://agroisync.com', 'https://en.agroisync.com').replace('https://es.agroisync.com', 'https://en.agroisync.com')} />
      <link rel="alternate" hrefLang="es" href={safeUrl.replace('https://agroisync.com', 'https://es.agroisync.com').replace('https://en.agroisync.com', 'https://es.agroisync.com')} />

      {/* Outros meta tags importantes */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#00A859" />
      <link rel="canonical" href={safeUrl} />
    </Helmet>
  );
};

export default SEO;