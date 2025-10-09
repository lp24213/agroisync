import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = ctx?.req?.headers?.["x-nonce"] || null;
    return { ...initialProps, nonce };
  }

  render() {
    const nonce = this.props.nonce || null;
    return (
      <Html lang="pt-BR">
        <Head>
          {nonce && <meta name="csp-nonce" content={String(nonce)} />}
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce || undefined} />
        </body>
      </Html>
    );
  }
}
