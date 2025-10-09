import Head from "next/head";
import { useI18n } from "../lib/i18n";
import HreflangTags from "../components/HreflangTags";

export async function getStaticProps() {
  return {
    props: { date: new Date().toISOString() },
    revalidate: 3600,
  };
}

export default function Home({ date }) {
  const { t } = useI18n();
  const title = "Agroisync — Futuro do Agronegócio";
  const description =
    "Conectamos produtores, compradores e logística em uma única plataforma.";
  const url = "https://agroisync.com/";
  const image = "https://agroisync.com/agroisync-logo.svg";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Agroisync",
    url,
    publisher: {
      "@type": "Organization",
      name: "Agroisync",
      logo: {
        "@type": "ImageObject",
        url: "https://agroisync.com/agroisync-logo.svg",
      },
    },
  };
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agroisync",
    url: "https://agroisync.com",
    logo: "https://agroisync.com/agroisync-logo.svg",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
    ],
  };

  return (
    <>
      <HreflangTags path="/" />
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      </Head>
      <main>
        <div className="container">
          <h1 className="hero-title">{t("home.title", "Agroisync")}</h1>
          <p>
            {t(
              "home.tagline",
              "Plataforma de agronegócio: marketplace, fretes e mais.",
            )}
          </p>
          <p>Renderizado no servidor em: {date}</p>
        </div>
      </main>
    </>
  );
}
