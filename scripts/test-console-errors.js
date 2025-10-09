const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const routes = [
  { path: "/", name: "home" },
  { path: "/marketplace", name: "marketplace" },
  { path: "/fretes", name: "fretes" },
  { path: "/sobre", name: "sobre" },
  { path: "/contact", name: "contact" },
  { path: "/loja", name: "loja" },
  { path: "/partnerships", name: "partnerships" },
];

async function testRoute(page, baseUrl, route) {
  const url = `${baseUrl}${route.path}`;
  const errors = [];
  const warnings = [];

  console.log(`Testing: ${url}`);

  // Listen for console messages
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();

    if (type === "error") {
      errors.push(text);
    } else if (type === "warning") {
      warnings.push(text);
    }
  });

  // Listen for page errors
  page.on("pageerror", (error) => {
    errors.push(`Page Error: ${error.message}`);
  });

  // Listen for failed requests
  page.on("requestfailed", (request) => {
    errors.push(
      `Request Failed: ${request.url()} - ${request.failure().errorText}`,
    );
  });

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    return {
      route: route.name,
      url,
      errors,
      warnings,
      success: errors.length === 0,
    };
  } catch (error) {
    return {
      route: route.name,
      url,
      errors: [...errors, `Navigation Error: ${error.message}`],
      warnings,
      success: false,
    };
  }
}

async function main() {
  const baseUrl = process.env.TEST_URL || "http://localhost:3000";
  const outputDir = path.join(__dirname, "..", "reports");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Testing console errors for: ${baseUrl}\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    const results = [];

    for (const route of routes) {
      const result = await testRoute(page, baseUrl, route);
      results.push(result);

      console.log(
        `  ${result.success ? "✓" : "✗"} ${route.name}: ${result.errors.length} errors, ${result.warnings.length} warnings`,
      );
    }

    // Generate report
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      baseUrl,
      summary: {
        totalRoutes: routes.length,
        successfulRoutes: results.filter((r) => r.success).length,
        failedRoutes: results.filter((r) => !r.success).length,
        totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
        totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
      },
      results,
    };

    // Write JSON report
    fs.writeFileSync(
      path.join(outputDir, "console_errors.json"),
      JSON.stringify(report, null, 2),
    );

    // Write text report
    let textReport = `# CONSOLE ERRORS REPORT\n`;
    textReport += `Generated: ${timestamp}\n`;
    textReport += `Base URL: ${baseUrl}\n\n`;
    textReport += `## Summary\n`;
    textReport += `- Total Routes: ${report.summary.totalRoutes}\n`;
    textReport += `- Successful: ${report.summary.successfulRoutes}\n`;
    textReport += `- Failed: ${report.summary.failedRoutes}\n`;
    textReport += `- Total Errors: ${report.summary.totalErrors}\n`;
    textReport += `- Total Warnings: ${report.summary.totalWarnings}\n\n`;

    textReport += `## Details\n\n`;

    for (const result of results) {
      textReport += `### ${result.route} (${result.url})\n`;
      textReport += `Status: ${result.success ? "PASS ✓" : "FAIL ✗"}\n\n`;

      if (result.errors.length > 0) {
        textReport += `**Errors (${result.errors.length}):**\n`;
        result.errors.forEach((error, i) => {
          textReport += `${i + 1}. ${error}\n`;
        });
        textReport += "\n";
      }

      if (result.warnings.length > 0) {
        textReport += `**Warnings (${result.warnings.length}):**\n`;
        result.warnings.forEach((warning, i) => {
          textReport += `${i + 1}. ${warning}\n`;
        });
        textReport += "\n";
      }

      if (result.errors.length === 0 && result.warnings.length === 0) {
        textReport += `No errors or warnings detected.\n\n`;
      }
    }

    fs.writeFileSync(
      path.join(outputDir, "console_errors.txt"),
      textReport,
    );

    console.log(`\n✓ Report generated at: ${outputDir}`);
    console.log(`  - console_errors.json`);
    console.log(`  - console_errors.txt`);

    // Exit with error code if there are failures
    if (report.summary.failedRoutes > 0) {
      console.error(
        `\n✗ ${report.summary.failedRoutes} route(s) failed with errors`,
      );
      process.exit(1);
    } else {
      console.log(`\n✓ All routes passed without errors`);
      process.exit(0);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
