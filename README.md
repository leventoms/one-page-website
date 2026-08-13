# Surprise Pages — Tier 1

Production-ready skeleton for the Tier 1 template: builder form → paid order →
live page at `/p/[slug]?pin=1234`. Next.js 14 (App Router), Supabase, Razorpay.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Razorpay keys
```

Run `supabase/schema.sql` in your Supabase project's SQL editor, then:

```bash
npm run dev
```

Visit `/builder` to create a page, `/p/[slug]?pin=XXXX` to view a published one.

Register a webhook in the Razorpay dashboard pointing at
`https://yourdomain/api/webhooks/razorpay` for the `payment.captured` event.

## Flow

1. `/builder` (client form) → `POST /api/orders` → draft order saved, slug generated
2. `POST /api/orders/[slug]/pay` → Razorpay order created, Checkout widget opens
3. User pays → Razorpay calls `POST /api/webhooks/razorpay` (signature-verified)
   → order marked `published`. **This webhook is the only thing that ever
   publishes a page** — the client-side "success" callback is UX only, never
   a trust boundary.
4. `/p/[slug]?pin=XXXX` → server component fetches the order, checks PIN,
   renders it through the template registry

## Where SOLID shows up

| Principle | Where |
|---|---|
| **S**ingle Responsibility | `SlugGenerator` only makes slugs. `OrderService` only holds order business rules. `SupabaseOrderRepository` only talks to Postgres. Each API route is a thin controller that parses input and delegates. |
| **O**pen/Closed | `template-registry.ts` is the only place tiers are listed. Adding Tier 2 means writing `Tier2Template.tsx` + one registry entry — `p/[slug]/page.tsx`, `OrderService`, and the API routes never change. |
| **L**iskov Substitution | Every template component implements `TemplateProps<T>` and can be swapped into the live-page renderer interchangeably. Any future `IOrderRepository` implementation (e.g. a Postgres/Prisma version) can replace `SupabaseOrderRepository` without breaking `OrderService`. |
| **I**nterface Segregation | `IOrderRepository` only exposes what order-related code needs; `IPaymentGateway` only exposes payment concerns. Neither leaks Supabase or Razorpay SDK types into the domain layer. |
| **D**ependency Inversion | `OrderService` depends on `IOrderRepository`/`ISlugGenerator` interfaces, not concrete classes. `composition-root.ts` is the single place concrete implementations get wired in — everywhere else asks for the abstraction. |

## Extending to Tier 2–4

1. Add the config shape to the `TemplateConfig` union in `src/types/order.ts`
2. Add a zod schema in `validation.ts`
3. Build `Tier2Template.tsx` implementing `TemplateProps<Tier2Config>`
4. Register it in `template-registry.ts`
5. Copy `Tier1Builder.tsx` → `Tier2Builder.tsx` for its form

No changes needed in: API routes, `OrderService`, `p/[slug]/page.tsx`,
the repository, or the payment gateway.

## Known gaps to close before real launch

- Razorpay KYC takes time as a solo/unregistered seller — start this early (see Phase 0)
- `songUrl` should point at a self-hosted short clip, not a streaming embed (ToS/copyright risk at commercial scale)
- Add rate-limiting on `POST /api/orders` to stop free-preview spam
- Add a cron/edge function to expire `draft` orders older than ~24h
