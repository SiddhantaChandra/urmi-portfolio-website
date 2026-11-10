create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company text check (char_length(company) <= 160),
  subject text not null check (char_length(btrim(subject)) between 1 and 200),
  message text not null check (char_length(btrim(message)) between 1 and 4000),
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed', 'disabled'))
);

create index contact_enquiries_email_created_idx
  on public.contact_enquiries (email, created_at desc);

-- Contact details and messages are private. Only the server may read/write.
alter table public.contact_enquiries enable row level security;
revoke all on public.contact_enquiries from anon, authenticated;
grant select, insert, update on public.contact_enquiries to service_role;

create function public.submit_contact_enquiry(
  p_name text, p_email text, p_company text, p_subject text, p_message text
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  enquiry_id uuid;
  normalized_email text := lower(btrim(p_email));
begin
  -- Serialize submissions per email so the limit survives concurrent requests
  -- and multiple server instances; do not trust client-side throttling.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(normalized_email, 0));
  if (select count(*) from public.contact_enquiries
      where email = normalized_email and created_at > now() - interval '1 hour') >= 3 then
    raise exception using errcode = 'P0429', message = 'Contact rate limit exceeded';
  end if;
  insert into public.contact_enquiries (name, email, company, subject, message)
  values (btrim(p_name), normalized_email, nullif(btrim(p_company), ''), btrim(p_subject), btrim(p_message))
  returning id into enquiry_id;
  return enquiry_id;
end;
$$;

revoke all on function public.submit_contact_enquiry(text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_contact_enquiry(text, text, text, text, text)
  to service_role;
