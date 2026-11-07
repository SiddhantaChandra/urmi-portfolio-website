-- Run after the deployed function has published its first verified snapshot.
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'instagram-mediakit-sync',
  '0 9 * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret from vault.decrypted_secrets
      where name = 'instagram_mediakit_project_url'
    ) || '/functions/v1/sync-instagram-stats',
    headers := jsonb_build_object(
      'x-instagram-sync-secret', (
        select decrypted_secret from vault.decrypted_secrets
        where name = 'instagram_mediakit_sync_secret'
      )
    ),
    timeout_milliseconds := 60000
  );
  $$
);
