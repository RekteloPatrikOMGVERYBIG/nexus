import Link from "next/link";
import AuthShell from "@/app/components/auth/AuthShell";
import { safeReturnTo } from "@/lib/auth/policy";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthShell>
      <h1>Let’s reconnect.</h1>
      <p role="status" className="auth-intro">
        We couldn’t verify your session. Please try again shortly.
      </p>
      <a className="button button-primary" href={safeReturnTo(next)}>
        Retry
      </a>
      <p className="auth-note">
        <Link href="/nexus/login">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
