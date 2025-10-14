import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title, 
  description, 
  image = 'https://agroisync.com/logo.png',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website' 
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const defaultTitle = t('seo.defaultTitle', 'AgroiSync - Plataforma de Agronegócio');
  const defaultDescription = t('seo.defaultDescription', 'AgroiSync: A plataforma de agronegócio mais futurista do mundo. Conectando produtores, compradores e transportadores com tecnologia blockchain.');
  
  const finalTitle = title ? `${title} | AgroiSync` : defaultTitle;
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Hreflang Tags */}
      <link rel="alternate" hrefLang="pt-BR" href={`https://agroisync.com${url}`} />
      <link rel="alternate" hrefLang="en" href={`https://en.agroisync.com${url}`} />
      <link rel="alternate" hrefLang="es" href={`https://es.agroisync.com${url}`} />
      
      {/* Outros meta tags importantes */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#00A859" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;