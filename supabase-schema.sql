-- Career Path AI — Supabase Schema
-- Auth is handled by Supabase Auth natively (no custom users/sessions tables needed)
-- Run this once: Supabase Dashboard → SQL Editor → New Query → paste & Run

-- User profiles table (user_id = Supabase Auth UUID)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
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
  timeline TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  career_title TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmap tasks table
CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS: service role key (used by the backend) bypasses RLS automatically
-- These policies allow the backend full access via the service role key
CREATE POLICY "Service role full access" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Service role full access" ON roadmaps FOR ALL USING (true);
CREATE POLICY "Service role full access" ON roadmap_tasks FOR ALL USING (true);
CREATE POLICY "Service role full access" ON chat_messages FOR ALL USING (true);
