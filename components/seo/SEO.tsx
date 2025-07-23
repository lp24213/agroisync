import Head from 'next/head'

export default function SEO({ title, description }: { title: string, description: string }) {
  const finalTitle = title ? `${title} | AGROTM` : 'AGROTM – O futuro cripto do agro'
  const finalDescription = description || 'O ecossistema Web3 mais completo da América Latina'

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/logo.png" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}