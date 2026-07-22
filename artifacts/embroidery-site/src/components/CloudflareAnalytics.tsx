import { useEffect } from "react";
import { usePrivacyPreferences } from "@/context/PrivacyPreferencesContext";

const SCRIPT_ID = "cloudflare-web-analytics";

export default function CloudflareAnalytics() {
  const { analyticsEnabled } = usePrivacyPreferences();

  useEffect(() => {
    const existing = document.getElementById(SCRIPT_ID);
    if (!analyticsEnabled) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({
      token: "0426be7b65964727a92e7368ad4d9c50",
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, [analyticsEnabled]);

  return null;
}
