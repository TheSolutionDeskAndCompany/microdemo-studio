# Microdemo Studio

Monorepo for Microdemo Studio product.

## Apps

- **extension**: Chrome/Edge extension (Manifest V3) built with WXT + TypeScript. Captures browser interactions and emits Step JSON.
- **studio**: Next.js 14 app with in-memory API to accept Demo JSON, list demos, and serve public pages.
- **player**: Vite-built Web Component (<microdemo-player>) that loads and renders Demo JSON steps.

## Packages

- **schema**: Zod schemas for Demo and Step.
- **utils**: Helpers for masking PII and safe CSS selectors.
- **ui**: Minimal React UI primitives (Button component).

## Quickstart

```bash
corepack enable
corepack prepare pnpm@9.7.1 --activate
pnpm i
pnpm dev
```

To run individual apps or packages:

```bash
pnpm --filter @microdemo/extension dev
pnpm --filter @microdemo/studio dev
pnpm --filter @microdemo/player dev
```

## Scripts

- `pnpm dev`: Runs all dev servers in parallel.
- `pnpm build`: Builds all packages and apps.
- `pnpm lint`: Lints all packages and apps.
- `pnpm typecheck`: Runs TypeScript type checks.
- `pnpm test`: Runs tests (to be added).

## Next Tasks

- Replace Studio in-memory store with Prisma + Neon.
- Add /api/public/:id and fetch that in the Player.
- Add masking E2E tests with Playwright.
- Add brand palette tokens (teal/fuchsia/mahogany) in CSS for Studio + Extension popup.
