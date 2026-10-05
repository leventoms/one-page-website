import { NextRequest, NextResponse } from 'next/server';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { AuthRequiredError, AdminRequiredError, AdminMfaRequiredError } from '@/platform/auth';

type Handler<T> = (data: T, request: NextRequest) => Promise<NextResponse>;

/**
 * Wraps an API route handler with:
 * 1. JSON body parsing
 * 2. Zod schema validation → 400 with field-level errors
 * 3. Handler invocation
 * 4. Typed error → HTTP status mapping (no internal errors leak to client)
 *
 * All new API routes use withApi. Existing routes are NOT refactored.
 */
export function withApi<T>(
  schema: ZodSchema<T>,
  handler: Handler<T>
) {
  return async (request: NextRequest, context?: unknown): Promise<NextResponse> => {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    try {
      return await handler(parsed.data, request);
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      if (err instanceof AdminMfaRequiredError) {
        return NextResponse.json(
          { error: 'MFA required', redirectTo: '/admin/security/challenge' },
          { status: 403 }
        );
      }
      if (err instanceof AdminRequiredError) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.flatten() },
          { status: 422 }
        );
      }
      console.error('[withApi] Unhandled error:', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
