import { NextResponse } from 'next/server';
import { getDemo } from '../../../store';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ ok: false, error: 'Missing demo ID' }, { status: 400 });
    }

    const data = await getDemo(params.id);
    
    if (!data) {
      return NextResponse.json({ ok: false, error: 'Demo not found' }, { status: 404 });
    }

    // This is public-safe JSON (ensure no PII fields are included)
    return NextResponse.json({ 
      ok: true, 
      demo: {
        ...data,
        // Ensure we're only returning public-safe fields
        steps: data.steps.map(step => ({
          ...step,
          // Filter out any sensitive data
          valueBefore: undefined,
          valueAfter: undefined,
        }))
      } 
    }, {
      status: 200,
      headers: {
        // Cache for 1 hour (3600 seconds)
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching demo:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
