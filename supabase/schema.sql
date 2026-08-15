-- Run this in the Supabase SQL editor (or via migration tooling later).

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft'
    check (status in ('draft', 'previewing', 'paid', 'published', 'expired')),
  config jsonb not null,
  price_in_paise integer not null,
  pin_code text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_slug_idx on orders (slug);
create index if not exists orders_status_idx on orders (status);

-- Row Level Security: no direct client access. All reads/writes go through
-- the server (service role key), so the browser can never query this table
-- directly, even with the anon key.
alter table orders enable row level security;

-- "Build it for me" leads — the manual/concierge fulfillment path that now
-- sits alongside the self-serve builder for every tier (not just Tier 4).
-- Deliberately looser than `orders`: no config jsonb, no pin, no payment
-- columns, because nothing here gets rendered or published automatically —
-- a human reads this row and builds the page by hand.
create table if not exists manual_requests (
  id uuid primary key default gen_random_uuid(),
  tier text not null check (tier in ('tier1', 'tier2', 'tier3', 'tier4')),
  recipient_name text not null,
  contact_email text not null,
  sender_name text,
  occasion text,
  message text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'delivered')),
  created_at timestamptz not null default now()
);

create index if not exists manual_requests_status_idx on manual_requests (status);
create index if not exists manual_requests_created_at_idx on manual_requests (created_at desc);

alter table manual_requests enable row level security;
