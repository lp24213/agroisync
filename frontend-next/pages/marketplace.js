import Head from "next/head";
import { useI18n } from "../lib/i18n";
import HreflangTags from "../components/HreflangTags";

export async function getServerSideProps() {
  const now = new Date().toISOString();
  return { props: { now } };
}

export default function Marketplace({ now }) {
  const { t } = useI18n();
  const title = "Marketplace — Agroisync";
  const description =
    "Compre e venda produtos agrícolas com segurança e transparência.";
  const url = "https://agroisync.com/marketplace";
  const image = "https://agroisync.com/agroisync-logo.svg";
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
        item: "https://agroisync.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Marketplace",
        item: url,
      },
    ],
  };

  return (
    <>
      <HreflangTags path="/marketplace" />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      </Head>
      <main>
        <div className="container">
          <h1 className="hero-title">
            {t("marketplace.title", "Marketplace")}
          </h1>
          <p>Renderizado no servidor: {now}</p>
        </div>
      </main>
    </>
  );
}
