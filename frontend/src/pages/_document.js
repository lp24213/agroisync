import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Keep meta and fonts intact. Avoid injecting blocking inline scripts here. */}
        </Head>
        <body>
          <Main />
          {/* NextScript runs scripts necessary for hydration;
              keep it, but avoid removing it — instead fix pages that rely only on client JS. */}
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
