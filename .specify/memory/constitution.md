<!--
Sync Impact Report
Version change: unversioned scaffold -> 1.0.0 (initial adoption)
Modified principles: all five unnamed template slots replaced with:
- I. Connected Engineering Workspace
- II. Framework Compatibility and Clear Boundaries
- III. Usable, Responsive Motion
- IV. Secure and Explicit Data Boundaries
- V. Evidence-Based Delivery
Added sections: Technology and Integration Constraints; Development Workflow
Removed sections: none
Follow-up TODOs: none
Dependent templates: unchanged; constitution checks read this document at runtime.
-->

# NEXUS Constitution

## Core Principles

### I. Connected Engineering Workspace

Features MUST support the project's purpose: connecting engineering knowledge, code,
projects, people, and AI-assisted actions in one workspace. Feature specifications MUST
identify the user outcome, the affected module or shared experience, and observable
acceptance criteria. Implementations MUST distinguish demonstration content and planned
capabilities from live data and functioning integrations. This keeps the CODE, PROJECTS,
PEOPLE, and AI modules coherent and makes system status trustworthy.

### II. Framework Compatibility and Clear Boundaries

Before writing Next.js code, contributors MUST read the relevant guides in the installed
`node_modules/next/dist/docs/` directory and heed deprecation notices, as required by
`AGENTS.md`. Framework decisions MUST match the installed version and repository
configuration. TypeScript strict mode MUST remain enabled. Components MUST have clear
responsibilities; shared service access belongs behind explicit interfaces such as the
existing `lib/supabase` helpers. Client boundaries MUST be justified by interactivity,
browser APIs, or a client-only dependency. New abstractions and dependencies MUST address
a concrete requirement or demonstrated duplication.

### III. Usable, Responsive Motion

Navigation and core actions MUST remain usable across mobile and desktop layouts and by
keyboard. Interactive controls MUST have accessible names and visible focus states.
Animation and 3D effects MUST respect reduced-motion preferences and MUST NOT be the sole
means of conveying information or completing an action. Essential content and navigation
MUST remain available when a 3D scene cannot render. Animation loops, event listeners,
and graphics resources MUST be cleaned up when their owning component is disposed.
Changes to animation-heavy experiences MUST include a recorded browser check for layout,
interaction, reduced motion, and performance on the target viewport or device class.

### IV. Secure and Explicit Data Boundaries

Protected data access and mutations MUST enforce authentication and authorization at a
trusted server or database boundary; client navigation checks alone are insufficient.
External input and service responses MUST be validated before they drive trusted state
or persistence. Credentials, session tokens, and private user content MUST NOT appear in
logs or committed files. Privileged service keys MUST remain server-side; public browser
configuration MUST grant no privileged access by itself. Asynchronous user flows MUST
provide appropriate pending, empty, success, and recoverable failure states. AI features
MUST identify generated output and document what user data is sent to external providers.

### V. Evidence-Based Delivery

Every change MUST be checked against its acceptance criteria with evidence proportionate
to its risk. Changes to authentication, authorization, persistence, or external-service
contracts MUST include automated coverage of relevant success and failure behavior.
Reversible presentation-only changes MAY use focused browser checks instead of new tests.
Code changes MUST run the applicable lint, type, and build checks; failures and checks
that cannot run MUST be recorded with their cause and impact. No check may be reported as
passing without execution. A change MUST NOT introduce an unexplained regression.

## Technology and Integration Constraints

The current implementation baseline is Next.js App Router, React, strict TypeScript,
CSS/Tailwind, Three.js with React Three Fiber, GSAP, and Supabase client/server helpers.
Installed versions and executable configuration are the source of truth for compatibility;
this constitution does not pin package versions.

The README describes FastAPI, REST APIs, and PostgreSQL as part of the intended platform.
Their presence in documentation MUST NOT be treated as evidence of an implemented backend
in this repository. Plans introducing or replacing integrations MUST state the actual
service boundary, ownership, data contract, environment configuration, and failure handling.
Database changes MUST document access controls and any migration or recovery implications.

Feature plans involving significant graphics or network work MUST define a measurable
performance target and a verification method appropriate to their intended devices.
Repository secrets MUST remain outside version control, and setup documentation MUST use
placeholder values instead of real credentials.

## Development Workflow

1. Establish the feature's user outcome and acceptance criteria. When using Spec Kit,
   record these in `spec.md`, design decisions in `plan.md`, and executable work in `tasks.md`.
2. Check the plan against each core principle before research and again after design.
   Record applicable constraints, planned validation, and any justified exceptions.
3. Implement scoped changes using the installed framework documentation and existing
   project conventions. Update affected contracts and setup guidance with behavior changes.
4. For code changes, run `npm run lint`, `npx tsc --noEmit`, and `npm run build` as applicable
   to the changed surface, plus focused automated or browser checks required by Principle V.
   Documentation-only changes require document validation, not an application build.
5. Review acceptance evidence and constitution compliance before merge. Record pre-existing
   failures separately from new regressions; explicitly identify any unverified behavior.

## Governance

This constitution governs project specifications, plans, implementation, and review.
`AGENTS.md` supplies operational contributor guidance, including the requirement to consult
installed Next.js documentation. Conflicts between project documents MUST be identified
and resolved explicitly rather than silently bypassing a principle.

Amendments MUST describe the rule being changed, the reason, affected workflows, and any
migration or follow-up work. The project maintainer accepts amendments through the normal
repository review process. Each amendment MUST update the version, last-amended date, and
Sync Impact Report. The ratification date records initial adoption and remains unchanged.

Versioning follows semantic versioning: MAJOR for incompatible principle removals or
redefinitions; MINOR for new principles or materially expanded guidance; PATCH for
clarifications that do not change obligations. Version 1.0.0 establishes the initial
project-specific constitution from the previously unversioned scaffold.

Every implementation review MUST check applicable principles. Exceptions MUST document
scope, rationale, risk, and a concrete resolution condition in the plan or review record
and receive maintainer acceptance before merge. Existing code is not presumed compliant;
new work MUST follow these rules and surface relevant existing gaps without silently
expanding the requested implementation scope.

**Version**: 1.0.0 | **Ratified**: 2026-09-05 | **Last Amended**: 2026-09-05
