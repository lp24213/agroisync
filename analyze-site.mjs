import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { URL } from "url";
import axios from "axios";

const SITE_URL = "https://agroisync.com";
const OUTPUT_DIR = "./analysis";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "agroisync_full_report.md");

(async () => {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    console.log("🚀 Iniciando análise completa de:", SITE_URL);

    // 1️⃣ Teste de disponibilidade básica
    console.log("🔎 Verificando disponibilidade...");
    let status = "indisponível";
    try {
      const res = await axios.get(SITE_URL);
      status = `${res.status} ${res.statusText}`;
    } catch (err) {
      status = `Erro: ${err.message}`;
    }

    // 2️⃣ Teste com Puppeteer – verificar erros JS, SSR, e mensagens de console
    console.log("🧠 Verificando erros JS e comportamento de renderização...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let jsErrors = [];
    let consoleLogs = [];

    page.on("pageerror", (err) => jsErrors.push(err.message));
    page.on("console", (msg) => consoleLogs.push(msg.text()));

    await page.goto(SITE_URL, { waitUntil: "networkidle2", timeout: 60000 });
    const html = await page.content();

    // Detectar se o site usa SSR ou só carrega com JS
    const ssrDetected =
      html.includes("<script") && html.length < 5000
        ? "❌ Sem SSR (renderização depende totalmente de JavaScript)"
        : "✅ SSR detectado (conteúdo renderizado no servidor)";

    // 3️⃣ Lighthouse – performance, SEO, acessibilidade
    console.log("⚙️ Rodando auditoria Lighthouse...");
    const { lhr } = await lighthouse(SITE_URL, {
      port: new URL(browser.wsEndpoint()).port,
      output: "json",
      onlyCategories: ["performance", "accessibility", "seo", "best-practices"],
    });

    const report = {
      status,
      ssrDetected,
      performance: lhr.categories.performance.score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      seo: lhr.categories.seo.score * 100,
      bestPractices: lhr.categories["best-practices"].score * 100,
      errors: jsErrors,
      console: consoleLogs.slice(0, 10),
      recommendations: lhr.audits,
    };

    // 4️⃣ Montar relatório
    const reportText = `
# 🌐 Relatório Técnico – AGROISYNC.COM

**Status:** ${report.status}
**Renderização:** ${report.ssrDetected}

## 📊 Pontuação Lighthouse
- **Performance:** ${report.performance}%
- **Acessibilidade:** ${report.accessibility}%
- **SEO:** ${report.seo}%
- **Boas Práticas:** ${report.bestPractices}%

## ⚠️ Erros JavaScript detectados
${report.errors.length ? report.errors.map((e) => `- ${e}`).join("\n") : "Nenhum erro JS capturado."}

## 🧾 Logs de Console (10 primeiros)
${report.console.length ? report.console.map((l) => `- ${l}`).join("\n") : "Sem logs relevantes."}

## 💡 Recomendações automáticas (principais)
${Object.values(report.recommendations)
  .filter((r) => r.score !== 1 && r.scoreDisplayMode === "numeric")
  .slice(0, 20)
  .map((r) => `- **${r.title}**: ${r.description || ""}`)
  .join("\n")}

---

## 🧩 Sugestões manuais
1. Implementar SSR real (Next.js, Astro ou Remix) → SEO e indexação.
2. Otimizar imagens e lazy loading.
3. Adicionar meta tags, hreflang e canonical.
4. Melhorar acessibilidade (contraste, alt em imagens, labels).
5. Adicionar Termos de Uso e Política de Privacidade.
6. Revisar logs de erro no backend.
7. Configurar cache e CDN.
8. Testar em mobile real (responsividade).
9. Revisar console warnings.
10. Implementar monitoramento de uptime e segurança (SSL, CSP).

---

🕐 **Análise gerada em:** ${new Date().toLocaleString("pt-BR")}
`;

    fs.writeFileSync(OUTPUT_FILE, reportText);
    console.log(`✅ Relatório completo salvo em: ${OUTPUT_FILE}`);

    await browser.close();
  } catch (err) {
    console.error("❌ Erro ao executar análise:", err);
  }
})();
