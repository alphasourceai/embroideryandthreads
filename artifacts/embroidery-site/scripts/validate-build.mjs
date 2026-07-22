import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDir = path.join(appRoot, "dist", "public");
const errors = [];

const pages = [
  [
    "index.html",
    "Custom Embroidery in Castle Rock, CO",
    "https://embroideryandthreads.com/",
    "index",
  ],
  [
    "pricing.html",
    "Custom Embroidery Pricing",
    "https://embroideryandthreads.com/pricing",
    "index",
  ],
  [
    "reviews.html",
    "Customer Reviews",
    "https://embroideryandthreads.com/reviews",
    "index",
  ],
  [
    "faq.html",
    "Custom Embroidery FAQ",
    "https://embroideryandthreads.com/faq",
    "index",
  ],
  [
    "privacy.html",
    "Privacy Policy",
    "https://embroideryandthreads.com/privacy",
    "index",
  ],
  [
    "insights.html",
    "Site Insights",
    "https://embroideryandthreads.com/insights",
    "noindex",
  ],
  [
    "404.html",
    "Page Not Found",
    "https://embroideryandthreads.com/404",
    "noindex",
  ],
];

function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes ?? []) walk(child, visit);
}

function attributes(node) {
  return Object.fromEntries(
    (node.attrs ?? []).map(({ name, value }) => [name, value]),
  );
}

for (const [file, titleNeedle, canonical, robotsNeedle] of pages) {
  const html = await readFile(path.join(outputDir, file), "utf8");
  const document = parse(html);
  let title = "";
  const metas = [];
  const links = [];
  const forms = [];

  walk(document, (node) => {
    if (node.tagName === "title") {
      title = (node.childNodes ?? [])
        .map((child) => child.value ?? "")
        .join("");
    }
    if (node.tagName === "meta") metas.push(attributes(node));
    if (node.tagName === "link") links.push(attributes(node));
    if (node.tagName === "form") forms.push(attributes(node));
  });

  const description = metas.find(
    (meta) => meta.name === "description",
  )?.content;
  const robots = metas.find((meta) => meta.name === "robots")?.content;
  const canonicalHref = links.find((link) => link.rel === "canonical")?.href;

  if (!title.includes(titleNeedle)) errors.push(`${file}: unexpected title.`);
  if (!description || description.length < 70)
    errors.push(`${file}: missing or short description.`);
  if (canonicalHref !== canonical)
    errors.push(`${file}: canonical URL is incorrect.`);
  if (!robots?.includes(robotsNeedle))
    errors.push(`${file}: robots directive is incorrect.`);
  if (/replit/i.test(html))
    errors.push(`${file}: contains Replit placeholder metadata.`);
  if (html.includes("__ASSET_VERSION__")) {
    errors.push(`${file}: unresolved public asset version placeholder.`);
  }

  if (file === "faq.html" && !html.includes('"@type":"FAQPage"')) {
    errors.push("faq.html: FAQPage structured data is missing.");
  }

  if (file === "pricing.html" && !html.includes('"@type":"OfferCatalog"')) {
    errors.push("pricing.html: OfferCatalog structured data is missing.");
  }

  if (file === "index.html") {
    const socialImage = metas.find(
      (meta) => meta.property === "og:image",
    )?.content;
    if (!socialImage?.includes("opengraph.jpg?v=")) {
      errors.push("index.html: social image is not deployment-versioned.");
    }
    const contactForm = forms.find((form) => form.name === "contact");
    if (!contactForm || contactForm["data-netlify"] !== "true") {
      errors.push("index.html: Netlify contact form shell is missing.");
    }
    if (!html.includes("https://static.cloudflareinsights.com/beacon.min.js")) {
      errors.push("index.html: Cloudflare Web Analytics beacon is missing.");
    }
  }
}

const requiredFiles = [
  "admin/config.yml",
  "admin/index.html",
  "favicon-32x32.png",
  "icon-192.png",
  "icon-512.png",
  "llms.txt",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
];

for (const file of requiredFiles) {
  try {
    await stat(path.join(outputDir, file));
  } catch {
    errors.push(`Missing required build artifact: ${file}`);
  }
}

const assetsDir = path.join(outputDir, "assets");
for (const file of await readdir(assetsDir)) {
  const size = (await stat(path.join(assetsDir, file))).size;
  if (file.endsWith(".js") && size > 350_000)
    errors.push(`${file}: JavaScript exceeds 350 KB.`);
  if (file.endsWith(".css") && size > 130_000)
    errors.push(`${file}: CSS exceeds 130 KB.`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  "Validated metadata, form detection, required files, and asset budgets.",
);
