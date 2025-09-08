/* Simple demo seeder using the Studio REST API.
 * Requires Studio dev/prod server running and reachable.
 */

const STUDIO = process.env.STUDIO_URL || 'http://localhost:3000';

async function main() {
  const payload = {
    title: `Seeded Demo ${new Date().toISOString().slice(0,19).replace('T',' ')}`,
    steps: [
      { index: 0, action: 'click', selector: '#hero-cta', caption: 'Click primary CTA' },
      { index: 1, action: 'input', selector: 'input[name=email]', caption: 'Enter email (masked)' },
    ],
  };

  const res = await fetch(`${STUDIO}/api/demos`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Seed failed: ${res.status} ${res.statusText}: ${text}`);
  }
  const data = await res.json();
  console.log('Created demo:', data);
  const pub = await fetch(`${STUDIO}/api/public/${data.publicId}`);
  const pubData = await pub.json();
  console.log('Public demo:', pubData.ok ? 'OK' : pubData.error);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

