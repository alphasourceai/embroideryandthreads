import { Link } from "wouter";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

export default function SiteFooter() {
  return (
    <footer className="storybook-footer">
      <span className="script-accent">Embroidery & Threads</span>
      <p>
        Castle Rock, CO · Local Pickup Only ·{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>{" "}
        · <Link href="/privacy">Privacy</Link>
      </p>
      <p className="footer-copyright">
        © {new Date().getFullYear()} Embroidery & Threads. All rights reserved.
      </p>
    </footer>
  );
}
