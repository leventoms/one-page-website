# PRD — Four-Tier Product Structure (folding Encore in)

**Status:** Draft for review
**Date:** 2026-08-31
**Owner:** (product owner)
**Scope:** Marketing copy, builder, validation, fulfillment for the four Surprise Pages tiers.

---

## 1. Summary

We are **not** shipping "Encore" (₹499) as a fifth tier. Its features — video, multi-page/chapter
layout, custom theme colors, priority delivery, and PIN delivery — are folded into the existing
four tiers, gated by **duration** and **quantity** limits rather than sold as a separate price point.

The product remains **four one-time tiers**:

| Tier | Price | Fulfillment |
|------|-------|-------------|
| Simple Wish | ₹99 | self-serve |
| Memory Lane | ₹199 | self-serve |
| Time Capsule | ₹299 | self-serve (most loved) |
| White Glove | from ₹999 | designer-built, custom quote |

## 2. Why (decisions & rationale)

- **No standalone Encore.** ₹499 sits in a dead zone between ₹299 and ₹999, cannibalizing both,
  and adds a fifth choice at a price point where decision paralysis already hurts. Video and
  chapters are *features*, not a tier.
- **Gate by quantity + duration.** For video/photos/sections these limits map to real
  storage/bandwidth cost, so they are honest guardrails, not arbitrary marketing levers.
- **Duration is the self-serve lever.** Lower tiers ladder on video *duration* (cheap to enforce);
  White Glove switches to a **quantity-only** cap with **unbounded duration** because a human is in
  the loop and can sanity-check.
- **White Glove is generous, not unlimited.** "Unlimited" is a cost and scope liability. The framing
  is *"generous limits, and if you need more we'll quote it"* — the cap becomes the start of a
  conversation, which is on-brand for a custom tier.
- **PIN delivery is universal**, not tier-gated — it's a zero-cost trust signal.
- **Priority delivery is White Glove only** — it's meaningless on instant self-serve tiers.

## 3. Tier feature matrix (target)

| Feature | Simple Wish ₹99 | Memory Lane ₹199 | Time Capsule ₹299 | White Glove ₹999+ |
|---|---|---|---|---|
| Photos | 1 | up to 10 | up to 15 | up to 60 *(more on request)* |
| Video | — | 1 clip, ~30s | 1 clip, ~60s | a few clips (~3–5), **any length** |
| Song / voice note | — | ✓ | ✓ | ✓ |
| Sections / chapters | single page | single page | 2–3 | up to ~8 chapters |
| Countdown lock | — | — | ✓ | ✓ (optional) |
| Custom theme colors | fixed accent | fixed accent | ✓ custom | ✓ custom |
| PIN delivery | ✓ | ✓ | ✓ | ✓ |
| Priority delivery | — | — | — | ✓ (2-hour) |
| Fulfillment | self-serve | self-serve | self-serve | designer-built |

Numbers are the recommended defaults and are the owner's to tune. The **structure** is what matters:
each White Glove cap is a clear step above Time Capsule (justifying the ₹999 jump) while still being
a real ceiling, with a custom-quote escape hatch above it.

## 4. Current state → gap analysis

Grounded in the code as it exists today:

| Area | Current (code) | Target (this PRD) | Change needed |
|---|---|---|---|
| Registered self-serve tiers | tier1/2/3 in `template-registry.ts`; tier4 manual-only | same 4-tier shape | none structurally |
| Simple Wish photos | `photoUrls` min 1 **max 3** (`validation.ts:18`) | 1 photo | tighten to 1 *(confirm)* |
| Memory Lane photos | `memories` min 2 **max 6** (`validation.ts:32`) | up to 10 | raise cap to 10 |
| Time Capsule photos | `photoUrls` min 1 **max 5** (`validation.ts:42`) | up to 15 | raise cap to 15 |
| Video | **none anywhere** | upload + embed, per matrix | new: upload→Supabase storage, embed allowlist, player |
| Theme colors | fixed 5-value enum `ALLOWED_ACCENT_COLORS` | custom picker for TC+ | new: free/expanded color for tier3 |
| Sections / chapters | single page per tier | TC 2–3, WG ~8 | new: multi-section builder + template |
| PIN | 4-digit PIN in `createOrderInputSchema` | universal (already is) | keep; surface as "PIN delivery" in UX |
| Priority delivery | none | WG only | ops process, not code (SLA copy + flag) |
| Marketing copy | says "Unlimited photos & sections" (`content.ts:161`) | "generous / more on request" | copy edit |
| Marketing copy | Memory Lane "up to 10" already (`content.ts:134`) | matches target | none |

