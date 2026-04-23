-- Brainstorm Flow Backend Schema Setup
-- Execute this SQL in your Supabase SQL Editor

-- 1. Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL, -- Links to Supabase auth user
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brief TEXT,
  description TEXT,
  tag TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  contributions_count INTEGER DEFAULT 0
);

-- 3. Create Contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id) -- Prevent duplicate likes
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_idea_id ON contributions(idea_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_likes_idea_id ON likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read all ideas" ON ideas;
DROP POLICY IF EXISTS "Users can create ideas" ON ideas;
DROP POLICY IF EXISTS "Users can update own ideas" ON ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON ideas;
DROP POLICY IF EXISTS "Users can read contributions" ON contributions;
DROP POLICY IF EXISTS "Users can create contributions" ON contributions;
DROP POLICY IF EXISTS "Users can update own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can read likes" ON likes;
DROP POLICY IF EXISTS "Users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;

-- USER POLICIES
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- IDEAS POLICIES
CREATE POLICY "Users can read all ideas"
  ON ideas FOR SELECT
  USING (true);

CREATE POLICY "Users can create ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE
  USING (auth.uid() = user_id);

-- CONTRIBUTIONS POLICIES
CREATE POLICY "Users can read contributions"
  ON contributions FOR SELECT
  USING (true);

CREATE POLICY "Users can create contributions"
  ON contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contributions"
  ON contributions FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = (SELECT user_id FROM ideas WHERE id = idea_id))
  WITH CHECK (auth.uid() = user_id OR auth.uid() = (SELECT user_id FROM ideas WHERE id = idea_id));

-- LIKES POLICIES
CREATE POLICY "Users can read all likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create a trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Apply trigger to ideas table
DROP TRIGGER IF EXISTS update_ideas_updated_at ON ideas;
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Apply trigger to contributions table
DROP TRIGGER IF EXISTS update_contributions_updated_at ON contributions;
CREATE TRIGGER update_contributions_updated_at
  BEFORE UPDATE ON contributions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create views for common queries
CREATE OR REPLACE VIEW ideas_with_stats AS
SELECT 
  i.id,
  i.user_id,
  i.title,
  i.brief,
  i.description,
  i.tag,
  i.github_url,
  i.created_at,
  i.updated_at,
  COALESCE((SELECT COUNT(*) FROM likes WHERE idea_id = i.id), 0) as likes_count,
  COALESCE((SELECT COUNT(*) FROM contributions WHERE idea_id = i.id AND status = 'approved'), 0) as approved_contributions_count,
  u.name as owner_name,
  u.avatar_url as owner_avatar
FROM ideas i
LEFT JOIN users u ON i.user_id = u.id;

-- Grant read access to views
GRANT SELECT ON ideas_with_stats TO anon;
