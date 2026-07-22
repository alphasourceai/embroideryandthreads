import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    if (location === "/insights") return;
    trackAnalyticsEvent("page_view");
  }, [location]);

  return null;
}
