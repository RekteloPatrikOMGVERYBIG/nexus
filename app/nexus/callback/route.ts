import { redirect } from "next/navigation";
export function GET() {
  redirect("/nexus/login?reason=invalid-link");
}
