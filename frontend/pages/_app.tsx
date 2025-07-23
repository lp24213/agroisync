import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from '../components/ThemeProvider';
import '../styles/globals.css';
import '../i18n/i18n';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <DefaultSeo
        title="AGROTM - Web3 Agro Revolution"
        description="O DApp Web3 mais moderno do agronegócio. NFTs, staking, DeFi, integração blockchain e design de outro mundo."
        openGraph={{
          type: 'website',
          locale: 'pt_BR',
          url: 'https://agrotm.com',
          site_name: 'AGROTM',
          images: [
            {
              url: '/assets/img/logo.png',
              width: 512,
              height: 512,
              alt: 'AGROTM Logo',
            },
          ],
        }}
        twitter={{
          handle: '@agrotm',
          site: '@agrotm',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[{ name: 'theme-color', content: '#0a0a0a' }]}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
} 