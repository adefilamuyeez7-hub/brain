-- ============================================================================
-- BRAINSTORM FLOW - SUPABASE SETUP (Simplified)
-- Complete database schema without complex RLS policies
-- ============================================================================

-- 1. CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE IDEAS TABLE (core content)
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brief TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  github_url TEXT,
  owner_name TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE CONTRIBUTIONS TABLE (user proposals)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREATE LIKES TABLE (engagement tracking)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_tag ON ideas(tag);
CREATE INDEX IF NOT EXISTS idx_contributions_idea_id ON contributions(idea_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_likes_idea_id ON likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DROP EXISTING POLICIES (clean slate)
-- ============================================================================

DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read all ideas" ON ideas;
DROP POLICY IF EXISTS "Users can create ideas" ON ideas;
DROP POLICY IF EXISTS "Users can update own ideas" ON ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON ideas;
DROP POLICY IF EXISTS "Users can read contributions" ON contributions;
DROP POLICY IF EXISTS "Users can create contributions" ON contributions;
DROP POLICY IF EXISTS "Users can update contributions" ON contributions;
DROP POLICY IF EXISTS "Users can update own contributions" ON contributions;
DROP POLICY IF EXISTS "Anyone can read likes" ON likes;
DROP POLICY IF EXISTS "Users can create likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;

-- ============================================================================
-- CREATE SIMPLE RLS POLICIES
-- Allow all operations - security handled at application level
-- ============================================================================

-- Users
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true) WITH CHECK (true);

-- Ideas
CREATE POLICY "Anyone can read ideas" ON ideas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ideas" ON ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ideas" ON ideas FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete ideas" ON ideas FOR DELETE USING (true);

-- Contributions
CREATE POLICY "Anyone can read contributions" ON contributions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contributions" ON contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contributions" ON contributions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete contributions" ON contributions FOR DELETE USING (true);

-- Likes
CREATE POLICY "Anyone can read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert likes" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete likes" ON likes FOR DELETE USING (true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Setup complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
