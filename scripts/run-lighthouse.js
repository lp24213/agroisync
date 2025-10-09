const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

const routes = [
  { path: "/", name: "home" },
  { path: "/marketplace", name: "marketplace" },
  { path: "/fretes", name: "fretes" },
  { path: "/sobre", name: "sobre" },
  { path: "/contact", name: "contact" },
];

async function runLighthouse(url, name, chrome) {
  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
  };

  console.log(`Running Lighthouse for: ${url}`);

  try {
    const runnerResult = await lighthouse(url, options);

    const report = {
      name,
      url,
      timestamp: new Date().toISOString(),
      scores: {
        performance: runnerResult.lhr.categories.performance.score * 100,
        accessibility: runnerResult.lhr.categories.accessibility.score * 100,
        bestPractices:
          runnerResult.lhr.categories["best-practices"].score * 100,
        seo: runnerResult.lhr.categories.seo.score * 100,
      },
      audits: Object.keys(runnerResult.lhr.audits)
        .filter((key) => {
          const audit = runnerResult.lhr.audits[key];
          return audit.score !== null && audit.score < 1;
        })
        .map((key) => {
          const audit = runnerResult.lhr.audits[key];
          return {
            id: key,
            title: audit.title,
            score: audit.score,
            displayValue: audit.displayValue,
            description: audit.description,
          };
        }),
    };

    return report;
  } catch (error) {
    console.error(`Error running Lighthouse for ${url}:`, error.message);
    return {
      name,
      url,
      error: error.message,
      scores: null,
    };
  }
}

async function main() {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000";
  const outputDir = path.join(__dirname, "..", "reports");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Running Lighthouse audits for: ${baseUrl}\n`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

  try {
    const results = [];

    for (const route of routes) {
      const url = `${baseUrl}${route.path}`;
      const result = await runLighthouse(url, route.name, chrome);
      results.push(result);

      if (result.scores) {
        console.log(`  ✓ ${route.name}:`);
        console.log(
          `    Performance: ${result.scores.performance.toFixed(0)}`,
        );
        console.log(
          `    Accessibility: ${result.scores.accessibility.toFixed(0)}`,
        );
        console.log(
          `    Best Practices: ${result.scores.bestPractices.toFixed(0)}`,
        );
        console.log(`    SEO: ${result.scores.seo.toFixed(0)}\n`);
      } else {
        console.log(`  ✗ ${route.name}: ${result.error}\n`);
      }
    }

    // Calculate averages
    const validResults = results.filter((r) => r.scores);
    const averages = {
      performance:
        validResults.reduce((sum, r) => sum + r.scores.performance, 0) /
        validResults.length,
      accessibility:
        validResults.reduce((sum, r) => sum + r.scores.accessibility, 0) /
        validResults.length,
      bestPractices:
        validResults.reduce((sum, r) => sum + r.scores.bestPractices, 0) /
        validResults.length,
      seo:
        validResults.reduce((sum, r) => sum + r.scores.seo, 0) /
        validResults.length,
    };

    const summary = {
      timestamp: new Date().toISOString(),
      baseUrl,
      totalRoutes: routes.length,
      testedRoutes: validResults.length,
      averages,
      results,
    };

    // Write JSON report
    fs.writeFileSync(
      path.join(outputDir, "lighthouse.json"),
      JSON.stringify(summary, null, 2),
    );

    // Write summary report
    let summaryText = `# LIGHTHOUSE AUDIT SUMMARY\n`;
    summaryText += `Generated: ${summary.timestamp}\n`;
    summaryText += `Base URL: ${baseUrl}\n\n`;
    summaryText += `## Average Scores\n`;
    summaryText += `- Performance: ${averages.performance.toFixed(0)}/100\n`;
    summaryText += `- Accessibility: ${averages.accessibility.toFixed(0)}/100\n`;
    summaryText += `- Best Practices: ${averages.bestPractices.toFixed(0)}/100\n`;
    summaryText += `- SEO: ${averages.seo.toFixed(0)}/100\n\n`;

    summaryText += `## Individual Route Scores\n\n`;

    for (const result of results) {
      if (result.scores) {
        summaryText += `### ${result.name}\n`;
        summaryText += `- Performance: ${result.scores.performance.toFixed(0)}/100\n`;
        summaryText += `- Accessibility: ${result.scores.accessibility.toFixed(0)}/100\n`;
        summaryText += `- Best Practices: ${result.scores.bestPractices.toFixed(0)}/100\n`;
        summaryText += `- SEO: ${result.scores.seo.toFixed(0)}/100\n`;

        if (result.audits && result.audits.length > 0) {
          summaryText += `\n**Issues to fix:**\n`;
          result.audits.slice(0, 5).forEach((audit) => {
            summaryText += `- ${audit.title} (score: ${(audit.score * 100).toFixed(0)})\n`;
          });
        }
        summaryText += "\n";
      } else {
        summaryText += `### ${result.name}\n`;
        summaryText += `Error: ${result.error}\n\n`;
      }
    }

    fs.writeFileSync(
      path.join(outputDir, "lighthouse_summary.md"),
      summaryText,
    );

    console.log(`\n✓ Lighthouse reports generated at: ${outputDir}`);
    console.log(`  - lighthouse.json`);
    console.log(`  - lighthouse_summary.md`);

    // Check if scores meet minimum threshold (85)
    const threshold = 85;
    const failedCategories = [];

    if (averages.performance < threshold)
      failedCategories.push("Performance");
    if (averages.accessibility < threshold)
      failedCategories.push("Accessibility");
    if (averages.bestPractices < threshold)
      failedCategories.push("Best Practices");
    if (averages.seo < threshold) failedCategories.push("SEO");

    if (failedCategories.length > 0) {
      console.warn(
        `\n⚠ The following categories scored below ${threshold}: ${failedCategories.join(", ")}`,
      );
    } else {
      console.log(`\n✓ All categories scored above ${threshold}`);
    }
  } finally {
    await chrome.kill();
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
