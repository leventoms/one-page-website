-- Rate limiting buckets table.
-- Used by src/platform/rate-limit.ts for per-key sliding window counting.
-- No RLS needed — only accessible via the service role key.
create table if not exists rate_limit_buckets (
  key          text    not null,
  window_start bigint  not null,
  count        integer not null default 1,
  primary key (key, window_start)
);
