import "../styles/globals.css";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import ConsentBanner from "../components/ConsentBanner";
import { useI18n } from "../lib/i18n";
import LocaleSwitcher from "../components/LocaleSwitcher";

function Layout({ children }) {
  const { t } = useI18n();
  return (
    <>
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <header role="banner">
        <div className="container header-bar">
          <div className="header-row">
            <nav role="navigation" aria-label="Principal">
              <ul className="nav-list">
                <li>
                  <Link href="/">{t("nav.home", "Início")}</Link>
                </li>
                <li>
                  <Link href="/marketplace">
                    {t("nav.marketplace", "Marketplace")}
                  </Link>
                </li>
                <li>
                  <Link href="/fretes">{t("nav.fretes", "Fretes")}</Link>
                </li>
                <li>
                  <Link href="/sobre">{t("nav.sobre", "Sobre")}</Link>
                </li>
                <li>
                  <Link href="/contato">{t("nav.contato", "Contato")}</Link>
                </li>
              </ul>
            </nav>
            <LocaleSwitcher />
          </div>
        </div>
      </header>
      <main id="main" role="main">
        {children}
      </main>
      <footer role="contentinfo">
        <div className="container footer-bar">
          <small>© {new Date().getFullYear()} Agroisync</small>
        </div>
      </footer>
    </>
  );
}

export default function App({ Component, pageProps }) {
  const [consent, setConsent] = useState(null);
  const [nonce, setNonce] = useState(null);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    try {
      const meta = document.querySelector('meta[name="csp-nonce"]');
      if (meta?.content) setNonce(meta.content);
    } catch {
      // no-op
    }
  }, []);

  return (
    <Layout>
      {/* Consent banner controls analytics/marketing flags */}
      <ConsentBanner onChange={setConsent} />

      {/* Load GA only after user consent for analytics */}
      {consent?.analytics && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
            nonce={nonce || undefined}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            nonce={nonce || undefined}
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date()); 
              gtag('config', '${gaId}', { anonymize_ip: true, allow_google_signals: false });
            `}
          </Script>
        </>
      )}

      <Component {...pageProps} />
    </Layout>
  );
}
