import { redirect } from "next/navigation";
import { loginLocation } from "@/lib/auth/policy";
export default async function LoginAlias({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  redirect(loginLocation((await searchParams).next));
}
