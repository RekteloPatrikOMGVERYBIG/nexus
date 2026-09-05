import { NextRequest, NextResponse } from "next/server";
import { isolatedAuth } from "@/lib/auth/route-client";
import {
  RECOVERY_COOKIE,
  RECOVERY_MAX_AGE,
  validTokenHash,
} from "@/lib/auth/policy";

export async function GET(request: NextRequest) {
  const token_hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const go = (path: string) =>
    NextResponse.redirect(new URL(path, request.url), {
      headers: {
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  if (!validTokenHash(token_hash))
    return go("/nexus/login?reason=invalid-link");
  if (type === "recovery") {
    const response = go("/nexus/reset-password");
    response.cookies.set(RECOVERY_COOKIE, token_hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: RECOVERY_MAX_AGE,
    });
    return response;
  }
  if (type !== "signup" && type !== "email")
    return go("/nexus/login?reason=invalid-link");
  try {
    const client = isolatedAuth();
    const { error } = await client.auth.verifyOtp({ token_hash, type });
    if (error) return go("/nexus/login?reason=invalid-link");
    await client.auth.signOut({ scope: "local" });
    return go("/nexus/login?reason=confirmed");
  } catch {
    return go("/nexus/login?reason=unavailable");
  }
}
