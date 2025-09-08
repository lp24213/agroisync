import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const SEOHead = ({ title, description, keywords, image, url, type = 'website', noindex = false }) => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'pt'

  // URLs base para diferentes idiomas
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://agroisync.com'
  const currentUrl = url || `${baseUrl}${window.location.pathname}`

  // Imagem padrão
  const defaultImage = `${baseUrl}/images/agroisync-og-image.jpg`
  const ogImage = image || defaultImage

  // Títulos e descrições padrão por idioma
  const defaultTitles = {
    pt: 'AgroSync - O Hub Completo do Agronegócio Brasileiro',
    en: 'AgroSync - The Complete Brazilian Agribusiness Hub',
    es: 'AgroSync - El Hub Completo del Agronegocio Brasileño',
    zh: 'AgroSync - 巴西农业综合企业完整中心'
  }

  const defaultDescriptions = {
    pt: 'Marketplace de produtos agrícolas, sistema de fretes AgroConecta, análise de criptomoedas e notícias do agronegócio. Tudo em uma plataforma completa.',
    en: 'Agricultural products marketplace, AgroConecta freight system, cryptocurrency analysis and agribusiness news. Everything in one complete platform.',
    es: 'Marketplace de productos agrícolas, sistema de fletes AgroConecta, análisis de criptomonedas y noticias del agronegocio. Todo en una plataforma completa.',
    zh: '农产品市场、AgroConecta货运系统、加密货币分析和农业综合企业新闻。一切都在一个完整的平台上。'
  }

  const defaultKeywords = {
    pt: 'agronegócio, marketplace, produtos agrícolas, fretes, criptomoedas, soja, milho, café, pecuária, agricultura, Brasil',
    en: 'agribusiness, marketplace, agricultural products, freight, cryptocurrency, soy, corn, coffee, livestock, agriculture, Brazil',
    es: 'agronegocio, marketplace, productos agrícolas, fletes, criptomonedas, soja, maíz, café, ganadería, agricultura, Brasil',
    zh: '农业综合企业, 市场, 农产品, 货运, 加密货币, 大豆, 玉米, 咖啡, 畜牧业, 农业, 巴西'
  }

  const pageTitle = title || defaultTitles[currentLang]
  const pageDescription = description || defaultDescriptions[currentLang]
  const pageKeywords = keywords || defaultKeywords[currentLang]

  // Gerar URLs alternativas para outros idiomas
  const alternateUrls = {
    pt: `${baseUrl}${window.location.pathname}?lang=pt`,
    en: `${baseUrl}${window.location.pathname}?lang=en`,
    es: `${baseUrl}${window.location.pathname}?lang=es`,
    zh: `${baseUrl}${window.location.pathname}?lang=zh`
  }

  return (
    <Helmet>
      {/* Título e descrição básicos */}
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />
      <meta name='keywords' content={pageKeywords} />
      <meta name='author' content='AgroSync' />
      <meta name='robots' content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name='language' content={currentLang} />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content={type} />
      <meta property='og:url' content={currentUrl} />
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageDescription} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:site_name' content='AgroSync' />
      <meta
        property='og:locale'
        content={
          currentLang === 'pt' ? 'pt_BR' : currentLang === 'en' ? 'en_US' : currentLang === 'es' ? 'es_ES' : 'zh_CN'
        }
      />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={currentUrl} />
      <meta name='twitter:title' content={pageTitle} />
      <meta name='twitter:description' content={pageDescription} />
      <meta name='twitter:image' content={ogImage} />
      <meta name='twitter:site' content='@agroisync' />
      <meta name='twitter:creator' content='@agroisync' />

      {/* URLs alternativas para outros idiomas */}
      <link rel='alternate' hrefLang='pt' href={alternateUrls.pt} />
      <link rel='alternate' hrefLang='en' href={alternateUrls.en} />
      <link rel='alternate' hrefLang='es' href={alternateUrls.es} />
      <link rel='alternate' hrefLang='zh' href={alternateUrls.zh} />
      <link rel='alternate' hrefLang='x-default' href={alternateUrls.pt} />

      {/* Canonical URL */}
      <link rel='canonical' href={currentUrl} />

      {/* Favicon */}
      <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
      <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
      <link rel='manifest' href='/site.webmanifest' />

      {/* Schema.org structured data */}
      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AgroSync',
          url: baseUrl,
          logo: `${baseUrl}/images/agroisync-logo.png`,
          description: pageDescription,
          sameAs: [
            'https://www.facebook.com/agroisync',
            'https://www.instagram.com/agroisync',
            'https://www.linkedin.com/company/agroisync',
            'https://twitter.com/agroisync'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+55-66-99236-2830',
            contactType: 'customer service',
            availableLanguage: ['Portuguese', 'English', 'Spanish', 'Chinese']
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR',
            addressRegion: 'MT'
          }
        })}
      </script>

      {/* Viewport e outros meta tags importantes */}
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta name='theme-color' content='#00ffbf' />
      <meta name='msapplication-TileColor' content='#00ffbf' />

      {/* Preconnect para performance */}
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      <link rel='preconnect' href='https://api.stripe.com' />
    </Helmet>
  )
}

export default SEOHead
