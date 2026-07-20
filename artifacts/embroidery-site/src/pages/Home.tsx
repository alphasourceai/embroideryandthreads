import { useEffect, useRef, useState, type FormEvent } from "react";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import Mail from "lucide-react/dist/esm/icons/mail";
import Menu from "lucide-react/dist/esm/icons/menu";
import Phone from "lucide-react/dist/esm/icons/phone";
import X from "lucide-react/dist/esm/icons/x";
import { Link } from "wouter";
import InstagramFeed from "@/components/InstagramFeed";
import OptimizedImage from "@/components/OptimizedImage";
import SiteFooter from "@/components/SiteFooter";
import siteContent from "@/content/site.json";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

const PROCESS_STEPS = [
  {
    icon: "/logo-needle.jpg",
    title: "Say Hello",
    description:
      "Send me a DM on Instagram or fill out the contact form below with what you're looking for — a gift, a custom piece, or something for yourself.",
  },
  {
    icon: "/logo-dressform.jpg",
    title: "The Details",
    description:
      "We'll chat about colors, fonts, and sizing. I'll make sure the design is exactly what you envision before I start stitching.",
  },
  {
    icon: "/logo-machine.jpg",
    title: "Local Pickup",
    description:
      "I'll get to stitching! Once it's ready, I'll package it beautifully for local pickup in the Castle Rock area.",
  },
];

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-heading" data-reveal>
      <span className="script-accent">{eyebrow}</span>
      <h2>{title}</h2>
      <div className="stitch-horizontal" aria-hidden="true" />
    </div>
  );
}

