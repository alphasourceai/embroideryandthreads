import type { FormSubmittedEvent } from "@netlify/functions";
import {
  deleteDraft,
  LEAD_RETENTION_DAYS,
  saveAnalyticsEvent,
  saveLead,
  type SubmittedLead,
} from "../lib/data.js";
import { cleanText, isOpaqueId } from "../lib/http.js";

export default {
  async formSubmitted(event: FormSubmittedEvent) {
    if (event.data["form-name"] !== "contact") return;

    const now = new Date();
    const id = crypto.randomUUID();
    const lead: SubmittedLead = {
      id,
      status: "new",
      name: cleanText(event.data.name, 120),
      email: cleanText(event.data.email, 254).toLowerCase(),
      category: cleanText(event.data.category, 80),
      message: cleanText(event.data.message, 4_000),
      submittedAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() + LEAD_RETENTION_DAYS * 86_400_000,
      ).toISOString(),
    };

    await saveLead(lead);

    const sessionId = isOpaqueId(event.data["analytics-session-id"])
      ? event.data["analytics-session-id"]
      : `submission_${crypto.randomUUID().replaceAll("-", "")}`;
    await saveAnalyticsEvent({
      id: crypto.randomUUID(),
      type: "form_submitted",
      timestamp: now.toISOString(),
      sessionId,
      path: "/",
      device: "unknown",
      completedFields: 4,
      ...(lead.category ? { category: lead.category } : {}),
    });

    const draftId = event.data["saved-draft-id"];
    if (isOpaqueId(draftId)) await deleteDraft(draftId);
  },
};
