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
