# Contact enquiries

The form posts to `/api/contact`. The server validates the fields, saves a private
enquiry in Supabase, then optionally sends a notification to **uwummie@gmail.com**
through Resend. Replies go to the visitor's email. No email app is needed when
direct submission is configured. No new npm dependency is required.

## Enable storage

1. Apply `supabase/migrations/20261110000000_contact_enquiries.sql` using your
   existing migration workflow or the Supabase SQL Editor.
2. In the Next.js hosting environment and local `.env.local`, set:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET_KEY
   ```

   The URL is already configured locally. Get a secret key from Supabase Project
   Settings → API Keys. A legacy `SUPABASE_SERVICE_ROLE_KEY` also works. Keep
   either key server-only; never give it a `NEXT_PUBLIC_` prefix.
3. Restart the local server or redeploy the site after setting these variables.

## Enable email notifications

The sender domain `urmichakraborty.com` is verified in Resend (DNS managed by
Cloudflare). Create a Resend sending API key, then add these server-only variables
to the same Next.js environment:

```dotenv
RESEND_API_KEY=YOUR_RESEND_KEY
CONTACT_FROM_EMAIL="Urmi Portfolio <hello@urmichakraborty.com>"
```

The recipient is fixed to uwummie@gmail.com in server code. `CONTACT_FROM_EMAIL`
must be an address on your verified Resend domain, not the visitor's address or
an unverified Gmail sender. See [Resend's send-email API](https://resend.com/docs/api-reference/emails/send-email).

## Behavior and verification

- Without storage credentials, the visitor gets an email draft link and copyable
  brief addressed to uwummie@gmail.com. Their form entries remain intact.
- With storage enabled, a successful save shows confirmation and clears the form.
- Without Resend credentials, submissions are saved with `notification_status =
  'disabled'`. Review them in the Supabase Table Editor.
- Email outages leave the message saved with status `failed`. No automatic retry
  worker is installed. Check `failed`, `pending`, and `disabled` rows in the Table
  Editor; `sent` means Resend accepted the notification, not confirmed inbox delivery.
- Row Level Security and explicit grants prevent public users from reading,
  inserting, or updating enquiries directly. Only the server key can call the RPC.
  See [Supabase's RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).
- The database allows three messages per email per rolling hour, including across
  server instances. A honeypot catches basic bots; this does not stop bots rotating
  email addresses. Add a CAPTCHA if the public form attracts abuse.

After configuring, submit a real message from the site. Confirm its row in
`contact_enquiries`, check its notification status, and verify arrival and Reply
in Gmail. Failure-path unit tests use mocked services and send no emails:
`node --test tests/contact.test.mjs`.
