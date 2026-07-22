import type { Context } from "@netlify/functions";
import { requireInsightsUser } from "../lib/auth.js";
import {
  ANALYTICS_RETENTION_DAYS,
  cleanupExpiredData,
  deleteDraft,
  deleteLead,
  listAnalyticsEvents,
  listDrafts,
  listLeads,
  updateLeadStatus,
  type AnalyticsEvent,
  type LeadStatus,
} from "../lib/data.js";
import {
  hasAllowedOrigin,
  isOpaqueId,
  jsonResponse,
  readJsonBody,
} from "../lib/http.js";

const allowedRanges = new Set([7, 30, 90, 365]);
const leadStatuses = new Set<LeadStatus>(["new", "contacted", "closed"]);

export default async (request: Request, _context: Context) => {
  const authorization = await requireInsightsUser();
  if ("error" in authorization) return authorization.error;

  if (request.method === "GET") {
    await cleanupExpiredData();
    const url = new URL(request.url);
    const requestedDays = Number(url.searchParams.get("days") ?? "30");
    const days = allowedRanges.has(requestedDays) ? requestedDays : 30;
    const cutoff = new Date(Date.now() - days * 86_400_000);
    const [allEvents, leads, drafts] = await Promise.all([
      listAnalyticsEvents(),
      listLeads(),
      listDrafts(),
    ]);
    const events = allEvents.filter(
      ({ timestamp }) => new Date(timestamp) >= cutoff,
    );

    return jsonResponse({
      rangeDays: days,
      generatedAt: new Date().toISOString(),
      retentionDays: ANALYTICS_RETENTION_DAYS,
      summary: summarize(events),
      daily: dailySeries(events, days),
      topPages: ranked(events, "path", "page_view"),
      referrers: ranked(
        events,
        "referrerHost",
        "page_view",
        "Direct / unknown",
      ),
      devices: ranked(events, "device", "page_view"),
      categories: ranked(events, "category", "form_progress", "Not selected"),
      leads: leads.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
      drafts: drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    });
  }

  if (!["PATCH", "DELETE"].includes(request.method)) {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!hasAllowedOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = (await readJsonBody(request, 2_000)) as Record<
      string,
      unknown
    >;
    if (
      !isOpaqueId(body.id) ||
      !["lead", "draft"].includes(body.kind as string)
    ) {
      return new Response("Invalid record", { status: 400 });
    }

    if (request.method === "DELETE") {
      if (body.kind === "lead") await deleteLead(body.id as string);
      else await deleteDraft(body.id as string);
      return new Response(null, { status: 204 });
    }

    if (body.kind !== "lead" || !leadStatuses.has(body.status as LeadStatus)) {
      return new Response("Invalid update", { status: 400 });
    }
    const updated = await updateLeadStatus(
      body.id as string,
      body.status as LeadStatus,
    );
    return updated
      ? jsonResponse({ updated: true })
      : new Response("Not found", { status: 404 });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
};

function summarize(events: AnalyticsEvent[]) {
  const pageViews = events.filter(({ type }) => type === "page_view");
  const sessions = new Set(pageViews.map(({ sessionId }) => sessionId));
  const starts = new Set(
    events
      .filter(({ type }) => type === "form_started")
      .map(({ sessionId }) => sessionId),
  );
  const submissions = events.filter(({ type }) => type === "form_submitted");
  const submittedSessions = new Set(
    submissions.map(({ sessionId }) => sessionId),
  );
  const abandoned = new Set(
    events
      .filter(
        ({ type, sessionId }) =>
          type === "form_abandoned" && !submittedSessions.has(sessionId),
      )
      .map(({ sessionId }) => sessionId),
  );

  return {
    pageViews: pageViews.length,
    sessions: sessions.size,
    formStarts: starts.size,
    submissions: submissions.length,
    abandoned: abandoned.size,
    conversionRate:
      starts.size > 0
        ? Math.round((submissions.length / starts.size) * 1_000) / 10
        : 0,
  };
}

function dailySeries(events: AnalyticsEvent[], days: number) {
  const rows = Array.from({ length: days }, (_, index) => {
    const date = new Date(Date.now() - (days - index - 1) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    return { date, views: 0, submissions: 0 };
  });
  const byDate = new Map(rows.map((row) => [row.date, row]));
  for (const event of events) {
    const row = byDate.get(event.timestamp.slice(0, 10));
    if (!row) continue;
    if (event.type === "page_view") row.views += 1;
    if (event.type === "form_submitted") row.submissions += 1;
  }
  return rows;
}

function ranked(
  events: AnalyticsEvent[],
  field: "path" | "referrerHost" | "device" | "category",
  type: AnalyticsEvent["type"],
  fallback = "Unknown",
) {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (event.type !== type) continue;
    const label = event[field] || fallback;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