export default function Home() {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement>(null);
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  usePageMetadata({
    title: "Custom Embroidery in Castle Rock, CO | Embroidery & Threads",
    description:
      "Shop custom embroidery in Castle Rock, Colorado, including personalized sweatshirts, gifts, stockings, totes, and made-to-order pieces for local pickup.",
    path: "/",
  });
  useScrollReveal();

  useEffect(() => {
    if (!lightbox) {
      document.body.style.overflow = "";
      return;
    }

    const trigger = lightboxTriggerRef.current;
    document.body.style.overflow = "hidden";
    lightboxCloseRef.current?.focus();

    const handleLightboxKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }

      if (event.key === "Tab") {
        event.preventDefault();
        lightboxCloseRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleLightboxKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleLightboxKeyDown);
      trigger?.focus();
    };
  }, [lightbox]);

  const closeMenu = () => setMenuOpen(false);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string") body.append(key, value);
    });

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <div className="storybook-site" id="top">
      {lightbox && (
        <div
          className="storybook-lightbox"
          onClick={() => setLightbox(null)}
          data-testid="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          aria-describedby="lightbox-caption"
        >
          <button
            ref={lightboxCloseRef}
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            data-testid="lightbox-close"
            aria-label="Close image"
            type="button"
          >
            <X aria-hidden="true" />
          </button>
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={lightbox.src} alt={lightbox.alt} />
            <p id="lightbox-caption">{lightbox.alt}</p>
          </div>
        </div>
      )}

      <div className="announcement">
        Local orders only — Castle Rock, CO
        <span className="script-accent">no shipping at this time</span>
      </div>

      <nav className="storybook-nav" aria-label="Primary navigation">
        <div className="nav-inner">
          <a
            href="#top"
            className="brand-lockup"
            data-testid="nav-logo"
            onClick={closeMenu}
          >
            <img src="/logo-b.jpg" alt="Embroidery & Threads" />
            <span>
              <span className="brand-name">Embroidery & Threads</span>
              <span className="brand-location">Castle Rock, Colorado</span>
            </span>
          </a>

          <div className="desktop-nav">
            <a href="#about" data-testid="nav-link-about">
              Story
            </a>
            <a href="#gallery" data-testid="nav-link-gallery">
              Gallery
            </a>
            <a href="#process">How It Works</a>
            <Link href="/reviews" data-testid="nav-link-reviews">
              Reviews
            </Link>
            <a href="#contact" data-testid="nav-link-contact">
              Contact
            </a>
            <a
              className="stitched-button stitched-button-small"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-button-order"
            >
              DM to Order
            </a>
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-nav">
            <a href="#about" onClick={closeMenu}>
              Story
            </a>
            <a href="#gallery" onClick={closeMenu}>
              Gallery
            </a>
            <a href="#process" onClick={closeMenu}>
              How It Works
            </a>
            <Link href="/reviews" onClick={closeMenu}>
              Reviews
            </Link>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
            <a
              className="stitched-button"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              DM to Order
            </a>
          </div>
        )}
        <div className="stitch-horizontal" aria-hidden="true" />
      </nav>

      <main id="main-content" tabIndex={-1}>
        <header className="storybook-hero">
          <div className="content-wrap hero-grid">
            <div className="hero-copy" data-reveal>
              <p className="overline">Handmade in Castle Rock</p>
              <h1>
                Sewn into
                <span className="script-accent">every little</span>
                detail.
              </h1>
              <p className="hero-description">
                A small, faith-based embroidery shop specializing in
                personalized pieces. From cozy Mama & Mini sets to custom
                holiday stockings, everything is made by hand with care.
              </p>
              <div className="hero-actions">
                <a
                  className="stitched-button"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-button-instagram"
                >
                  DM to Order
                </a>
                <a
                  className="stitched-button stitched-button-ghost"
                  href="#gallery"
                  data-testid="hero-button-explore"
                >
                  Explore the Work
                </a>
              </div>
            </div>

            <div className="embroidery-hoop" data-reveal>
              <div className="hoop-knob" aria-hidden="true" />
              <div className="hoop-ring">
                <div className="hoop-stitches">
                  <OptimizedImage
                    src={siteContent.hero.image}
                    alt={siteContent.hero.alt}
                    width="677"
                    height="1201"
                    fetchPriority="high"
                    widths={[480, 800, 1100]}
                    sizes="(max-width: 920px) 82vw, 38vw"
                  />
                </div>
              </div>
              <img
                className="hoop-badge"
                src="/logo-b.jpg"
                alt="Embroidery & Threads logo"
                width="150"
                height="150"
              />
            </div>
          </div>

          <svg
            className="hero-thread"
            viewBox="0 0 1440 60"
            fill="none"
            preserveAspectRatio="none"
            height="60"
            aria-hidden="true"
          >
            <path d="M-10 30 C 240 58, 480 2, 720 30 S 1200 58, 1450 30" />
          </svg>
        </header>

        <section id="about" className="storybook-section story-section">
          <div className="scallop scallop-top" aria-hidden="true" />
          <div className="content-wrap">
            <SectionHeading
              eyebrow="the story"
              title="The Heart Behind the Hoop"
            />
            <div className="story-grid">
              <div className="fabric-patch" data-reveal>
                <div className="fabric-patch-inner">
                  <OptimizedImage
                    src={siteContent.story.image}
                    alt={siteContent.story.alt}
                    width="677"
                    height="1201"
                    loading="lazy"
                    widths={[480, 800, 1100]}
                    sizes="(max-width: 920px) min(520px, 100vw), 40vw"
                  />
                </div>
              </div>

              <div className="story-copy" data-reveal>
                <p>
                  I started Embroidery & Threads because I believe the things we
                  wear and carry should tell a story. Based in beautiful Castle
                  Rock, Colorado, this little shop is built on faith, family,
                  and the joy of creating something truly yours. Ordering from
                  me isn't like checking out online — it's a conversation. We'll
                  dream up the perfect design together, whether it's a matching
                  sweatshirt for you and your little one, or a custom tote that
                  makes the perfect gift.
                </p>
                <p>
                  I'm currently taking custom orders in the Castle Rock area.
                  I'm not shipping at this time — reach out on Instagram or use
                  the contact form below and we'll work out a local pickup.
                </p>
                <span className="script-accent story-signature">
                  made with love, every time
                </span>
              </div>
            </div>
          </div>
          <div className="scallop scallop-bottom" aria-hidden="true" />
        </section>

        <section id="gallery" className="storybook-section gallery-section">
          <div className="content-wrap">
            <SectionHeading eyebrow="a few favorites" title="The Gallery" />
            <p className="section-intro" data-reveal>
              A selection of custom pieces — click any image to take a closer
              look. Every stitch is placed with purpose.
            </p>
            <div className="gallery-grid">
              {siteContent.gallery.map((image, index) => (
                <button
                  key={`${image.image}-${index}`}
                  className={`gallery-patch gallery-patch-${index + 1}`}
                  type="button"
                  onClick={(event) => {
                    lightboxTriggerRef.current = event.currentTarget;
                    setLightbox({ src: image.image, alt: image.alt });
                  }}
                  data-testid={`gallery-image-${index}`}
                  data-reveal
                  aria-label={`View ${image.alt}`}
                >
                  <span className="gallery-patch-inner">
                    <OptimizedImage
                      src={image.image}
                      alt={image.alt}
                      width="677"
                      height="1201"
                      loading="lazy"
                      widths={[360, 640, 900]}
                      sizes="(max-width: 920px) min(520px, 100vw), 33vw"
                    />
                  </span>
                </button>
              ))}
            </div>
            <div className="centered-action" data-reveal>
              <a
                className="stitched-button stitched-button-ghost"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="gallery-button-instagram"
              >
                See more on Instagram
              </a>
            </div>
          </div>
        </section>

        <section id="process" className="storybook-section process-section">
          <div className="content-wrap">
            <SectionHeading eyebrow="start to finish" title="How It Works" />
            <p className="section-intro" data-reveal>
              I handle all orders personally to ensure we get every detail just
              right.
            </p>
            <div className="steps-grid">
              <svg
                className="steps-thread"
                viewBox="0 0 1000 60"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 20 C 200 60, 320 -10, 500 25 S 820 60, 1000 15" />
              </svg>
              {PROCESS_STEPS.map((step, index) => (
                <article className="process-step" key={step.title} data-reveal>
                  <div className="step-icon">
                    <img
                      src={step.icon}
                      alt={step.title}
                      width="150"
                      height="150"
                      loading="lazy"
                    />
                  </div>
                  <span className="step-number">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="storybook-section reviews-band">
          <div className="content-wrap">
            <SectionHeading
              eyebrow="shared with love"
              title="From Their Feeds"
            />
            <p className="section-intro" data-reveal>
              Every piece leaves here with love — and sometimes customers share
              it back. Here are a few favorites.
            </p>
            <div className="review-polaroid-grid">
              {siteContent.reviews.map((review, index) => (
                <Link
                  href="/reviews"
                  className="polaroid-card"
                  key={`${review.reviewer}-${index}`}
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
                  <span className="polaroid-handle">{review.reviewer}</span>
                </Link>
              ))}
            </div>
            <div className="centered-action" data-reveal>
              <Link
                href="/reviews"
                className="stitched-button stitched-button-ghost"
              >
                Read Customer Stories
              </Link>
            </div>
          </div>
        </section>

        <InstagramFeed posts={siteContent.instagram} />

        {siteContent.pricing.enabled && (
          <section id="pricing" className="storybook-section pricing-section">
            <div className="content-wrap">
              <SectionHeading
                eyebrow={siteContent.pricing.eyebrow}
                title={siteContent.pricing.title}
              />
              <p className="section-intro" data-reveal>
                {siteContent.pricing.intro}
              </p>
              <div className="pricing-grid">
                {siteContent.pricing.items.map((item) => (
                  <article className="pricing-item" key={item.name} data-reveal>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <strong>{item.price}</strong>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="storybook-section contact-section">
          <div className="scallop scallop-top" aria-hidden="true" />
          <div className="content-wrap">
            <div className="contact-tag" data-reveal>
              <div className="tag-hole" aria-hidden="true" />
              <p className="overline">
                Serving Castle Rock & surrounding areas
              </p>
              <h2>
                <span className="script-accent">let's make</span>
                something personal
              </h2>
              <p className="contact-intro">
                Whether you have a specific design in mind or just want to
                explore options, I'd love to hear from you.
              </p>

              <div className="contact-methods">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="footer-link-instagram"
                >
                  <Instagram aria-hidden="true" />
                  <span>
                    <strong>Instagram</strong>
                    @embroideryandthreads
                  </span>
                </a>
                <a
                  href="mailto:embroideryandthreads@gmail.com"
                  data-testid="footer-link-email"
                >
                  <Mail aria-hidden="true" />
                  <span>
                    <strong>Email</strong>
                    embroideryandthreads@gmail.com
                  </span>
                </a>
                <a href="tel:7205550199" data-testid="footer-link-phone">
                  <Phone aria-hidden="true" />
                  <span>
                    <strong>Phone</strong>
                    (720) 555-0199
                  </span>
                </a>
              </div>

              <form
                className="storybook-form"
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleContactSubmit}
                data-testid="contact-form"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="visually-hidden">
                  <label>
                    Do not fill this out if you are human:
                    <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <div className="form-heading">
                  <h3>Send a Message</h3>
                  <p>I'll get back to you as soon as possible.</p>
                </div>

                <div className="form-grid">
                  <label>
                    <span>Name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Your name"
                      data-testid="contact-input-name"
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="your@email.com"
                      data-testid="contact-input-email"
                    />
                  </label>
                </div>

                <label>
                  <span>What are you looking for?</span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Describe your custom order idea — item type, names, colors, occasion..."
                    data-testid="contact-input-message"
                  />
                </label>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="stitched-button"
                    data-testid="contact-form-submit"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting"
                      ? "Sending..."
                      : "Send Message"}
                  </button>
                  <a
                    className="stitched-button stitched-button-ghost"
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order via DM
                  </a>
                </div>
                <p
                  className={`form-status${formStatus === "error" ? " form-status-error" : ""}`}
                  aria-live="polite"
                  data-testid="contact-form-status"
                >
                  {formStatus === "success" &&
                    "Thank you. Your message has been sent."}
                  {formStatus === "error" &&
                    "Your message could not be sent. Please try again or email us directly."}
                </p>
              </form>
            </div>
          </div>
          <div className="scallop scallop-bottom" aria-hidden="true" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
