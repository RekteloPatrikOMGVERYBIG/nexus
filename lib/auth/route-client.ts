import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { type NextRequest, type NextResponse } from "next/server";
import { supabaseConfig } from "../supabase/config";

export const authFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    signal: init?.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });

// Isolated clients never replace an existing browser account during email verification/recovery.
export function isolatedAuth() {
  const { url, key } = supabaseConfig();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { fetch: authFetch },
  });
}

export function routeAuth(request: NextRequest) {
  const { url, key } = supabaseConfig();
  const updates = new Map<
    string,
    { name: string; value: string; options: CookieOptions }
  >();
  const headers = new Headers();
  const client = createServerClient(url, key, {
    global: { fetch: authFetch },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies, extraHeaders) {
        for (const cookie of cookies) {
          updates.set(cookie.name, cookie);
          request.cookies.set(cookie.name, cookie.value);
        }
        for (const [name, value] of Object.entries(extraHeaders))
          headers.set(name, value);
      },
    },
  });
  function finish(response: NextResponse) {
    updates.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options),
    );
    headers.forEach((value, name) => response.headers.set(name, value));
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  return { client, finish };
}
