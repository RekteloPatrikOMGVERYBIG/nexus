export const publicAuthRoutes = new Set([
  "/nexus/login",
  "/nexus/signup",
  "/nexus/confirm",
  "/nexus/callback",
  "/nexus/forgot-password",
  "/nexus/reset-password",
  "/nexus/session-error",
]);
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const RECOVERY_COOKIE = "nexus-recovery";
export const RECOVERY_MAX_AGE = 600;

export function safeReturnTo(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return "/nexus";
  try {
    const url = new URL(value, "https://nexus.invalid");
    const path = decodeURIComponent(url.pathname).replace(/\/+$/, "");
    if (
      url.origin !== "https://nexus.invalid" ||
      path.includes("//") ||
      // Decoding must not introduce URL delimiters or control characters.
      /[%\\?#\u0000-\u0020\u007f]/.test(path) ||
      !(path === "/nexus" || path.startsWith("/nexus/")) ||
      [...publicAuthRoutes].some(
        (route) => path === route || path.startsWith(route + "/"),
      )
    )
      return "/nexus";
    // Auth credentials must never be forwarded as navigation context.
    for (const key of [...url.searchParams.keys()]) {
      if (/token|secret|password|code|^type$|^next$|^error/i.test(key))
        url.searchParams.delete(key);
    }
    return path + url.search;
  } catch {
    return "/nexus";
  }
}

export function loginLocation(next: unknown, reason?: string) {
  const params = new URLSearchParams({ next: safeReturnTo(next) });
  if (reason) params.set("reason", reason);
  return "/nexus/login?" + params;
}

export type SessionState =
  "authenticated" | "anonymous" | "expired" | "unconfirmed" | "unavailable";
export function sessionState(
  user: { email_confirmed_at?: string } | null,
  error: { status?: number; code?: string; name?: string } | null,
): SessionState {
  if (error) {
    if (
      error.code === "session_not_found" ||
      error.name === "AuthSessionMissingError"
    )
      return "anonymous";
    if ([400, 401, 403].includes(error.status || 0)) return "expired";
    return "unavailable";
  }
  if (!user) return "anonymous";
  return user.email_confirmed_at ? "authenticated" : "unconfirmed";
}

export function validEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}
export function validPassword(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= PASSWORD_MIN_LENGTH &&
    value.length <= PASSWORD_MAX_LENGTH
  );
}
export function validTokenHash(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{20,256}$/.test(value);
}
