-- Admin RLS policies (v0 week 1).
-- Per PLAN.md D15: admin allowlist is in the public.config table so Robin
-- can change it from the GUI without touching code. Workers use the
-- service_role key and bypass RLS entirely.

-- Seed an empty allowlist row if missing. The admin UI will populate it.
insert into public.config (key, value)
values ('admin_allowed_emails', '[]'::jsonb)
on conflict (key) do nothing;

-- Helper: returns true if the current authenticated user's email is in the
-- admin_allowed_emails config list. SECURITY DEFINER so it can read the
-- config table even when called from a row-level policy.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select (auth.jwt() ->> 'email') in (
        select jsonb_array_elements_text(value)
        from public.config
        where key = 'admin_allowed_emails'
      )
    ),
    false
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Read-only policies for all pipeline tables for authenticated admins.
do $$
declare
  t text;
begin
  foreach t in array array[
    'config',
    'discovery_run',
    'candidate',
    'candidate_score',
    'seed',
    'crawl_run',
    'document',
    'document_chunk',
    'operator_feedback'
  ]
  loop
    execute format(
      'drop policy if exists "admin can read %1$I" on public.%1$I',
      t
    );
    execute format(
      'create policy "admin can read %1$I" on public.%1$I for select to authenticated using (public.is_admin())',
      t
    );
  end loop;
end $$;

-- Operator-write policies: the admin UI lets Robin tune config and submit
-- feedback. Everything else stays read-only from the admin (pipeline
-- writes happen through workers using service_role).
drop policy if exists "admin can write config" on public.config;
create policy "admin can write config" on public.config
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin can write operator_feedback" on public.operator_feedback;
create policy "admin can write operator_feedback" on public.operator_feedback
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin can update operator_feedback" on public.operator_feedback;
create policy "admin can update operator_feedback" on public.operator_feedback
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin can toggle seed" on public.seed;
create policy "admin can toggle seed" on public.seed
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
