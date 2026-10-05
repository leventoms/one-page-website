-- Admin audit log. Written only from server-side code using the service role.
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
