import type { Context } from "@netlify/functions";
import {
  saveAnalyticsEvent,
  type AnalyticsEvent,
  type AnalyticsEventType,
} from "../lib/data.js";
import {
  cleanText,
  hasAllowedOrigin,
  isOpaqueId,
  readJsonBody,
} from "../lib/http.js";

const eventTypes = new Set<AnalyticsEventType>([
  "page_view",
  "form_started",
  "form_progress",
  "form_abandoned",
]);
const devices = new Set(["desktop", "mobile", "tablet", "unknown"]);

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!hasAllowedOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = (await readJsonBody(request, 4_000)) as Record<
      string,
      unknown
    >;
    if (
      !eventTypes.has(body.type as AnalyticsEventType) ||
      !isOpaqueId(body.id) ||
      !isOpaqueId(body.sessionId)
    ) {
      return new Response("Invalid event", { status: 400 });
    }

    const path = cleanText(body.path, 120);
    if (!path.startsWith("/") || path.includes("?") || path.includes("#")) {
      return new Response("Invalid path", { status: 400 });
    }

    const device = devices.has(body.device as string)
      ? (body.device as AnalyticsEvent["device"])
      : "unknown";
    const completedFields = Number(body.completedFields);
    const event: AnalyticsEvent = {
      id: body.id as string,
      type: body.type as AnalyticsEventType,
      timestamp: new Date().toISOString(),
      sessionId: body.sessionId as string,
      path,
      device,
      ...(cleanText(body.referrerHost, 100)
        ? { referrerHost: cleanText(body.referrerHost, 100) }
        : {}),
      ...(Number.isInteger(completedFields) && completedFields >= 0
        ? { completedFields: Math.min(completedFields, 4) }
        : {}),
      ...(cleanText(body.category, 80)
        ? { category: cleanText(body.category, 80) }
        : {}),
    };

    await saveAnalyticsEvent(event);
    return new Response(null, { status: 204 });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
};
