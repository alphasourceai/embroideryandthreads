const PRODUCTION_HOSTS = new Set([
  "embroideryandthreads.com",
  "www.embroideryandthreads.com",
  "embroideryandthreads.netlify.app",
]);

export const jsonResponse = (data: unknown, init: ResponseInit = {}) =>
  Response.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...init.headers,
    },
  });

export function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const { hostname } = new URL(origin);
    return (
      PRODUCTION_HOSTS.has(hostname) ||
      hostname.endsWith("--embroideryandthreads.netlify.app") ||
      hostname === "localhost" ||
      hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

export async function readJsonBody(request: Request, maxBytes = 12_000) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) throw new Error("Payload too large");

  const text = await request.text();
  if (text.length > maxBytes) throw new Error("Payload too large");
  return JSON.parse(text) as unknown;
}

export function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isOpaqueId(value: unknown) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{16,80}$/.test(value);
}
