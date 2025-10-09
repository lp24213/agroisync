import Head from 'next/head';

/**
 * Component to add hreflang tags for multilingual SEO
 * @param {string} path - The current page path (e.g., '/', '/marketplace', '/sobre')
 */
export default function HreflangTags({ path = '/' }) {
  const baseUrl = 'https://agroisync.com';
  const locales = ['pt', 'en', 'es', 'zh'];
  
  return (
    <Head>
      {/* Hreflang for each locale */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}${locale === 'pt' ? '' : `/${locale}`}${path}`}
        />
      ))}
      {/* x-default for international users */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${path}`}
      />
    </Head>
  );
}

