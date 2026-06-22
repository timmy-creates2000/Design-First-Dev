-- Career Path AI — Supabase Schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New Query → paste & Run

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (for token-based auth)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  education_level TEXT NOT NULL,
  course TEXT NOT NULL,
  school TEXT,
  state TEXT NOT NULL,
  academic_level TEXT,
  interests JSONB DEFAULT '[]',
  existing_skills JSONB DEFAULT '[]',
  monthly_budget TEXT NOT NULL,
  device_access TEXT,
  internet_quality TEXT,
  career_goals TEXT,
  learning_pace TEXT NOT NULL,
  work_style TEXT,
  timeline TEXT NOT NULL
);

-- Roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  career_title TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmap tasks table
CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id TEXT PRIMARY KEY,
  roadmap_id TEXT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stage TEXT NOT NULL,
  month_number INTEGER,
  resource_link TEXT,
  estimated_duration TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
