# Backend Architecture Plan - Brainstorm Flow App

## 🏗️ Overview

Current state: **Client-only, in-memory Zustand store**

Goal: **Production-ready backend with database, auth, and APIs**

---

## 📊 Database Schema

### Required Tables

#### 1. `users` table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Auth fields (managed by auth provider)
  clerk_id VARCHAR(255) UNIQUE -- if using Clerk
);
```

#### 2. `ideas` table
```sql
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
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexing for performance
  CREATE INDEX idx_ideas_owner_id ON ideas(owner_id);
  CREATE INDEX idx_ideas_tag ON ideas(tag);
  CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
);
```

#### 3. `contributions` table
```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CREATE INDEX idx_contributions_idea_id ON contributions(idea_id);
  CREATE INDEX idx_contributions_author_id ON contributions(author_id);
  CREATE INDEX idx_contributions_status ON contributions(status);
);
```

#### 4. `likes` table (for "hearting" ideas)
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, idea_id),
  CREATE INDEX idx_likes_idea_id ON likes(idea_id);
  CREATE INDEX idx_likes_user_id ON likes(user_id);
);
```

#### 5. `follows` table (for future follow system)
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);
```

---

## 🔐 Authentication Solutions (Choose One)

### Option 1: Clerk (Recommended - Easiest)
**Cost:** Free tier includes 10k monthly active users  
**Pros:**
- Pre-built UI components
- Automatic session management
- Built-in user management dashboard
- Email/password, Google, GitHub sign-up
- Zero configuration for React

**Setup:**
```bash
npm install @clerk/clerk-react
npm install @clerk/remix  # for server-side
```

**Integration with React:**
```typescript
import { ClerkProvider } from '@clerk/clerk-react';

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <RouterProvider router={router} />
</ClerkProvider>
```

---

### Option 2: Auth0
**Cost:** Free tier for up to 7k users  
**Pros:**
- Enterprise-grade
- Supports many OAuth providers
- Advanced security features

**Cons:** More setup required

---

### Option 3: Supabase Auth (Built-in)
**Cost:** Included with Supabase (free tier available)  
**Pros:**
- Integrated with database
- PostgreSQL-native
- Discord, Google, GitHub OAuth

---

## 🗄️ Database Provider (Choose One)

### Option 1: Supabase (Recommended - Full Stack)
**What you get:**
- PostgreSQL database
- Authentication
- Real-time subscriptions
- Row-level security
- API auto-generated

**Pricing:** Free tier includes 2 projects, 500MB storage

**Setup:**
```bash
npm install @supabase/supabase-js
npm install @supabase/ssr  # for SSR support
```

**Environment:**
```env
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=...
```

---

### Option 2: Firebase Firestore
**Pros:**
- Real-time database
- Easy to scale
- No schema management needed

**Cons:**
- Vendor lock-in
- Can be expensive at scale
- Less flexible queries

---

### Option 3: Planetscale (MySQL)
**Pros:**
- MySQL at scale
- Serverless
- Git-like branching

**Cons:**
- Need to manage schema
- Need separate auth solution

---

## 🔌 Backend Framework (Choose One)

### Option 1: Vercel Serverless Functions (Simplest for Vercel)
**When:** If deploying to Vercel  
**File structure:** `/api/*.ts`

```typescript
// api/ideas.ts
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch from Supabase
    const { data } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    res.status(200).json(data);
  }
}
```

---

### Option 2: TanStack Start Server Functions (Recommended)
**When:** Using TanStack Start for full-stack  
**Already installed in your project!**

```typescript
// routes/api/ideas.ts
import { json } from '@tanstack/react-start';

export async function GET() {
  const { data } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });
  return json(data);
}

export async function POST({ request }) {
  const idea = await request.json();
  const { data } = await supabase
    .from('ideas')
    .insert([idea])
    .select();
  return json(data[0]);
}
```

---

### Option 3: Node.js + Express
**Pros:**
- Full control
- Can host anywhere
- Familiar for Node developers

**Cons:**
- More setup
- Need to host/manage server
- More complex deployment

---

## 📋 Recommended Stack

### For Fastest Implementation:
```
Frontend:  React 19 + TanStack Router (✅ Already have)
Backend:   TanStack Start Server Functions
Database:  Supabase PostgreSQL
Auth:      Clerk or Supabase Auth
Hosting:   Vercel
```

### Architecture:
```
brainstorm-flow-app/
├── src/
│   ├── routes/
│   │   ├── index.tsx          (home page)
│   │   ├── create.tsx         (create idea)
│   │   ├── idea.$ideaId.tsx   (detail page)
│   │   └── api/               (NEW - server functions)
│   │       ├── ideas.ts       (GET, POST /api/ideas)
│   │       ├── ideas.$id.ts   (GET, PATCH, DELETE)
│   │       └── contributions  (POST, PATCH)
│   └── ...
├── lib/
│   └── supabase.ts            (database client)
└── types/
    └── database.ts            (type definitions)
```

---

## 🔄 Migration Plan: In-Memory → Backend

### Step 1: Set Up Database & Auth (Day 1)
```bash
# Create Supabase project
# Create database tables (SQL above)
# Set up Clerk auth
npm install @clerk/clerk-react @supabase/supabase-js
```

### Step 2: Create Database Client (Day 1)
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Step 3: Create API Routes (Day 2)
Replace Zustand store calls with API calls:

**Before (Current):**
```typescript
const addIdea = useIdeasStore((s) => s.addIdea);
addIdea({ title, brief, description, tag });
```

**After (With Backend):**
```typescript
const response = await fetch('/api/ideas', {
  method: 'POST',
  body: JSON.stringify({ title, brief, description, tag }),
});
const newIdea = await response.json();
```

### Step 4: Update Components (Day 2-3)
- Replace Zustand hooks with TanStack Query (react-query)
- Add loading/error states
- Add API error handling

### Step 5: Deploy (Day 3)
```bash
# Push to GitHub
git add .
git commit -m "Add backend integration"
git push

# Vercel auto-deploys
```

---

## 📡 Required API Endpoints

### Ideas
```
GET    /api/ideas                    # List all ideas
POST   /api/ideas                    # Create idea
GET    /api/ideas/:id                # Get single idea
PATCH  /api/ideas/:id                # Update idea
DELETE /api/ideas/:id                # Delete idea
POST   /api/ideas/:id/likes          # Like/unlike idea
```

### Contributions
```
POST   /api/contributions            # Propose contribution
GET    /api/contributions/:id        # Get contribution
PATCH  /api/contributions/:id        # Update status (approve/reject)
DELETE /api/contributions/:id        # Delete contribution
```

### Users
```
GET    /api/users/:id                # Get user profile
GET    /api/users/:id/ideas          # Get user's ideas
GET    /api/users/:id/followers      # Get followers
POST   /api/users/:id/follow         # Follow user
```

---

## 🛠️ Implementation Checklist

### Database Setup
- [ ] Create Supabase project
- [ ] Create all 5 tables (users, ideas, contributions, likes, follows)
- [ ] Set up row-level security policies
- [ ] Create indexes for performance

### Authentication
- [ ] Set up Clerk dashboard
- [ ] Install Clerk React SDK
- [ ] Wrap app with ClerkProvider
- [ ] Sync Clerk users to Supabase users table

### Backend Functions
- [ ] Create `/api/ideas.ts` route
- [ ] Create `/api/ideas/:id.ts` route
- [ ] Create `/api/contributions.ts` route
- [ ] Add error handling and validation

### Frontend Integration
- [ ] Install TanStack Query (react-query)
- [ ] Replace Zustand hooks with Query hooks
- [ ] Add loading/error UI states
- [ ] Test all API calls

### Deployment
- [ ] Add environment variables to Vercel
- [ ] Deploy to Vercel
- [ ] Test all features
- [ ] Monitor performance

---

## 💡 Quick Start: Supabase + Clerk + TanStack

### 1. Create Supabase Project
```bash
# Go to https://supabase.com/dashboard
# New project → Choose region → Wait for setup
```

### 2. Run Database Migrations
```sql
-- In Supabase SQL editor, run the table definitions above
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js @clerk/clerk-react @tanstack/react-query
```

### 4. Add Environment Variables
```env
# .env.local
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_CLERK_PUBLISHABLE_KEY=...
```

### 5. Wrap App with Clerk
```typescript
// src/main.tsx
import { ClerkProvider } from '@clerk/clerk-react';

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <RouterProvider router={router} />
</ClerkProvider>
```

### 6. Create First API Route
```typescript
// src/routes/api/ideas.ts
import { json } from '@tanstack/react-start';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });
  return json(data);
}
```

---

## 📈 Scaling Considerations

**Now (MVP):**
- Supabase free tier (2 projects, 500MB)
- Vercel free tier
- Clerk free tier (10k MAU)

**Later (When Scaling):**
- Upgrade Supabase (PostgreSQL at scale)
- Upgrade Vercel Pro (for better performance)
- Add caching (Redis)
- Add CDN for images

---

## 🚨 Security Checklist

### Database
- [ ] Enable Row-Level Security (RLS) in Supabase
- [ ] Only allow users to modify their own data
- [ ] Validate all inputs server-side

### API
- [ ] Add rate limiting
- [ ] Validate API tokens
- [ ] Use HTTPS only
- [ ] Implement CORS properly

### Auth
- [ ] Never store auth tokens in localStorage (Clerk/Supabase handle this)
- [ ] Use secure cookies for sessions
- [ ] Implement logout functionality

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/overview)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/intro.html)

---

## 🎯 Next Steps

1. **Choose your stack** (recommend: Supabase + Clerk + TanStack Query)
2. **Create accounts** on chosen services
3. **Create database schema** in Supabase
4. **Integrate Clerk** authentication
5. **Create server functions** for API endpoints
6. **Update components** to use new APIs
7. **Test thoroughly** before deploying

Would you like me to help implement any of these steps?
