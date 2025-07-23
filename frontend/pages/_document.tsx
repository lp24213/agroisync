import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/icons/logo-192.png" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="description" content="O DApp Web3 mais moderno do agronegócio. NFTs, staking, DeFi, integração blockchain e design de outro mundo." />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AGROTM" />
        <link rel="apple-touch-icon" href="/assets/icons/logo-192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 