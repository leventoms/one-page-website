import { NextRequest, NextResponse } from 'next/server';
import { createContactNotifier } from '@/lib/composition-root';
import { contactMessageInputSchema } from '@/lib/services/validation';

/**
 * Public contact form endpoint. Thin controller, mirroring the manual-requests
 * route: bad JSON → 400, validation failure → 422, success → 201, anything
 * thrown → 500. There's no database write — the message is handed to the
 * env-selected notifier, which emails the owner when Resend is configured and
 * logs it otherwise.
 */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = contactMessageInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const notifier = createContactNotifier();
    await notifier.notifyContactMessage(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Failed to send contact message', err);
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 });
  }
}
