#!/usr/bin/env bash
set -e
echo "==== ENV: node / npm / yarn ===="
node -v || true
npm -v || true
yarn -v || true
echo
echo "==== GIT: branch / last commits / status ===="
git rev-parse --abbrev-ref HEAD || true
git log -n 10 --oneline || true
git status --porcelain || true
echo
echo "==== package.json scripts ===="
[ -f package.json ] && jq '.scripts' package.json || echo "package.json not found or jq not installed"
echo
echo "==== TREE (depth 3) ===="
if command -v tree >/dev/null 2>&1; then tree -L 3 || true; else find . -maxdepth 3 -type d -print; fi
echo
echo "==== PAGES LIST (pages or src/pages) ===="
if [ -d pages ]; then ls -R pages | sed -n '1,200p'; elif [ -d src/pages ]; then ls -R src/pages | sed -n '1,200p'; else echo 'No pages or src/pages'; fi
echo
echo "==== CHECK _app/_document/_middleware presence ===="
for f in pages/_app.* pages/_document.* pages/_middleware.* src/pages/_app.* src/pages/_document.* src/pages/_middleware.*; do [ -f $f ] && echo "FOUND: $f"; done
echo
echo "==== WRANGLER / WORKERS ===="
[ -f wrangler.toml ] && echo "wrangler.toml:" && sed -n '1,200p' wrangler.toml || echo "wrangler.toml not found"
[ -f wrangler.json ] && echo "wrangler.json:" && sed -n '1,200p' wrangler.json || echo "wrangler.json not found"
if [ -d workers ]; then echo "workers/:" && ls -R workers || true; else echo "No workers folder"; fi
echo
echo "==== NEXT CONFIG & VERCEL ===="
[ -f next.config.js ] && sed -n '1,200p' next.config.js || echo "next.config.js not found"
[ -f vercel.json ] && sed -n '1,200p' vercel.json || echo "vercel.json not found"
echo
echo "==== .env files (keys only) ===="
for envf in .env .env.local .env.production; do if [ -f "$envf" ]; then echo "---- $envf ----"; sed -n '1,200p' "$envf" | sed -n 's/=.*/=[REDACTED]/p'; else echo "$envf not found"; fi; done
echo
echo "==== RUN BUILD (capturing output) ===="
( set +e; npm run build ) > /tmp/agroisync_build.out 2>&1 || true
echo "BUILD LOG (last 300 lines):"
tail -n 300 /tmp/agroisync_build.out || true
echo
echo "==== RUN DEV (capturing startup) ===="
( set +e; npm run dev ) > /tmp/agroisync_dev.out 2>&1 &
DEV_PID=$!
sleep 8
kill $DEV_PID 2>/dev/null || true
echo "DEV LOG (first 200 lines):"
head -n 200 /tmp/agroisync_dev.out || true
echo
echo "==== OPTIONAL: Vercel CLI logs (if vercel installed & logged) ===="
if command -v vercel >/dev/null 2>&1; then vercel whoami || true; vercel logs --prod --limit 200 || true; else echo "Vercel CLI not installed"; fi
echo
echo "==== DIAG COMPLETE ===="
