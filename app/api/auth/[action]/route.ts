import { NextRequest, NextResponse } from "next/server";
import { isolatedAuth, routeAuth } from "@/lib/auth/route-client";
import {
  RECOVERY_COOKIE,
  safeReturnTo,
  sessionState,
  validEmail,
  validPassword,
  validTokenHash,
} from "@/lib/auth/policy";

function reply(message: string, status = 200, extra = {}) {
  return NextResponse.json(
    { message, ...extra },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}
function errorReply(error: { code?: string; status?: number }) {
  if (error.status === 429)
    return reply("Too many attempts. Please wait before trying again.", 429);
  if (error.code === "email_not_confirmed")
    return reply(
      "Confirm your email before signing in. You can request another confirmation below.",
      403,
    );
  if (error.code === "weak_password")
    return reply("Choose a stronger password with at least 8 characters.", 400);
  return reply(
    "This action could not be completed. Check your details or request a new email link.",
    400,
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  if ((await context.params).action !== "session")
    return reply("Not found.", 404);
  const auth = routeAuth(request);
  try {
    const {
      data: { user },
      error,
    } = await auth.client.auth.getUser();
    const state = sessionState(user, error);
    return auth.finish(
      reply(
        "Session checked.",
        state === "authenticated" ? 200 : state === "unavailable" ? 503 : 401,
        { state },
      ),
    );
  } catch {
    return auth.finish(
      reply("Unable to check your session. Please retry.", 503),
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  // Browser mutations must originate from this application (including logout).
  if (
    request.headers.get("origin") !== request.nextUrl.origin ||
    !request.headers.get("content-type")?.startsWith("application/json")
  )
    return reply("Request rejected.", 403);
  const { action } = await context.params;
  if (
    !["login", "signup", "recover", "resend", "reset", "logout"].includes(
      action,
    )
  )
    return reply("Not found.", 404);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply("Request too large.", 413);
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
  } catch {
    return reply("Invalid request.", 400);
  }
  const auth = routeAuth(request);
  try {
    if (action === "logout") {
      const { error } = await auth.client.auth.signOut({ scope: "local" });
      return auth.finish(
        error
          ? reply("Sign out did not complete. Please try again.", 503)
          : reply("You have signed out."),
      );
    }
    if (action === "reset") {
      if (
        !validPassword(body.password) ||
        body.password !== body.confirmPassword
      )
        return reply("Use 8–128 characters and matching passwords.", 400);
      const token_hash = request.cookies.get(RECOVERY_COOKIE)?.value;
      if (!validTokenHash(token_hash))
        return reply(
          "Your recovery link is missing or expired. Request a new one.",
          400,
        );
      const isolated = isolatedAuth();
      const verified = await isolated.auth.verifyOtp({
        token_hash,
        type: "recovery",
      });
      let response;
      if (verified.error || !verified.data.user)
        response = reply(
          "Your recovery link is invalid or expired. Request a new one.",
          400,
        );
      else {
        const { error } = await isolated.auth.updateUser({
          password: body.password,
        });
        await isolated.auth.signOut({ scope: "local" });
        response = error
          ? errorReply(error)
          : reply("Password updated. Sign in with your new password.");
      }
      response.cookies.set(RECOVERY_COOKIE, "", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
      return auth.finish(response);
    }
    const email =
      typeof body.email === "string" ? body.email.trim() : body.email;
    if (!validEmail(email)) return reply("Enter a valid email address.", 400);
    if (action === "login") {
      if (
        typeof body.password !== "string" ||
        !body.password.length ||
        body.password.length > 128
      )
        return reply("Enter your password.", 400);
      const { data, error } = await auth.client.auth.signInWithPassword({
        email,
        password: body.password,
      });
      if (error) return auth.finish(errorReply(error));
      if (!data.user?.email_confirmed_at) {
        await auth.client.auth.signOut({ scope: "local" });
        return auth.finish(reply("Confirm your email before signing in.", 403));
      }
      return auth.finish(
        reply("Signed in. Opening your workspace…", 200, {
          next: safeReturnTo(body.next),
        }),
      );
    }
    const isolated = isolatedAuth();
    const emailRedirectTo = new URL(
      "/nexus/confirm",
      request.nextUrl.origin,
    ).toString();
    let error;
    if (action === "signup") {
      if (
        !validPassword(body.password) ||
        body.password !== body.confirmPassword
      )
        return reply("Use 8–128 characters and matching passwords.", 400);
      ({ error } = await isolated.auth.signUp({
        email,
        password: body.password,
        options: { emailRedirectTo },
      }));
    } else if (action === "recover") {
      ({ error } = await isolated.auth.resetPasswordForEmail(email, {
        redirectTo: emailRedirectTo,
      }));
    } else {
      ({ error } = await isolated.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo },
      }));
    }
    // Do not reveal whether an address already belongs to an account.
    if (error && !["user_already_exists", "user_not_found"].includes(error.code || ""))
      return auth.finish(errorReply(error));
    return auth.finish(
      reply(
        "If this address is eligible, an email will arrive shortly. Check your inbox and spam folder.",
      ),
    );
  } catch {
    return auth.finish(
      reply("We could not connect. Please try again shortly.", 503),
    );
  }
}
