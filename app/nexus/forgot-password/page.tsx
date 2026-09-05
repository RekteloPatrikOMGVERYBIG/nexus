import AuthShell from "@/app/components/auth/AuthShell";
import AuthForm from "@/app/components/auth/AuthForm";
import { safeReturnTo } from "@/lib/auth/policy";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string; mode?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthShell>
      <AuthForm
        mode={"recover"}
        next={safeReturnTo(params.next)}
        reason={params.reason}
      />
    </AuthShell>
  );
}
