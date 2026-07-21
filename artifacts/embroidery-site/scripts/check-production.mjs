import { resolve4 } from "node:dns/promises";
import tls from "node:tls";

const origin = process.argv[2] ?? "https://embroideryandthreads.com";
const hostname = new URL(origin).hostname;
const errors = [];
const requestAttempts = 3;
const requestTimeoutMs = 10_000;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function describeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error?.cause;
  const causeDetail = cause?.code ?? cause?.message;
  return causeDetail ? `${message} (${causeDetail})` : message;
}

async function request(path, expectedStatus, { binary = false } = {}) {
  let lastFailure = "request failed";

  for (let attempt = 1; attempt <= requestAttempts; attempt += 1) {
    try {
      const response = await fetch(new URL(path, origin), {
        cache: "no-store",
        headers: {
          accept: binary ? "image/*" : "text/html,*/*;q=0.8",
          "user-agent": "EmbroideryAndThreadsProductionMonitor/1.0",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
      const body = binary
        ? Buffer.from(await response.arrayBuffer())
        : await response.text();

      if (response.status === expectedStatus) return { response, body };

      lastFailure = `expected ${expectedStatus}, received ${response.status}`;
    } catch (error) {
      lastFailure = describeError(error);
    }

    if (attempt < requestAttempts) await sleep(750 * attempt);
  }

  errors.push(
    `${path}: ${lastFailure} after ${requestAttempts} attempts.`,
  );
  return { response: null, body: binary ? Buffer.alloc(0) : "" };
}

const home = await request("/", 200);
const reviews = await request("/reviews", 200);
const faq = await request("/faq", 200);
const privacy = await request("/privacy", 200);
await request("/admin/", 200);
await request(`/monitor-missing-${Date.now()}`, 404);

for (const [name, page, title] of [
  ["home", home, "Custom Embroidery in Castle Rock, CO"],
  ["reviews", reviews, "Customer Reviews"],
  ["faq", faq, "Custom Embroidery FAQ"],
  ["privacy", privacy, "Privacy Policy"],
]) {
  if (!page.body.includes(`<title>${title}`) && !page.body.includes(title)) {
    errors.push(`${name}: expected title was not found.`);
  }
  if (!page.body.includes('rel="canonical"')) errors.push(`${name}: canonical link is missing.`);
}

if (
  !/<form\b[^>]*\bname=(["'])contact\1/i.test(home.body) ||
  !/<input\b[^>]*\bname=(["'])form-name\1[^>]*\bvalue=(["'])contact\2/i.test(home.body)
) {
  errors.push("home: Netlify form detection shell is missing.");
}

if (!home.body.includes("https://static.cloudflareinsights.com/beacon.min.js")) {
  errors.push("home: Cloudflare Web Analytics beacon is missing.");
}

const assetVersion = home.body.match(/opengraph\.jpg\?v=([a-zA-Z0-9_-]+)/)?.[1];
if (!assetVersion) {
  errors.push("home: deployment-versioned media URLs are missing.");
} else {
  const logo = await request(`/logo-b.jpg?v=${assetVersion}`, 200, {
    binary: true,
  });
  if (logo.response) {
    if (!logo.response.headers.get("content-type")?.startsWith("image/jpeg")) {
      errors.push("logo: expected JPEG content type was not returned.");
    }
    if (logo.body.length < 1_000) {
      errors.push("logo: response was unexpectedly empty or truncated.");
    }
  }
}

for (const header of ["content-security-policy", "x-content-type-options", "x-frame-options"]) {
  if (!home.response?.headers.get(header)) errors.push(`home: ${header} header is missing.`);
}

try {
  const response = await fetch(`https://www.${hostname}/`, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  if (![301, 302, 307, 308].includes(response.status) || !location.startsWith(origin)) {
    errors.push(`www redirect: received ${response.status} with location ${location || "(none)"}.`);
  }
} catch (error) {
  errors.push(`www redirect: ${error.message}`);
}

try {
  const addresses = await resolve4(hostname);
  if (!addresses.length) errors.push("DNS: apex did not return an IPv4 address.");
} catch (error) {
  errors.push(`DNS: ${error.message}`);
}

try {
  const certificate = await new Promise((resolve, reject) => {
    const socket = tls.connect(443, hostname, { servername: hostname, rejectUnauthorized: true }, () => {
      const peer = socket.getPeerCertificate();
      socket.end();
      resolve(peer);
    });
    socket.setTimeout(10_000, () => socket.destroy(new Error("TLS connection timed out.")));
    socket.on("error", reject);
  });
  const daysRemaining = (Date.parse(certificate.valid_to) - Date.now()) / 86_400_000;
  if (daysRemaining < 14) errors.push(`TLS: certificate expires in ${daysRemaining.toFixed(1)} days.`);
} catch (error) {
  errors.push(`TLS: ${error.message}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Production checks passed for ${origin}.`);
