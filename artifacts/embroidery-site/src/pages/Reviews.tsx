import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import { Link } from "wouter";
import OptimizedImage from "@/components/OptimizedImage";
import SiteFooter from "@/components/SiteFooter";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import siteContent from "@/content/site.json";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

export default function Reviews() {
  usePageMetadata({
    title: "Customer Reviews | Embroidery & Threads Castle Rock",
    description:
      "See customer stories and custom embroidery shared by Embroidery & Threads customers in Castle Rock, Colorado.",
    path: "/reviews",
  });
  useScrollReveal();

  return (
    <div className="storybook-site reviews-page">
      <div className="announcement">
        Local orders only — Castle Rock, CO
        <span className="script-accent">no shipping at this time</span>
      </div>

      <nav className="storybook-nav reviews-nav" aria-label="Reviews navigation">
        <div className="nav-inner">
          <Link
            href="/"
            className="brand-lockup"
            data-testid="reviews-nav-home"
          >
            <img src="/logo-b.jpg" alt="Embroidery & Threads" />
            <span>
              <span className="brand-name">Embroidery & Threads</span>
              <span className="brand-location">Castle Rock, Colorado</span>
            </span>
          </Link>
          <Link
            href="/"
            className="reviews-back"
            data-testid="reviews-nav-back"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        </div>
        <div className="stitch-horizontal" aria-hidden="true" />
      </nav>

      <main>
        <section className="reviews-page-hero storybook-section">
          <div className="content-wrap">
            <div className="section-heading" data-reveal>
              <span className="script-accent">what people are saying</span>
              <h1>Customer Stories</h1>
              <div className="stitch-horizontal" aria-hidden="true" />
            </div>
            <p className="section-intro" data-reveal>
              Every piece leaves here with love — and sometimes customers share
              it back. Here are a few favorites.
            </p>

            <div className="reviews-page-grid">
              {siteContent.reviews.map((review, index) => (
                <article
                  key={`${review.reviewer}-${index}`}
                  className="reviews-page-card"
                  data-testid={`review-card-${index + 1}`}
                  data-reveal
                >
                  <span className="washi-tape" aria-hidden="true" />
                  <OptimizedImage
                    src={review.image}
                    alt={review.alt}
                    width="486"
                    height="867"
                    loading="lazy"
                    widths={[420, 720, 972]}
                    sizes="(max-width: 920px) min(460px, 100vw), 33vw"
                  />
                  <div className="review-card-copy">
                    <div className="review-card-meta">
                      <span className="polaroid-handle">{review.reviewer}</span>
                      <span>{review.dateLabel}</span>
                    </div>
                    <p>“{review.quote}”</p>
                    {review.reply && (
                      <p className="owner-reply">
                        <img
                          src="/logo-b.jpg"
                          alt=""
                          width="150"
                          height="150"
                        />
                        {review.reply}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="reviews-cta" data-reveal>
              <span className="script-accent">your idea could be next</span>
              <h2>Let's make something personal.</h2>
              <p>Love what you see? Place your own custom order.</p>
              <div className="hero-actions">
                <a
                  className="stitched-button"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="reviews-button-instagram"
                >
                  <Instagram aria-hidden="true" />
                  DM to Order
                </a>
                <Link
                  href="/#contact"
                  className="stitched-button stitched-button-ghost"
                  data-testid="reviews-button-contact"
                >
                  Send a Message
                </Link>
              </div>
              <p className="local-note">
                <MapPin aria-hidden="true" />
                Local orders only — Castle Rock, CO area
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
