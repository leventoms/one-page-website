-- Auto-generated snapshot — do not edit directly. Run migrations instead.
-- Apply individual files in supabase/migrations/ in order to set up a fresh database.

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
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_slug_idx on orders (slug);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_owner_created_idx on orders (owner_id, created_at desc);

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

create table if not exists rate_limit_buckets (
  key text not null,
  window_start bigint not null,
  count integer not null default 1,
  primary key (key, window_start)
);

create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_actions_target_idx on admin_actions (target_type, target_id);
create index if not exists admin_actions_created_at_idx on admin_actions (created_at desc);

alter table admin_actions enable row level security;
