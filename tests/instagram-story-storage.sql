-- Run after the Story migration on a disposable test database. Rolls back data.
begin;

do $$
declare
  anchor timestamptz := now() - interval '3 days';
  result public.instagram_story_averages%rowtype;
  row_count integer;
begin
  perform public.save_instagram_story_views('123', jsonb_build_array(
    jsonb_build_object('story_id', '1', 'published_at', anchor - interval '23 hours', 'views', 100),
    jsonb_build_object('story_id', '2', 'published_at', anchor - interval '2 hours', 'views', 0),
    jsonb_build_object('story_id', '3', 'published_at', anchor - interval '2 hours', 'views', null)
  ), anchor);
  select * into result from public.instagram_story_averages;
  assert result.average_views is null and result.story_count = 0, 'Active Stories must not enter the average';
  assert result.active_average_views = 50 and result.active_story_count = 2,
    'Active fallback includes available counts and real zeroes only';

  perform public.save_instagram_story_views('123', jsonb_build_array(
    jsonb_build_object('story_id', '1', 'published_at', anchor - interval '23 hours', 'views', 200)
  ), anchor + interval '30 minutes');
  select count(*) into row_count from public.instagram_story_views where account_id = '123';
  assert row_count = 3, 'Hourly observations must update, not append, Story records';

  perform public.save_instagram_story_views('123', '[]', anchor + interval '2 hours');
  select * into result from public.instagram_story_averages;
  assert result.average_views = 200 and result.story_count = 1, 'Expiry must retain the last successful count';
  assert result.active_average_views = 0 and result.active_story_count = 1,
    'An expired Story must leave the active fallback';

  perform public.save_instagram_story_views('123', '[]', anchor + interval '24 hours');
  select * into result from public.instagram_story_averages;
  assert result.average_views = 100 and result.story_count = 2, 'Each expired Story counts once; true zero counts, unavailable data does not';
  assert result.active_average_views is null and result.active_story_count = 0,
    'No active counts must remain after expiry';

  perform public.save_instagram_story_views('123', jsonb_build_array(
    jsonb_build_object('story_id', '1', 'published_at', anchor - interval '23 hours', 'views', null)
  ), anchor + interval '25 hours');
  select * into result from public.instagram_story_averages;
  assert result.average_views = 100, 'A failed insight must not erase the saved count';

  perform public.save_instagram_story_views('123', jsonb_build_array(
    jsonb_build_object('story_id', '1', 'published_at', anchor - interval '23 hours', 'views', 999)
  ), anchor + interval '25 hours');
  perform public.save_instagram_story_views('123', jsonb_build_array(
    jsonb_build_object('story_id', '1', 'published_at', anchor - interval '23 hours', 'views', 1)
  ), anchor + interval '20 hours');
  select * into result from public.instagram_story_averages;
  assert result.average_views = 100, 'Retries and out-of-order runs must not change newer results';

  begin
    perform public.save_instagram_story_views('123', '[{"story_id":"4","published_at":"2020-01-01","views":-1}]', anchor + interval '26 hours');
    raise exception 'Negative counts were accepted';
  exception when raise_exception then
    if sqlerrm = 'Negative counts were accepted' then raise; end if;
  end;
  begin
    perform public.save_instagram_story_views('123', '[{"story_id":"4","published_at":"2020-01-01","views":1.5}]', anchor + interval '26 hours');
    raise exception 'Fractional counts were accepted';
  exception when raise_exception then
    if sqlerrm = 'Fractional counts were accepted' then raise; end if;
  end;

  perform public.save_instagram_story_views('456', jsonb_build_array(
    jsonb_build_object('story_id', '4', 'published_at', anchor - interval '23 hours', 'views', 0)
  ), anchor + interval '26 hours');
  select * into result from public.instagram_story_averages;
  assert result.account_id = '456' and result.average_views = 0 and result.story_count = 1,
    'A different account must not inherit old Story data';
end;
$$;

set local role anon;
do $$
declare
  row_count integer;
begin
  select count(*) into row_count from public.instagram_story_averages;
  assert row_count = 1, 'Public visitors can read the aggregate';
  begin
    perform * from public.instagram_story_views;
    raise exception 'Public visitors could read individual Stories';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.save_instagram_story_views('123', '[]', now());
    raise exception 'Public visitors could write Story data';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
rollback;
