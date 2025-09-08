import Link from "next/link";
import { listDemos } from "../store";

export const dynamic = "force-dynamic";

export default async function Demos() {
  const demos = await listDemos();
  return (
    <main style={{ padding: 20 }}>
      <h1>Demos</h1>
      <ul>
        {demos.map((demo) => (
          <li key={demo.publicId}>
            <Link href={`/demos/${demo.publicId}`}>{demo.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
