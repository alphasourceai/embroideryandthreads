import assert from "node:assert/strict";
import test from "node:test";
import type { Context } from "@netlify/functions";
import { requireInsightsUser } from "./auth.ts";

const request = new Request(
  "https://embroideryandthreads.com/.netlify/functions/insights",
);

function contextWithToken(token: string): Context {
  return {
    cookies: {
      get: (name: string) => (name === "nf_jwt" ? token : ""),
    },
    site: { url: "https://embroideryandthreads.com" },
  } as Context;
}

test("accepts a verified Identity user with the analytics role", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (input, init) => {
    assert.equal(
      input.toString(),
      "https://embroideryandthreads.com/.netlify/identity/user",
    );
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer valid-token",
    );
    return Response.json({
      id: "user-1",
      email: "admin@example.com",
      app_metadata: { roles: ["analytics"] },
    });
  };

  const result = await requireInsightsUser(
    request,
    contextWithToken("valid-token"),
  );

  assert.ok("user" in result);
  assert.equal(result.user.email, "admin@example.com");
  assert.deepEqual(result.user.roles, ["analytics"]);
});

test("rejects a session token that Identity does not validate", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () => new Response("Unauthorized", { status: 401 });

  const result = await requireInsightsUser(
    request,
    contextWithToken("invalid-token"),
  );

  assert.ok("error" in result);
  assert.equal(result.error.status, 401);
});

test("rejects a verified user without an authorized role", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () =>
    Response.json({
      id: "user-2",
      email: "viewer@example.com",
      app_metadata: { roles: [] },
    });

  const result = await requireInsightsUser(
    request,
    contextWithToken("valid-token"),
  );

  assert.ok("error" in result);
  assert.equal(result.error.status, 403);
});
