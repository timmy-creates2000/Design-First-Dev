# Career Path AI

AI-powered Nigerian career guidance and skill roadmap platform for students, graduates, and NYSC members.

## Run & Operate

- `pnpm --filter @workspace/career-path-ai run dev` — run the frontend (auto-assigned port)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes to Supabase (after setting DATABASE_URL)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Routing: Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (Supabase-ready)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- AI: Ready for Google Gemini API

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all endpoints)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas for server validation
- `lib/db/src/schema/` — Drizzle ORM table definitions
- `artifacts/api-server/src/routes/` — Express route handlers (auth, careers, roadmap, chat, progress, resources)
- `artifacts/career-path-ai/src/` — React frontend (pages, components, contexts)

## Architecture decisions

- In-memory data stores used for MVP; migrate to Supabase using `SUPABASE_SETUP.md`
- Token-based auth stored in localStorage (Bearer token sent in Authorization header)
- All API routes mount under `/api` prefix; the reverse proxy routes `/api` to the API server
- Career recommendations are scored algorithmically from user profile data
- AI chat uses intelligent mock responses keyed to Nigerian career context; replace with Gemini API

## Product

Nigerian career guidance platform for undergraduates, fresh graduates, and NYSC members. Core flow: sign up → onboarding (background, interests, budget) → personalized career recommendations → skill-gap analysis → visual roadmap generation → progress tracking + AI coaching.

## Supabase & Gemini Setup

See `SUPABASE_SETUP.md` for complete instructions on:
- Setting up Supabase database
- Migrating from in-memory to PostgreSQL
- Adding Gemini AI to the chat
- Deploying to production

## User preferences

- Mobile-friendly, fully responsive design
- Google Fonts: Plus Jakarta Sans (body) + Space Grotesk (headings)
- Nigerian market context in all career data (salaries in Naira, local resources)
- Everything should work with mock data before real APIs are connected

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before using updated types
- Routes in `careers.ts` import from `auth.ts` for token validation — shared in-memory maps
- The `careers/recommendations` route must come BEFORE `careers/:id` in the Express router or it gets matched as an id
- Do not run `pnpm dev` at workspace root — use per-package filter commands

## Pointers

- See `SUPABASE_SETUP.md` for database migration and Gemini AI integration
- See `pnpm-workspace` skill for workspace structure and TypeScript details
