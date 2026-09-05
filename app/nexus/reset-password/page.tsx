import Link from "next/link";
import { cookies } from "next/headers";
import AuthShell from "@/app/components/auth/AuthShell";
import AuthForm from "@/app/components/auth/AuthForm";
import { RECOVERY_COOKIE, validTokenHash } from "@/lib/auth/policy";
export default async function Page() {
  const token = (await cookies()).get(RECOVERY_COOKIE)?.value;
  return (
    <AuthShell>
      {validTokenHash(token) ? (
        <AuthForm mode="reset" />
      ) : (
        <>
          <h1>Request a fresh link.</h1>
          <p role="status" className="auth-intro">
            Your recovery link is missing or expired.
          </p>
          <Link className="button button-primary" href="/nexus/forgot-password">
            Send recovery email
          </Link>
        </>
      )}
    </AuthShell>
  );
}
