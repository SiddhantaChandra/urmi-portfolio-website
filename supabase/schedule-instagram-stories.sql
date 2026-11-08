-- Apply the Story migration and deploy sync-instagram-stories first.
-- Reuses the existing Vault URL/sync secret. Leaves the daily account job alone.
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'instagram-story-sync',
  '0 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret from vault.decrypted_secrets
      where name = 'instagram_mediakit_project_url'
    ) || '/functions/v1/sync-instagram-stories',
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
