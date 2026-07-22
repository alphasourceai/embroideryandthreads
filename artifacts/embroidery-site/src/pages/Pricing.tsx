import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import CircleHelp from "lucide-react/dist/esm/icons/circle-help";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import { Link } from "wouter";
import PublicImage from "@/components/PublicImage";
import SiteFooter from "@/components/SiteFooter";
import pricing from "@/content/pricing.json";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function categoryId(name: string) {
  return name
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Pricing() {
  usePageMetadata({
    title: "Custom Embroidery Pricing | Castle Rock, CO",
    description:
      "View starting prices for custom embroidered apparel, hats, baby items, gifts, totes, logos, and add-ons from Embroidery & Threads in Castle Rock.",
    path: "/pricing",
  });
  useScrollReveal();

  return (
    <div className="storybook-site pricing-page">
      <div className="announcement">
        Local orders only - Castle Rock, CO
        <span className="script-accent">no shipping at this time</span>
      </div>

      <nav
        className="storybook-nav reviews-nav"
        aria-label="Pricing navigation"
      >
        <div className="nav-inner">
          <Link href="/" className="brand-lockup">
            <PublicImage src="/logo-b.jpg" alt="Embroidery & Threads" />
            <span>
              <span className="brand-name">Embroidery & Threads</span>
              <span className="brand-location">Castle Rock, Colorado</span>
            </span>
          </Link>
          <Link href="/" className="reviews-back" aria-label="Back to home">
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        </div>
        <div className="stitch-horizontal" aria-hidden="true" />
      </nav>

      <main id="main-content" tabIndex={-1}>
        <header className="pricing-page-hero storybook-section">
          <div className="content-wrap pricing-page-heading" data-reveal>
            <PublicImage
              className="pricing-emblem"
              src="/logo-b.jpg"
              alt=""
              width="150"
              height="150"
            />
            <span className="script-accent">{pricing.eyebrow}</span>
            <h1>{pricing.title}</h1>
            <p>{pricing.intro}</p>
            <nav className="pricing-jump-links" aria-label="Price categories">
              {pricing.categories.map((category) => (
                <a key={category.name} href={`#${categoryId(category.name)}`}>
                  {category.name}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="pricing-catalog-section storybook-section">
          <div className="content-wrap">
            <div className="pricing-notice" data-reveal>
              <p className="overline">Starting prices</p>
              <p>{pricing.disclaimer}</p>
              <p>{pricing.taxNote}</p>
            </div>

            <div className="pricing-category-grid">
              {pricing.categories.map((category) => (
                <section
                  className="pricing-category"
                  id={categoryId(category.name)}
                  key={category.name}
                  data-reveal
                >
                  <h2>{category.name}</h2>
                  <ul>
                    {category.items.map((item) => (
                      <li key={`${category.name}-${item.name}`}>
                        <span className="pricing-line-copy">
                          <strong>{item.name}</strong>
                          {"note" in item && item.note && (
                            <small>{item.note}</small>
                          )}
                        </span>
                        <span className="pricing-leader" aria-hidden="true" />
                        <span className="pricing-amount">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="pricing-page-cta" data-reveal>
              <span className="script-accent">ready to plan your piece?</span>
              <h2>Let's confirm the details.</h2>
              <p>
                Send your item, design idea, colors, and timing. You'll receive
                a final total before payment is due.
              </p>
              <div className="hero-actions">
                <Link href="/#contact" className="stitched-button">
                  <MessageCircle aria-hidden="true" />
                  Request an Order
                </Link>
                <Link
                  href="/faq"
                  className="stitched-button stitched-button-ghost"
                >
                  <CircleHelp aria-hidden="true" />
                  Read the FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
