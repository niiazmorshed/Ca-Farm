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

-- Triage state for the admin inbox: new → in_progress → resolved.
-- "if not exists" keeps the migration re-runnable on databases created
-- before the column was introduced.
alter table enquiries add column if not exists status text not null default 'new'
  check (status in ('new', 'in_progress', 'resolved'));

-- ── Ireland mortgage comparison ─────────────────────────────────────────────
-- Lender rate products shown on /tools/ireland, editable in /admin/mortgage-rates
-- so a repricing never needs a code deploy. Seeded below only when empty.

create table if not exists mortgage_products (
  id           bigint generated always as identity primary key,
  lender       text not null,
  name         text not null,
  rate_type    text not null check (rate_type in
    ('variable','fixed-1','fixed-2','fixed-3','fixed-4','fixed-5','fixed-7','fixed-10','fixed-full')),
  rate_percent numeric(5,2) not null check (rate_percent >= 0 and rate_percent < 100),
  aprc_percent numeric(5,2) not null check (aprc_percent >= 0 and aprc_percent < 100),
  max_ltv      numeric(4,3) not null default 0.9 check (max_ltv > 0 and max_ltv <= 1),
  green        boolean not null default false,
  cashback     text,
  -- Variable rate the loan rolls to when the fixed period ends. Null → the
  -- product rate is quoted for the whole term (variables, full-term fixed).
  revert_rate_percent numeric(5,2) check (revert_rate_percent > 0 and revert_rate_percent < 100),
  -- Structured cashback: % of the loan at drawdown and/or a flat € amount.
  -- The free-text `cashback` column stays as the badge/narrative.
  cashback_percent    numeric(5,2) check (cashback_percent > 0 and cashback_percent < 100),
  cashback_flat       numeric(10,2) check (cashback_flat > 0),
  -- Longer offer description shown in the calculator's per-product details.
  details      text,
  -- Which buyer types may use the product: first-time / trading-up / switch / investment.
  audience     text[] not null default '{first-time,trading-up,switch}',
  active       boolean not null default true,
  updated_at   timestamptz not null default now()
);

-- Upgrade path for databases created before the revert-rate / cashback fields.
alter table mortgage_products add column if not exists revert_rate_percent numeric(5,2) check (revert_rate_percent > 0 and revert_rate_percent < 100);
alter table mortgage_products add column if not exists cashback_percent    numeric(5,2) check (cashback_percent > 0 and cashback_percent < 100);
alter table mortgage_products add column if not exists cashback_flat       numeric(10,2) check (cashback_flat > 0);
alter table mortgage_products add column if not exists details             text;

-- Allow 1-year fixed products (constraint predates the fixed-1 rate type).
alter table mortgage_products drop constraint if exists mortgage_products_rate_type_check;
alter table mortgage_products add constraint mortgage_products_rate_type_check check (rate_type in
  ('variable','fixed-1','fixed-2','fixed-3','fixed-4','fixed-5','fixed-7','fixed-10','fixed-full'));

-- Central Bank policy numbers + the "rates as of" label. Single row (id = 1).
create table if not exists mortgage_settings (
  id                  smallint primary key default 1 check (id = 1),
  rates_as_of         text not null,
  lti_first_time      numeric(4,2) not null default 4.0,
  lti_trading_up      numeric(4,2) not null default 3.5,
  max_ltv_owner       numeric(4,3) not null default 0.9,
  max_ltv_investment  numeric(4,3) not null default 0.7,
  max_age_at_end      int not null default 70,
  -- Longest term lenders offer: residential vs buy-to-let/investment.
  max_term_owner      int not null default 35,
  max_term_investment int not null default 25,
  updated_at          timestamptz not null default now()
);

-- Upgrade path for databases created before the per-type term caps existed.
alter table mortgage_settings add column if not exists max_term_owner      int not null default 35;
alter table mortgage_settings add column if not exists max_term_investment int not null default 25;

insert into mortgage_settings (id, rates_as_of)
values (1, 'July 2026')
on conflict (id) do nothing;

-- Seed the July 2026 snapshot, only when the table is empty (re-runnable).
-- revert = variable rate the fixed product rolls to; cb% = cashback % of loan.
insert into mortgage_products
  (lender, name, rate_type, rate_percent, aprc_percent, max_ltv, green, cashback, revert_rate_percent, cashback_percent, audience)
