#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');
const LOGGER_PATH = path.join(ROOT, 'utils', 'logger.js');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full);
    } else if (e.isFile() && full.endsWith('.js')) {
      processFile(full);
    }
  }
}

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');

  if (!/console\.(log|error|warn|info|debug)\(/.test(src)) {
    return;
  }

  // Replace console.* calls with logger.*
  src = src.replace(/console\.error\(/g, 'logger.error(');
  src = src.replace(/console\.warn\(/g, 'logger.warn(');
  src = src.replace(/console\.info\(/g, 'logger.info(');
  src = src.replace(/console\.debug\(/g, 'logger.debug(');
  // Treat console.log as info to reduce noise
  src = src.replace(/console\.log\(/g, 'logger.info(');

  // If file already references logger, keep as-is
  if (!/\blogger\b/.test(src)) {
    // compute relative path from file to LOGGER_PATH
    const rel = path.relative(path.dirname(filePath), LOGGER_PATH).replace(/\\/g, '/');
    let importStatement = '';
    // Decide whether the file uses ES modules (import) or CommonJS (require)
    if (/^\s*import\s+/m.test(src)) {
      importStatement = `import logger from '${rel.startsWith('.') ? rel : './' + rel}';\n`;
      // insert after other imports (after last import)
      const lastImport = src.match(/(^\s*import[\s\S]*?;\s*)/gm);
      if (lastImport && lastImport.length) {
        // find index after last import
        const idx = src.lastIndexOf(lastImport[lastImport.length - 1]);
        const before = src.slice(0, idx + lastImport[lastImport.length - 1].length);
        const after = src.slice(idx + lastImport[lastImport.length - 1].length);
        src = before + importStatement + after;
      } else {
        src = importStatement + src;
      }
    } else {
      importStatement = `const logger = require('${rel.startsWith('.') ? rel : './' + rel}');\n`;
      // insert after 'use strict' or at top
      if (/^\s*['"]use strict['"];?/m.test(src)) {
        src = src.replace(/^\s*(['"]use strict['"];?\s*)/m, `$1${importStatement}`);
      } else {
        src = importStatement + src;
      }
    }
  } else {
    // file mentions logger but maybe not imported; ensure import exists
    if (!/import\s+logger\s+from|require\(.*logger/.test(src)) {
      const rel = path.relative(path.dirname(filePath), LOGGER_PATH).replace(/\\/g, '/');
      const importStatement = /^\s*import\s+/m.test(src)
        ? `import logger from '${rel.startsWith('.') ? rel : './' + rel}';\n`
        : `const logger = require('${rel.startsWith('.') ? rel : './' + rel}');\n`;
      // try to insert after other imports/requires
      const importMatch = src.match(/(^\s*(import .*from .*;|const .* = require\(.*\);)\s*)/gm);
      if (importMatch && importMatch.length) {
        const idx = src.lastIndexOf(importMatch[importMatch.length - 1]);
        const before = src.slice(0, idx + importMatch[importMatch.length - 1].length);
        const after = src.slice(idx + importMatch[importMatch.length - 1].length);
        src = before + importStatement + after;
      } else {
        src = importStatement + src;
      }
    }
  }

  fs.writeFileSync(filePath, src, 'utf8');
  console.log('Patched', filePath);
}

console.log('Starting console->logger fix in', ROOT);
walk(ROOT);
console.log('Done.');
