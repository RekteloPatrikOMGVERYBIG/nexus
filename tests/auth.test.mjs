import assert from "node:assert/strict";
import { test } from "node:test";
import nextServer from "next/server.js";
import { loadTS } from "./load-ts.mjs";
const { NextRequest } = nextServer;
const policy = loadTS("lib/auth/policy.ts");
for (const input of [
  undefined,
  "https://evil.test",
  "//evil.test",
  "/nexus/login",
  "/nexus/signup",
  "/nexus/login/child",
  "/nexus/%6cogin",
  "/nexus/../login",
  "/nexus/%255clogin",
  "/nexus/%2flogin",
  "/nexus/login%3Fnext=/nexus",
  "/nexus/login%23fragment",
  "/nexus/%0aprivate",
  "/nexus/%0dprivate",
  "/nexus/%09private",
  "/nexus/%7fprivate",
  "/nexus\\evil",
  "/other",
]) {
  test(`return URL rejects unsafe destination ${input}`, () =>
    assert.equal(policy.safeReturnTo(input), "/nexus"));
}
test("return URL preserves useful query but removes credentials", () =>
  assert.equal(
    policy.safeReturnTo(
      "/nexus/private?view=recent&token=secret&code=secret&next=evil",
    ),
    "/nexus/private?view=recent",
  ));
test("session distinguishes expiry, unconfirmed account and outage", () => {
  assert.equal(policy.sessionState(null, { status: 401 }), "expired");
  assert.equal(policy.sessionState(null, { status: 503 }), "unavailable");
  assert.equal(
    policy.sessionState(null, { name: "AuthSessionMissingError" }),
    "anonymous",
  );
  assert.equal(policy.sessionState({ id: "a" }, null), "unconfirmed");
});

function handlers(overrides = {}) {
  const calls = [];
  const result = {
    data: {
      user: { id: "verified-account", email_confirmed_at: "2026-01-01" },
    },
    error: null,
  };
  const browserAuth = {
    getUser: async () => overrides.session || result,
    signInWithPassword: async () => overrides.login || result,
    signOut: async (options) => {
      calls.push(["logout", options]);
      return overrides.logout || { error: null };
    },
  };
  const isolated = {
    verifyOtp: async (options) => {
      calls.push(["verify", options]);
      return overrides.verify || result;
    },
    updateUser: async (options) => {
      calls.push(["update", options]);
      return { error: null };
    },
    signOut: async () => ({ error: null }),
    signUp: async () => {
      calls.push(["signup"]);
      return { error: null };
    },
    resetPasswordForEmail: async () => ({ error: null }),
    resend: async () => ({ error: null }),
  };
  const mocks = {
    "@supabase/ssr": {
      createServerClient: (_url, _key, { cookies }) => {
        cookies.setAll(
          [{ name: "session", value: "refreshed", options: { path: "/" } }],
          {},
        );
        return { auth: browserAuth };
      },
    },
    "@supabase/supabase-js": { createClient: () => ({ auth: isolated }) },
  };
  return {
    ...loadTS("app/api/auth/[action]/route.ts", mocks),
    confirm: loadTS("app/nexus/confirm/route.ts", mocks).GET,
    calls,
  };
}
function request(action, body = {}, headers = {}) {
  return new NextRequest(`https://nexus.test/api/auth/${action}`, {
    method: "POST",
    headers: {
      origin: "https://nexus.test",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
const context = (action) => ({ params: Promise.resolve({ action }) });
test("cross-origin mutation rejected before auth", async () => {
  const api = handlers();
  assert.equal(
    (
      await api.POST(
        request("logout", {}, { origin: "https://evil.test" }),
        context("logout"),
      )
    ).status,
    403,
  );
  assert.equal(api.calls.length, 0);
});
test("login carries refreshed cookies and sanitized return route", async () => {
  const api = handlers();
  const response = await api.POST(
    request("login", {
      email: "user@example.com",
      password: "password",
      next: "//evil.test",
    }),
    context("login"),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).next, "/nexus");
  assert.equal(response.cookies.get("session").value, "refreshed");
});
test("unconfirmed users cannot sign in", async () => {
  const api = handlers({ login: { data: { user: { id: "a" } }, error: null } });
  assert.equal(
    (
      await api.POST(
        request("login", { email: "user@example.com", password: "password" }),
        context("login"),
      )
    ).status,
    403,
  );
  assert.equal(api.calls[0][0], "logout");
});
test("logout failure is not reported as success", async () => {
  const api = handlers({ logout: { error: { status: 500 } } });
  assert.equal(
    (await api.POST(request("logout"), context("logout"))).status,
    503,
  );
  assert.equal(api.calls[0][1].scope, "local");
});
test("password validation happens before registration", async () => {
  const api = handlers();
  assert.equal(
    (
      await api.POST(
        request("signup", {
          email: "user@example.com",
          password: "short",
          confirmPassword: "short",
        }),
        context("signup"),
      )
    ).status,
    400,
  );
  assert.equal(api.calls.length, 0);
});
test("ordinary signed-in session cannot reset without recovery proof", async () => {
  const api = handlers();
  assert.equal(
    (
      await api.POST(
        request("reset", {
          password: "long-password",
          confirmPassword: "long-password",
        }),
        context("reset"),
      )
    ).status,
    400,
  );
  assert.equal(api.calls.length, 0);
});
test("password changes only after isolated recovery verification", async () => {
  const api = handlers();
  const response = await api.POST(
    request(
      "reset",
      { password: "long-password", confirmPassword: "long-password" },
      { cookie: "nexus-recovery=" + "a".repeat(64) },
    ),
    context("reset"),
  );
  assert.equal(response.status, 200);
  assert.equal(api.calls[0][0], "verify");
  assert.equal(api.calls[0][1].type, "recovery");
  assert.equal(api.calls[1][0], "update");
  assert.equal(response.cookies.get("nexus-recovery").maxAge, 0);
});
test("expired or replayed recovery token never updates password", async () => {
  const api = handlers({
    verify: { data: { user: null }, error: { status: 403 } },
  });
  const response = await api.POST(
    request(
      "reset",
      { password: "long-password", confirmPassword: "long-password" },
      { cookie: "nexus-recovery=" + "a".repeat(64) },
    ),
    context("reset"),
  );
  assert.equal(response.status, 400);
  assert.equal(api.calls.length, 1);
  assert.equal(response.cookies.get("nexus-recovery").maxAge, 0);
});
test("recovery landing hides token from URL without creating browser session", async () => {
  const api = handlers();
  const response = await api.confirm(
    new NextRequest(
      "https://nexus.test/nexus/confirm?type=recovery&token_hash=" +
        "a".repeat(64),
    ),
  );
  assert.equal(
    new URL(response.headers.get("location")).pathname,
    "/nexus/reset-password",
  );
  assert.equal(response.cookies.get("nexus-recovery").httpOnly, true);
  assert.equal(response.cookies.get("session"), undefined);
  assert.equal(api.calls.length, 0);
});
test("session endpoint fails closed during outage", async () => {
  const api = handlers({
    session: { data: { user: null }, error: { status: 503 } },
  });
  const response = await api.GET(
    new NextRequest("https://nexus.test/api/auth/session"),
    context("session"),
  );
  assert.equal(response.status, 503);
  assert.match(response.headers.get("cache-control"), /no-store/);
});
