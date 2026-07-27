begin;

-- Use fineanswer2025@gmail.com as the sole admin address for every future
-- password or OAuth signup.
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
    case when lower(new.email) = 'fineanswer2025@gmail.com'
         then 'admin' else 'client' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Promote the requested account and demote the former admin. Privileged server
-- guards read profiles directly, so this takes effect before either JWT refreshes.
update public.profiles
   set role = case
     when lower(email) = 'fineanswer2025@gmail.com' then 'admin'
     else 'client'
   end
 where lower(email) in (
   'fineanswer2025@gmail.com',
   'idublinfourir@gmail.com'
 );

commit;
