import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { Link } from "wouter";
import PublicImage from "@/components/PublicImage";
import SiteFooter from "@/components/SiteFooter";
import { usePageMetadata } from "@/hooks/use-page-metadata";

export default function Privacy() {
  usePageMetadata({
    title: "Privacy Policy | Embroidery & Threads",
    description:
      "Learn how Embroidery & Threads handles inquiry information, saved drafts, and privacy-friendly website analytics.",
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

      <main
        id="main-content"
        className="storybook-section privacy-section"
        tabIndex={-1}
      >
        <article className="content-wrap privacy-content">
          <p className="overline">Last updated July 22, 2026</p>
          <h1>Privacy Policy</h1>
          <p>
            Embroidery & Threads collects information needed to respond to
            inquiries, manage custom orders, understand website use, and improve
            the ordering experience. The sections below explain when information
            is collected and how long it is kept.
          </p>
          <h2>Submitted inquiries</h2>
          <p>
            When you send the contact form, Embroidery & Threads receives the
            name, email address, project category, and message you provide.
            Netlify processes and stores the submission and may send an email
            notification. A working copy may be retained for up to 24 months to
            respond, manage orders, measure inquiry results, and maintain
            appropriate business records. Netlify&apos;s form records may be
            retained separately as needed for those purposes.
          </p>
          <h2>Optional saved inquiries</h2>
          <p>
            The website does not save the contents of an unfinished form unless
            you enable &ldquo;Saved inquiry follow-up&rdquo; in Privacy choices.
            When enabled, a valid name and email address, project category, and
            message entered in the contact form may be securely saved so
            Embroidery & Threads can follow up. Saved drafts expire after 30
            days, are removed when the form is successfully submitted, and can
            be deleted sooner upon request. Turning this preference off asks the
            website to delete the saved draft associated with the current
            browser tab.
          </p>
          <h2>Sharing and marketing</h2>
          <p>
            Embroidery & Threads does not sell contact-form information for
            advertising. Information may be shared with service providers only
            when needed to operate the website or respond to an inquiry.
          </p>
          <h2>Website analytics</h2>
          <p>
            If you enable &ldquo;Site analytics&rdquo; in Privacy choices, the
            website uses first-party analytics and Cloudflare Web Analytics to
            understand aggregate page visits, form progress, and site
            performance. Cloudflare Web Analytics does not use cookies or track
            individual visitors across websites.
          </p>
          <p>
            First-party records may include the page visited, date and time,
            broad device type, a random session identifier, whether the form was
            started, the number of completed fields, the selected project
            category, and whether the form was submitted or left unfinished. The
            referring website is included only when both Site analytics and
            Marketing attribution are enabled. Analytics records never include
            the name, email address, or message typed into a form.
          </p>
          <p>
            The random analytics identifier is stored only in the current
            browser tab&apos;s session storage and is not used to follow you
            across websites. The site&apos;s analytics records do not store your
            raw IP address and are automatically deleted after approximately 13
            months.
          </p>
          <h2>Privacy choices</h2>
          <p>
            Optional analytics, marketing attribution, and saved inquiry
            follow-up remain off until you make a choice in the site&apos;s
            privacy banner. Your category selections and the date of your choice
            are stored in this browser&apos;s local storage so the website can
            remember them. Essential security, spam prevention, preference
            storage, and form submission functions remain active. You can reopen
            Privacy choices from the footer and change these settings at any
            time.
          </p>
          <h2>Service providers and security</h2>
          <p>
            Netlify hosts the website, processes forms, runs website functions,
            manages authorized dashboard access, and stores analytics and lead
            records. Stored records are access-controlled, and the private
            insights page requires an authorized account. Cloudflare provides
            traffic analytics and domain services. These providers process data
            only as needed to operate the website and its supporting services.
          </p>
          <h2>Spam prevention</h2>
          <p>
            The contact form is protected by Google reCAPTCHA to reduce spam and
            abuse. Google&apos;s{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
            <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
            apply.
          </p>
          <h2>Contact</h2>
          <p>
            Questions, requests to access or correct information, or requests to
            delete a submitted inquiry or saved draft can be sent to{" "}
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
