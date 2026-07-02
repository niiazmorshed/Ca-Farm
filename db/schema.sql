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

-- ── Ireland mortgage comparison ─────────────────────────────────────────────
-- Lender rate products shown on /tools/ireland, editable in /admin/mortgage-rates
-- so a repricing never needs a code deploy. Seeded below only when empty.

create table if not exists mortgage_products (
  id           bigint generated always as identity primary key,
  lender       text not null,
  name         text not null,
  rate_type    text not null check (rate_type in
    ('variable','fixed-2','fixed-3','fixed-4','fixed-5','fixed-7','fixed-10','fixed-full')),
  rate_percent numeric(5,2) not null check (rate_percent >= 0 and rate_percent < 100),
  aprc_percent numeric(5,2) not null check (aprc_percent >= 0 and aprc_percent < 100),
  max_ltv      numeric(4,3) not null default 0.9 check (max_ltv > 0 and max_ltv <= 1),
  green        boolean not null default false,
  cashback     text,
  -- Which buyer types may use the product: first-time / trading-up / switch / investment.
  audience     text[] not null default '{first-time,trading-up,switch}',
  active       boolean not null default true,
  updated_at   timestamptz not null default now()
);

-- Central Bank policy numbers + the "rates as of" label. Single row (id = 1).
create table if not exists mortgage_settings (
  id                 smallint primary key default 1 check (id = 1),
  rates_as_of        text not null,
  lti_first_time     numeric(4,2) not null default 4.0,
  lti_trading_up     numeric(4,2) not null default 3.5,
  max_ltv_owner      numeric(4,3) not null default 0.9,
  max_ltv_investment numeric(4,3) not null default 0.7,
  max_age_at_end     int not null default 70,
  updated_at         timestamptz not null default now()
);

insert into mortgage_settings (id, rates_as_of)
values (1, 'July 2026')
on conflict (id) do nothing;

-- Seed the July 2026 snapshot, only when the table is empty (re-runnable).
insert into mortgage_products
  (lender, name, rate_type, rate_percent, aprc_percent, max_ltv, green, cashback, audience)
select * from (values
  ('Haven (AIB Group)', '4 Year Fixed',            'fixed-4',    3.20, 3.90, 0.9, true,  null::text,     '{first-time,trading-up,switch}'::text[]),
  ('AIB',               '5 Year Fixed',            'fixed-5',    3.25, 3.86, 0.9, true,  null,           '{first-time,trading-up,switch}'),
  ('Avant Money',       'Full-term Fixed',         'fixed-full', 3.40, 3.48, 0.9, false, '1% cashback',  '{first-time,trading-up,switch}'),
  ('Avant Money',       '4 Year Fixed',            'fixed-4',    3.40, 3.70, 0.9, false, '2% cashback',  '{first-time,trading-up,switch}'),
  ('Avant Money',       '3 Year Fixed',            'fixed-3',    3.60, 3.80, 0.9, false, null,           '{first-time,trading-up,switch}'),
  ('Avant Money',       '7 Year Fixed',            'fixed-7',    3.45, 3.60, 0.8, false, null,           '{first-time,trading-up,switch}'),
  ('Avant Money',       '10 Year Fixed',           'fixed-10',   3.50, 3.60, 0.8, false, null,           '{first-time,trading-up,switch}'),
  ('Bank of Ireland',   '2 Year Fixed',            'fixed-2',    3.65, 4.00, 0.9, false, '2% cashback',  '{first-time,trading-up,switch}'),
  ('Bank of Ireland',   '4 Year Fixed',            'fixed-4',    3.45, 3.90, 0.9, false, '2% cashback',  '{first-time,trading-up,switch}'),
  ('Bank of Ireland',   'Standard Variable',       'variable',   4.15, 4.30, 0.9, false, null,           '{first-time,trading-up,switch}'),
  ('PTSB',              '3 Year Fixed',            'fixed-3',    3.70, 4.10, 0.9, false, '2% cashback',  '{first-time,trading-up,switch}'),
  ('PTSB',              '5 Year Fixed',            'fixed-5',    3.60, 4.00, 0.9, false, '2% cashback',  '{first-time,trading-up,switch}'),
  ('AIB',               'Standard Variable',       'variable',   3.75, 3.90, 0.9, false, null,           '{first-time,trading-up,switch}'),
  ('Haven (AIB Group)', 'Variable',                'variable',   3.95, 4.10, 0.9, false, null,           '{first-time,trading-up,switch}'),
  ('ICS Mortgages',     '3 Year Fixed',            'fixed-3',    3.95, 4.20, 0.9, false, null,           '{first-time,trading-up,switch}'),
  ('ICS Mortgages',     'Buy-to-Let 5 Year Fixed', 'fixed-5',    4.55, 4.80, 0.7, false, null,           '{investment}'),
  ('Avant Money',       'Buy-to-Let Variable',     'variable',   4.75, 4.90, 0.7, false, null,           '{investment}'),
  ('Bank of Ireland',   'Buy-to-Let 2 Year Fixed', 'fixed-2',    4.65, 4.90, 0.7, false, null,           '{investment}')
) as seed(lender, name, rate_type, rate_percent, aprc_percent, max_ltv, green, cashback, audience)
where not exists (select 1 from mortgage_products);
