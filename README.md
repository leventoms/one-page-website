# Surprise Pages

Self-serve builder for personalised one-page "surprise" gift links —
birthdays, anniversaries, everyday surprises. India-first (₹ pricing,
Razorpay). Next.js 14 (App Router), TypeScript, Tailwind, Supabase.

Live: https://one-page-website-wine.vercel.app/

## Tiers

| Tier | Price | What it is | Fulfillment |
|---|---|---|---|
| 1 — Simple Wish | ₹99 | One message, one card | Self-serve (`/builder`) or manual |
| 2 — Memory Lane | ₹199 | Scrollable photo + caption sequence | Self-serve (`/builder/tier2`) or manual |
| 3 — Time Capsule | ₹299 | Countdown lock, petal-reveal animation | Self-serve (`/builder/tier3`) or manual |
| 4 — White Glove | From ₹999 | Fully custom | Manual only (`/builder/white-glove`) |

Every tier now has **two fulfillment paths**, not just one:

- **Self-serve ("DIY"):** fill the real builder form → live preview updates
  as you type → pay → page auto-publishes at `/p/[slug]`, no one involved.
- **Manual ("build it for me"):** a much shorter form — just recipient name
  + your email, everything else optional — submits a brief instead of a
  finished config. No payment, no auto-publish. It saves to Supabase and
  emails the owner (via Resend); the owner builds and delivers the page by
  hand. Reachable as a secondary CTA on every self-serve builder, and as
  the only path for Tier 4.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Razorpay + Resend keys
```

Run `supabase/schema.sql` in your Supabase project's SQL editor (creates
both the `orders` and `manual_requests` tables), then:

```bash
npm run dev
```

Register a webhook in the Razorpay dashboard pointing at
`https://yourdomain/api/webhooks/razorpay` for the `payment.captured` event.

**Note:** building inside a network-restricted sandbox will fail on the
`next/font/google` fetch — that's expected, not a real bug; Vercel's build
servers have full internet access. Use `npx tsc --noEmit` as the reliable
check in a restricted environment.

## Self-serve flow

1. Builder page (client form) → `POST /api/orders` → draft order saved,
   slug generated
2. `POST /api/orders/[slug]/pay` → Razorpay order created, Checkout widget
   opens (price looked up server-side from the template registry, never
   trusted from the client)
3. User pays → Razorpay calls `POST /api/webhooks/razorpay`
   (signature-verified via `crypto.timingSafeEqual`) → order marked
   `published`. **This webhook is the only thing that ever publishes a
   page** — the client-side "success" callback is UX only, never a trust
   boundary.
4. `/p/[slug]?pin=XXXX` → server component fetches the order, checks the
   PIN, renders it through the template registry

## Manual ("build it for me") flow

1. Shared `ManualRequestForm` (recipient name + contact email required,
   everything else optional) → `POST /api/manual-requests`
2. `ManualRequestService` saves the request to Supabase first, always —
   then best-effort notifies the owner. A missing/broken notifier can
   never cause a lead to be lost; it just falls back to a console log.
3. Owner reads the `manual_requests` table (or their email, once Resend
   env vars are set), builds the page by hand, sends it to the sender
   directly. No automation past step 2 — that's intentional.

## Project structure

Feature-first: `app/` is routing only, each product surface is a
self-contained folder under `src/features/`, and `src/lib` + `src/types`
hold the framework-agnostic domain core.

```
src/
  app/                      # routes only (App Router)
    (site)/                 # everything under the shared marketing Nav
      layout.tsx            #   <Nav> + font variables
      page.tsx              #   landing page (composes features/marketing)
      landing.css           #   autumn/painterly landing theme (.sp-*)
      builder/              #   self-serve builders (tiers 1-3 + white-glove)
      terms/  refunds/      #   policy pages
    p/[slug]/               # delivered gift page (PIN-gated, no Nav)
    api/                    # order / manual-request / payment endpoints
    layout.tsx  globals.css # root shell + shared paper-theme utilities
  features/
    marketing/              # the landing page, self-contained
      components/{sections,effects,ui}/
      hooks/  content.ts  types.ts  assets.ts  typography.ts
    builder/                # Tier1-3 builder chrome (client forms)
    templates/              # Tier1-3 live-page renderers
    gift/                   # PinGate (recipient PIN entry)
  components/               # genuinely shared: Nav, ManualRequestForm
  lib/                      # domain core: services, repositories,
                            #   composition-root, template-registry, payments
  types/                    # shared TypeScript contracts
```

Imports use the `@/*` alias (→ `src/*`) throughout; a feature reaches
another feature only through its `@/features/*` entry points, never via
relative paths into its internals.

## Where SOLID shows up

| Principle | Where |
|---|---|
| **S**ingle Responsibility | `SlugGenerator` only makes slugs. `OrderService`/`ManualRequestService` only hold their own business rules. `SupabaseOrderRepository`/`SupabaseManualRequestRepository` only talk to Postgres. Each API route is a thin controller that parses input and delegates. |
| **O**pen/Closed | `template-registry.ts` is the only place tiers are listed. Adding a tier means writing a template component + one registry entry — `p/[slug]/page.tsx`, `OrderService`, and the API routes never change. |
| **L**iskov Substitution | Every template component implements `TemplateProps<T>` and can be swapped into the live-page renderer interchangeably. Any future `IOrderRepository`/`INotifier` implementation can replace the Supabase/Resend ones without breaking the services that depend on them. |
| **I**nterface Segregation | `IOrderRepository` only exposes what order-related code needs; `IPaymentGateway` only exposes payment concerns; `INotifier` only exposes "notify about a new manual request." None leak Supabase/Razorpay/Resend SDK types into the domain layer. |
| **D**ependency Inversion | Services depend on interfaces, not concrete classes. `composition-root.ts` is the single place concrete implementations get wired in — everywhere else asks for the abstraction. |

## Design system

Near-black canvas with a single warm orange → pink → purple accent
gradient, used sparingly (CTAs, the "Popular" badge, one highlighted
phrase per section) — everything else stays monochrome. Inter for
display/body, IBM Plex Mono for small uppercase labels. Landing-page
motion (scroll-reveal, hero blobs/petals, hover-lift, CTA sheen) is
routed through a handful of shared keyframes/utilities in `globals.css`
rather than one-off animations per section, and all of it respects
`prefers-reduced-motion`.

## Known gaps to close before real launch

- Razorpay isn't configured in production yet (env vars unset, pending
  KYC) — self-serve order creation works, but paying will 500 until
  that's done. Deliberate placeholder, not a bug.
- No real photo upload — builders currently take raw photo URLs.
- `songUrl` accepts any URL, including streaming embeds — a copyright/ToS
  risk at commercial scale; needs a self-hosted short-clip flow instead.
- `/terms` and `/refunds` are placeholder pages, not real policies —
  Razorpay will require real ones for KYC approval.
- Resend env vars unset by default — manual requests still save fine,
  they just won't email the owner until `RESEND_API_KEY` /
  `RESEND_TO_EMAIL` / `RESEND_FROM_EMAIL` are set.
- Add rate-limiting on `POST /api/orders` and `POST /api/manual-requests`
  to stop spam.
- Add a cron/edge function to expire `draft` orders older than ~24h.
