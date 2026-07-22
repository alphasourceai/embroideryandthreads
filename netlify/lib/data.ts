import { getStore, type Store } from "@netlify/blobs";

export const ANALYTICS_RETENTION_DAYS = 400;
export const DRAFT_RETENTION_DAYS = 30;
export const LEAD_RETENTION_DAYS = 730;

export type AnalyticsEventType =
  | "page_view"
  | "form_started"
  | "form_progress"
  | "form_abandoned"
  | "form_submitted";

export type AnalyticsEvent = {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  sessionId: string;
  path: string;
  referrerHost?: string;
  device: "desktop" | "mobile" | "tablet" | "unknown";
  completedFields?: number;
  category?: string;
};

export type SavedDraft = {
  id: string;
  status: "saved";
  name: string;
  email: string;
  category: string;
  message: string;
  consentedAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type LeadStatus = "new" | "contacted" | "closed";

export type SubmittedLead = {
  id: string;
  status: LeadStatus;
  name: string;
  email: string;
  category: string;
  message: string;
  submittedAt: string;
  expiresAt: string;
};

const analyticsStore = () => getStore("site-analytics-events");
const draftsStore = () =>
  getStore({ name: "contact-drafts", consistency: "strong" });
const leadsStore = () =>
  getStore({ name: "contact-leads", consistency: "strong" });

const dayKey = (timestamp: string) => timestamp.slice(0, 10);

export async function saveAnalyticsEvent(event: AnalyticsEvent) {
  await analyticsStore().setJSON(
    `events/${dayKey(event.timestamp)}/${event.timestamp}-${event.id}`,
    event,
  );
}

export async function saveDraft(draft: SavedDraft) {
  await draftsStore().setJSON(`drafts/${draft.id}`, draft);
}

export async function deleteDraft(id: string) {
  await draftsStore().delete(`drafts/${id}`);
}

export async function saveLead(lead: SubmittedLead) {
  await leadsStore().setJSON(`leads/${lead.id}`, lead);
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const store = leadsStore();
  const lead = await store.get(`leads/${id}`, {
    type: "json",
    consistency: "strong",
  });
  if (!lead || typeof lead !== "object") return false;
  await store.setJSON(`leads/${id}`, { ...lead, status });
  return true;
}

export async function deleteLead(id: string) {
  await leadsStore().delete(`leads/${id}`);
}

async function listJson<T>(store: Store, prefix: string) {
  const { blobs } = await store.list({ prefix });
  const values = await Promise.all(
    blobs.map(async ({ key }) => {
      try {
        return (await store.get(key, { type: "json" })) as T | null;
      } catch {
        return null;
      }
    }),
  );
  return values.filter((value) => value !== null) as T[];
}

export const listAnalyticsEvents = () =>
  listJson<AnalyticsEvent>(analyticsStore(), "events/");

export const listDrafts = () => listJson<SavedDraft>(draftsStore(), "drafts/");

export const listLeads = () => listJson<SubmittedLead>(leadsStore(), "leads/");

export async function cleanupExpiredData(now = new Date()) {
  const analyticsCutoff = new Date(
    now.getTime() - ANALYTICS_RETENTION_DAYS * 86_400_000,
  );
  const [eventEntries, draftEntries, leadEntries] = await Promise.all([
    analyticsStore().list({ prefix: "events/" }),
    draftsStore().list({ prefix: "drafts/" }),
    leadsStore().list({ prefix: "leads/" }),
  ]);

  const staleEventKeys = eventEntries.blobs
    .map(({ key }) => key)
    .filter((key) => {
      const date = key.split("/")[1];
      return Boolean(date) && date < analyticsCutoff.toISOString().slice(0, 10);
    });

  const expiredDraftKeys = await expiredKeys<SavedDraft>(
    draftsStore(),
    draftEntries.blobs.map(({ key }) => key),
    now,
  );
  const expiredLeadKeys = await expiredKeys<SubmittedLead>(
    leadsStore(),
    leadEntries.blobs.map(({ key }) => key),
    now,
  );

  await Promise.all([
    ...staleEventKeys.map((key) => analyticsStore().delete(key)),
    ...expiredDraftKeys.map((key) => draftsStore().delete(key)),
    ...expiredLeadKeys.map((key) => leadsStore().delete(key)),
  ]);
}

async function expiredKeys<T extends { expiresAt: string }>(
  store: Store,
  keys: string[],
  now: Date,
) {
  const rows = await Promise.all(
    keys.map(async (key) => ({
      key,
      value: (await store.get(key, { type: "json" })) as T | null,
    })),
  );
  return rows
    .filter(({ value }) => value && new Date(value.expiresAt) <= now)
    .map(({ key }) => key);
}
