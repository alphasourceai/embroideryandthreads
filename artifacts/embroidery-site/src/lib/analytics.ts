import { readPrivacyPreferences } from "@/lib/privacy-preferences";

export type AnalyticsEventName =
  | "page_view"
  | "form_started"
  | "form_progress"
  | "form_abandoned";

type AnalyticsDetails = {
  completedFields?: number;
  category?: string;
};

const SESSION_KEY = "et_analytics_session";
const DRAFT_KEY = "et_contact_draft";
let memorySessionId = "";
let memoryDraftId = "";

function createOpaqueId() {
  return crypto.randomUUID().replaceAll("-", "");
}

function sessionValue(key: string, fallback: () => string) {
  try {
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const value = fallback();
    window.sessionStorage.setItem(key, value);
    return value;
  } catch {
    return fallback();
  }
}

export function getAnalyticsSessionId() {
  if (memorySessionId) return memorySessionId;
  memorySessionId = sessionValue(SESSION_KEY, createOpaqueId);
  return memorySessionId;
}

export function getContactDraftId() {
  if (memoryDraftId) return memoryDraftId;
  memoryDraftId = sessionValue(DRAFT_KEY, createOpaqueId);
  return memoryDraftId;
}

export function clearAnalyticsSessionId() {
  memorySessionId = "";
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage can be unavailable in restrictive browser contexts.
  }
}

function getDeviceType() {
  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (width < 768) return "mobile";
  if (coarse && width < 1180) return "tablet";
  return "desktop";
}

function getReferrerHost() {
  if (!document.referrer) return "";
  try {
    const host = new URL(document.referrer).hostname;
    return host === window.location.hostname ? "" : host;
  } catch {
    return "";
  }
}

export function trackAnalyticsEvent(
  type: AnalyticsEventName,
  details: AnalyticsDetails = {},
  useBeacon = false,
) {
  const preferences = readPrivacyPreferences();
  if (preferences?.analytics !== true) return;

  const payload = JSON.stringify({
    id: createOpaqueId(),
    type,
    sessionId: getAnalyticsSessionId(),
    path: window.location.pathname,
    referrerHost:
      preferences.marketingAttribution === true ? getReferrerHost() : "",
    device: getDeviceType(),
    ...details,
  });

  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/.netlify/functions/analytics-event",
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  void fetch("/.netlify/functions/analytics-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function saveContactDraft(
  form: HTMLFormElement,
  consentedAt: string,
  useBeacon = false,
) {
  if (readPrivacyPreferences()?.savedInquiryFollowUp !== true) {
    return Promise.resolve(false);
  }

  const data = new FormData(form);
  const payload = JSON.stringify({
    id: getContactDraftId(),
    consent: true,
    consentedAt,
    name: data.get("name"),
    email: data.get("email"),
    category: data.get("category"),
    message: data.get("message"),
    botField: data.get("bot-field"),
  });

  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/.netlify/functions/contact-draft",
      new Blob([payload], { type: "application/json" }),
    );
    return Promise.resolve(false);
  }

  return fetch("/.netlify/functions/contact-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  })
    .then((response) => response.ok)
    .catch(() => false);
}

export function deleteContactDraft() {
  let id = memoryDraftId;
  if (!id) {
    try {
      id = window.sessionStorage.getItem(DRAFT_KEY) ?? "";
    } catch {
      id = "";
    }
  }
  if (!id) return Promise.resolve(undefined);

  return fetch("/.netlify/functions/contact-draft", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
    keepalive: true,
  }).catch(() => undefined);
}
