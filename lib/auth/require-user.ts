import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { loginLocation, sessionState } from "./policy";

// Call this at every private data boundary too; a layout alone is not authorization for mutations.
export const requireUser = cache(async () => {
  let result;
  try {
    result = await (await createClient()).auth.getUser();
  } catch {
    redirect("/nexus/session-error");
  }
  const state = sessionState(result.data.user, result.error);
  if (state === "unavailable") redirect("/nexus/session-error");
  if (state !== "authenticated" || !result.data.user)
    redirect(loginLocation("/nexus", state));
  return result.data.user;
});
