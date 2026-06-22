---
name: Supabase + Gemini Setup
description: How this project connects to Supabase and Gemini AI, key quirks.
---

# Supabase + Gemini Setup

**Why:** In-memory maps replaced with Supabase JS client for persistence; real Gemini AI for chat.

## Database approach
- Uses `@supabase/supabase-js` with SUPABASE_SERVICE_ROLE_KEY (NOT Drizzle/DATABASE_URL)
- Backend client: `artifacts/api-server/src/lib/supabase.ts`
- Frontend client: `artifacts/career-path-ai/src/lib/supabase.ts` (uses anon key)
- Tables: users, sessions, user_profiles, roadmaps, roadmap_tasks, chat_messages
- Schema SQL is in `supabase-schema.sql` — must be run once in Supabase SQL editor

## Gemini AI
- Package: `@google/generative-ai` in api-server
- Secret: GEMINI_API_KEY
- Used in: `artifacts/api-server/src/routes/chat.ts` with model `gemini-2.5-flash`
- `@google/*` is in the esbuild external list — @google/generative-ai is NOT bundled, runs from node_modules

## Workflows
- API Server: `PORT=5000 pnpm --filter @workspace/api-server run dev`
- Frontend: `PORT=8080 BASE_PATH=/ pnpm --filter @workspace/career-path-ai run dev`
- PORT must be set explicitly — not auto-assigned without artifact.toml

## Build quirk
- `zod` must be in esbuild external list (added to build.mjs) AND as direct dep of api-server
- Otherwise esbuild can't resolve it when bundling lib/api-zod

## Env vars set
- VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL (shared)
- SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY (secrets)
