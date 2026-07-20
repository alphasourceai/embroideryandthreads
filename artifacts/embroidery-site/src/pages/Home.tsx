import { useEffect, useState, type FormEvent } from "react";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import Mail from "lucide-react/dist/esm/icons/mail";
import Menu from "lucide-react/dist/esm/icons/menu";
import Phone from "lucide-react/dist/esm/icons/phone";
import X from "lucide-react/dist/esm/icons/x";
import { Link } from "wouter";
import InstagramFeed from "@/components/InstagramFeed";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const INSTAGRAM_URL = "https://www.instagram.com/embroideryandthreads/";

const GALLERY_IMAGES = [
  {
    src: "/gallery-1.png",
    alt: "Castle Rock Christmas sweatshirts — custom embroidered holiday collection",
  },
  {
    src: "/gallery-2.png",
    alt: "Merry & Bright holiday embroidery on cream sweatshirt",
  },
  {
    src: "/gallery-3.png",
    alt: "MAMA lavender floral applique sweatshirt with custom name tag",
  },
  {
    src: "/gallery-4.png",
    alt: "Personalized embroidered pieces from Embroidery & Threads",
  },
  {
    src: "/gallery-5.png",
    alt: "Faith-based and patriotic embroidered pieces — God Bless the USA",
  },
];

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

const REVIEW_IMAGES = [
  {
    src: "/review-1.png",
    handle: "@ambermnolan",
    alt: "Aggies Texas A&M custom embroidered sweatshirt shared by @ambermnolan",
  },
  {
    src: "/review-2.png",
    handle: "@stewards_of_stoke",
    alt: "Behind-the-scenes custom embroidery shared by @stewards_of_stoke",
  },
  {
    src: "/review-3.png",
    handle: "@natasha.kenton1",
    alt: "Beautifully packaged Embroidery & Threads gifts shared by @natasha.kenton1",
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

    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
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
    <div className="storybook-site">
      {lightbox && (
        <div
          className="storybook-lightbox"
          onClick={() => setLightbox(null)}
          data-testid="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button
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
            <p>{lightbox.alt}</p>
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
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
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

      <main id="top">
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
                A small, faith-based embroidery shop specializing in personalized
                pieces. From cozy Mama & Mini sets to custom holiday stockings,
                everything is made by hand with care.
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
                  <img
                    src="/gallery-2.png"
                    alt="Merry & Bright holiday embroidery on cream sweatshirt"
                    width="677"
                    height="1201"
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
            <SectionHeading eyebrow="the story" title="The Heart Behind the Hoop" />
            <div className="story-grid">
              <div className="fabric-patch" data-reveal>
                <div className="fabric-patch-inner">
                  <img
                    src="/gallery-3.png"
                    alt="MAMA lavender floral applique sweatshirt with custom name tag"
                    width="677"
                    height="1201"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="story-copy" data-reveal>
                <p>
                  I started Embroidery & Threads because I believe the things we
                  wear and carry should tell a story. Based in beautiful Castle
                  Rock, Colorado, this little shop is built on faith, family, and
                  the joy of creating something truly yours. Ordering from me
                  isn't like checking out online — it's a conversation. We'll
                  dream up the perfect design together, whether it's a matching
                  sweatshirt for you and your little one, or a custom tote that
                  makes the perfect gift.
                </p>
                <p>
                  I'm currently taking custom orders in the Castle Rock area. I'm
                  not shipping at this time — reach out on Instagram or use the
                  contact form below and we'll work out a local pickup.
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
              {GALLERY_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  className={`gallery-patch gallery-patch-${index + 1}`}
                  type="button"
                  onClick={() => setLightbox(image)}
                  data-testid={`gallery-image-${index}`}
                  data-reveal
                  aria-label={`View ${image.alt}`}
                >
                  <span className="gallery-patch-inner">
                    <img
                      src={image.src}
                      alt={image.alt}
                      width="677"
                      height="1201"
                      loading="lazy"
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
            <SectionHeading eyebrow="shared with love" title="From Their Feeds" />
            <p className="section-intro" data-reveal>
              Every piece leaves here with love — and sometimes customers share
              it back. Here are a few favorites.
            </p>
            <div className="review-polaroid-grid">
              {REVIEW_IMAGES.map((review) => (
                <Link
                  href="/reviews"
                  className="polaroid-card"
                  key={review.handle}
                  data-reveal
                >
                  <span className="washi-tape" aria-hidden="true" />
                  <img
                    src={review.src}
                    alt={review.alt}
                    width="486"
                    height="867"
                    loading="lazy"
                  />
                  <span className="polaroid-handle">{review.handle}</span>
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

        <InstagramFeed />

        <section id="contact" className="storybook-section contact-section">
          <div className="scallop scallop-top" aria-hidden="true" />
          <div className="content-wrap">
            <div className="contact-tag" data-reveal>
              <div className="tag-hole" aria-hidden="true" />
              <p className="overline">Serving Castle Rock & surrounding areas</p>
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
                    {formStatus === "submitting" ? "Sending..." : "Send Message"}
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
