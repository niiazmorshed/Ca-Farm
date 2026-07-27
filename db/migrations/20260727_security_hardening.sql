begin;

-- Persist fixed-window public-action limits without storing raw identifiers.
create table if not exists public.request_rate_limits (
  action       text not null,
  key_hash     text not null,
  window_start timestamptz not null,
  count        integer not null default 1 check (count > 0),
  primary key (action, key_hash, window_start)
);

create index if not exists request_rate_limits_window_idx
  on public.request_rate_limits (window_start);

alter table public.request_rate_limits enable row level security;

comment on table public.request_rate_limits is
  'Hashed server-side action throttles. RLS deny-all is intentional; pg owner access bypasses RLS.';

-- Enforce the application reply cap for every new database write. Historical
-- rows are left unvalidated so an oversized legacy message cannot block DDL.
do $$ begin
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.enquiry_messages'::regclass
       and conname = 'enquiry_messages_body_length_check'
  ) then
    alter table public.enquiry_messages
      add constraint enquiry_messages_body_length_check
      check (char_length(body) <= 4000) not valid;
  end if;
end $$;

-- Keep every server-owned table outside the public Supabase API.
alter table public.enquiries enable row level security;
alter table public.enquiry_messages enable row level security;
alter table public.mortgage_products enable row level security;
alter table public.mortgage_settings enable row level security;
alter table public.tax_rates enable row level security;
alter table public.calculator_settings enable row level security;
alter table public.cgt_settings enable row level security;
alter table public.cgt_multipliers enable row level security;
alter table public.rate_audit enable row level security;
alter table public.toolkit_resources enable row level security;

comment on table public.enquiries is
  'Server-only customer enquiries. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.enquiry_messages is
  'Server-only customer conversation data. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.mortgage_products is
  'Server-managed calculator rates. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.mortgage_settings is
  'Server-managed calculator settings. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.tax_rates is
  'Server-managed calculator rates. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.calculator_settings is
  'Server-managed calculator settings. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.cgt_settings is
  'Server-managed CGT settings. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.cgt_multipliers is
  'Server-managed CGT multipliers. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.rate_audit is
  'Server-only rate change history. RLS deny-all is intentional; pg owner access bypasses RLS.';
comment on table public.toolkit_resources is
  'Server-managed public toolkit metadata. RLS deny-all is intentional; pg owner access bypasses RLS.';

-- Restore the documented single-address admin allow-list for future users.
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
    case when lower(new.email) = 'idublinfourir@gmail.com'
         then 'admin' else 'client' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Reconcile the historical second allow-list address. Privileged server guards
-- read this row directly, so demotion is immediate even before its JWT refreshes.
update public.profiles
   set role = 'client'
 where lower(email) = 'fineanswer2025@gmail.com'
   and role = 'admin';

commit;
