#!/usr/bin/env node
/*
  Record a short animated GIF of the Player rendering a demo.

  Usage:
    pnpm gif:demo

  Options via env:
    STUDIO_URL  - Studio base URL (default: http://localhost:3010)
    DEMO_ID     - Existing public demo ID. If omitted and STUDIO_URL is local,
                  the script will start Studio dev and create a demo.
    OUT_GIF     - Output path (default: docs/demo.gif)

  Notes:
    - Requires Playwright browsers. If missing, run:
        pnpm -w exec playwright install --with-deps
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const fetch = global.fetch || require('node-fetch');
const ffmpeg = require('ffmpeg-static');

async function waitForPort(port, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const s = new http.Agent().createConnection({ host: '127.0.0.1', port }, () => {
          s.end(); resolve();
        });
        s.on('error', reject);
      });
      return true;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Timeout waiting for port ${port}`);
}

async function startStudioIfNeeded(studioUrl) {
  if (!studioUrl.startsWith('http://localhost')) return null;
  const port = Number(new URL(studioUrl).port || '3010');
  // Try quick check
  try {
    await fetch(`${studioUrl}/api/public/non-existent`);
    return null; // already up
  } catch {}
  console.log(`Starting Studio dev server on ${studioUrl}...`);
  const proc = spawn('pnpm', ['--filter', '@microdemo/studio', 'dev'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: String(port), NODE_ENV: 'development' },
    stdio: 'ignore'
  });
  await waitForPort(port, 120000);
  return proc;
}

async function ensurePlayerBuilt() {
  // Build player and create canonical player.js
  console.log('Building Player...');
  await new Promise((resolve, reject) => {
    const p = spawn('pnpm', ['--filter', '@microdemo/player', 'build'], { stdio: 'inherit' });
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Player build failed: ${code}`)));
  });
  const dist = path.resolve(__dirname, '../apps/player/dist');
  const es = path.join(dist, 'player.es.js');
  const canon = path.join(dist, 'player.js');
  if (fs.existsSync(es)) {
    fs.copyFileSync(es, canon);
  }
  return dist;
}

function startStaticServer(rootDir, port = 3011) {
  const server = http.createServer((req, res) => {
    let p = req.url.split('?')[0];
    if (p === '/') p = '/demo-rec.html';
    const filePath = path.join(rootDir, p);
    if (!filePath.startsWith(rootDir)) { res.writeHead(403).end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200).end(data);
    });
  }).listen(port);
  return server;
}

async function createLocalDemo(studioUrl) {
  const payload = {
    title: `Readme Demo ${new Date().toISOString().slice(0,19).replace('T',' ')}`,
    steps: [
      { index: 0, action: 'click', selector: '#cta', caption: 'Click CTA' },
      { index: 1, action: 'input', selector: 'input[name=email]', caption: 'Enter email (masked)' },
    ],
  };
  const res = await fetch(`${studioUrl}/api/demos`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Create demo failed: ${res.status}`);
  const data = await res.json();
  return data.publicId;
}

async function recordGif(pageUrl, outGif) {
  const { chromium } = require('playwright');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mdemo-'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 700 }, recordVideo: { dir: tmpDir, size: { width: 1200, height: 700 } } });
  const page = await context.newPage();
  console.log('Recording from', pageUrl);
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);
  await context.close();
  await browser.close();
  const videoFile = fs.readdirSync(tmpDir).map(f => path.join(tmpDir, f)).find(f => f.endsWith('.webm'));
  if (!videoFile) throw new Error('Video not found');
  if (!ffmpeg) throw new Error('ffmpeg-static not found');
  await new Promise((resolve, reject) => {
    const args = ['-y', '-i', videoFile, '-vf', "fps=10,scale=900:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", outGif];
    const proc = spawn(ffmpeg, args, { stdio: 'inherit' });
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg failed ${code}`)));
  });
}

(async () => {
  const STUDIO_URL = process.env.STUDIO_URL || 'http://localhost:3010';
  const DEMO_ID = process.env.DEMO_ID;
  const OUT_GIF = process.env.OUT_GIF || path.resolve(__dirname, '../docs/demo.gif');

  const studioProc = await startStudioIfNeeded(STUDIO_URL);
  try {
    const distDir = await ensurePlayerBuilt();
    const demoId = DEMO_ID || await createLocalDemo(STUDIO_URL);
    const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width\"/><title>Microdemo Readme Recording</title><script>window.__MICRODEMO_STUDIO__='${STUDIO_URL.replace(/'/g, '')}';</script><script type=\"module\" src=\"./player.js\"></script><style>body{background:#0b0f13;margin:0;padding:24px} microdemo-player{max-width:900px;margin:auto;display:block}</style></head><body><microdemo-player data-id=\"${demoId}\"></microdemo-player></body></html>`;
    const demoFile = path.join(distDir, 'demo-rec.html');
    fs.writeFileSync(demoFile, html, 'utf8');
    const server = startStaticServer(distDir, 3011);
    try {
      await recordGif('http://localhost:3011/demo-rec.html', OUT_GIF);
      console.log('GIF saved to', OUT_GIF);
    } finally {
      server.close();
    }
  } finally {
    if (studioProc) studioProc.kill('SIGINT');
  }
})().catch((e) => { console.error(e); process.exit(1); });

