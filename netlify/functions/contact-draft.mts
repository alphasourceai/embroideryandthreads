import type { Context } from "@netlify/functions";
import {
  deleteDraft,
  DRAFT_RETENTION_DAYS,
  saveDraft,
  type SavedDraft,
} from "../lib/data.js";
import {
  cleanText,
  hasAllowedOrigin,
  isOpaqueId,
  readJsonBody,
} from "../lib/http.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST" && request.method !== "DELETE") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!hasAllowedOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;
    if (!isOpaqueId(body.id)) {
      return new Response("Invalid draft", { status: 400 });
    }

    if (request.method === "DELETE") {
      await deleteDraft(body.id as string);
      return new Response(null, { status: 204 });
    }

    if (cleanText(body.botField, 120)) {
      return new Response(null, { status: 204 });
    }
    if (body.consent !== true) {
      return new Response("Consent required", { status: 400 });
    }

    const now = new Date();
    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    if (!name || !emailPattern.test(email)) {
      return new Response("Name and valid email required", { status: 400 });
    }

    const draft: SavedDraft = {
      id: body.id as string,
      status: "saved",
      name,
      email,
      category: cleanText(body.category, 80),
      message: cleanText(body.message, 4_000),
      consentedAt: cleanText(body.consentedAt, 40) || now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() + DRAFT_RETENTION_DAYS * 86_400_000,
      ).toISOString(),
    };

    await saveDraft(draft);
    return Response.json(
      { saved: true, updatedAt: draft.updatedAt, expiresAt: draft.expiresAt },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
};
