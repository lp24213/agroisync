import Head from "next/head";
import { useI18n } from "../lib/i18n";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import HreflangTags from "../components/HreflangTags";

export async function getStaticProps() {
  return { props: {}, revalidate: 86400 };
}

export default function Contato() {
  const { t } = useI18n();
  const title = "Contato — Agroisync";
  const description = "Fale com nossa equipe.";
  const url = "https://agroisync.com/contato";
  const image = "https://agroisync.com/agroisync-logo.svg";
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agroisync",
    url: "https://agroisync.com",
    logo: "https://agroisync.com/agroisync-logo.svg",
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Agroisync",
    url: "https://agroisync.com",
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
        name: "Contato",
        item: url,
      },
    ],
  };

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({ loading: false, ok: null, error: "" });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, ok: null, error: "" });
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Erro ao enviar");
      setStatus({ loading: false, ok: true, error: "" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, ok: false, error: err.message || "Erro" });
    }
  }

  return (
    <>
      <HreflangTags path="/contato" />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      </Head>
      <main>
        <div className="container">
          <h1 className="hero-title">{t("contato.title", "Contato")}</h1>
          <p>{t("contato.intro", "Envie sua mensagem para nossa equipe.")}</p>

          <form
            onSubmit={onSubmit}
            noValidate
            aria-label="Formulário de contato"
            className="form"
          >
            <div className="mb-12">
              <label htmlFor="name">{t("form.name", "Nome")}</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-required="true"
                className="block w-full p-8"
              />
            </div>
            <div className="mb-12">
              <label htmlFor="email">{t("form.email", "Email")}</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-required="true"
                className="block w-full p-8"
              />
            </div>
            <div className="mb-12">
              <label htmlFor="message">{t("form.message", "Mensagem")}</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                aria-required="true"
                className="block w-full p-8"
              />
            </div>
            <div className="mb-12">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={(t) => setToken(t)}
              />
            </div>
            <button type="submit" disabled={status.loading || !token}>
              {status.loading
                ? t("contato.sending", "Enviando...")
                : t("contato.submit", "Enviar")}
            </button>
            {status.ok && (
              <p role="status" className="text-green">
                {t("contato.success", "Mensagem enviada com sucesso.")}
              </p>
            )}
            {status.ok === false && (
              <p role="alert" className="text-red">
                {status.error}
              </p>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
