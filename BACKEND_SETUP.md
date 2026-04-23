# Backend Integration Setup Guide

## ✅ What's Been Added

Your app now has backend infrastructure ready:

- ✅ Supabase client (`src/lib/supabase.ts`)
- ✅ React Query hooks for data fetching (`src/hooks/useApi.ts`)
- ✅ Clerk authentication provider (`src/components/AuthProvider.tsx`)
- ✅ Environment configuration template (`.env.example`)

---

## 🚀 Step 1: Create Supabase Project (5 min)

### Create Account & Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Enter project name: `brainstorm-flow`
4. Choose region closest to you
5. Create a strong password
6. Wait 2-3 minutes for setup

### Get Your Keys
1. In Supabase dashboard, click your project
2. Go to Settings → API
3. Copy these values:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`

### Create Database Tables

In Supabase SQL Editor, run this:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  brief VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  github_url VARCHAR(500),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contributions table
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);

-- Follows table (optional, for future features)
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for performance
CREATE INDEX idx_ideas_owner ON ideas(owner_id);
CREATE INDEX idx_ideas_tag ON ideas(tag);
CREATE INDEX idx_ideas_created ON ideas(created_at DESC);
CREATE INDEX idx_contributions_idea ON contributions(idea_id);
CREATE INDEX idx_contributions_author ON contributions(author_id);
CREATE INDEX idx_likes_idea ON likes(idea_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
```

---

## 🔐 Step 2: Set Up Clerk Authentication (5 min)

### Create Clerk Account
1. Go to https://clerk.com/sign-up
2. Create account and verify email
3. Create new application called `brainstorm-flow`

### Get Your Keys
1. In Clerk dashboard, go to API Keys
2. Copy "Publishable Key" → `VITE_CLERK_PUBLISHABLE_KEY`

### Configure OAuth (Optional but Recommended)
1. In Clerk dashboard → Social Connections
2. Enable: Google, GitHub (optional)
3. Add OAuth credentials if you have them

---

## 🔑 Step 3: Add Environment Variables

### Create `.env.local` file

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### Don't commit this file!
```bash
# .env.local is already in .gitignore
# Keep it private and local only
```

---

## ✅ Step 4: Test the Setup

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Visit http://localhost:5173
```

You should see:
- ✅ Sign in / Sign up buttons (top right)
- ✅ Ideas loading from Supabase (if you add demo data)
- ✅ No console errors

---

## 🧪 Step 5: Add Demo Data (Optional)

In Supabase SQL Editor:

```sql
-- Insert demo user
INSERT INTO users (id, email, name, avatar_url, bio)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@example.com',
  'Demo User',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  'Demo user for testing'
);

-- Insert demo idea
INSERT INTO ideas (
  title, brief, description, tag, owner_id, likes_count
) VALUES (
  'Soft UI for note apps',
  'A calmer, pastel-first notes experience.',
  'Most note apps look like spreadsheets. What if a notes app felt like a sketchbook — soft pastels, rounded cards, gentle motion — designed to lower the cost of capturing a thought?',
  'Design',
  '00000000-0000-0000-0000-000000000001',
  0
);
```

---

## 🔄 How It Works Now

### Data Flow
```
React Component
  ↓
useApi Hook (React Query)
  ↓
Supabase Client
  ↓
PostgreSQL Database
  ↓
Supabase API
```

### Example: Create Idea
```typescript
const { mutate: createIdea } = useCreateIdea();

const handleSubmit = async (data) => {
  createIdea({
    title: data.title,
    brief: data.brief,
    description: data.description,
    tag: data.tag,
    owner_id: user.id,
  });
};
```

### Example: Fetch Ideas
```typescript
const { data: ideas, isLoading } = useIdeas();

return (
  <div>
    {isLoading && <p>Loading...</p>}
    {ideas?.map(idea => (
      <IdeaCard key={idea.id} idea={idea} />
    ))}
  </div>
);
```

---

## 🔐 Row-Level Security (Optional but Recommended)

Protect your data by adding RLS policies in Supabase:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow all to read ideas
CREATE POLICY "Allow read all ideas"
ON ideas FOR SELECT USING (true);

-- Allow users to create ideas
CREATE POLICY "Allow users to create ideas"
ON ideas FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Allow users to update own ideas
CREATE POLICY "Allow users to update own ideas"
ON ideas FOR UPDATE USING (auth.uid() = owner_id);

-- Similar for contributions, likes, etc.
```

---

## 📝 Next: Update Components

Once environment variables are set, update pages to use the new hooks:

### Update `src/routes/index.tsx`
```typescript
import { useIdeas } from '@/hooks/useApi';
import { useUser } from '@clerk/clerk-react';

function Index() {
  const { user } = useUser();
  const { data: ideas, isLoading } = useIdeas();

  if (isLoading) return <div>Loading ideas...</div>;

  return (
    <MobileFrame>
      {/* Use real data instead of mock */}
      {ideas?.map(idea => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </MobileFrame>
  );
}
```

---

## 🚨 Common Issues

### Error: "Missing VITE_SUPABASE_URL"
- Check `.env.local` file exists
- Verify keys are copied correctly (no extra spaces)
- Restart dev server: `npm run dev`

### Error: "Missing VITE_CLERK_PUBLISHABLE_KEY"
- Create Clerk account first
- Copy publishable key (not secret key)
- Add to `.env.local`

### Supabase connection fails
- Check URL format: `https://xxx.supabase.co`
- Verify database is running (check Supabase dashboard)
- Check internet connection

### Clerk sign-in doesn't work
- Verify publishable key is correct
- Check Clerk dashboard for errors
- Clear browser cookies and retry

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase SQL Reference](https://www.postgresql.org/docs/current/sql.html)

---

## 🎯 Next Steps

1. **Create Supabase project** (5 min)
2. **Create Clerk account** (3 min)
3. **Run SQL migrations** (2 min)
4. **Add environment variables** (2 min)
5. **Test locally** (5 min)
6. **Push to GitHub** (1 min)
7. **Deploy to Vercel** (2 min)
8. **Update components to use backend** (ongoing)

**Total time: ~20-30 minutes to get production-ready!**

---

**Questions?** Check the BACKEND_PLAN.md for detailed architecture info.
