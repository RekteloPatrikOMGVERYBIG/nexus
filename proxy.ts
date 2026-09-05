import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Exact matches only: a child of an auth page is not automatically public.
const publicAuthRoutes = new Set([
  "/nexus/login",
  "/nexus/signup",
  "/nexus/confirm",
  "/nexus/callback",
  "/nexus/forgot-password",
  "/nexus/reset-password",
]);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "");
  const isPublicAuthRoute = publicAuthRoutes.has(pathname);
  const isProtectedRoute =
    (pathname === "/nexus" || pathname.startsWith("/nexus/")) &&
    !isPublicAuthRoute;

  if (!isProtectedRoute && !isPublicAuthRoute) {
    return NextResponse.next({ request });
  }

  const pendingCookies = new Map<
    string,
    { name: string; value: string; options: CookieOptions }
  >();
  const authHeaders = new Headers();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHARE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach((cookie) => {
            request.cookies.set(cookie.name, cookie.value);
            pendingCookies.set(cookie.name, cookie);
          });
          Object.entries(headers).forEach(([name, value]) => {
            authHeaders.set(name, value);
          });
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  const isAuthenticated = !error && Boolean(user);

  // Construct the response after refresh so downstream requests see updated cookies.
  let response = NextResponse.next({ request });
  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/nexus/login";
    url.search = "";
    response = NextResponse.redirect(url);
  } else if (isAuthenticated && pathname === "/nexus/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/nexus";
    url.search = "";
    response = NextResponse.redirect(url);
  }

  // Both redirects and pass-through responses must carry all SSR cookie updates.
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  authHeaders.forEach((value, name) => response.headers.set(name, value));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/nexus",
    "/nexus/((?!_next(?:/|$)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};
