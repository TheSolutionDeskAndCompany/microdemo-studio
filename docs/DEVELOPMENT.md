# Development

This document is for contributors and operators. The top-level README is product-focused by design.

## Prerequisites

- Node.js 20+
- pnpm 9 (`corepack enable && corepack prepare pnpm@9.7.1 --activate`)

## Install

```bash
pnpm i
```

## Workspace commands

```bash
pnpm -r typecheck
pnpm -r lint
pnpm -r build
```

## Apps

Studio (API + UI)

```bash
cd apps/studio
DATABASE_URL="file:./prisma/dev.db" NODE_ENV=development pnpm prisma generate && pnpm dev
```

Player (web component)

```bash
pnpm --filter @microdemo/player dev
```

Extension (recorder)

```bash
pnpm --filter @microdemo/extension build
# Load apps/extension/.output/chrome-mv3 in your browser
```

## E2E and Seed

- Install browsers: `pnpm -w exec playwright install --with-deps`
- Start Studio on http://localhost:3000
- Run: `pnpm -w exec playwright test apps/studio/tests/e2e.spec.ts --project=chromium`

Seed a sample demo (Studio must be running):

```bash
pnpm seed:demo
# or set STUDIO_URL to target another host
```

## Player CDN (GitHub Pages)

- Tag releases `player-v0.x.y` to build Player and publish to Pages.
- Files are served at:
  - `/player.js` (ES module)
  - `/player.es.js` (ES module)
  - `/player.umd.js` (UMD)

