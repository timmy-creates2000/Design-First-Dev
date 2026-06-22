# Career Path AI — Supabase & Gemini Setup Guide

This guide walks you through migrating the app from in-memory mock data to a production-ready Supabase database, adding Gemini AI, and running the full stack.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project** and fill in your project details
3. Wait for the project to be ready (~2 min)
4. Go to **Settings → Database** and copy your **Connection string** (URI format)

---

## 2. Set Environment Variables

In Replit, open **Secrets** (the lock icon) and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase PostgreSQL connection string (from Settings → Database → URI) |
| `SESSION_SECRET` | Any long random string (already set) |
| `GEMINI_API_KEY` | Your Google Gemini API key (from [aistudio.google.com](https://aistudio.google.com)) |

> **Supabase connection string format:**
> `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

---

## 3. Push the Database Schema

The schema is defined in `lib/db/src/schema/`. Add the following tables to `lib/db/src/schema/index.ts`:

```typescript
import { pgTable, text, integer, boolean, timestamp, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfilesTable = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  educationLevel: text("education_level").notNull(),
  course: text("course").notNull(),
  school: text("school"),
  state: text("state").notNull(),
  academicLevel: text("academic_level"),
  interests: json("interests").$type<string[]>().default([]),
  existingSkills: json("existing_skills").$type<string[]>().default([]),
  monthlyBudget: text("monthly_budget").notNull(),
  deviceAccess: text("device_access"),
  internetQuality: text("internet_quality"),
  careerGoals: text("career_goals"),
  learningPace: text("learning_pace").notNull(),
  workStyle: text("work_style"),
  timeline: text("timeline").notNull(),
});

export const roadmapsTable = pgTable("roadmaps", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  careerId: text("career_id").notNull(),
  careerTitle: text("career_title").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const roadmapTasksTable = pgTable("roadmap_tasks", {
  id: text("id").primaryKey(),
  roadmapId: text("roadmap_id").notNull().references(() => roadmapsTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stage: text("stage").notNull(),
  monthNumber: integer("month_number"),
  resourceLink: text("resource_link"),
  estimatedDuration: text("estimated_duration").notNull(),
  difficulty: text("difficulty").notNull(),
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completed_at"),
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Then run the schema push command:

```bash
pnpm --filter @workspace/db run push
```

This will create all the tables in your Supabase database.

---

## 4. Migrate Routes from In-Memory to Supabase

Replace the in-memory Maps in the route files with Drizzle ORM queries. Example for `artifacts/api-server/src/routes/auth.ts`:

```typescript
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// Replace: users.set(user.id, user)
await db.insert(usersTable).values(user);

// Replace: users.get(userId)
const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

// Replace: for (const u of users.values()) { if (u.email === email) ... }
const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
```

For sessions/tokens, use a `sessionsTable` in your DB or switch to Supabase Auth (recommended for production).

---

## 5. Add Gemini AI for Chat

Install the Gemini SDK:

```bash
pnpm --filter @workspace/api-server add @google/generative-ai
```

Replace the `generateAIResponse` function in `artifacts/api-server/src/routes/chat.ts`:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateAIResponse(message: string, userId: string): Promise<string> {
  const profile = await getUserProfile(userId);
  const roadmap = await getUserRoadmap(userId);

  const systemContext = `You are CareerBot, an AI career coach for Nigerian students and graduates. 
You know the Nigerian job market deeply — salaries in Naira, remote work opportunities, 3MTT, 
Nigerian fintech ecosystem, NYSC, and practical learning resources available in Nigeria.
User profile: ${JSON.stringify(profile)}
User roadmap: ${roadmap?.careerTitle ?? "Not selected yet"}
Always be direct, practical, and encouraging. Reference Nigerian context when relevant.
Never give generic advice — make every answer specific to this user's situation.`;

  const result = await model.generateContent([systemContext, message]);
  return result.response.text();
}
```

---

## 6. Switch to Supabase Auth (Optional but Recommended)

Instead of building your own auth, use Supabase's built-in auth:

1. In Supabase dashboard: **Authentication → Providers** → enable Email and Google
2. Install the Supabase client:

```bash
pnpm --filter @workspace/career-path-ai add @supabase/supabase-js
```

3. Add environment variables:

```
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

4. Create `artifacts/career-path-ai/src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

5. Replace the `AuthContext` login/signup calls with `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`.

---

## 7. Running the App

### Development (Replit)

The app runs automatically via Replit workflows. Both services start when you open the project:

- **Frontend** (Career Path AI): `pnpm --filter @workspace/career-path-ai run dev`
- **API Server**: `pnpm --filter @workspace/api-server run dev`

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env  # add DATABASE_URL, SESSION_SECRET, GEMINI_API_KEY

# Push DB schema
pnpm --filter @workspace/db run push

# Run API server
pnpm --filter @workspace/api-server run dev

# Run frontend (in a new terminal)
pnpm --filter @workspace/career-path-ai run dev
```

---

## 8. Deploying to Production

### Option A: Replit Deploy (Easiest)
1. Click the **Deploy** button in Replit
2. Add all environment variables in the deploy settings
3. Your app will be live at `your-app.replit.app`

### Option B: Vercel + Railway/Render

**Frontend (Vercel):**
```bash
cd artifacts/career-path-ai
pnpm run build
# Deploy dist/public/ to Vercel
```

**Backend (Railway or Render):**
```bash
cd artifacts/api-server
pnpm run build
# Deploy dist/index.mjs to Railway/Render
# Set PORT, DATABASE_URL, SESSION_SECRET, GEMINI_API_KEY env vars
```

---

## 9. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Supabase) |
| `SESSION_SECRET` | Yes | Secret for session encryption |
| `GEMINI_API_KEY` | Yes (for AI) | Google Gemini API key |
| `VITE_SUPABASE_URL` | Optional | For Supabase Auth |
| `VITE_SUPABASE_ANON_KEY` | Optional | For Supabase Auth |
| `PORT` | Auto | Set by Replit automatically |

---

## 10. Key Commands Reference

```bash
# Regenerate API types after OpenAPI changes
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes to Supabase
pnpm --filter @workspace/db run push

# Type check everything
pnpm run typecheck

# Build everything
pnpm run build

# Install a new package in the API server
pnpm --filter @workspace/api-server add <package-name>

# Install a new package in the frontend
pnpm --filter @workspace/career-path-ai add <package-name>
```

---

## File Structure

```
artifacts/
  api-server/          # Express API server
    src/routes/        # All API route handlers
  career-path-ai/      # React + Vite frontend
    src/pages/         # All page components
    src/components/    # Shared UI components
lib/
  api-spec/            # OpenAPI spec (source of truth)
  api-client-react/    # Generated React Query hooks
  api-zod/             # Generated Zod validation schemas
  db/                  # Drizzle ORM schema + client
```

---

*Built with pnpm workspaces · Express 5 · React + Vite · Drizzle ORM · Supabase · Gemini AI*
