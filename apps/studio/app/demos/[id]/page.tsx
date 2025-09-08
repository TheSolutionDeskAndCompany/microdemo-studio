import { getDemo } from "../../store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DemoDetail({ params }: { params: { id: string } }) {
  const demo = await getDemo(params.id);
  if (!demo) return notFound();
  return (
    <main style={{ padding: 20 }}>
      <h1>{demo.title}</h1>
      <p>Embed snippet:</p>
      <pre>
        {`<script>
  window.__MICRODEMO_STUDIO__ = "http://localhost:3000";
</script>
<script type="module" src="https://your-cdn-url/player.es.js"></script>
<microdemo-player data-id="${demo.publicId}"></microdemo-player>`}
      </pre>
    </main>
  );
}
