# Microdemo Studio Deployment Guide

## 1. Vercel Setup for Studio

### Prerequisites
- Vercel account
- Neon (or other PostgreSQL) database
- GitHub/GitLab/Bitbucket repository connected to Vercel

### Steps

1. **Create a new project in Vercel**
   - Import your repository
   - Set the following settings:
     - Framework Preset: `Next.js`
     - Root Directory: `apps/studio`
     - Build Command: `pnpm prisma:generate && next build`
     - Install Command: `pnpm install --frozen-lockfile`
     - Output Directory: `.next`

2. **Configure Environment Variables**
   Add these environment variables in Vercel:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
   NODE_ENV="production"
   CORS_ALLOWED_ORIGINS="https://thesolutiondeskandcompany.github.io"
   ```

3. **Deploy**
   - Push your changes to the main branch or create a pull request
   - Vercel will automatically deploy the changes

4. **Run Migrations**
   After the first deployment, run:
   ```bash
   pnpm --filter @microdemo/studio prisma migrate deploy
   ```
   Or add a "Post-Deploy Command" in Vercel:
   ```
   pnpm prisma:migrate:deploy
   ```

## 2. Player CDN Setup

### Option A: Cloudflare Pages
1. Create a new Pages project in Cloudflare
2. Configure:
   - Build command: `pnpm i && pnpm --filter @microdemo/player build`
   - Output directory: `apps/player/dist`
   - Root directory: `/`

### Option B: GitHub Pages + jsDelivr
1. Build the player:
   ```bash
   pnpm --filter @microdemo/player build
   ```
2. Commit and push the `dist` directory to your repository
3. Create a GitHub release to make it available via jsDelivr

## 3. Extension Build

1. Update the production URL in `apps/extension/background.ts`:
   ```typescript
   const STUDIO_BASE_URL = "https://your-vercel-app.vercel.app";
   ```

2. Build the extension:
   ```bash
   pnpm build:extension:prod
   ```

3. The production-ready extension will be in `apps/extension/.output/chrome-mv3`

## 4. Testing Production

After deployment, verify everything works:

1. **Test Studio API**:
   ```bash
   STUDIO="https://your-vercel-app.vercel.app"
   NEW_ID=$(curl -s -X POST $STUDIO/api/demos \
     -H 'content-type: application/json' \
     -d '{"title":"Prod Test","steps":[{"index":0,"action":"click","selector":"#test","caption":"Test"}]}' | jq -r .publicId)
   curl -s $STUDIO/api/public/$NEW_ID | jq
   ```

2. **Test Player**:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Microdemo Player Test</title>
     <script>
       window.__MICRODEMO_STUDIO__ = "https://your-vercel-app.vercel.app";
     </script>
     <script type="module" src="https://thesolutiondeskandcompany.github.io/microdemo-studio/player.es.js"></script>
   </head>
   <body>
     <microdemo-player data-id="YOUR_DEMO_ID"></microdemo-player>
   </body>
   </html>
   ```

## 5. CI/CD (Optional)

Add this to your GitHub Actions workflow (`.github/workflows/e2e.yml`):

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run tests
        run: |
          pnpm --filter @microdemo/studio dev &
          npx wait-on http://localhost:3000
          pnpm -w exec playwright install --with-deps
          pnpm -w exec playwright test
```
