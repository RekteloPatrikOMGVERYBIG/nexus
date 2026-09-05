import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";
import { authFetch } from "../auth/route-client";

// Read-only Server Component client. Proxy refreshes and persists cookies before rendering.
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseConfig();
  return createServerClient(url, key, {
    global: { fetch: authFetch },
    cookies: { getAll: () => cookieStore.getAll(), setAll() {} },
  });
}
