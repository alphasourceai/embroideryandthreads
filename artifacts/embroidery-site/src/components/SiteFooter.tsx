import { Link } from "wouter";
import { usePrivacyPreferences } from "@/context/PrivacyPreferencesContext";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

export default function SiteFooter() {
  const { openPreferences } = usePrivacyPreferences();

  return (
    <footer className="storybook-footer">
      <span className="script-accent">Embroidery & Threads</span>
      <p>
        Castle Rock, CO · Local Pickup Only ·{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>{" "}
        · <Link href="/pricing">Pricing</Link> · <Link href="/faq">FAQ</Link> ·{" "}
        <Link href="/privacy">Privacy</Link> ·{" "}
        <button
          className="footer-link-button"
          type="button"
          onClick={openPreferences}
        >
          Privacy choices
        </button>
      </p>
      <p className="footer-copyright">
        © {new Date().getFullYear()} Embroidery & Threads. All rights reserved.
      </p>
    </footer>
  );
}
