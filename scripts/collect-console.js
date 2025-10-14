// Script: collect-console.js
// Abre uma URL em um browser headless e captura: console messages, page errors, request failures e responses com status >= 400
// Uso: node collect-console.js <url>

const fs = require('fs');
const path = require('path');
const url = process.argv[2] || 'https://agroisync.com';

(async () => {
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
    const page = await browser.newPage();

    const results = {
      url,
      timestamp: new Date().toISOString(),
      console: [],
      pageErrors: [],
      requestFailures: [],
      badResponses: []
    };

    page.on('console', msg => {
      try {
        const args = msg.args();
        const text = msg.text();
        results.console.push({type: msg.type(), text, location: msg.location ? msg.location() : null});
      } catch (e) {
        results.console.push({type: msg.type(), text: msg.text()});
      }
    });

    page.on('pageerror', err => {
      results.pageErrors.push({message: err.message, stack: err.stack});
    });

    page.on('requestfailed', req => {
      results.requestFailures.push({url: req.url(), method: req.method(), failureText: req.failure().errorText});
    });

    page.on('response', async res => {
      try {
        const status = res.status();
        if (status >= 400) {
          results.badResponses.push({url: res.url(), status, statusText: res.statusText()});
        }
      } catch (e) {
        // ignore
      }
    });

    console.log(`Navigating to ${url} ...`);
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});

    // Espera mais alguns segundos para eventuais logs late-binding
    await page.waitForTimeout(3000);

    const outPath = path.resolve(__dirname, '../reports/console-capture.json');
    try { fs.mkdirSync(path.dirname(outPath), {recursive:true}); } catch(e) {}
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

    console.log(`Capture saved to ${outPath}`);
    console.log(JSON.stringify({summary: {
      consoleCount: results.console.length,
      pageErrors: results.pageErrors.length,
      requestFailures: results.requestFailures.length,
      badResponses: results.badResponses.length
    }}));

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao executar captura:', err && err.stack ? err.stack : err);
    process.exit(2);
  }
})();