select * from (values
  ('Haven (AIB Group)', '4 Year Fixed',            'fixed-4',    3.20, 3.90, 0.9, true,  null::text,     3.95::numeric, null::numeric, '{first-time,trading-up,switch}'::text[]),
  ('AIB',               '5 Year Fixed',            'fixed-5',    3.25, 3.86, 0.9, true,  null,           3.75, null, '{first-time,trading-up,switch}'),
  ('Avant Money',       'Full-term Fixed',         'fixed-full', 3.40, 3.48, 0.9, false, '1% cashback',  null, 1,    '{first-time,trading-up,switch}'),
  ('Avant Money',       '4 Year Fixed',            'fixed-4',    3.40, 3.70, 0.9, false, '2% cashback',  3.85, 2,    '{first-time,trading-up,switch}'),
  ('Avant Money',       '3 Year Fixed',            'fixed-3',    3.60, 3.80, 0.9, false, null,           3.85, null, '{first-time,trading-up,switch}'),
  ('Avant Money',       '7 Year Fixed',            'fixed-7',    3.45, 3.60, 0.8, false, null,           3.85, null, '{first-time,trading-up,switch}'),
  ('Avant Money',       '10 Year Fixed',           'fixed-10',   3.50, 3.60, 0.8, false, null,           3.85, null, '{first-time,trading-up,switch}'),
  ('Bank of Ireland',   '2 Year Fixed',            'fixed-2',    3.65, 4.00, 0.9, false, '2% cashback',  4.15, 2,    '{first-time,trading-up,switch}'),
  ('Bank of Ireland',   '4 Year Fixed',            'fixed-4',    3.45, 3.90, 0.9, false, '2% cashback',  4.15, 2,    '{first-time,trading-up,switch}'),
  ('Bank of Ireland',   'Standard Variable',       'variable',   4.15, 4.30, 0.9, false, null,           null, null, '{first-time,trading-up,switch}'),
  ('PTSB',              '3 Year Fixed',            'fixed-3',    3.70, 4.10, 0.9, false, '2% cashback',  4.70, 2,    '{first-time,trading-up,switch}'),
  ('PTSB',              '5 Year Fixed',            'fixed-5',    3.60, 4.00, 0.9, false, '2% cashback',  4.70, 2,    '{first-time,trading-up,switch}'),
  ('AIB',               'Standard Variable',       'variable',   3.75, 3.90, 0.9, false, null,           null, null, '{first-time,trading-up,switch}'),
  ('Haven (AIB Group)', 'Variable',                'variable',   3.95, 4.10, 0.9, false, null,           null, null, '{first-time,trading-up,switch}'),
  ('ICS Mortgages',     '3 Year Fixed',            'fixed-3',    3.95, 4.20, 0.9, false, null,           4.30, null, '{first-time,trading-up,switch}'),
  ('ICS Mortgages',     'Buy-to-Let 5 Year Fixed', 'fixed-5',    4.55, 4.80, 0.7, false, null,           5.00, null, '{investment}'),
  ('Avant Money',       'Buy-to-Let Variable',     'variable',   4.75, 4.90, 0.7, false, null,           null, null, '{investment}'),
  ('Bank of Ireland',   'Buy-to-Let 2 Year Fixed', 'fixed-2',    4.65, 4.90, 0.7, false, null,           4.95, null, '{investment}')
) as seed(lender, name, rate_type, rate_percent, aprc_percent, max_ltv, green, cashback, revert_rate_percent, cashback_percent, audience)
where not exists (select 1 from mortgage_products);

-- Backfill revert/cashback for rows seeded before those fields existed.
-- Only touches nulls, so admin edits are never overwritten (re-runnable).
update mortgage_products p
   set revert_rate_percent = coalesce(p.revert_rate_percent, b.revert),
       cashback_percent    = coalesce(p.cashback_percent, b.cb)
  from (values
    ('Haven (AIB Group)', '4 Year Fixed',            3.95::numeric, null::numeric),
    ('AIB',               '5 Year Fixed',            3.75, null),
    ('Avant Money',       'Full-term Fixed',         null, 1),
    ('Avant Money',       '4 Year Fixed',            3.85, 2),
    ('Avant Money',       '3 Year Fixed',            3.85, null),
    ('Avant Money',       '7 Year Fixed',            3.85, null),
    ('Avant Money',       '10 Year Fixed',           3.85, null),
    ('Bank of Ireland',   '2 Year Fixed',            4.15, 2),
    ('Bank of Ireland',   '4 Year Fixed',            4.15, 2),
    ('PTSB',              '3 Year Fixed',            4.70, 2),
    ('PTSB',              '5 Year Fixed',            4.70, 2),
    ('ICS Mortgages',     '3 Year Fixed',            4.30, null),
    ('ICS Mortgages',     'Buy-to-Let 5 Year Fixed', 5.00, null),
    ('Bank of Ireland',   'Buy-to-Let 2 Year Fixed', 4.95, null)
  ) as b(lender, name, revert, cb)
 where p.lender = b.lender and p.name = b.name
   and (p.revert_rate_percent is null or p.cashback_percent is null);

