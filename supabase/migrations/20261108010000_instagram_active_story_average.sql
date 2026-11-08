-- Show provisional active-Story averages only until completed history exists.
begin;

alter table public.instagram_story_averages
  add column active_average_views double precision check (active_average_views >= 0),
  add column active_story_count integer not null default 0 check (active_story_count >= 0);
create or replace function public.save_instagram_story_views(
  new_account_id text,
  new_observations jsonb,
  new_observed_at timestamptz
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if new_account_id is null or new_account_id !~ '^[0-9]+$'
    or new_observed_at is null or not pg_catalog.isfinite(new_observed_at)
    or new_observed_at > pg_catalog.now() + interval '5 minutes'
    or pg_catalog.jsonb_typeof(new_observations) is distinct from 'array'
  then
    raise exception 'Invalid Story observations';
  end if;

  -- Serialize retries/runs so an older request cannot roll back newer counts.
  perform pg_catalog.pg_advisory_xact_lock(178414, 801);
  if exists (
    select 1 from public.instagram_story_averages
    where username = 'uwummie' and observed_at >= new_observed_at
  ) then
    return;
  end if;

  if exists (
    select 1
    from pg_catalog.jsonb_to_recordset(new_observations)
      as story(story_id text, published_at timestamptz, views numeric)
    where story_id is null or story_id !~ '^[0-9]+$'
      or published_at is null or not pg_catalog.isfinite(published_at)
      or published_at > new_observed_at
      or (views is not null and (
        views < 0 or views > 9007199254740991 or views <> pg_catalog.trunc(views)
      ))
  ) then
    raise exception 'Invalid Story record';
  end if;

  insert into public.instagram_story_views as current_story
    (account_id, story_id, published_at, views, views_observed_at, last_seen_at)
  select new_account_id, story_id, published_at, views::bigint,
    case when views is not null then new_observed_at end, new_observed_at
  from pg_catalog.jsonb_to_recordset(new_observations)
    as story(story_id text, published_at timestamptz, views numeric)
  on conflict (account_id, story_id) do update
    set views = coalesce(excluded.views, current_story.views),
        views_observed_at = coalesce(excluded.views_observed_at, current_story.views_observed_at),
        last_seen_at = excluded.last_seen_at
    where excluded.last_seen_at > current_story.last_seen_at;

  -- Active Stories are still accumulating views. Keep their last successful
  -- counts after expiry, then average each completed Story exactly once.
  insert into public.instagram_story_averages
    (username, account_id, average_views, story_count, observed_at)
  select 'uwummie', new_account_id, avg(views)::double precision,
    count(views)::integer, new_observed_at
  from public.instagram_story_views
  where account_id = new_account_id
    and published_at + interval '24 hours' <= new_observed_at
  on conflict (username) do update
    set account_id = excluded.account_id,
        average_views = excluded.average_views,
        story_count = excluded.story_count,
        observed_at = excluded.observed_at;
  -- Keep provisional active counts separate from completed Story history.
  update public.instagram_story_averages
  set active_average_views = (
        select avg(views)::double precision from public.instagram_story_views
        where account_id = new_account_id
          and published_at + interval '24 hours' > new_observed_at
      ),
      active_story_count = (
        select count(views)::integer from public.instagram_story_views
        where account_id = new_account_id
          and published_at + interval '24 hours' > new_observed_at
      )
  where username = 'uwummie';
end;
$$;

-- Populate the fallback from observations already collected before this migration.
update public.instagram_story_averages as average
set active_average_views = (
      select avg(views)::double precision from public.instagram_story_views as story
      where story.account_id = average.account_id
        and story.published_at + interval '24 hours' > greatest(average.observed_at, now())
    ),
    active_story_count = (
      select count(views)::integer from public.instagram_story_views as story
      where story.account_id = average.account_id
        and story.published_at + interval '24 hours' > greatest(average.observed_at, now())
    );

commit;
