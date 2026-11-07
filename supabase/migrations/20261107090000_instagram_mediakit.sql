create extension if not exists supabase_vault with schema vault;

create table public.instagram_mediakit_stats (
  username text primary key check (username = 'uwummie'),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  observed_at timestamptz not null
);

alter table public.instagram_mediakit_stats enable row level security;
revoke all on public.instagram_mediakit_stats from public, anon, authenticated;
grant select on public.instagram_mediakit_stats to anon, authenticated;

create policy "Read public Instagram aggregates"
  on public.instagram_mediakit_stats for select to anon, authenticated
  using (true);

create function public.read_instagram_mediakit_token()
returns jsonb
language sql
security definer set search_path = ''
as $$
  select decrypted_secret::jsonb
  from vault.decrypted_secrets
  where name = 'instagram_mediakit_token';
$$;

create function public.replace_instagram_mediakit_token(
  previous_expiry timestamptz,
  replacement jsonb
)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  token_id uuid;
  current_expiry timestamptz;
begin
  select id into token_id
  from vault.secrets
  where name = 'instagram_mediakit_token'
  for update;

  select (decrypted_secret::jsonb->>'expiresAt')::timestamptz
  into current_expiry
  from vault.decrypted_secrets
  where id = token_id;

  if current_expiry is null or current_expiry is distinct from previous_expiry then
    return false;
  end if;

  perform vault.update_secret(token_id, replacement::text);
  return true;
end;
$$;

create function public.publish_instagram_mediakit_stats(
  new_snapshot jsonb,
  new_observed_at timestamptz
)
returns void
language sql
security definer set search_path = ''
as $$
  insert into public.instagram_mediakit_stats as current_stats (username, snapshot, observed_at)
  values ('uwummie', new_snapshot, new_observed_at)
  on conflict (username) do update
    set snapshot = excluded.snapshot, observed_at = excluded.observed_at
    where excluded.observed_at > current_stats.observed_at;
$$;

revoke all on function public.read_instagram_mediakit_token() from public, anon, authenticated;
revoke all on function public.replace_instagram_mediakit_token(timestamptz, jsonb) from public, anon, authenticated;
revoke all on function public.publish_instagram_mediakit_stats(jsonb, timestamptz) from public, anon, authenticated;

grant execute on function public.read_instagram_mediakit_token() to service_role;
grant execute on function public.replace_instagram_mediakit_token(timestamptz, jsonb) to service_role;
grant execute on function public.publish_instagram_mediakit_stats(jsonb, timestamptz) to service_role;
