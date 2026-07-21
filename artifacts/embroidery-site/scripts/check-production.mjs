import { resolve4 } from "node:dns/promises";
import tls from "node:tls";

const origin = process.argv[2] ?? "https://embroideryandthreads.com";
const hostname = new URL(origin).hostname;
const errors = [];

async function request(path, expectedStatus) {
  try {
    const response = await fetch(new URL(path, origin), {
      headers: { "user-agent": "EmbroideryAndThreadsProductionMonitor/1.0" },
      redirect: "follow",
    });
    if (response.status !== expectedStatus) {
      errors.push(`${path}: expected ${expectedStatus}, received ${response.status}.`);
    }
    return { response, body: await response.text() };
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
    return { response: null, body: "" };
  }
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
