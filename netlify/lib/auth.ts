import { getUser } from "@netlify/identity";

export async function requireInsightsUser() {
  const user = await getUser();
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
