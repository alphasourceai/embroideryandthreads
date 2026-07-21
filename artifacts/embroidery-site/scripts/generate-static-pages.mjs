import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDir = path.join(appRoot, "dist", "public");
const source = await readFile(path.join(outputDir, "index.html"), "utf8");
const faqItems = JSON.parse(
  await readFile(path.join(appRoot, "src", "content", "faq.json"), "utf8"),
);

const home = {
  title: "Custom Embroidery in Castle Rock, CO | Embroidery & Threads",
  description:
    "Shop custom embroidery in Castle Rock, Colorado, including personalized sweatshirts, gifts, stockings, totes, and made-to-order pieces for local pickup.",
  socialDescription:
    "Personalized sweatshirts, gifts, stockings, totes, and custom embroidered pieces handmade in Castle Rock, Colorado for local pickup.",
  url: "https://embroideryandthreads.com/",
  robots: "index, follow, max-image-preview:large",
};

const pages = [
  {
    file: "reviews.html",
    title: "Customer Reviews | Embroidery & Threads Castle Rock",
    description:
      "See customer stories and custom embroidery shared by Embroidery & Threads customers in Castle Rock, Colorado.",
    url: "https://embroideryandthreads.com/reviews",
    robots: home.robots,
  },
  {
    file: "faq.html",
    title: "Custom Embroidery FAQ | Embroidery & Threads Castle Rock",
    description:
      "Find answers about custom embroidery turnaround, rush orders, local pickup, payment, cancellations, and garment care from Embroidery & Threads in Castle Rock.",
    url: "https://embroideryandthreads.com/faq",
    robots: home.robots,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    },
  },
  {
    file: "privacy.html",
    title: "Privacy Policy | Embroidery & Threads",
    description:
      "Learn how Embroidery & Threads handles information submitted through its custom embroidery inquiry form.",
    url: "https://embroideryandthreads.com/privacy",
    robots: home.robots,
  },
  {
    file: "404.html",
    title: "Page Not Found | Embroidery & Threads",
    description:
      "The requested page could not be found. Return to Embroidery & Threads for custom embroidery in Castle Rock, Colorado.",
    url: "https://embroideryandthreads.com/404",
    robots: "noindex, nofollow",
  },
];

function replaceRequired(html, search, replacement) {
  if (!html.includes(search)) {
    throw new Error(`Expected metadata was not found: ${search}`);
  }

  return html.replaceAll(search, replacement);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderPage(page) {
  let html = source;
  html = replaceRequired(html, escapeHtml(home.title), escapeHtml(page.title));
  html = replaceRequired(
    html,
    escapeHtml(home.description),
    escapeHtml(page.description),
  );
  html = replaceRequired(
    html,
    escapeHtml(home.socialDescription),
    escapeHtml(page.description),
  );
  html = replaceRequired(
    html,
    `<link rel="canonical" href="${home.url}" />`,
    `<link rel="canonical" href="${page.url}" />`,
  );
  html = replaceRequired(
    html,
    `<meta property="og:url" content="${home.url}" />`,
    `<meta property="og:url" content="${page.url}" />`,
  );
  html = replaceRequired(html, home.robots, page.robots);
  if (page.structuredData) {
    const json = JSON.stringify(page.structuredData).replaceAll("<", "\\u003c");
    html = replaceRequired(
      html,
      "</head>",
      `    <script type="application/ld+json">${json}</script>\n  </head>`,
    );
  }
  return html;
}

await Promise.all(
  pages.map((page) =>
    writeFile(path.join(outputDir, page.file), renderPage(page), "utf8"),
  ),
);
