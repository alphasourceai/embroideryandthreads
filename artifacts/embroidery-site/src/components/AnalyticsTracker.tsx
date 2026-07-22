import { useEffect } from "react";
import { useLocation } from "wouter";
import { usePrivacyPreferences } from "@/context/PrivacyPreferencesContext";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const [location] = useLocation();
  const { analyticsEnabled } = usePrivacyPreferences();

  useEffect(() => {
    if (!analyticsEnabled || location === "/insights") return;
    trackAnalyticsEvent("page_view");
  }, [analyticsEnabled, location]);

  return null;
}
