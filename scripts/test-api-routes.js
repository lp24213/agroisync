const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Define API routes to test
const routes = [
  { method: "GET", path: "/api/health", name: "Health Check" },
  { method: "GET", path: "/api/products", name: "Get Products" },
  {
    method: "POST",
    path: "/api/contact",
    name: "Contact Form",
    body: {
      name: "Test",
      email: "test@test.com",
      message: "Test",
      token: "test-token",
    },
    expectedStatus: [200, 400],
  },
  {
    method: "GET",
    path: "/api/users",
    name: "Get Users",
    expectedStatus: [200, 401, 404],
  },
  {
    method: "GET",
    path: "/api/orders",
    name: "Get Orders",
    expectedStatus: [200, 401, 404],
  },
];

async function testRoute(baseUrl, route) {
  const url = `${baseUrl}${route.path}`;
  console.log(`Testing: ${route.method} ${url}`);

  try {
    const config = {
      method: route.method,
      url,
      timeout: 10000,
      validateStatus: () => true, // Don't throw on any status
      ...(route.body && { data: route.body }),
    };

    const response = await axios(config);

    const expectedStatuses = route.expectedStatus || [200, 201];
    const isExpected = expectedStatuses.includes(response.status);
    const is5xx = response.status >= 500 && response.status < 600;

    return {
      name: route.name,
      method: route.method,
      path: route.path,
      status: response.status,
      isExpected,
      is5xx,
      success: !is5xx && isExpected,
      responseTime: response.headers["x-response-time"] || "N/A",
      contentType: response.headers["content-type"] || "unknown",
      hasErrorMessage: !!response.data?.error,
      errorMessage: response.data?.error || null,
    };
  } catch (error) {
    return {
      name: route.name,
      method: route.method,
      path: route.path,
      status: error.response?.status || "ERROR",
      isExpected: false,
      is5xx: error.response?.status >= 500,
      success: false,
      error: error.message,
      errorType: error.code,
    };
  }
}

async function main() {
  const baseUrl = process.env.API_URL || "http://localhost:3000";
  const outputDir = path.join(__dirname, "..", "reports");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Testing API routes for: ${baseUrl}\n`);

  const results = [];

  for (const route of routes) {
    const result = await testRoute(baseUrl, route);
    results.push(result);

    const statusIcon = result.success ? "✓" : result.is5xx ? "✗" : "⚠";
    console.log(`  ${statusIcon} ${route.name}: ${result.status}`);
  }

  // Generate summary
  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    baseUrl,
    totalRoutes: routes.length,
    successfulRoutes: results.filter((r) => r.success).length,
    failedRoutes: results.filter((r) => !r.success).length,
    error5xxRoutes: results.filter((r) => r.is5xx).length,
    results,
  };

  // Write JSON report
  fs.writeFileSync(
    path.join(outputDir, "api_status.json"),
    JSON.stringify(summary, null, 2),
  );

  // Write markdown report
  let mdReport = `# API STATUS REPORT\n`;
  mdReport += `Generated: ${timestamp}\n`;
  mdReport += `Base URL: ${baseUrl}\n\n`;
  mdReport += `## Summary\n`;
  mdReport += `- Total Routes: ${summary.totalRoutes}\n`;
  mdReport += `- Successful: ${summary.successfulRoutes}\n`;
  mdReport += `- Failed: ${summary.failedRoutes}\n`;
  mdReport += `- 5xx Errors: ${summary.error5xxRoutes}\n\n`;

  mdReport += `## Route Details\n\n`;

  for (const result of results) {
    const status = result.success
      ? "PASS ✓"
      : result.is5xx
        ? "FAIL ✗"
        : "WARNING ⚠";
    mdReport += `### ${result.name}\n`;
    mdReport += `- **Method:** ${result.method}\n`;
    mdReport += `- **Path:** ${result.path}\n`;
    mdReport += `- **Status:** ${result.status}\n`;
    mdReport += `- **Result:** ${status}\n`;

    if (result.errorMessage) {
      mdReport += `- **Error Message:** ${result.errorMessage}\n`;
    }

    if (result.error) {
      mdReport += `- **Error:** ${result.error}\n`;
      if (result.errorType) {
        mdReport += `- **Error Type:** ${result.errorType}\n`;
      }
    }

    mdReport += "\n";
  }

  // Add recommendations
  mdReport += `## Recommendations\n\n`;

  const failedRoutes = results.filter((r) => !r.success);
  if (failedRoutes.length === 0) {
    mdReport += `✓ All routes are functioning properly.\n`;
  } else {
    mdReport += `The following routes need attention:\n\n`;
    failedRoutes.forEach((r) => {
      mdReport += `- **${r.name}** (${r.method} ${r.path}): `;
      if (r.is5xx) {
        mdReport += `Fix server error (${r.status})\n`;
      } else if (r.error) {
        mdReport += `${r.error}\n`;
      } else {
        mdReport += `Unexpected status ${r.status}\n`;
      }
    });
  }

  fs.writeFileSync(path.join(outputDir, "api_status.md"), mdReport);

  console.log(`\n✓ API test reports generated at: ${outputDir}`);
  console.log(`  - api_status.json`);
  console.log(`  - api_status.md`);

  if (summary.error5xxRoutes > 0) {
    console.error(`\n✗ ${summary.error5xxRoutes} route(s) returned 5xx errors`);
    process.exit(1);
  } else if (summary.failedRoutes > 0) {
    console.warn(`\n⚠ ${summary.failedRoutes} route(s) need attention`);
  } else {
    console.log(`\n✓ All routes passed`);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
