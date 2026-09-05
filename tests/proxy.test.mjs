import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTS } from "./load-ts.mjs";
import nextServer from "next/server.js";
import nextTesting from "next/experimental/testing/server.js";

const { NextRequest } = nextServer;
// The installed Next.js exports the old helper name despite its Proxy documentation.
const { unstable_doesMiddlewareMatch: unstable_doesProxyMatch } = nextTesting;

// Execute the actual proxy with real Next request/response objects; only Auth is stubbed.
function loadProxy(user, cookieUpdates = []) {
  let calls = 0;
  const exports = loadTS("proxy.ts", {
    "@supabase/ssr": {
      createServerClient(_url, _key, { cookies }) {
        return {
          auth: {
            async getUser() {
              calls++;
              for (const batch of cookieUpdates)
                cookies.setAll(batch, {
                  "Cache-Control": "private, no-store",
                  Pragma: "no-cache",
                  Expires: "0",
                });
              return {
                data: { user },
                error: user
                  ? null
                  : { status: 401, code: "refresh_token_not_found" },
              };
            },
          },
        };
      },
    },
  });
  return { ...exports, calls: () => calls };
}

for (const [name, user, path, destination] of [
  ["logged out -> login", null, "/nexus/login", null],
  ["logged out -> nexus", null, "/nexus", "/nexus/login"],
  [
    "logged in -> nexus",
    { id: "test-user", email_confirmed_at: "2026-01-01" },
    "/nexus",
    null,
  ],
  [
    "logged in -> login",
    { id: "test-user", email_confirmed_at: "2026-01-01" },
    "/nexus/login",
    "/nexus",
  ],
  [
    "expired/invalid session -> nexus",
    null,
    "/nexus?view=recent",
    "/nexus/login",
  ],
  ["logged out -> child", null, "/nexus/private/item", "/nexus/login"],
  ["login trailing slash", null, "/nexus/login/", null],
  [
    "login child remains protected",
    null,
    "/nexus/login/private",
    "/nexus/login",
  ],
]) {
  test(name, async () => {
    const { proxy } = loadProxy(user);
    const response = await proxy(new NextRequest("https://nexus.test" + path));
    const location = response.headers.get("location");
    assert.equal(location ? new URL(location).pathname : null, destination);
    assert.equal(response.status, destination ? 307 : 200);
    if (location) {
      assert.notEqual(
        location,
        "https://nexus.test" + path,
        "must not redirect to itself",
      );
      const next = await proxy(new NextRequest(location));
      assert.equal(
        next.headers.get("location"),
        null,
        "redirect chain must terminate",
      );
    }
  });
}

for (const path of [
  "signup",
  "confirm",
  "callback",
  "forgot-password",
  "reset-password",
]) {
  test(`public auth route: ${path}`, async () => {
    const { proxy } = loadProxy(null);
    const response = await proxy(
      new NextRequest(`https://nexus.test/nexus/${path}`),
    );
    assert.equal(response.headers.get("location"), null);
  });
}

for (const [user, path] of [
  [null, "/nexus"],
  [{ id: "test-user", email_confirmed_at: "2026-01-01" }, "/nexus/login"],
  [{ id: "test-user", email_confirmed_at: "2026-01-01" }, "/nexus"],
]) {
  test(`SSR cookies and cache headers survive: ${Boolean(user)} ${path}`, async () => {
    const { proxy } = loadProxy(user, [
      [
        {
          name: "session.0",
          value: "fixture",
          options: { path: "/", secure: true, sameSite: "lax", httpOnly: true },
        },
      ],
      [{ name: "session.1", value: "", options: { path: "/", maxAge: 0 } }],
    ]);
    const request = new NextRequest("https://nexus.test" + path);
    const response = await proxy(request);
    assert.equal(response.cookies.get("session.0").value, "fixture");
    assert.equal(response.cookies.get("session.0").secure, true);
    assert.equal(response.cookies.get("session.0").httpOnly, true);
    assert.equal(response.cookies.get("session.0").sameSite, "lax");
    assert.equal(response.cookies.get("session.1").maxAge, 0);
    assert.equal(request.cookies.get("session.0").value, "fixture");
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("pragma"), "no-cache");
  });
}

test("matcher selects only relevant nexus pages", () => {
  const { config } = loadProxy(null);
  for (const path of ["/nexus", "/nexus/login", "/nexus/private/item"]) {
    assert.equal(
      unstable_doesProxyMatch({ config, nextConfig: {}, url: path }),
      true,
      path,
    );
  }
  for (const path of [
    "/",
    "/api/test",
    "/nexus-other",
    "/_next/static/test.js",
    "/_next/image?url=x",
    "/favicon.ico",
    "/logo.svg",
    "/nexus/_next/static/test.js",
    "/nexus/logo.svg",
  ]) {
    assert.equal(
      unstable_doesProxyMatch({ config, nextConfig: {}, url: path }),
      false,
      path,
    );
  }
});
