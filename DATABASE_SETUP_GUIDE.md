# Brainstorm Flow - Supabase Setup Guide

## 📋 Overview

This guide explains how to set up your Supabase database for the Brainstorm Flow app.

**Two files required:**
1. `SUPABASE_SETUP_CLEAN.sql` - Schema (tables, indexes, security)
2. `SEED_DATA.sql` - Sample ideas (for new users to see)

---

## ✅ Step-by-Step Instructions

### Step 1: Initialize Database Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **`wmfpqgqaeoblblcyemev`**
3. Click **SQL Editor** on the left sidebar
4. Click **New Query**
5. Open file: `SUPABASE_SETUP_CLEAN.sql`
6. Copy the **entire contents**
7. Paste into Supabase SQL editor
8. Click **Run** (or Ctrl+Enter)

**Expected output:**
```
✓ Setup complete! Tables created:
✓ contributions
✓ ideas
✓ likes
✓ users
```

---

### Step 2: Add Sample Data (Optional)

1. Click **New Query** again
2. Open file: `SEED_DATA.sql`
3. Copy the **entire contents**
4. Paste into new SQL editor
5. Click **Run**

**Expected output:**
```
✓ Seed data inserted!
✓ total_ideas: 7
```

---

## 🎯 What Gets Created

### Database Tables

| Table | Purpose | Rows |
|-------|---------|------|
| `users` | User profiles and auth | 1 demo user |
| `ideas` | Core content | 7 sample ideas |
| `contributions` | Community proposals | 0 (users add them) |
| `likes` | Engagement tracking | 0 (users add them) |

### Sample Ideas Included

1. **AI-Powered Writing Assistant** (Tech) - 12 likes
2. **Sustainable Fashion Marketplace** (Product) - 8 likes
3. **Mental Health Check-in Bot** (Life) - 5 likes
4. **Code Review Learning Game** (Tech) - 15 likes
5. **DIY Garden Design with AR** (Design) - 7 likes
6. **Community Event Matching** (Product) - 10 likes
7. **Habit Stacking Tracker** (Wellness) - 9 likes

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** - Enabled on all tables
✅ **User policies** - Users can only modify their own data
✅ **Cascade deletes** - Deleting user removes their ideas automatically
✅ **Unique constraints** - No duplicate likes

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Make sure you ran **STEP 1** (schema setup) first
- Step 2 (seed data) requires Step 1 to be complete

### Error: "duplicate key"
- Demo user already exists - that's OK
- Just skip that insert and continue with ideas

### Error: "permission denied"
- Supabase project might be in read-only mode
- Check project settings → Safety
- Or try in a new incognito window

### Want to clear and restart?
Run this in a new query:
```sql
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
Then run STEP 1 again.

---

## 📱 View Your Data

### See all users
```sql
SELECT id, email, name FROM users;
```

### See all ideas
```sql
SELECT id, title, tag, likes_count FROM ideas ORDER BY created_at DESC;
```

### See all contributions
```sql
SELECT id, idea_id, user_id, status FROM contributions;
```

---

## 🚀 Next Steps

1. ✅ Database schema created
2. ✅ Sample data inserted
3. ⏭️ Frontend already connects via `.env.local` Supabase keys
4. ⏭️ Users see ideas when they open the app
5. ⏭️ Users can sign up with Clerk and contribute

---

## 📖 Frontend Connection

Your app is already configured in [src/lib/supabase.ts](../src/lib/supabase.ts):

```typescript
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Environment variables are in `.env.local`:
```
VITE_SUPABASE_URL=https://wmfpqgqaeoblblcyemev.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✨ You're All Set!

Your Supabase backend is now ready. New users will see the 7 sample ideas and can:
- ✅ Like ideas
- ✅ View idea details
- ✅ Propose contributions
- ✅ See user profiles
- ✅ Build community together

Questions? Check the Supabase docs: https://supabase.com/docs
