import { timingSafeEqual } from "node:crypto";
import { refreshCredential, SyncError } from "./instagram.mjs";

const encoder = new TextEncoder();
const refreshWindow = 14 * 86_400_000;

export async function callDatabase(operation, args = {}) {
  const url = Deno.env.get("SUPABASE_URL");
  try {
    const secret = JSON.parse(
      Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}",
    ).default;
    const key = secret ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) throw new Error();
    const headers = { apikey: key, "Content-Type": "application/json" };
    if (!secret) headers.Authorization = `Bearer ${key}`;
    const response = await fetch(`${url}/rest/v1/rpc/${operation}`, {
      method: "POST",
      headers,
      body: JSON.stringify(args),
      redirect: "error",
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error();
    return operation === "publish_instagram_mediakit_stats" ||
      operation === "save_instagram_story_views"
      ? null
      : await response.json();
  } catch {
    throw new SyncError(`Database operation failed (${operation})`);
  }
}

async function readCredential() {
  const credential = await callDatabase("read_instagram_mediakit_token");
  const expiry = Date.parse(credential?.expiresAt);
  const requiresExpiry =
    credential?.accountId == null || credential.expiresAt != null;
  if (
    !credential?.accessToken ||
    typeof credential.accessToken !== "string" ||
    (requiresExpiry && !Number.isFinite(expiry))
  ) {
    throw new SyncError(
      "A long-lived Instagram credential is required in Vault",
    );
  }
  if (expiry <= Date.now()) {
    throw new SyncError("Instagram authorization expired. Reconnect @uwummie");
  }
  return credential;
}

export async function credentialForSync() {
  const credential = await readCredential();
  if (
    credential.accountId != null ||
    Date.parse(credential.expiresAt) - Date.now() > refreshWindow
  ) {
    return credential;
  }

  let replacement;
  try {
    replacement = await refreshCredential(credential.accessToken);
  } catch (error) {
    console.warn(
      error instanceof SyncError
        ? error.message
        : "Instagram token refresh failed",
    );
    return credential;
  }

  const saved = await callDatabase("replace_instagram_mediakit_token", {
    previous_expiry: credential.expiresAt,
    replacement,
  });
  return saved ? replacement : await readCredential();
}

export function authorizeSync(request) {
  const expected = Deno.env.get("INSTAGRAM_SYNC_SECRET");
  const supplied = request.headers.get("x-instagram-sync-secret");
  if (!expected || !supplied) return false;
  const actual = encoder.encode(supplied);
  const secret = encoder.encode(expected);
  return actual.length === secret.length && timingSafeEqual(actual, secret);
}
