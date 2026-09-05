# NEXUS authentication setup and verification

The application implements email/password authentication using Supabase Auth, SSR cookies, server route handlers and a server-rendered protected route group. Product data tables and RLS policies are outside this package; every future private query or mutation must independently enforce ownership/RLS. A protected layout alone does not secure a data API.

## Environment

Set these public project values in `.env.local` and the deployment environment:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

The existing misspelled `NEXT_PUBLIC_SUPABASE_PUBLISHARE_KEY` remains supported as a fallback. Never put a service-role key in a `NEXT_PUBLIC_` variable. Restart Next after environment changes.

## Required Supabase dashboard configuration

1. Enable the Email provider and **Confirm email**. Set the minimum password length to 8 to match the forms. The application accepts up to 128 characters.
2. Set Site URL to the canonical HTTPS production origin. Add exact redirect URLs such as `https://YOUR_DOMAIN/nexus/confirm` and `http://localhost:3000/nexus/confirm` for development. Do not use an unrestricted production wildcard.
3. Configure a production SMTP provider and its sending domain. Supabase default mail delivery is unsuitable for general production delivery. Configure Auth rate limits appropriate to your traffic; the application shows an explicit retry message for HTTP 429. Provider rate limits remain essential because a public Supabase key allows direct Auth requests.
4. Replace the action link in the **Confirm signup** email template with:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=signup">Confirm email</a>
```

5. Replace the action link in the **Reset password** email template with:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=recovery">Reset password</a>
```

These token-hash templates are required. The application deliberately does not accept a generic code callback as proof of password recovery. Old/default links lead to the invalid-link notice; request a new email after updating templates. Disable email-provider link tracking/rewrite features that alter auth URLs. Do not log confirmation URL query strings at your reverse proxy or analytics provider.

## Session and recovery behavior

- `/login` is a compatibility redirect to `/nexus/login`.
- Proxy explicitly exempts public auth routes, verifies the user with Supabase and preserves all SSR cookie updates on both pass-through and redirect responses. The protected layout and page verify the user again on the server.
- Safe `next` destinations retain useful query parameters, reject external/auth destinations and remove credential parameters. Login verifies that the server can read its session cookie before navigating.
- Browser tabs recheck on focus, pageshow, navigation, visibility changes and every 60 seconds. A service outage hides the workspace with a retry state; it does not falsely claim that the user signed out.
- Logout ends the current browser session (`scope: local`). Failure is visible and retryable. This is not an all-device revocation feature.
- Email confirmation uses an isolated Supabase client and does not sign the browser in.
- Recovery stores the email token hash in a short-lived HttpOnly, SameSite=Strict cookie (Secure on production HTTPS), removes it from the destination URL and only consumes it on a valid password submission. A missing token blocks the form; expired/forged/used tokens are rejected by Supabase before any password update. The form does not infer the recovery account from an existing browser session.
- Password verification and update use the same isolated session. After an update failure the link may already be consumed; request a fresh recovery email. Other-device session revocation is not implemented or claimed. An existing unrelated browser account is not replaced by the recovery session.
- Changing a password does not guarantee immediate revocation of already-issued access tokens on other devices. Define a separate all-device policy before making that promise.

## Automated checks

```sh
node --test tests/*.test.mjs
npm run lint
npx tsc --noEmit
npm run build
```

Tests execute actual Proxy/route-handler code with real Next request/response objects and mocked Supabase. They cover redirect termination, cookie propagation, matcher exclusions, safe return destinations, server session states, origin checks, validation, recovery proof and logout failure. They are not live email or browser end-to-end tests.

## Live acceptance checklist (requires configured Supabase and test inbox)

- Logged out: `/login` leads to the login form; `/nexus/login` is accessible; `/nexus` and private child URLs lead to login with a safe return URL.
- Sign up, receive the email, confirm, then sign in. Before confirmation, login is denied. Reused and expired links display a recoverable error. Resend works with a neutral response.
- Logged in: `/nexus` loads; `/nexus/login` redirects once to a safe destination. Reload and a second tab retain the session. Refreshing an expired access token preserves the updated cookies.
- Forged or no-longer-refreshable session: private content is denied and login remains accessible. A simulated provider outage shows the retry page without a loop.
- Recover a password, submit mismatched values, then matching values. Verify old password fails, new password works, and reusing the link fails. Repeat with a different account already signed in; only the recovery account password must change.
- Log out, revisit `/nexus`, use browser Back and focus a second tab. Private content must not become usable. Simulate failed logout and verify the error/retry state.
- Test cookies disabled, mobile layouts, keyboard focus, screen-reader announcements and reduced motion. Check the 3D scene with WebGL available/unavailable.

External Supabase settings, actual email delivery and this live checklist have not been verified by the automated suite.

References: [Supabase server-side Next.js guide](https://supabase.com/docs/guides/auth/server-side/nextjs), [password authentication](https://supabase.com/docs/guides/auth/passwords).
