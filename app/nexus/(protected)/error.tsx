"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="auth-form-wrap">
      <h1>We couldn’t open your workspace.</h1>
      <p role="alert">Please try again.</p>
      <button className="button button-primary" onClick={reset}>
        Retry
      </button>
    </main>
  );
}
