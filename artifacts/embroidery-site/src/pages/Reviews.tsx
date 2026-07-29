import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Star from "lucide-react/dist/esm/icons/star";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import OptimizedImage from "@/components/OptimizedImage";
import PublicImage from "@/components/PublicImage";
import SiteFooter from "@/components/SiteFooter";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import siteContent from "@/content/site.json";
import type { CustomerReview, GoogleReviewResponse } from "@/types/reviews";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";
const GOOGLE_REVIEW_URL = "https://g.page/r/CePAAktAo91REBM/review";
const manualReviews = siteContent.reviews as CustomerReview[];

export default function Reviews() {
  const [googleFeed, setGoogleFeed] = useState<GoogleReviewResponse | null>(
    null,
  );
  usePageMetadata({
    title: "Customer Reviews | Embroidery & Threads Castle Rock",
    description:
      "See customer stories and custom embroidery shared by Embroidery & Threads customers in Castle Rock, Colorado.",
    path: "/reviews",
  });
  useScrollReveal();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/.netlify/functions/google-reviews", {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GoogleReviewResponse | null) => {
        if (data) setGoogleFeed(data);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const googleReviews = useMemo(() => {
    const seen = new Set(
      manualReviews.map((review) =>
        `${review.reviewer}|${review.quote}`.toLowerCase(),
      ),
    );
    return (googleFeed?.reviews ?? [])
      .filter(
        (review) =>
          !seen.has(`${review.reviewer}|${review.quote}`.toLowerCase()),
      )
      .map((review) => ({
        ...review,
        source: "google" as const,
      }));
  }, [googleFeed]);

  return (
    <div className="storybook-site reviews-page">
      <div className="announcement">
        Local orders only — Castle Rock, CO
        <span className="script-accent">no shipping at this time</span>
      </div>

      <nav
        className="storybook-nav reviews-nav"
        aria-label="Reviews navigation"
      >
        <div className="nav-inner">
          <Link
            href="/"
            className="brand-lockup"
            data-testid="reviews-nav-home"
          >
            <PublicImage src="/logo-b.jpg" alt="Embroidery & Threads" />
            <span>
              <span className="brand-name">Embroidery & Threads</span>
              <span className="brand-location">Castle Rock, Colorado</span>
            </span>
          </Link>
          <Link
            href="/"
            className="reviews-back"
            aria-label="Back to home"
            data-testid="reviews-nav-back"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        </div>
        <div className="stitch-horizontal" aria-hidden="true" />
      </nav>

      <main id="main-content" tabIndex={-1}>
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

            <GoogleReviewsSection feed={googleFeed} reviews={googleReviews} />

            <div className="reviews-collection-heading" data-reveal>
              <span className="overline">Customer shares</span>
              <h2>Kind Words from Instagram</h2>
              <p>
                Notes and finished pieces shared directly by local customers.
              </p>
            </div>
            <div className="reviews-page-grid">
              {manualReviews.map((review, index) => (
                <ReviewCard
                  review={review}
                  index={index}
                  idPrefix="customer"
                  key={review.id ?? `${review.reviewer}-${index}`}
                />
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
                <a
                  className="stitched-button stitched-button-ghost"
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="reviews-button-google-review"
                >
                  <Star aria-hidden="true" />
                  Leave a Google Review
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

function ReviewCard({
  review,
  index,
  idPrefix,
}: {
  review: CustomerReview;
  index: number;
  idPrefix: string;
}) {
  const sourceLabel =
    review.source === "google"
      ? "Google review"
      : review.source === "instagram"
        ? "Instagram share"
        : "Customer feedback";
  const sourceContent = (
    <>
      {review.source === "instagram" ? (
        <Instagram aria-hidden="true" />
      ) : review.source === "google" ? (
        <span className="google-mark" aria-hidden="true">
          G
        </span>
      ) : null}
      {sourceLabel}
      {review.sourceUrl && <ExternalLink aria-hidden="true" />}
    </>
  );

  return (
    <article
      className={`reviews-page-card${review.image ? "" : " review-text-card"}`}
      data-testid={`${idPrefix}-review-card-${index + 1}`}
      data-reveal
    >
      <span className="washi-tape" aria-hidden="true" />
      {review.image && (
        <OptimizedImage
          src={review.image}
          alt={review.alt ?? ""}
          width="486"
          height="867"
          loading="lazy"
          widths={[420, 720, 972]}
          sizes="(max-width: 920px) min(460px, 100vw), 33vw"
        />
      )}
      <div className="review-card-copy">
        <div className="review-source-row">
          {review.sourceUrl ? (
            <a
              className="review-source"
              href={review.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sourceContent}
            </a>
          ) : (
            <span className="review-source">{sourceContent}</span>
          )}
          {review.rating && <ReviewStars rating={review.rating} />}
        </div>
        <div className="review-card-meta">
          <span className="polaroid-handle">{review.reviewer}</span>
          <span>{review.dateLabel}</span>
        </div>
        <p className="review-quote">“{review.quote}”</p>
        {review.reply && (
          <p className="owner-reply">
            <PublicImage src="/logo-b.jpg" alt="" width="150" height="150" />
            {review.reply}
          </p>
        )}
      </div>
    </article>
  );
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={index < rating ? "is-filled" : ""}
        />
      ))}
    </span>
  );
}

function GoogleReviewsSection({
  feed,
  reviews,
}: {
  feed: GoogleReviewResponse | null;
  reviews: CustomerReview[];
}) {
  const hasRating =
    typeof feed?.rating === "number" && typeof feed?.reviewCount === "number";
  const reviewLabel = hasRating
    ? `${feed.reviewCount} Google ${
        feed.reviewCount === 1 ? "rating" : "ratings"
      }`
    : "";

  return (
    <section
      className="google-reviews-section"
      aria-labelledby="google-reviews-heading"
      data-testid="google-reviews-section"
    >
      <div className="reviews-collection-heading" data-reveal>
        <span className="overline">Verified on Google</span>
        <h2 id="google-reviews-heading">Google Reviews</h2>
        <p>
          Recent public feedback from the Embroidery &amp; Threads Google
          Business Profile.
        </p>
      </div>

      <article
        className="google-review-summary"
        aria-label="Google rating summary"
        data-testid="google-review-summary"
        data-reveal
      >
        <div className="google-review-summary-main">
          <img
            src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
            alt="Google"
            width="92"
            height="30"
            loading="lazy"
          />
          {hasRating ? (
            <>
              <strong>{feed.rating!.toFixed(1)}</strong>
              <ReviewStars rating={Math.round(feed.rating!)} />
              <span>{reviewLabel}</span>
            </>
          ) : (
            <span className="google-review-status">
              {feed?.unavailable
                ? "Google ratings are temporarily unavailable."
                : "Loading the latest Google ratings..."}
            </span>
          )}
        </div>
        <div className="google-review-summary-copy">
          <p>
            Ratings and written reviews are refreshed automatically from Google.
            Only recent 4- and 5-star written reviews returned by Google are
            featured below.
          </p>
          {feed?.googleMapsUri && (
            <a
              href={feed.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
            >
              See the full Google profile
              <ExternalLink aria-hidden="true" />
            </a>
          )}
        </div>
      </article>

      {reviews.length > 0 ? (
        <div className="google-review-card-grid">
          {reviews.map((review, index) => (
            <ReviewCard
              review={review}
              index={index}
              idPrefix="google"
              key={review.id ?? `${review.reviewer}-${index}`}
            />
          ))}
        </div>
      ) : (
        <div
          className="google-review-empty"
          data-testid="google-review-empty"
          data-reveal
        >
          <span className="google-mark" aria-hidden="true">
            G
          </span>
          <p>
            {hasRating
              ? `Customers have left ${reviewLabel.toLowerCase()}. Written Google reviews will appear here automatically as Google makes them available.`
              : "Written Google reviews will appear here automatically as Google makes them available."}
          </p>
        </div>
      )}
    </section>
  );
}
