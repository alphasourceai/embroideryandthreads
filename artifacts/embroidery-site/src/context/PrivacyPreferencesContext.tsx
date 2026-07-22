import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ALL_PRIVACY_SELECTION,
  EMPTY_PRIVACY_SELECTION,
  type PrivacyPreferences,
  type PrivacyPreferenceSelection,
  readPrivacyPreferences,
  writePrivacyPreferences,
} from "@/lib/privacy-preferences";
import { clearAnalyticsSessionId, deleteContactDraft } from "@/lib/analytics";

type PrivacyPreferencesContextValue = {
  allowAll: () => void;
  analyticsEnabled: boolean;
  closePreferences: () => void;
  hasSavedPreferences: boolean;
  marketingAttributionEnabled: boolean;
  openPreferences: () => void;
  preferences: PrivacyPreferences | null;
  preferencesOpen: boolean;
  rejectOptional: () => void;
  savePreferences: (selection: PrivacyPreferenceSelection) => void;
  savedInquiryFollowUpEnabled: boolean;
};

const PrivacyPreferencesContext =
  createContext<PrivacyPreferencesContextValue | null>(null);

export function PrivacyPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<PrivacyPreferences | null>(
    () => readPrivacyPreferences(),
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
    window.requestAnimationFrame(() => {
      if (triggerRef.current?.isConnected) triggerRef.current.focus();
    });
  }, []);

  const openPreferences = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }
    setPreferencesOpen(true);
  }, []);

  const savePreferences = useCallback(
    (selection: PrivacyPreferenceSelection) => {
      const next = writePrivacyPreferences(selection);
      if (!next.analytics) clearAnalyticsSessionId();
      if (!next.savedInquiryFollowUp) void deleteContactDraft();
      setPreferences(next);
      closePreferences();
    },
    [closePreferences],
  );

  const allowAll = useCallback(
    () => savePreferences(ALL_PRIVACY_SELECTION),
    [savePreferences],
  );
  const rejectOptional = useCallback(
    () => savePreferences(EMPTY_PRIVACY_SELECTION),
    [savePreferences],
  );

  const value = useMemo<PrivacyPreferencesContextValue>(
    () => ({
      allowAll,
      analyticsEnabled: preferences?.analytics === true,
      closePreferences,
      hasSavedPreferences: preferences !== null,
      marketingAttributionEnabled: preferences?.marketingAttribution === true,
      openPreferences,
      preferences,
      preferencesOpen,
      rejectOptional,
      savePreferences,
      savedInquiryFollowUpEnabled: preferences?.savedInquiryFollowUp === true,
    }),
    [
      allowAll,
      closePreferences,
      openPreferences,
      preferences,
      preferencesOpen,
      rejectOptional,
      savePreferences,
    ],
  );

  return (
    <PrivacyPreferencesContext.Provider value={value}>
      {children}
    </PrivacyPreferencesContext.Provider>
  );
}

export function usePrivacyPreferences() {
  const context = useContext(PrivacyPreferencesContext);
  if (!context) {
    throw new Error(
      "usePrivacyPreferences must be used within PrivacyPreferencesProvider",
    );
  }
  return context;
}
