import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDir = path.join(appRoot, "dist", "public");
const serverOutputDir = path.join(appRoot, "dist", "server");
const source = await readFile(path.join(outputDir, "index.html"), "utf8");
const { render } = await import(
  pathToFileURL(path.join(serverOutputDir, "entry-server.js")).href
);
const formDetectionStart = "<!-- netlify-form-detection:start -->";
const formDetectionEnd = "<!-- netlify-form-detection:end -->";
const faqItems = JSON.parse(
  await readFile(path.join(appRoot, "src", "content", "faq.json"), "utf8"),
);
const pricing = JSON.parse(
  await readFile(path.join(appRoot, "src", "content", "pricing.json"), "utf8"),
);
const services = JSON.parse(
  await readFile(path.join(appRoot, "src", "content", "services.json"), "utf8"),
);

const home = {
  file: "index.html",
  path: "/",
  title: "Custom Embroidery in Castle Rock, CO | Embroidery & Threads",
  description:
    "Explore custom embroidery and starting prices in Castle Rock, Colorado for personalized sweatshirts, hats, baby gifts, totes, logo embroidery, and local pickup.",
  socialDescription:
    "Custom sweatshirts, hats, baby gifts, totes, and logo embroidery handmade in Castle Rock, Colorado, with starting prices and local pickup.",
  url: "https://embroideryandthreads.com/",
  robots: "index, follow, max-image-preview:large",
};

const pages = [
  {
    file: "pricing.html",
    path: "/pricing",
    title: "Custom Embroidery Pricing | Castle Rock, CO",
    description:
      "View starting prices for custom embroidered apparel, hats, baby items, gifts, totes, logos, and add-ons from Embroidery & Threads in Castle Rock.",
    url: "https://embroideryandthreads.com/pricing",
    robots: home.robots,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Embroidery & Threads starting prices",
      url: "https://embroideryandthreads.com/pricing",
      itemListElement: pricing.categories.flatMap((category) =>
        category.items.map((item) => ({
          "@type": "Offer",
          category: category.name,
          priceCurrency: "USD",
          description: `${item.name}: ${item.price}${item.note ? ` - ${item.note}` : ""}`,
          itemOffered: {
            "@type": "Service",
            name: item.name,
          },
        })),
      ),
    },
  },
  {
    file: "reviews.html",
    path: "/reviews",
    title: "Customer Reviews | Embroidery & Threads Castle Rock",
    description:
      "See customer stories and custom embroidery shared by Embroidery & Threads customers in Castle Rock, Colorado.",
    url: "https://embroideryandthreads.com/reviews",
    robots: home.robots,
  },
  {
    file: "faq.html",
    path: "/faq",
    title: "Custom Embroidery FAQ | Embroidery & Threads Castle Rock",
    description:
      "Find answers about custom embroidery pricing, turnaround, rush orders, local pickup, payment, cancellations, and garment care in Castle Rock.",
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
    path: "/privacy",
    title: "Privacy Policy | Embroidery & Threads",
    description:
      "Learn how Embroidery & Threads handles inquiry information, saved drafts, and privacy-friendly website analytics.",
    url: "https://embroideryandthreads.com/privacy",
    robots: home.robots,
  },
  {
    file: "insights.html",
    path: "/insights",
    title: "Site Insights | Embroidery & Threads",
    description:
      "Private website analytics and inquiry management for authorized Embroidery & Threads administrators.",
    url: "https://embroideryandthreads.com/insights",
    robots: "noindex, nofollow",
  },
  {
    file: "404.html",
    path: "/404",
    title: "Page Not Found | Embroidery & Threads",
    description:
      "The requested page could not be found. Return to Embroidery & Threads for custom embroidery in Castle Rock, Colorado.",
    url: "https://embroideryandthreads.com/404",
    robots: "noindex, nofollow",
  },
  ...services.map((service) => {
    const url = `https://embroideryandthreads.com/${service.slug}`;

    return {
      file: `${service.slug}.html`,
      path: `/${service.slug}`,
      title: `${service.title} | Embroidery & Threads`,
      description: service.description,
      url,
      robots: home.robots,
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name: service.title,
            serviceType: service.navLabel,
            description: service.description,
            url,
            areaServed: {
              "@type": "City",
              name: "Castle Rock, Colorado",
            },
            provider: {
              "@id": "https://embroideryandthreads.com/#business",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://embroideryandthreads.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: service.title,
                item: url,
              },
            ],
          },
        ],
      },
    };
  }),
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

async function renderPage(page) {
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
  if (page.path !== "/") {
    html = removeMarkedBlock(html, formDetectionStart, formDetectionEnd);
  }
  const markup = await render(page.path);
  html = replaceRequired(
    html,
    '<div id="root"></div>',
    `<div id="root" data-prerendered="true">${markup}</div>`,
  );
  return html;
}

function removeMarkedBlock(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Expected marked block was not found: ${startMarker}`);
  }

  return html.slice(0, start) + html.slice(end + endMarker.length);
}

await Promise.all(
  [home, ...pages].map(async (page) =>
    writeFile(
      path.join(outputDir, page.file),
      await renderPage(page),
      "utf8",
    ),
  ),
);

await rm(serverOutputDir, { recursive: true, force: true });
