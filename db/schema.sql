-- Contact form submissions ("UserCollection" in Mongo terms = a table here).
-- Re-runnable: "if not exists" means running the migration twice is safe.
create table if not exists enquiries (
  id          bigint generated always as identity primary key,
  name        text        not null,
  email       text        not null,
  company     text,
  service     text,
  message     text        not null,
  created_at  timestamptz not null default now()
);

-- Speeds up "newest first" listing in the dashboard / admin.
create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
