import assert from "node:assert/strict";
import test from "node:test";
import { handleContact } from "../app/api/contact/submit.mjs";

const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_fixture",
  RESEND_API_KEY: "re_fixture",
  CONTACT_FROM_EMAIL: "Portfolio <hello@example.com>",
};
const fields = {
  name: " Visitor ",
  email: "visitor@example.com",
  company: "",
  subject: "A collaboration",
  message: "Let’s make something together.",
  website: "",
};
function request(body = fields, origin = "https://portfolio.example") {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}

test("valid enquiries are saved before email; replies go to the visitor", async () => {
  const calls = [];
  const response = await handleContact(request(), env, async (url, options) => {
    calls.push(url);
    const body = JSON.parse(options.body);
    if (url.includes("/rpc/")) {
      assert.equal(options.headers.apikey, env.SUPABASE_SECRET_KEY);
      assert.equal(options.headers.Authorization, undefined);
      assert.equal(body.p_name, "Visitor");
      assert.equal(body.p_company, null);
      return Response.json("fixture-id");
    }
    if (url === "https://api.resend.com/emails") {
      assert.equal(calls.length, 2);
      assert.deepEqual(body.to, ["uwummie@gmail.com"]);
      assert.equal(body.reply_to, fields.email);
      assert.equal(body.from, env.CONTACT_FROM_EMAIL);
      assert.equal(body.subject, `Portfolio enquiry: ${fields.subject}`);
      assert.ok(body.text.includes(fields.message));
      assert.equal(options.headers["Idempotency-Key"], "contact/fixture-id");
      return Response.json({ id: "email-id" });
    }
    assert.equal(options.method, "PATCH");
    assert.equal(body.notification_status, "sent");
    return new Response(null, { status: 204 });
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { received: true });
  assert.equal(calls.length, 3);
});

test("invalid, oversized, cross-origin and honeypot submissions never reach services", async () => {
  const noFetch = () => {
    throw new Error("Must not call services");
  };
  for (const invalid of [
    null,
    [],
    { ...fields, name: "  " },
    { ...fields, subject: "\r\nBcc: attacker@example.com" },
    { ...fields, email: "not-an-email" },
    { ...fields, company: 123 },
    { ...fields, message: "x".repeat(4001) },
  ]) {
    assert.equal(
      (await handleContact(request(invalid), env, noFetch)).status,
      400,
    );
  }
  assert.equal(
    (
      await handleContact(
        request({ ...fields, message: "x".repeat(25000) }),
        env,
        noFetch,
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handleContact(
        request(fields, "https://external.example"),
        env,
        noFetch,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleContact(request({ ...fields, website: "spam" }), env, noFetch))
      .status,
    200,
  );
  assert.equal((await handleContact(request(), {}, noFetch)).status, 503);
});

test("database failures and rate limits cannot trigger email or false success", async () => {
  for (const [code, expected] of [
    ["P0429", 429],
    ["42501", 503],
  ]) {
    let calls = 0;
    const response = await handleContact(request(), env, async (url) => {
      calls++;
      assert.ok(url.includes("/rpc/"));
      return Response.json({ code }, { status: 400 });
    });
    assert.equal(response.status, expected);
    assert.equal(calls, 1);
  }
});

test("a provider outage preserves the saved enquiry and records failed notification", async (t) => {
  t.mock.method(console, "error", () => {});
  const statuses = [];
  const response = await handleContact(request(), env, async (url, options) => {
    if (url.includes("/rpc/")) return Response.json("fixture-id");
    if (url.includes("resend.com")) throw new Error("Provider unavailable");
    statuses.push(JSON.parse(options.body).notification_status);
    return new Response(null, { status: 204 });
  });
  assert.equal(response.status, 201);
  assert.deepEqual(statuses, ["failed"]);
});

test("storage-only setup works with a legacy service key and does not send email", async () => {
  const storageEnv = {
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: "legacy-jwt",
  };
  const response = await handleContact(
    request(),
    storageEnv,
    async (url, options) => {
      assert.ok(!url.includes("resend.com"));
      assert.equal(options.headers.Authorization, "Bearer legacy-jwt");
      if (url.includes("/rpc/")) return Response.json("fixture-id");
      assert.equal(JSON.parse(options.body).notification_status, "disabled");
      return new Response(null, { status: 204 });
    },
  );
  assert.equal(response.status, 201);
});
