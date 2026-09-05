import { requireUser } from "@/lib/auth/require-user";
import SessionGuard from "@/app/components/auth/SessionGuard";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <SessionGuard>{children}</SessionGuard>;
}