-- ── Ireland income tax calculator rates ─────────────────────────────────────
-- One JSONB row per tax year holding the full YearRates config (income tax
-- bands/credits, USC, PRSI, pension relief), editable in /admin/tax-rates so
-- a Budget change never needs a deploy. The hardcoded RATES_<year> configs in
-- app/lib/ireland-income-tax.ts are the fallback when a row is missing or
-- fails validation. JSON has no Infinity: open-ended upper bounds (last USC
-- band, last pension age band) are stored as null.

create table if not exists tax_rates (
  year       smallint primary key,
  rates      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ── Auth: profiles, roles and the admin allow-list ──────────────────────────
-- Tracks what is live in Supabase (originally created in the dashboard SQL
-- editor). Re-runnable. One profile row per auth.users row; `role` drives the
-- /admin vs /portal split (see app/lib/supabase/guards.ts).

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Security-definer helper lives outside `public` so PostgREST never exposes it.
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Users read their own profile; admins read all.
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
  for select using (auth.uid() = id or private.is_admin());

-- The auth server needs to read roles when stamping JWT claims (token hook).
drop policy if exists auth_admin_read_roles on public.profiles;
create policy auth_admin_read_roles on public.profiles
  for select to supabase_auth_admin using (true);

-- Creates the profile row on signup. THE ADMIN EMAIL ALLOW-LIST LIVES HERE —
-- add an email to the `in (...)` list to make that account an admin from its
-- first login. Existing accounts instead need:
--   update public.profiles set role = 'admin' where lower(email) = '<email>';
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    case when lower(new.email) in ('idublinfourir@gmail.com', 'fineanswer2025@gmail.com')
         then 'admin' else 'client' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Stamps the `user_role` claim into every JWT so the app can authorise from
-- the locally-verified token. Must also be enabled in the Supabase dashboard:
-- Authentication → Hooks → Custom Access Token → this function.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path to ''
as $$
declare
  claims jsonb := coalesce(event -> 'claims', '{}'::jsonb);
  v_role text;
begin
  begin
    select role into v_role
      from public.profiles
     where id = (event ->> 'user_id')::uuid;
  exception when others then
    v_role := null;
  end;

  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(v_role, 'client')));
  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;

-- ── Entrepreneur Toolkits ────────────────────────────────────────────────────
-- Downloadable resources (memos, templates, tax/VAT forms, setup guides) shown
-- on /toolkits, managed in /admin/toolkits. Files live in the public Supabase
-- Storage bucket "toolkits"; rows can also point at an external URL instead
-- (file_path null = nothing to delete from storage).

create table if not exists toolkit_resources (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text,
  category    text not null check (category in
    ('memo','template','tax-form','vat-form','guide','other')),
  file_url    text not null,
  -- Storage object path inside the "toolkits" bucket; null for external links.
  file_path   text,
  -- Original filename shown on the download button.
  file_name   text,
  -- Accounting framework badge (FRS 102 / FRS 101 / IFRS …); null when N/A.
  framework   text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Upgrade path for databases created before the framework badge existed.
alter table toolkit_resources add column if not exists framework text;

create index if not exists toolkit_resources_category_idx
  on toolkit_resources (category, created_at desc);

-- Public bucket for the files. Public buckets serve objects without RLS checks
-- and uploads only happen server-side with the service role. Wrapped so a
-- restricted DB role can still run the rest of this file.
do $$ begin
  insert into storage.buckets (id, name, public)
  values ('toolkits', 'toolkits', true)
  on conflict (id) do nothing;
exception when others then
  raise notice 'skipping toolkits bucket creation: %', sqlerrm;
end $$;
