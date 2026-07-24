import { getUser } from "@netlify/identity";
import type { Context } from "@netlify/functions";

type InsightsUser = {
  id: string;
  email?: string;
  roles?: string[];
};

export async function requireInsightsUser(request: Request, context: Context) {
  const user =
    (await getUser()) ?? (await getUserFromRequest(request, context));
  if (!user) return { error: new Response("Unauthorized", { status: 401 }) };

  const allowedEmails = (process.env.ANALYTICS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const roles = user.roles ?? [];
  const hasAccess =
    roles.includes("analytics") ||
    roles.includes("admin") ||
    Boolean(user.email && allowedEmails.includes(user.email.toLowerCase()));

  if (!hasAccess) {
    return { error: new Response("Forbidden", { status: 403 }) };
  }

  return { user };
}

async function getUserFromRequest(
  request: Request,
  context: Context,
): Promise<InsightsUser | null> {
  const token =
    getBearerToken(request.headers.get("authorization")) ??
    context.cookies.get("nf_jwt") ??
    getCookie(request.headers.get("cookie"), "nf_jwt");
  if (!token) return null;

  const identityUrl = new URL(
    "/.netlify/identity/user",
    context.site.url ?? process.env.URL ?? new URL(request.url).origin,
  );

  try {
    const response = await fetch(identityUrl, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;

    const user = (await response.json()) as Record<string, unknown>;
    const appMetadata = isRecord(user.app_metadata) ? user.app_metadata : {};
    const roles = Array.isArray(appMetadata.roles)
      ? appMetadata.roles.filter(
          (role): role is string => typeof role === "string",
        )
      : [];

    return {
      id: typeof user.id === "string" ? user.id : "",
      email: typeof user.email === "string" ? user.email : undefined,
      roles,
    };
  } catch {
    return null;
  }
}

function getBearerToken(authorization: string | null) {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

function getCookie(header: string | null, name: string) {
  if (!header) return undefined;

  for (const pair of header.split(";")) {
    const separator = pair.indexOf("=");
    if (separator === -1 || pair.slice(0, separator).trim() !== name) continue;

    const value = pair.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
