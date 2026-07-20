import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function Privacy() {
  usePageMetadata({
    title: "Privacy Policy | Embroidery & Threads",
    description:
      "Learn how Embroidery & Threads handles information submitted through its custom embroidery inquiry form.",
    path: "/privacy",
  });

  return (
    <div className="storybook-site privacy-page">
      <nav
        className="storybook-nav reviews-nav"
        aria-label="Privacy navigation"
      >
        <div className="nav-inner">
          <Link href="/" className="brand-lockup">
            <img src="/logo-b.jpg" alt="Embroidery & Threads" />
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
        className="storybook-section privacy-section"
        tabIndex={-1}
      >
        <article className="content-wrap privacy-content">
          <p className="overline">Last updated July 20, 2026</p>
          <h1>Privacy Policy</h1>
          <p>
            Embroidery & Threads collects the name, email address, and message
            you choose to submit through the contact form. This information is
            used to respond to your inquiry and manage a potential custom order.
          </p>
          <h2>How submissions are handled</h2>
          <p>
            Netlify processes and stores form submissions and may send email
            notifications to Embroidery & Threads. Information is retained only
            as long as reasonably necessary to respond to inquiries, manage
            orders, and maintain appropriate business records.
          </p>
          <h2>Sharing and marketing</h2>
          <p>
            Embroidery & Threads does not sell contact-form information for
            advertising. Information may be shared with service providers only
            when needed to operate the website or respond to an inquiry.
          </p>
          <h2>Contact</h2>
          <p>
            Questions or requests about your information can be sent to{" "}
            <a href="mailto:embroideryandthreads@gmail.com">
              embroideryandthreads@gmail.com
            </a>
            .
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
