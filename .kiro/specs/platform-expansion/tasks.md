# Implementation Plan: Platform Expansion

## Overview

Extends Surprise Pages into a two-layer platform. Layer 0 (Tasks 1–8) ships the platform shell — auth, middleware, admin panel, rate limiting, audit, and shared utilities. Layer A (Tasks 9–11, 21) adds the reports and takedown module. Layer B (Task 12) adds real policy pages. Layer C (Tasks 13–20) adds the subscription-gated mature section. All work is additive; no existing public tier flows are modified.

---

## Tasks

### Layer 0 — Platform Shell

- [x] 1. Dependencies, environment variables, and migration structure
  - Add to `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAILS` (comma-separated), `ADMIN_ALERT_EMAIL`
  - Create `supabase/migrations/` directory
  - Move current `supabase/schema.sql` content into `supabase/migrations/001_initial_schema.sql`
  - Rewrite `supabase/schema.sql` as a snapshot file with a comment: "Auto-generated snapshot — do not edit directly. Edit migrations instead."
  - Update README setup section to reference migrations directory and new env vars
  - Verify `npx tsc --noEmit` passes with zero errors
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Supabase client factories
  - [x] 2.1 Create `src/platform/supabase/browser.ts` with `getSupabaseBrowserClient()` singleton using `createBrowserClient` from `@supabase/ssr` and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [x] 2.2 Create `src/platform/supabase/server.ts` with `getSupabaseSessionClient()` using `createServerClient` from `@supabase/ssr` with `cookies()` from `next/headers`; cookie `set` and `remove` callbacks are no-ops (middleware owns writes)
  - [x] 2.3 Create barrel `src/platform/supabase/index.ts` exporting both functions
  - [ ]* 2.4 Write unit test verifying `getSupabaseBrowserClient()` returns the same reference on repeated calls (singleton property)
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Middleware, route guard config, and auth callback
  - [x] 3.1 Create `src/platform/routes.ts` exporting `PROTECTED_ROUTES: Array<{ prefix: string; role: 'user' | 'admin' }>` = `[{ prefix: '/mature', role: 'user' }, { prefix: '/admin', role: 'admin' }]`
  - [x] 3.2 Create `src/middleware.ts`: refreshes session using `@supabase/ssr` `createServerClient` with full cookie read+write. Calls `supabase.auth.getUser()`. For routes matching a protected prefix: no session → redirect to `/login?next={pathname}`; admin prefix + non-admin role → `return new NextResponse(null, { status: 404 })`
  - [x] 3.3 Create `src/app/auth/callback/route.ts`: GET handler; validate `next` param (must start with `/` AND must NOT start with `//`; fallback to `/`); call `supabase.auth.exchangeCodeForSession(code)`; redirect to validated `next`
  - [ ]* 3.4 Write property test for `next` param validation: for any string that does not start with `/` or starts with `//`, the resolved path is always `/`
    - **Property 1: Open-redirect prevention**
    - **Validates: Requirements 3.4, 4.1**
  - [ ]* 3.5 Write unit tests: protected route redirects unauthenticated user; admin prefix returns 404 for non-admin
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Login page and magic link
  - [x] 4.1 Create `src/components/auth/LoginForm.tsx` ('use client'): email input + submit; calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: NEXT_PUBLIC_SITE_URL + '/auth/callback?next=' + next } })`; 60-second client-side cooldown; two states — form and "Check your inbox"; styled with `sp-form`, `sp-input`, `sp-btn` CSS classes
  - [x] 4.2 Create `src/app/(site)/login/page.tsx` (Server Component): check session → redirect to validated `next` if logged in; render `<LoginForm next={next} />`; export `generateMetadata` returning `{ robots: 'noindex' }`
  - [ ]* 4.3 Write unit test: login page redirects already-authenticated user to `next`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 5. Checkpoint — Ensure auth flow compiles and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Role system and auth helpers
  - [x] 6.1 Create `src/platform/auth.ts`:
    - Define `AuthRequiredError` (status 401), `AdminRequiredError` (status 404), `AdminMfaRequiredError` (status 403 + redirectTo)
    - Implement `requireUser()`: calls `getSupabaseSessionClient().auth.getUser()`, returns User or throws `AuthRequiredError`
    - Implement `requireAdmin()`: calls `requireUser()`, checks `user.app_metadata.role === 'admin'` (throws `AdminRequiredError` if not), checks `aal_level === 'aal2'` via `supabase.auth.getAuthenticatorAssuranceLevel()` (throws `AdminMfaRequiredError` if aal1)
  - [x] 6.2 Create `scripts/grant-admin.ts`: reads `ADMIN_EMAILS` and `SUPABASE_SERVICE_ROLE_KEY`; validates each email format; looks up user by email via admin API; calls `supabase.auth.admin.updateUserById(id, { app_metadata: { role: 'admin' } })`
  - [ ]* 6.3 Write unit tests: `requireUser()` throws for missing session; `requireAdmin()` throws `AdminRequiredError` for non-admin; throws `AdminMfaRequiredError` for aal1 admin
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 22.1, 22.2, 22.3_

- [x] 7. Admin MFA (TOTP)
  - [x] 7.1 Create `src/app/admin/security/page.tsx`: MFA enrollment status page; calls `supabase.auth.mfa.enroll()` to display QR code; unenroll option
  - [x] 7.2 Create `src/app/admin/security/challenge/page.tsx`: TOTP input form; on submit calls `supabase.auth.mfa.challengeAndVerify({ factorId, code })`; redirects to `/admin` on success
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 8. Shared platform utilities
  - [x] 8.1 Create `src/platform/with-api.ts`: `withApi(schema, handler)` wrapper that (1) parses JSON body against Zod schema → 400 on failure; (2) calls `handler(validatedData, request)`; (3) maps error types: `AuthRequiredError` → 401, `AdminRequiredError` → 404, `AdminMfaRequiredError` → 403, `ZodError` → 422, generic `Error` → 500 (message hidden, logged server-side)
  - [x] 8.2 Create `src/platform/email.ts`: `sendEmail(to: string, subject: string, text: string): Promise<void>` using the same Resend fetch pattern as `src/lib/email.ts` without modifying that file
  - [x] 8.3 Create `supabase/migrations/002_rate_limit_buckets.sql` with the `rate_limit_buckets` table (key text, window_start bigint, count integer, PRIMARY KEY (key, window_start))
  - [x] 8.4 Create `src/platform/rate-limit.ts`: `rateLimit(key, limit, windowSeconds): Promise<boolean>` using upsert on `rate_limit_buckets` with service-role client; window_start = `Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds`; returns true if under limit
  - [x] 8.5 Create `src/platform/audit.ts`: `audit(entry: AuditEntry): Promise<void>` writing to `admin_actions` using service-role client; never throws; logs on error
  - [ ]* 8.6 Write property test for `withApi` error mapping: for each error class, the response status matches the mapping
  - [ ]* 8.7 Write property test for rate limit key isolation: exhausting limit for key A has no effect on key B
    - **Property 2: Rate limit key isolation**
    - **Validates: Requirements 7.6, 10.3**
  - [ ]* 8.8 Write property test for `audit()` never-throws: for any failing Supabase insert, `audit()` resolves without throwing
    - **Property 3: Audit never throws**
    - **Validates: Requirements 7.7, 24.2**
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

- [x] 9. Admin shell
  - [x] 9.1 Create `src/platform/admin-nav.ts`: `ADMIN_NAV: Array<{ label: string; href: string }>` = `[{ label: 'Dashboard', href: '/admin' }]`
  - [x] 9.2 Create `src/app/admin/layout.tsx` (Server Component): calls `requireAdmin()`; two-column layout with sidebar from `ADMIN_NAV` + content slot; dark styling distinct from marketing site; `generateMetadata` returns `{ robots: 'noindex, nofollow' }`
  - [x] 9.3 Create `src/app/admin/page.tsx`: dashboard with placeholder count cards for orders, reports, subscriptions, and manual requests using Supabase count queries
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 10. Checkpoint — Ensure platform shell is complete, all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

### Layer A — Module: Reports and Takedown

- [ ] 11. Reports schema
  - [-] 11.1 Create `supabase/migrations/003_reports.sql`: add `disabled boolean NOT NULL DEFAULT false`, `disabled_reason text`, `disabled_at timestamptz`, `contact_email text` columns to `orders`; create `reports` table with constrained `reason` and `status` enums; enable RLS on `reports`
  - [-] 11.2 Create `supabase/migrations/004_audit_log.sql`: create `admin_actions` table with `admin_id uuid REFERENCES auth.users(id)`, `action`, `target_type`, `target_id`, `details jsonb`, `created_at`; enable RLS
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 12. Report submission API and disabled page check
  - [~] 12.1 Create `src/modules/reports/lib.ts` with functions: `createReport(input)`, `notifyReport(report, order)` (emails `ADMIN_ALERT_EMAIL`; `[URGENT]` prefix for `reason=minor`), `getOpenReports(): Promise<ReportWithOrder[]>`, `disableOrder(slug, reason, adminId)` (sets disabled fields, actions open reports, calls `audit()`), `dismissReport(reportId, adminId)` (sets `status='dismissed'`, calls `audit()`)
  - [~] 12.2 Create `src/app/api/reports/route.ts`: `withApi`-wrapped POST with schema `{ orderId: uuid, reason: enum, details?: string max 500, reporterEmail?: email }`; rate limit 5/IP/10min; calls `createReport()` then best-effort `notifyReport()`; always returns `{ ok: true }` — never reveals if orderId exists
  - [~] 12.3 Update `src/app/p/[slug]/page.tsx`: after `getOrderWithPin()`, if `order.disabled === true`, return `<main>This page is no longer available.</main>` without rendering template or config; add `<ReportLink orderId={order.id} />` to the published page view (not in preview mode)
  - [~] 12.4 Create `src/components/reports/ReportModal.tsx` ('use client'): reason dropdown, optional details textarea (max 500 chars), optional email, content policy link; POST to `/api/reports`; shows confirmation on success; no login required
  - [~] 12.5 Create `src/components/reports/ReportLink.tsx` ('use client'): "Report this page" link that opens `ReportModal`
  - [ ]* 12.6 Write property test: for any orderId value (valid, invalid, random), POST /api/reports returns `{ ok: true }` with HTTP 200
    - **Property 4: Report opacity**
    - **Validates: Requirements 10.1**
  - [ ]* 12.7 Write property test: for any sequence of 6+ requests from the same IP in one window, requests 6+ return HTTP 429
    - **Property 5: Report rate limiting**
    - **Validates: Requirements 10.3**
  - [ ]* 12.8 Write property test: for any order with `disabled=true` and any config, the `/p/[slug]` response never includes template-rendered output
    - **Property 6: Disabled page content isolation**
    - **Validates: Requirements 10.5**
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 13. Admin report queue and order management
  - [~] 13.1 Append to `ADMIN_NAV` in `src/platform/admin-nav.ts`: `{ label: 'Reports', href: '/admin/reports' }`, `{ label: 'Orders', href: '/admin/orders' }`
  - [~] 13.2 Create `src/app/admin/reports/page.tsx` (Server Component): open reports queue; each row shows order preview link, reason, details, reporter email, timestamp; Disable and Dismiss action buttons; pagination
  - [~] 13.3 Create `src/app/admin/orders/page.tsx` (Server Component): all orders across all tiers; columns: slug, tier (color-coded badge), status, created_at, paid_at, contact_email, disabled flag, report count; filter by tier/status/date range; actions: View, Disable, Re-enable, View reports
  - [~] 13.4 Create `src/app/api/admin/orders/[slug]/disable/route.ts`: `withApi` POST, `requireAdmin()`, calls `disableOrder()`, returns `{ ok: true }`
  - [~] 13.5 Create `src/app/api/admin/orders/[slug]/enable/route.ts`: `withApi` POST, `requireAdmin()`, clears `disabled` fields, calls `audit()`, returns `{ ok: true }`
  - [~] 13.6 Create `src/app/api/admin/reports/[id]/dismiss/route.ts`: `withApi` POST, `requireAdmin()`, calls `dismissReport()`, returns `{ ok: true }`
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 14. Manual requests admin page
  - [~] 14.1 Append to `ADMIN_NAV`: `{ label: 'Manual Requests', href: '/admin/manual-requests' }`
  - [~] 14.2 Create `src/app/admin/manual-requests/page.tsx` (Server Component): all `manual_requests` rows with tier, recipient name, contact email, optional fields, status; status-update action per row
  - [~] 14.3 Create `src/app/api/admin/manual-requests/[id]/status/route.ts`: `withApi` POST with schema `{ status: 'new' | 'in_progress' | 'delivered' }`, `requireAdmin()`, updates status field, calls `audit()`, returns `{ ok: true }`
  - _Requirements: 21.1, 21.2_

- [~] 15. Checkpoint — Ensure reports module is complete, all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

### Layer B — Module: Policy Pages

- [ ] 16. Content policy and real legal pages
  - [ ] 16.1 Create `src/modules/policy/content.ts` with editable content constants sections: allowed content, prohibited content, report process, 24–48 hour response target, consequences (page disabled, subscription suspended, no refund on violation)
  - [~] 16.2 Create `src/app/(site)/content-policy/page.tsx` using `<LegalPage>` component and constants from `content.ts`
  - [~] 16.3 Update `src/app/(site)/terms/page.tsx`, `refunds/page.tsx`, `privacy/page.tsx` with real placeholder policy copy (not "coming soon")
  - [~] 16.4 Update site footer (in `src/components/Nav.tsx` or footer component) to link `/content-policy`, `/terms`, `/privacy`, `/refunds`; ensure no `noindex` on these pages
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

---

### Layer C — Module: Mature Section

- [ ] 17. Mature section schema
  - [~] 17.1 Create `supabase/migrations/005_mature_section.sql`: add `mature_section boolean NOT NULL DEFAULT false`, `user_id uuid REFERENCES auth.users(id)`, `policy_accepted_at timestamptz` columns and `orders_user_id_idx` index to `orders`; update `manual_requests` tier constraint to include `'mature1'`, `'mature2'`, `'mature3'`; create `subscription_orders` and `subscriptions` tables with RLS policy "Users read own subscription"
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 21.3_

- [ ] 18. Mature tiers — types, validation, templates
  - [~] 18.1 Extend `src/types.ts`: add `'mature1' | 'mature2' | 'mature3'` to `TemplateTier`; add `Mature1Config`, `Mature2Config`, `Mature3Config`, `Subscription` interfaces; extend `TemplateConfig` discriminated union with mature1/2/3 branches
  - [~] 18.2 Add `imageUrlSchema` to `src/lib/validation.ts`: `z.string().url().refine(url => { try { const u = new URL(url); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } })`; backfill all existing tier photo URL fields to use it
  - [~] 18.3 Add `mature1ConfigSchema` (photoUrls max 5), `mature2ConfigSchema`, `mature3ConfigSchema` (photoUrls max 20, message max 1000) using `EXPANDED_ACCENT_COLORS` to `src/lib/validation.ts`; add to `templateConfigSchema` discriminated union
  - [~] 18.4 Create `src/components/templates/Mature1Template.tsx` (based on `Tier1Template`), `Mature2Template.tsx` (based on `Tier2Template`), `Mature3Template.tsx` (based on `Tier2Template`); wrap output in `<MatureInterstitial>` when `!isPreview`; preserve `referrerPolicy="no-referrer"` and `loading="lazy"` on images
  - [~] 18.5 Register mature templates in `src/lib/templates.ts`: `mature1` (Romantic Wish, 9900), `mature2` (Romantic Memories, 19900), `mature3` (Freeform, 29900)
  - [ ]* 18.6 Write property test for `imageUrlSchema`: for any URL string, schema accepts iff protocol=https: AND no username AND no password
    - **Property 7: imageUrlSchema HTTPS enforcement**
    - **Validates: Requirements 14.4**
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 19. Subscription module
  - [~] 19.1 Create `src/modules/mature/subscriptions.ts`:
    - `getActiveSubscription(userId)`: queries `status='active' AND expires_at > now()` using service-role client; returns `Subscription | null`
    - `createSubscription(input)`: `expires_at = starts_at + 1 year`; on unique constraint violation on `razorpay_payment_id`, re-fetches and returns existing row (idempotent for webhook replays)
    - `suspendSubscription(userId, adminId)`: sets `status='suspended'`, calls `audit()`
    - `reinstateSubscription(userId, adminId)`: sets `status='active'`, calls `audit()`
  - [ ]* 19.2 Write property test for `getActiveSubscription`: for any set of subscription rows, returns null iff no row has `status='active' AND expires_at > now()`
    - **Property 8: Subscription active check correctness**
    - **Validates: Requirements 15.1**
  - [ ]* 19.3 Write property test for `createSubscription` idempotency: calling with same `razorpay_payment_id` twice returns equivalent records without duplicate rows
    - **Property 9: Idempotent subscription creation**
    - **Validates: Requirements 15.2**
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 20. Subscription payment API routes
  - [~] 20.1 Create `src/app/api/subscriptions/pay/route.ts`: `withApi` POST with schema `{ ageDeclared: z.literal(true), policyAccepted: z.literal(true) }`; `requireUser()` → 401; `getActiveSubscription()` → 409 if active; create Razorpay order 9900 paise with receipt `sub_<userId>`; INSERT `subscription_orders` with server-captured `ageDeclaredAt` and `policyAcceptedAt` (never from client); return `{ razorpayOrderId, amountInPaise: 9900, keyId }`
  - [~] 20.2 Create `src/app/api/subscriptions/verify/route.ts`: `withApi` POST with schema `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`; `requireUser()` → 401; fetch `subscription_orders` by `razorpay_order_id`; verify `user_id` matches session user; verify HMAC using `verifyRazorpayPaymentSignature`; mark `subscription_orders.status='paid'`; call `createSubscription()` (idempotent); return `{ ok: true }`
  - [~] 20.3 Extend `src/app/api/webhooks/razorpay/route.ts` with receipt-based dispatch: receipt starts with `sub_` → subscription handler (fetch `subscription_orders` by `razorpay_order_id`, call `createSubscription()` — idempotent); all other receipts → existing `publishOrder()` path; both paths return 500 on unexpected failure for Razorpay retry
  - [ ]* 20.4 Write property test for webhook dispatch: for any receipt string, routes to subscription handler iff `receipt.startsWith('sub_')`, otherwise routes to `publishOrder`
    - **Property 10: Webhook dispatch correctness**
    - **Validates: Requirements 16.4**
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 21. Mature order enforcement in POST /api/orders
  - [~] 21.1 Update `src/app/api/orders/route.ts`: derive `isMature = ['mature1','mature2','mature3'].includes(parsed.data.config.tier)` server-side; if `isMature`: `requireUser()` → 401; `getActiveSubscription()` → 403 'Subscription required'; require `policyAccepted: true` in body → 403 'Policy acceptance required'; capture `policyAcceptedAt = new Date().toISOString()` server-side
  - [~] 21.2 Extend `createOrderInputSchema` in `src/lib/validation.ts`: add `policyAccepted: z.boolean().optional()`, `contactEmail: z.string().email().optional()`
  - [~] 21.3 Extend `createOrder()` in `src/lib/orders.ts`: accept optional `userId`, `policyAcceptedAt`, `matureSection`, `contactEmail` parameters; persist them; public tier orders always receive `userId=null, policyAcceptedAt=null, matureSection=false`
  - [ ]* 21.4 Write property test: for any public tier order creation body (tier1/2/3), stored `userId=null` and `mature_section=false`
    - **Property 13: Public order field defaults**
    - **Validates: Requirements 17.6, 23.2**
  - [ ]* 21.5 Write property test: for any order body, stored `mature_section` equals `config.tier IN ['mature1','mature2','mature3']`
    - **Property 11: Server-side mature_section derivation**
    - **Validates: Requirements 17.1**
  - [ ]* 21.6 Write property test: for any mature order, `policy_accepted_at` stored is a server-generated timestamp (not client-supplied)
    - **Property 12: Policy acceptance timestamp integrity**
    - **Validates: Requirements 17.3, 22.4**
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 23.1, 23.2_

- [~] 22. Checkpoint — Ensure mature payment and enforcement logic is complete, all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. Age gate UI and mature builder pages
  - [~] 23.1 Create `src/components/mature/AgeGate.tsx` ('use client'): Step 1 — two required checkboxes ("I am 18+" and "I agree to content policy [link]"); Step 2 — "Unlock mature section — ₹99/year" button; POST `/api/subscriptions/pay` → Razorpay Checkout widget (Script lazyOnload) → POST `/api/subscriptions/verify` → `router.refresh()`; dark styling (`bg-[#0a0a0c]`, warm accent) distinct from paper-theme
  - [~] 23.2 Create `src/app/(site)/(brand)/mature/page.tsx` (Server Component): hub with three builder cards (`Romantic Wish`, `Romantic Memories`, `Freeform`); server-side subscription check (`getActiveSubscription`); lock icon on cards if no active subscription
  - [~] 23.3 Create `src/app/(site)/(brand)/mature/wish/page.tsx` (Server Component): `requireUser()` → `getActiveSubscription()` check; render `<AgeGate>` if no subscription, `<Mature1Builder>` if subscribed
  - [~] 23.4 Create `src/app/(site)/(brand)/mature/memories/page.tsx` (Server Component): same pattern for `<Mature2Builder>`
  - [~] 23.5 Create `src/app/(site)/(brand)/mature/freeform/page.tsx` (Server Component): same pattern for `<Mature3Builder>`
  - [~] 23.6 Create `src/components/builders/Mature1Builder.tsx`, `Mature2Builder.tsx`, `Mature3Builder.tsx`: same structure as tier builders; reuse `useOrderCheckout` unchanged; required policy checkbox in form; helper text: "Link to an image you own or have permission to share. Explicit nudity isn't permitted — see the content policy."; send `policyAccepted: true` in POST `/api/orders` body
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8_

- [ ] 24. Recipient protections and SEO hardening
  - [~] 24.1 Create `src/components/mature/MatureInterstitial.tsx` ('use client'): "This page contains mature themes. Continue?" with Confirm and Go Back; on confirm: `sessionStorage.setItem('mature_ok', '1')`; on re-visit same session: skipped
  - [~] 24.2 Add `noindex, nofollow` via `generateMetadata` on all `/mature/*` pages and `/admin/*` layout; add `noindex` on `/login` page (already done in Task 4)
  - [~] 24.3 Update `generateMetadata` in `src/app/p/[slug]/page.tsx` to check `order.mature_section` and return `{ robots: 'noindex, nofollow' }` when true
  - [~] 24.4 Add CSP header in `next.config.mjs` via `headers()`: `Content-Security-Policy: img-src 'self' https: data:` applying to all routes
  - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [ ] 25. Admin additions for mature section
  - [~] 25.1 Append to `ADMIN_NAV`: `{ label: 'Subscriptions', href: '/admin/subscriptions' }`
  - [~] 25.2 Create `src/app/admin/subscriptions/page.tsx` (Server Component): look up user by email; display plan, status, starts_at, expires_at, age_declared_at, policy_accepted_at; Suspend and Reinstate buttons
  - [~] 25.3 Create `src/app/api/admin/subscriptions/suspend/route.ts`: `withApi` POST with schema `{ userId: string }`, `requireAdmin()`, calls `suspendSubscription(userId, adminId)`, returns `{ ok: true }`
  - [~] 25.4 Create `src/app/api/admin/subscriptions/reinstate/route.ts`: `withApi` POST with schema `{ userId: string }`, `requireAdmin()`, calls `reinstateSubscription(userId, adminId)`, returns `{ ok: true }`
  - [~] 25.5 Update `src/app/admin/reports/page.tsx` to add a repeat-offender section: users with 2+ actioned reports on their orders (joined query: `orders.user_id → reports WHERE status='actioned'`)
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [~] 26. Final checkpoint — Ensure all tests pass and feature is complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional property/unit tests — they can be skipped for a faster MVP but are strongly recommended for security-sensitive paths.
- The existing `src/lib/supabase.ts` (service-role client), `src/lib/email.ts`, and all existing API routes under `src/app/api/orders/`, `src/app/api/verify-payment/`, `src/app/api/manual-requests/`, and `src/app/api/contact/` are NOT modified (except `src/app/api/orders/route.ts` in Task 21 and `src/app/api/webhooks/razorpay/route.ts` in Task 20).
- `src/app/p/[slug]/page.tsx` receives two targeted additions: disabled check (Task 12) and SEO metadata (Task 24).
- `src/lib/orders.ts` receives one targeted extension: optional mature fields (Task 21).
- `src/lib/validation.ts` receives one targeted extension: imageUrlSchema + mature schemas (Task 18).
- `src/lib/templates.ts` receives one targeted extension: mature template registration (Task 18).
- `src/types.ts` receives one targeted extension: mature types + Subscription interface (Task 18).
- Layers 0+A+B (Tasks 1–16) can ship independently before the mature section — they improve the public platform immediately.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1"] },
    { "id": 2, "tasks": ["2.3", "2.4", "3.2", "3.3"] },
    { "id": 3, "tasks": ["3.4", "3.5", "4.1", "8.1", "8.2", "8.3"] },
    { "id": 4, "tasks": ["4.2", "4.3", "6.1", "8.4", "8.5"] },
    { "id": 5, "tasks": ["6.2", "6.3", "7.1", "8.6", "8.7", "8.8"] },
    { "id": 6, "tasks": ["7.2", "9.1"] },
    { "id": 7, "tasks": ["9.2", "9.3", "11.1", "11.2"] },
    { "id": 8, "tasks": ["12.1", "13.1", "14.1"] },
    { "id": 9, "tasks": ["12.2", "12.3", "12.4", "12.5", "13.2", "13.3", "14.2"] },
    { "id": 10, "tasks": ["12.6", "12.7", "12.8", "13.4", "13.5", "13.6", "14.3"] },
    { "id": 11, "tasks": ["16.1"] },
    { "id": 12, "tasks": ["16.2", "16.3", "16.4", "17.1"] },
    { "id": 13, "tasks": ["18.1"] },
    { "id": 14, "tasks": ["18.2"] },
    { "id": 15, "tasks": ["18.3", "18.4"] },
    { "id": 16, "tasks": ["18.5", "18.6", "19.1"] },
    { "id": 17, "tasks": ["19.2", "19.3", "20.1"] },
    { "id": 18, "tasks": ["20.2", "20.3"] },
    { "id": 19, "tasks": ["20.4", "21.1", "21.2", "21.3"] },
    { "id": 20, "tasks": ["21.4", "21.5", "21.6", "23.1"] },
    { "id": 21, "tasks": ["23.2", "23.3", "23.4", "23.5"] },
    { "id": 22, "tasks": ["23.6", "24.1", "24.2", "25.1"] },
    { "id": 23, "tasks": ["24.3", "24.4", "25.2"] },
    { "id": 24, "tasks": ["25.3", "25.4", "25.5"] }
  ]
}
```
