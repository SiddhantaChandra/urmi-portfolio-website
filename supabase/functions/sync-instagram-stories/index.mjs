import { SyncError } from "../sync-instagram-stats/instagram.mjs";
import {
  authorizeSync,
  callDatabase,
  credentialForSync,
} from "../sync-instagram-stats/shared.mjs";
import { fetchStoryObservations } from "./stories.mjs";

Deno.serve(async (request) => {
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (!authorizeSync(request)) return new Response(null, { status: 401 });

  const observedAt = new Date().toISOString();
  try {
    const credential = await credentialForSync();
    const { accountId, observations } = await fetchStoryObservations(
      credential,
      observedAt,
    );
    await callDatabase("save_instagram_story_views", {
      new_account_id: accountId,
      new_observations: observations,
      new_observed_at: observedAt,
    });
    return Response.json({ synced: true });
  } catch (error) {
    console.error(
      error instanceof SyncError
        ? error.message
        : "Instagram Story sync failed",
    );
    return Response.json({ synced: false }, { status: 502 });
  }
});
