const recipient = "uwummie@gmail.com";
const limits = {
  name: 120,
  email: 254,
  company: 160,
  subject: 200,
  message: 4000,
};

function reply(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function handleContact(
  request,
  env = process.env,
  fetcher = fetch,
) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return reply(
      { error: "Please send your message from the contact form." },
      403,
    );
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return reply({ error: "Please submit the contact form." }, 415);
  }
  // Bound the body before parsing, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: "Your message is empty." }, 400);
  const chunks = [];
  let size = 0;
  let input;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24000) {
        await reader.cancel();
        return reply({ error: "Your message is too long." }, 413);
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply(
      { error: "Couldn’t read your message. Please try again." },
      400,
    );
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return reply({ error: "Please fill out the contact form." }, 400);
  }
  if (input.website) return reply({ received: true });
  const fields = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = input[key] ?? "";
    if (typeof value !== "string" || value.trim().length > max) {
      return reply({ error: `Please check the ${key} field.` }, 400);
    }
    fields[key] = value.trim();
    if (key !== "company" && !fields[key]) {
      return reply({ error: `Please fill in your ${key}.` }, 400);
    }
    if (key !== "message" && (/[\r\n]/.test(value) || value.includes("\0"))) {
      return reply({ error: `Please check the ${key} field.` }, 400);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return reply({ error: "Please enter a valid email address." }, 400);
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return reply({ error: "Direct messaging isn’t available yet." }, 503);
  }
  // Secret and legacy service-role keys stay on the server. New secret keys
  // use apikey; only legacy JWT keys also belong in Authorization.
  const headers = {
    apikey: key,
    ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }),
    "Content-Type": "application/json",
  };
  let id;
  try {
    const saved = await fetcher(`${url}/rest/v1/rpc/submit_contact_enquiry`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        p_name: fields.name,
        p_email: fields.email.toLowerCase(),
        p_company: fields.company || null,
        p_subject: fields.subject,
        p_message: fields.message,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!saved.ok) {
      const failure = await saved.json().catch(() => ({}));
      if (failure.code === "P0429") {
        return reply(
          {
            error:
              "You’ve sent a few messages already. Please try again in an hour or email me directly.",
          },
          429,
        );
      }
      throw new Error("Contact storage failed");
    }
    id = await saved.json();
    if (typeof id !== "string") throw new Error("Missing enquiry ID");
  } catch {
    return reply(
      {
        error:
          "Couldn’t confirm receipt of your message. Please try again or email me directly.",
      },
      503,
    );
  }

  // Storage is the source of truth: an email outage must not lose an enquiry
  // or ask the visitor to resubmit a message that was already received.
  let notificationStatus = "disabled";
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL) {
    notificationStatus = "failed";
    try {
      const sent = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `contact/${id}`,
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: [recipient],
          reply_to: fields.email,
          subject: `Portfolio enquiry: ${fields.subject}`,
          text: `Name: ${fields.name}\nEmail: ${fields.email}\nBrand or company: ${fields.company || "Not provided"}\nSubject: ${fields.subject}\n\n${fields.message}\n\nEnquiry ID: ${id}`,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (sent.ok) notificationStatus = "sent";
    } catch {
      // Keep the saved enquiry even if the provider is unavailable.
    }
  }
  try {
    const updated = await fetcher(
      `${url}/rest/v1/contact_enquiries?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ notification_status: notificationStatus }),
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!updated.ok)
      console.error("Contact notification status could not be recorded", id);
  } catch {
    console.error("Contact notification status could not be recorded", id);
  }
  if (notificationStatus === "failed")
    console.error("Contact email notification failed; enquiry saved", id);
  return reply({ received: true }, 201);
}
