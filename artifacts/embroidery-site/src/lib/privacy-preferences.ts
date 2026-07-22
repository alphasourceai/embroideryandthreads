export const PRIVACY_PREFERENCES_STORAGE_KEY =
  "embroideryandthreads:privacy-preferences:v1";

export type PrivacyPreferenceSelection = {
  analytics: boolean;
  marketingAttribution: boolean;
  savedInquiryFollowUp: boolean;
};

export type PrivacyPreferences = PrivacyPreferenceSelection & {
  updatedAt: string;
};

export const EMPTY_PRIVACY_SELECTION: PrivacyPreferenceSelection = {
  analytics: false,
  marketingAttribution: false,
  savedInquiryFollowUp: false,
};

export const ALL_PRIVACY_SELECTION: PrivacyPreferenceSelection = {
  analytics: true,
  marketingAttribution: true,
  savedInquiryFollowUp: true,
};

function isValidTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const timestamp = new Date(value);
  return Number.isFinite(timestamp.getTime());
}

export function parsePrivacyPreferences(
  value: string | null,
): PrivacyPreferences | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<PrivacyPreferences>;
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketingAttribution !== "boolean" ||
      typeof parsed.savedInquiryFollowUp !== "boolean" ||
      !isValidTimestamp(parsed.updatedAt)
    ) {
      return null;
    }
    return parsed as PrivacyPreferences;
  } catch {
    return null;
  }
}

export function readPrivacyPreferences(): PrivacyPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    return parsePrivacyPreferences(
      window.localStorage.getItem(PRIVACY_PREFERENCES_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

export function writePrivacyPreferences(
  selection: PrivacyPreferenceSelection,
): PrivacyPreferences {
  const preferences: PrivacyPreferences = {
    analytics: Boolean(selection.analytics),
    marketingAttribution: Boolean(selection.marketingAttribution),
    savedInquiryFollowUp: Boolean(selection.savedInquiryFollowUp),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      PRIVACY_PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Preferences remain active for this page when storage is unavailable.
  }

  return preferences;
}
