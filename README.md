# Microdemo Studio

Create, share, and embed short interactive product demos captured from real user flows.

Record once in your browser, publish to Studio, and drop a lightweight web component into any page to play it back.

## Why Microdemo

- Capture authentically: One‑click recording from a browser extension.
- Share instantly: Public, immutable demo links you can send or embed.
- Safe by design: PII masking and server‑side filtering of sensitive fields.
- Frictionless embed: A single custom element that fetches and renders the demo.

## What’s Inside

- Studio (Next.js): API + minimal UI to store and serve demos.
- Player (Web Component): Small, framework‑agnostic embed.
- Extension (Chrome MV3 via WXT): Recorder that turns interactions into a demo.
- Packages: Shared schema (Zod), utilities, and lightweight UI bits.

## Quickstart (dev)

Prereqs: Node 20+, pnpm 9

```bash
corepack enable
corepack prepare pnpm@9.7.1 --activate
pnpm i
```

Studio (API + UI)

```bash
# From repo root
cd apps/studio
DATABASE_URL="file:./prisma/dev.db" NODE_ENV=development \
  pnpm prisma generate && pnpm dev
```

Player (embed component)

```bash
pnpm --filter @microdemo/player dev
```

Extension (recorder)

```bash
pnpm --filter @microdemo/extension build
# Load the output from apps/extension/.output/chrome-mv3 in your browser
```

Tip: The Player can be pointed at any Studio base URL by setting `window.__MICRODEMO_STUDIO__` before loading it.

## Build & CI

```bash
pnpm -r typecheck
pnpm -r lint
pnpm -r build
```

GitHub Actions runs typecheck, lint, and build on every push/PR.

## E2E and Seed

- E2E: requires Studio running on `http://localhost:3000`.
  - Install browsers: `pnpm -w exec playwright install --with-deps`
  - Start Studio: `pnpm --filter @microdemo/studio dev`
  - Run: `pnpm -w exec playwright test apps/studio/tests/e2e.spec.ts --project=chromium`
- Seed a sample demo (server must be running):
  - `pnpm seed:demo` (or set `STUDIO_URL` env to target a different host)

## Security

- CORS is centrally enforced and locked down for production origins.
- Standard security headers are applied (HSTS in production).
- Secrets are not committed; use environment variables for deployment.

## License

MIT — commercial licensing available upon request.

## Get In Touch

Interested in using Microdemo in your product or want a demo? Contact us to discuss plans and integration options.
