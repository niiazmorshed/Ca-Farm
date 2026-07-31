begin;

-- Founders Hub request form gains a fifth field: the requester's organisation
-- website.
--
-- The column is NOT NULL *with a default*, deliberately. This migration runs
-- before the code that fills the field is deployed, so for a short window the
-- live app still inserts without it; a plain NOT NULL would reject those rows
-- and break the public form. The default absorbs them, and rows captured
-- before this field existed get the same placeholder.
--
-- Apply with: node scripts/db-migrate.mjs db/migrations/20260731_request_website.sql

alter table toolkit_requests
  add column if not exists website text not null default '(not captured)';

commit;
