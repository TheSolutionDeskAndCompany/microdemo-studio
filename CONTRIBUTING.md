# Contributing to Microdemo Studio

Thanks for your interest in contributing! This guide keeps contributions smooth and the repo healthy.

## Development

- Node 20+, pnpm 9
- Install: `corepack enable && corepack prepare pnpm@9.7.1 --activate && pnpm i`
- Dev servers:
  - Studio: `pnpm --filter @microdemo/studio dev`
  - Player: `pnpm --filter @microdemo/player dev`
  - Extension: `pnpm --filter @microdemo/extension build`

## Pull Requests

- Branch from `main`
- Keep PRs focused; include a concise description of changes
- Run locally before pushing:
  - `pnpm -r typecheck && pnpm -r lint && pnpm -r build`
- Add tests when applicable (Playwright E2E under `apps/studio/tests`)

## Commit Style

- Use clear, imperative commit messages (e.g., `feat:`, `fix:`, `chore:`)

## Security

- Never commit secrets. Use environment variables and `.env.example` as a reference.
- See `SECURITY.md` for reporting vulnerabilities.

## Code of Conduct

Be respectful, constructive, and professional. We’ll enforce it to keep the community healthy.

