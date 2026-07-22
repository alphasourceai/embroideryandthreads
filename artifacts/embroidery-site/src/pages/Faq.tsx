import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import { Link } from "wouter";
import PublicImage from "@/components/PublicImage";
import SiteFooter from "@/components/SiteFooter";
import faqs from "@/content/faq.json";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Faq() {
  usePageMetadata({
    title: "Custom Embroidery FAQ | Embroidery & Threads Castle Rock",
    description:
      "Find answers about custom embroidery pricing, turnaround, rush orders, local pickup, payment, cancellations, and garment care in Castle Rock.",
    path: "/faq",
  });
  useScrollReveal();

  return (
    <div className="storybook-site faq-page">
      <div className="announcement">
        Local orders only — Castle Rock, CO
        <span className="script-accent">no shipping at this time</span>
      </div>

      <nav className="storybook-nav reviews-nav" aria-label="FAQ navigation">
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

      <main id="main-content" className="storybook-section faq-section" tabIndex={-1}>
        <div className="content-wrap faq-content">
          <div className="section-heading" data-reveal>
            <span className="script-accent">before we start stitching</span>
            <h1>Frequently Asked Questions</h1>
            <div className="stitch-horizontal" aria-hidden="true" />
          </div>
          <p className="section-intro" data-reveal>
            Details about custom embroidery pricing, ordering, local pickup,
            payment, and caring for your finished piece. For item-by-item costs,
            see the <Link href="/pricing">current starting prices</Link>.
          </p>

          <dl className="faq-list">
            {faqs.map((item) => (
              <div className="faq-item" key={item.question} data-reveal>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>

          <div className="faq-contact" data-reveal>
            <span className="script-accent">still have a question?</span>
            <h2>Let's talk through your idea.</h2>
            <p>Text is preferred, and messages are answered within 24 to 48 hours.</p>
            <a className="stitched-button" href="sms:+17204651414">
              <MessageCircle aria-hidden="true" />
              Text (720) 465-1414
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
