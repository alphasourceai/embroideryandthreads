import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import Check from "lucide-react/dist/esm/icons/check";
import Clock3 from "lucide-react/dist/esm/icons/clock-3";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import { Link } from "wouter";
import OptimizedImage from "@/components/OptimizedImage";
import PublicImage from "@/components/PublicImage";
import SiteFooter from "@/components/SiteFooter";
import pricing from "@/content/pricing.json";
import services from "@/content/services.json";
import siteContent from "@/content/site.json";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import "@/service-page.css";

export type ServiceDefinition = (typeof services)[number];

type ServicePageProps = {
  serviceSlug: string;
};

function galleryImages(service: ServiceDefinition) {
  const sourceGalleries = service.galleryNames
    .map((name) => siteContent.gallery.find((gallery) => gallery.name === name))
    .filter((gallery) => gallery !== undefined);
  const imagesPerGallery = Math.max(
    1,
    Math.floor(6 / Math.max(1, sourceGalleries.length)),
  );

  return sourceGalleries
    .flatMap((gallery) => gallery.images.slice(0, imagesPerGallery))
    .slice(0, 6);
}

function startingPrices(service: ServiceDefinition) {
  return pricing.categories
    .filter((category) => service.pricingCategories.includes(category.name))
    .flatMap((category) =>
      category.items.slice(0, 2).map((item) => ({
        ...item,
        category: category.name,
      })),
    )
    .slice(0, 6);
}

export default function ServicePage({ serviceSlug }: ServicePageProps) {
  const service = services.find((candidate) => candidate.slug === serviceSlug);

  if (!service) {
    return null;
  }

  const images = galleryImages(service);
  const prices = startingPrices(service);
  const relatedServices = services.filter(
    (candidate) => candidate.slug !== service.slug,
  );

  usePageMetadata({
    title: `${service.title} | Embroidery & Threads`,
    description: service.description,
    path: `/${service.slug}`,
  });
  useScrollReveal();

  return (
    <div className="storybook-site service-page">
      <div className="announcement">
        Local orders only - Castle Rock, CO
        <span className="script-accent">no shipping at this time</span>
      </div>

      <nav
        className="storybook-nav reviews-nav"
        aria-label={`${service.navLabel} navigation`}
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
        <header className="service-hero">
          <OptimizedImage
            src={service.heroImage}
            alt={service.heroAlt}
            widths={[640, 960, 1440]}
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
          <div className="service-hero-shade" aria-hidden="true" />
          <div className="content-wrap service-hero-copy">
            <nav className="service-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>Services</span>
            </nav>
            <p className="overline">{service.eyebrow}</p>
            <h1>{service.title}</h1>
            <p>{service.intro}</p>
            <div className="hero-actions">
              <Link href="/#contact" className="stitched-button">
                <MessageCircle aria-hidden="true" />
                Request an Order
              </Link>
              <Link
                href="/pricing"
                className="stitched-button stitched-button-light"
              >
                View Starting Prices
              </Link>
            </div>
          </div>
        </header>

        <section className="storybook-section service-overview-section">
          <div className="content-wrap service-overview">
            <div data-reveal>
              <span className="script-accent">thoughtfully made</span>
              <h2>{service.overviewTitle}</h2>
              <p>{service.overviewBody}</p>
              <div className="service-local-notes">
                <span>
                  <MapPin aria-hidden="true" />
                  Castle Rock pickup
                </span>
                <span>
                  <Clock3 aria-hidden="true" />
                  About one week standard turnaround
                </span>
              </div>
            </div>
            <ul className="service-highlights" data-reveal>
              {service.highlights.map((highlight) => (
                <li key={highlight}>
                  <Check aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="storybook-section service-gallery-section">
          <div className="content-wrap">
            <div className="section-heading" data-reveal>
              <span className="script-accent">recent work</span>
              <h2>{service.navLabel} Inspiration</h2>
              <div className="stitch-horizontal" aria-hidden="true" />
            </div>
            <p className="section-intro" data-reveal>
              These examples show what is possible. Colors, names, garments,
              placement, and other details can be adjusted for your order.
            </p>
            <div className="service-photo-grid">
              {images.map((image, index) => (
                <figure key={`${image.image}-${index}`} data-reveal>
                  <OptimizedImage
                    src={image.image}
                    alt={image.alt}
                    widths={[420, 720, 960]}
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <figcaption>{image.alt}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="storybook-section service-pricing-section">
          <div className="content-wrap service-pricing-layout">
            <div data-reveal>
              <p className="overline">Starting prices</p>
              <h2>Plan the piece, then confirm the total.</h2>
              <p>
                Final pricing depends on the item, design size, stitch count,
                and placement. You will receive a final total before payment is
                due.
              </p>
              <Link href="/pricing" className="service-text-link">
                See the complete pricing guide
              </Link>
            </div>
            <ul className="service-price-list" data-reveal>
              {prices.map((item) => (
                <li key={`${item.category}-${item.name}`}>
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.name}</strong>
                  </span>
                  <b>{item.price}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="storybook-section service-process-section">
          <div className="content-wrap">
            <div className="section-heading" data-reveal>
              <span className="script-accent">from idea to pickup</span>
              <h2>How a Custom Order Works</h2>
              <div className="stitch-horizontal" aria-hidden="true" />
            </div>
            <ol className="service-steps">
              <li data-reveal>
                <span>01</span>
                <h3>Share the idea</h3>
                <p>
                  Send the item, wording, colors, inspiration, quantity, and
                  timing through the inquiry form or Instagram.
                </p>
              </li>
              <li data-reveal>
                <span>02</span>
                <h3>Confirm the details</h3>
                <p>
                  Becky will review the design, answer questions, and confirm
                  the final price before payment and stitching.
                </p>
              </li>
              <li data-reveal>
                <span>03</span>
                <h3>Pick up locally</h3>
                <p>
                  Pickup is at the Castle Rock home business. The address and
                  instructions are provided after payment.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="storybook-section service-directory-section">
          <div className="content-wrap service-directory">
            <div data-reveal>
              <span className="script-accent">
                more ways to make it personal
              </span>
              <h2>Explore More Embroidery Services</h2>
            </div>
            <nav aria-label="Related embroidery services" data-reveal>
              {relatedServices.map((related) => (
                <Link key={related.slug} href={`/${related.slug}`}>
                  {related.navLabel}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className="service-contact-band">
          <div className="content-wrap" data-reveal>
            <span className="script-accent">have something in mind?</span>
            <h2>Let's plan a piece that feels like yours.</h2>
            <p>
              Inquiries are answered within 24 to 48 hours. Text is preferred,
              and rush timing can be discussed when the schedule allows.
            </p>
            <div className="hero-actions">
              <Link href="/#contact" className="stitched-button">
                <MessageCircle aria-hidden="true" />
                Start an Inquiry
              </Link>
              <a
                className="stitched-button stitched-button-ghost"
                href="sms:+17204651414"
              >
                Text (720) 465-1414
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
