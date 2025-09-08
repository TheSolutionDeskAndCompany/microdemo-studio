import { NextResponse, type NextRequest } from "next/server";
import { createDemo, listDemos } from "../../store";

export async function GET() {
  try {
    const demos = await listDemos();
    return NextResponse.json({ ok: true, demos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch demos';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { publicId } = await createDemo(json);
    return NextResponse.json({ ok: true, publicId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create demo';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
