-- A signed-in customer owns the orders they create. Existing anonymous orders
-- intentionally remain unassigned: there is no safe way to infer ownership.
alter table orders add column if not exists owner_id uuid references auth.users(id) on delete set null;
create index if not exists orders_owner_created_idx on orders (owner_id, created_at desc);