## 5. Feature specs

### 5.1 Video

**Decision:** Both paths are supported — **self-hosted upload** *and* **external embed** (paste a
YouTube/Vimeo-style link). The builder offers both as input options.

Guiding principle: **we limit what we host, not what we link.** Duration/size caps exist to control
*our* storage and bandwidth cost, so they apply only to uploaded video, not to embeds.

**Self-hosted (upload):**
- Stored in Supabase Storage (already in the stack).
- **Duration + file-size limits enforced client-side (builder) and server-side (validation):**
  Memory Lane ~30s, Time Capsule ~60s. White Glove: **quantity-capped (~3–5), no duration cap.**
- Accept a small set of formats (e.g. mp4/webm); reject oversized files before upload.

**Embed (external link):**
- No storage cost to us, so **no duration limit** — length is the provider's problem, not ours.
- **Quantity** still counts toward the tier's clip cap (1 on ML/TC; a few on WG).
- **Security (required):** allowlist providers, validate/normalize the URL to a canonical embed URL,
  render via a sandboxed iframe. Never inject a raw user-supplied URL into markup. Treat the pasted
  link as untrusted input.

**Consequence to accept:** an embedded link on Memory Lane can be longer than the ~30s upload cap.
That's intentional and consistent with the principle above — an embed costs us nothing, so we don't
police its length. The duration ladder governs *hosted* video only.

### 5.2 Custom theme colors
- Time Capsule and White Glove get custom color selection beyond the current fixed 5-color enum.
- Simple Wish / Memory Lane keep the curated `ALLOWED_ACCENT_COLORS` set (on-brand, no effort).
- Constrain the picker (e.g. hue with brand-safe saturation/lightness) so pages can't look broken.

### 5.3 PIN delivery (universal)
- Every tier already sets a 4-digit PIN. Productize the *delivery UX* from the delivery-flow demo:
  success screen + confirmation email + pre-written WhatsApp share, with **link and PIN sent as two
  separate messages**. No tier gating.

### 5.4 Priority delivery (White Glove only)
- A 2-hour SLA promise on the designer-built tier. This is an **ops/process** commitment plus copy —
  no self-serve pipeline change. Track against the manual-request flow.

## 6. Out of scope
- A fifth "Encore" tier (explicitly cut).
- Unlimited anything.
- Priority delivery on self-serve tiers.
- Video duration caps on White Glove.

## 7. Open questions (must resolve before build)
1. ~~**Video hosting**~~ — **Resolved:** support both self-hosted upload *and* external embed. Duration
   caps apply to uploads only; embeds are quantity-gated, any length (see §5.1). Remaining sub-item:
   which embed providers to allowlist (YouTube, Vimeo, …?).
2. **Simple Wish photo count** — code allows 3, marketing says "one photo". Lock to 1, or keep 3?
3. **Exact caps** — confirm the recommended numbers (10 / 15 / 60 photos; ~30s / ~60s upload video; 8 chapters).
4. **Custom theme scope** — full color picker vs. an expanded curated palette for TC+?
5. **Multi-section builder** — how much builder rework is acceptable for TC's 2–3 sections in this pass?

## 8. Rollout suggestion
1. Copy-only changes first (kill "unlimited", align caps) — low risk, ships immediately.
2. Raise photo caps in `validation.ts` + builders (ML→10, TC→15).
3. Custom theme colors for TC+.
4. Video (after §7.1 is decided) — largest effort.
5. Multi-section/chapters + White Glove generous caps + priority-delivery ops copy.

