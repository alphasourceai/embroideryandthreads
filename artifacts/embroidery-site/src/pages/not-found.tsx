import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { Link } from "wouter";
import PublicImage from "@/components/PublicImage";
import SiteFooter from "@/components/SiteFooter";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function NotFound() {
  usePageMetadata({
    title: "Page Not Found | Embroidery & Threads",
    description:
      "The requested page could not be found. Return to Embroidery & Threads for custom embroidery in Castle Rock, Colorado.",
    path: window.location.pathname,
    robots: "noindex, nofollow",
  });

  return (
    <div className="storybook-site not-found-page">
      <nav
        className="storybook-nav reviews-nav"
        aria-label="Page not found navigation"
      >
        <div className="nav-inner">
          <Link href="/" className="brand-lockup">
            <PublicImage src="/logo-b.jpg" alt="Embroidery & Threads" />
            <span>
              <span className="brand-name">Embroidery & Threads</span>
              <span className="brand-location">Castle Rock, Colorado</span>
            </span>
          </Link>
          <Link href="/" className="reviews-back">
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        </div>
        <div className="stitch-horizontal" aria-hidden="true" />
      </nav>

      <main
        id="main-content"
        className="storybook-section not-found-section"
        tabIndex={-1}
      >
        <div className="content-wrap not-found-content">
          <p className="overline">A stitch went missing</p>
          <span className="script-accent">404</span>
          <h1>We couldn't find that page.</h1>
          <p>
            The link may be outdated, but the custom embroidery shop is still
            right here.
          </p>
          <div className="hero-actions">
            <Link href="/" className="stitched-button">
              Return Home
            </Link>
            <Link
              href="/#contact"
              className="stitched-button stitched-button-ghost"
            >
              Contact the Shop
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
