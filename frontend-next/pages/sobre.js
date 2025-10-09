import Head from "next/head";
import { useI18n } from "../lib/i18n";
import HreflangTags from "../components/HreflangTags";

export async function getStaticProps() {
  return { props: {}, revalidate: 86400 };
}

export default function Sobre() {
  const { t } = useI18n();
  const title = "Sobre — Agroisync";
  const description = "Saiba mais sobre a Agroisync e nossa missão.";
  const url = "https://agroisync.com/sobre";
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
        name: "Sobre",
        item: url,
      },
    ],
  };

  return (
    <>
      <HreflangTags path="/sobre" />
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
            {t("sobre.title", "Sobre a Agroisync")}
          </h1>
          <p>
            {t(
              "sobre.description",
              "Nossa missão é conectar o ecossistema do agronegócio com tecnologia.",
            )}
          </p>
        </div>
      </main>
    </>
  );
}
