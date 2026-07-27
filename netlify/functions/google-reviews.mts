import type { Context } from "@netlify/functions";
import { fetchGoogleReviewFeed } from "../lib/google-reviews.js";
import { jsonResponse } from "../lib/http.js";

export default async (request: Request, _context: Context) => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? "";
  const placeId = process.env.GOOGLE_PLACE_ID?.trim() ?? "";
  if (!apiKey || !placeId) {
    return jsonResponse(
      { configured: false, reviews: [], googleMapsUri: "" },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  }

  try {
    const feed = await fetchGoogleReviewFeed({ apiKey, placeId });
    return jsonResponse(
      { configured: true, ...feed },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=21600, stale-while-revalidate=86400",
          "Netlify-CDN-Cache-Control":
            "public, durable, s-maxage=21600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error(
      "Google review sync failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return jsonResponse(
      {
        configured: true,
        unavailable: true,
        reviews: [],
        googleMapsUri: "",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
