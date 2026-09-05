import { NextResponse, type NextRequest } from "next/server";
import { routeAuth } from "./lib/auth/route-client";
import {
  publicAuthRoutes,
  safeReturnTo,
  loginLocation,
  sessionState,
  type SessionState,
} from "./lib/auth/policy";
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "");
  const isPublic = publicAuthRoutes.has(pathname);
  const protectedRoute =
    (pathname === "/nexus" || pathname.startsWith("/nexus/")) && !isPublic;
  if (!protectedRoute && !isPublic) return NextResponse.next({ request });
  const auth = routeAuth(request);
  let state: SessionState = "unavailable";
  try {
    const {
      data: { user },
      error,
    } = await auth.client.auth.getUser();
    state = sessionState(user, error);
  } catch {
    /* Keep public auth pages available during outages. */
  }
  let response = NextResponse.next({ request });
  const next = safeReturnTo(pathname + request.nextUrl.search);
  if (protectedRoute && state !== "authenticated") {
    const target =
      state === "unavailable"
        ? "/nexus/session-error?next=" + encodeURIComponent(next)
        : loginLocation(next, state);
    response = NextResponse.redirect(new URL(target, request.url));
  } else if (state === "authenticated" && pathname === "/nexus/login") {
    response = NextResponse.redirect(
      new URL(
        safeReturnTo(request.nextUrl.searchParams.get("next")),
        request.url,
      ),
    );
  }
  return auth.finish(response);
}
export const config = {
  matcher: [
    "/nexus",
    "/nexus/((?!_next(?:/|$)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};
