import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title, 
  description, 
  url, 
  image = "https://agroisync.com/agroisync-logo.svg",
  type = "website",
  breadcrumbs = []
}) {
  const fullTitle = title ? `${title} — Agroisync` : "Agroisync — Futuro do Agronegócio";
  const fullDescription = description || "Conectamos produtores, compradores e logística em uma única plataforma.";
  const fullUrl = url || "https://agroisync.com/";

  // Schema.org Organization
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agroisync",
    url: "https://agroisync.com",
    logo: "https://agroisync.com/agroisync-logo.svg",
  };

  // Schema.org WebSite
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Agroisync",
    url: fullUrl,
    publisher: {
      "@type": "Organization",
      name: "Agroisync",
      logo: {
        "@type": "ImageObject",
        url: "https://agroisync.com/agroisync-logo.svg",
      },
    },
  };

  // Schema.org Breadcrumbs
  const breadcrumbLd = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Agroisync" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="author" content="Agroisync" />
      <meta name="keywords" content="agronegócio, agricultura, marketplace, fretes, tecnologia agrícola" />
      <meta name="theme-color" content="#00ff88" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(orgLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteLd)}
      </script>
      {breadcrumbLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbLd)}
        </script>
      )}
    </Helmet>
  );
}
