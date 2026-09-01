import { NextRequest, NextResponse } from 'next/server';
import { submitManualRequest } from '@/lib/manual-requests';
import { manualRequestInputSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = manualRequestInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const result = await submitManualRequest(parsed.data);
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err) {
    console.error('Failed to save manual request', err);
    return NextResponse.json({ error: 'Could not submit request' }, { status: 500 });
  }
}
