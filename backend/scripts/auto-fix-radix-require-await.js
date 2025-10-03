const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      walk(fp, filelist);
    } else if (stat.isFile() && fp.endsWith('.js')) {
      filelist.push(fp);
    }
  });
  return filelist;
}

function findMatchingBraceIndex(str, startIndex) {
  let i = startIndex;
  const len = str.length;
  if (str[i] !== '{') return -1;
  let depth = 0;
  for (; i < len; i++) {
    const ch = str[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function removeAsyncIfNoAwait(content) {
  let changed = false;
  // Pattern 1: async function NAME(...) { ... }
  const asyncFuncRegex = /async\s+function\s+([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*\{/g;
  let match;
  while ((match = asyncFuncRegex.exec(content)) !== null) {
    const idx = match.index;
    const braceStart = content.indexOf('{', asyncFuncRegex.lastIndex - 1);
    if (braceStart === -1) continue;
    const braceEnd = findMatchingBraceIndex(content, braceStart);
    if (braceEnd === -1) continue;
    const body = content.slice(braceStart + 1, braceEnd);
    if (!/\bawait\b/.test(body)) {
      // remove the 'async ' before function
      const before = content.slice(0, idx);
      const after = content.slice(idx).replace(/^async\s+/, '');
      content = before + after;
      changed = true;
      // reset regex lastIndex to continue safely
      asyncFuncRegex.lastIndex = idx + 1;
    }
  }

  // Pattern 2: const NAME = async (...) => { ... } or let/var
  const asyncArrowRegex = /(const|let|var)\s+[a-zA-Z0-9_$]+\s*=\s*async\s*\([^)]*\)\s*=>\s*\{/g;
  while ((match = asyncArrowRegex.exec(content)) !== null) {
    const idx = match.index;
    const arrowStart = content.indexOf('=>', asyncArrowRegex.lastIndex - 2);
    if (arrowStart === -1) continue;
    const braceStart = content.indexOf('{', arrowStart);
    if (braceStart === -1) continue;
    const braceEnd = findMatchingBraceIndex(content, braceStart);
    if (braceEnd === -1) continue;
    const body = content.slice(braceStart + 1, braceEnd);
    if (!/\bawait\b/.test(body)) {
      // remove 'async' between '=' and '('
      const segmentStart = content.lastIndexOf('=', idx) + 1 || idx;
      const segment = content.slice(segmentStart, braceStart);
      const replaced = segment.replace(/async\s*/, '');
      content = content.slice(0, segmentStart) + replaced + content.slice(braceStart);
      changed = true;
      asyncArrowRegex.lastIndex = segmentStart + 1;
    }
  }

  // Pattern 3: async (...) => { ... } standalone (e.g. passed as callback)
  const asyncStandaloneRegex = /async\s*\([^)]*\)\s*=>\s*\{/g;
  while ((match = asyncStandaloneRegex.exec(content)) !== null) {
    const idx = match.index;
    const braceStart = content.indexOf('{', asyncStandaloneRegex.lastIndex - 1);
    if (braceStart === -1) continue;
    const braceEnd = findMatchingBraceIndex(content, braceStart);
    if (braceEnd === -1) continue;
    const body = content.slice(braceStart + 1, braceEnd);
    if (!/\bawait\b/.test(body)) {
      // remove 'async '
      const before = content.slice(0, idx);
      const after = content.slice(idx).replace(/^async\s*/, '');
      content = before + after;
      changed = true;
      asyncStandaloneRegex.lastIndex = idx + 1;
    }
  }

  // Pattern 4: class methods: async methodName(...) { ... }
  const asyncMethodRegex = /async\s+([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*\{/g;
  while ((match = asyncMethodRegex.exec(content)) !== null) {
    const idx = match.index;
    // ensure this appears inside a class by checking previous 200 chars for 'class '
    const prev = content.slice(Math.max(0, idx - 200), idx);
    if (!/class\s+[a-zA-Z0-9_$]+/.test(prev)) continue;
    const braceStart = content.indexOf('{', asyncMethodRegex.lastIndex - 1);
    if (braceStart === -1) continue;
    const braceEnd = findMatchingBraceIndex(content, braceStart);
    if (braceEnd === -1) continue;
    const body = content.slice(braceStart + 1, braceEnd);
    if (!/\bawait\b/.test(body)) {
      const before = content.slice(0, idx);
      const after = content.slice(idx).replace(/^async\s*/, '');
      content = before + after;
      changed = true;
      asyncMethodRegex.lastIndex = idx + 1;
    }
  }

  return { content, changed };
}

function addRadix(content) {
  let changed = false;
  // Regexp: parseInt(something) where something does not contain a comma at top level
  // This is a best-effort; avoid matching when there's already a second argument.
  const regex = /parseInt\(\s*([^,()\n][^)]*?)\s*\)/g;
  content = content.replace(regex, (m, p1) => {
    // skip if p1 seems to already include a radix-like expression (defensive)
    if (/,\s*\d+\s*$/.test(m)) return m;
    changed = true;
    return `parseInt(${p1.trim()}, 10)`;
  });
  return { content, changed };
}

function main() {
  const base = path.join(__dirname, '..', 'src');
  console.log('Starting radix & require-await fixer in', base);
  const files = walk(base);
  let patched = [];
  files.forEach((fp) => {
    try {
      let content = fs.readFileSync(fp, 'utf8');
      const original = content;
      const r1 = addRadix(content);
      content = r1.content;
      const r2 = removeAsyncIfNoAwait(content);
      content = r2.content;
      if (content !== original) {
        fs.writeFileSync(fp, content, 'utf8');
        patched.push(fp);
        console.log('Patched', fp);
      }
    } catch (err) {
      console.error('Error processing', fp, err.message);
    }
  });
  console.log('Done. Patched files count:', patched.length);
}

main();
