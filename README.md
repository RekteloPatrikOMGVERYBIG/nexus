# NEXUS

NEXUS is an early-stage workspace for engineering knowledge. The current application includes an animated landing page, a dashboard shell and email/password authentication through Supabase.

CODE, PROJECTS, PEOPLE and Intelligence are interface previews. Their product workflows and private data storage are not implemented yet. There is no FastAPI backend in this repository.

## Run locally

Use Node.js 24 and npm. Install dependencies with `npm ci`, configure `.env.local` following [Authentication setup](docs/auth-setup.md), then run:

```sh
npm run dev
```

Open http://localhost:3000. The sign-in page is at `/nexus/login`; `/login` redirects there. The workspace at `/nexus` requires a confirmed authenticated account.

## Checks

```sh
npm run check
```

This runs ESLint, automated auth regression tests, a production build (including TypeScript), and HTTP smoke checks against a temporary local production server. The smoke script shuts down its server afterward. It selects an available local port; use `SMOKE_PORT` to choose a specific port.

Individual commands: `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:smoke` (requires a build).

GitHub Actions runs the same checks on pushes and pull requests, using test configuration without production credentials. Tests mock Supabase; they do not prove real email delivery or browser end-to-end behavior.

## Architecture

- Next.js App Router, React, TypeScript and CSS.
- Three.js Timer drives the active landing scene; GSAP handles interface motion.
- Supabase Auth with SSR cookies shared by Proxy and server route handlers.
- `app/nexus/(protected)`: server-verified workspace routes.
- `app/components/auth`: accessible auth forms and client session monitoring.
- `app/api/auth/[action]`: login, registration, recovery, logout and session endpoints.
- `lib/auth`: session policy, safe return URLs and server clients.
- `tests`: auth and redirect regression coverage.

Before deployment, complete the Supabase email configuration and live acceptance checklist in [docs/auth-setup.md](docs/auth-setup.md). Private product data will additionally need a schema, RLS ownership policies and server-side authorization at each data boundary.

Design rationale and visual verification limits are recorded in [docs/design-direction.md](docs/design-direction.md).
