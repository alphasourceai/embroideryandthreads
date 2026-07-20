import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import { Link } from "wouter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

const REVIEWS = [
  {
    id: "1",
    reviewer: "@ambermnolan",
    quote: "had @embroideryandthreads make a sweatshirt for me",
    reply: "so glad you like it!!!",
    imageSrc: "/review-1.png",
    altText:
      "Aggies Texas A&M custom embroidered sweatshirt shared by @ambermnolan",
    timeAgo: "27 weeks ago",
  },
  {
    id: "2",
    reviewer: "@stewards_of_stoke",
    quote: "Custom embroidery in action — tagged @EMBROIDERYANDTHREADS",
    reply: null,
    imageSrc: "/review-2.png",
    altText:
      "Behind-the-scenes of the embroidery machine making a custom design for @stewards_of_stoke",
    timeAgo: "14 weeks ago",
  },
  {
    id: "3",
    reviewer: "@natasha.kenton1",
    quote: "So many beautiful gifts to give from @embroideryandthreads",
    reply: null,
    imageSrc: "/review-3.png",
    altText:
      "Beautifully packaged Embroidery & Threads gifts under the Christmas tree, shared by @natasha.kenton1",
    timeAgo: "24 weeks ago",
  },
];

export default function Reviews() {
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
              {REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="reviews-page-card"
                  data-testid={`review-card-${review.id}`}
                  data-reveal
                >
                  <span className="washi-tape" aria-hidden="true" />
                  <img
                    src={review.imageSrc}
                    alt={review.altText}
                    width="486"
                    height="867"
                    loading="lazy"
                  />
                  <div className="review-card-copy">
                    <div className="review-card-meta">
                      <span className="polaroid-handle">{review.reviewer}</span>
                      <span>{review.timeAgo}</span>
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

      <footer className="storybook-footer">
        <span className="script-accent">Embroidery & Threads</span>
        <p>
          Castle Rock, CO · Local Pickup Only ·{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Embroidery & Threads. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
