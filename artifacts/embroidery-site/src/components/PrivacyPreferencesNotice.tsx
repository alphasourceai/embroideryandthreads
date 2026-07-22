import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Lock from "lucide-react/dist/esm/icons/lock";
import X from "lucide-react/dist/esm/icons/x";
import { Link, useLocation } from "wouter";
import { usePrivacyPreferences } from "@/context/PrivacyPreferencesContext";
import {
  EMPTY_PRIVACY_SELECTION,
  type PrivacyPreferenceSelection,
} from "@/lib/privacy-preferences";

type PreferenceRowProps = {
  checked: boolean;
  description: string;
  id: string;
  label: string;
  locked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function PreferenceRow({
  checked,
  description,
  id,
  label,
  locked = false,
  onCheckedChange,
}: PreferenceRowProps) {
  const labelId = `privacy-preference-${id}-label`;
  const descriptionId = `privacy-preference-${id}-description`;

  return (
    <section className="privacy-preference-row">
      <div>
        <div className="privacy-preference-heading">
          <h3 id={labelId}>{label}</h3>
          {locked && <Lock aria-hidden="true" />}
        </div>
        <p id={descriptionId}>{description}</p>
      </div>
      <div className="privacy-preference-control">
        <button
          className="privacy-switch"
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={locked}
          onClick={() => onCheckedChange?.(!checked)}
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          data-state={checked ? "checked" : "unchecked"}
        >
          <span aria-hidden="true" />
        </button>
        <span>{locked ? "Always on" : checked ? "Enabled" : "Disabled"}</span>
      </div>
    </section>
  );
}

export default function PrivacyPreferencesNotice() {
  const [location] = useLocation();
  const {
    allowAll,
    closePreferences,
    hasSavedPreferences,
    preferences,
    preferencesOpen,
    rejectOptional,
    savePreferences,
    openPreferences,
  } = usePrivacyPreferences();
  const [draft, setDraft] = useState<PrivacyPreferenceSelection>(
    EMPTY_PRIVACY_SELECTION,
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preferencesOpen) return;
    setDraft({
      analytics: preferences?.analytics ?? false,
      marketingAttribution: preferences?.marketingAttribution ?? false,
      savedInquiryFollowUp: preferences?.savedInquiryFollowUp ?? false,
    });
  }, [preferences, preferencesOpen]);

  useEffect(() => {
    if (!preferencesOpen) return;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.getElementById("root");
    const previousAriaHidden = appRoot?.getAttribute("aria-hidden");
    const wasInert = appRoot?.hasAttribute("inert") ?? false;
    document.body.style.overflow = "hidden";
    appRoot?.setAttribute("aria-hidden", "true");
    appRoot?.setAttribute("inert", "");

    const frame = window.requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("button:not([disabled])")
        ?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreferences();
        return;
      }
      if (event.key !== "Tab") return;

      const controls = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (appRoot) {
        if (previousAriaHidden == null) appRoot.removeAttribute("aria-hidden");
        else appRoot.setAttribute("aria-hidden", previousAriaHidden);
        if (!wasInert) appRoot.removeAttribute("inert");
      }
    };
  }, [closePreferences, preferencesOpen]);

  if (location === "/insights") return null;

  return (
    <>
      {!hasSavedPreferences && (
        <section
          aria-hidden={preferencesOpen}
          aria-label="Privacy choices"
          className={`privacy-banner${preferencesOpen ? " is-hidden" : ""}`}
          data-testid="privacy-banner"
        >
          <div className="privacy-banner-inner">
            <div className="privacy-banner-copy">
              <span className="privacy-banner-kicker">
                Your privacy, your choice
              </span>
              <h2>Privacy choices</h2>
              <p>
                We use optional site analytics and traffic-source measurement.
                You can also allow unfinished inquiry details to be saved so
                Embroidery &amp; Threads can follow up. Essential security and
                form functions always remain active.
              </p>
            </div>
            <div className="privacy-banner-actions">
              <button
                className="privacy-button privacy-button-primary"
                type="button"
                onClick={allowAll}
              >
                Allow all
              </button>
              <button
                className="privacy-button"
                type="button"
                onClick={openPreferences}
              >
                Configure preferences
              </button>
              <Link href="/privacy" className="privacy-policy-link">
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      )}

      {preferencesOpen &&
        createPortal(
          <div
            className="privacy-dialog-overlay"
            onClick={closePreferences}
            data-testid="privacy-dialog-overlay"
          >
            <div
              ref={dialogRef}
              className="privacy-dialog"
              data-testid="privacy-preferences-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-dialog-title"
              aria-describedby="privacy-dialog-description"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="privacy-dialog-close"
                type="button"
                onClick={closePreferences}
                aria-label="Close privacy preferences"
              >
                <X aria-hidden="true" />
              </button>
              <div className="privacy-dialog-header">
                <span className="script-accent">your choices</span>
                <h2 id="privacy-dialog-title">Configure privacy preferences</h2>
                <p id="privacy-dialog-description">
                  Choose which optional site features Embroidery &amp; Threads
                  may use on this device. Essential functions are always
                  enabled.
                </p>
              </div>

              <div className="privacy-preference-list">
                <PreferenceRow
                  checked
                  description="Required for site security, spam prevention, preference storage, and core form functionality."
                  id="essential"
                  label="Essential"
                  locked
                />
                <PreferenceRow
                  checked={draft.analytics}
                  description="Records anonymous page visits and contact-form progress so the site experience can be measured and improved."
                  id="analytics"
                  label="Site analytics"
                  onCheckedChange={(analytics) =>
                    setDraft((current) => ({ ...current, analytics }))
                  }
                />
                <PreferenceRow
                  checked={draft.marketingAttribution}
                  description="Records the referring website with analytics events so traffic sources and future marketing results can be understood."
                  id="marketing-attribution"
                  label="Marketing attribution"
                  onCheckedChange={(marketingAttribution) =>
                    setDraft((current) => ({
                      ...current,
                      marketingAttribution,
                    }))
                  }
                />
                <PreferenceRow
                  checked={draft.savedInquiryFollowUp}
                  description="Allows a valid name, email, project category, and message entered in an unfinished inquiry to be saved for up to 30 days for follow-up."
                  id="saved-inquiry-follow-up"
                  label="Saved inquiry follow-up"
                  onCheckedChange={(savedInquiryFollowUp) =>
                    setDraft((current) => ({
                      ...current,
                      savedInquiryFollowUp,
                    }))
                  }
                />
              </div>

              <div className="privacy-dialog-actions">
                <button
                  className="privacy-button"
                  type="button"
                  onClick={allowAll}
                >
                  Allow all
                </button>
                <button
                  className="privacy-button"
                  type="button"
                  onClick={rejectOptional}
                >
                  Reject optional
                </button>
                <button
                  className="privacy-button privacy-button-primary"
                  type="button"
                  onClick={() => savePreferences(draft)}
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
