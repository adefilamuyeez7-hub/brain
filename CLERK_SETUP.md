# Clerk Authentication Setup Guide

This app now uses **Clerk** for user authentication with social sign-in support (Google, GitHub, Discord, etc.).

## Current Status

✅ **Frontend ready** - Sign-in/Sign-up pages created  
❌ **Clerk key needed** - Add VITE_CLERK_PUBLISHABLE_KEY to .env.local

## Quick Setup (5 minutes)

### 1. Create Clerk Account
- Go to https://clerk.com
- Sign up (free tier available)
- Create a new application

### 2. Get Your Publishable Key
- Go to **Clerk Dashboard** → **API Keys**
- Copy the **Publishable Key** (starts with `pk_live_` or `pk_test_`)

### 3. Add to .env.local
```bash
# .env.local
VITE_SUPABASE_URL=https://wmfpqgqaeoblblcyemev.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZnBxZ3FhZW9ibGJsY3llbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDgwODUsImV4cCI6MjA5MjUyNDA4NX0.1iYykPvmuickEV-chf8BZG-nPDMxWVmgH7YCr3TMEnk

# Clerk Configuration (ADD THIS)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

### 4. Rebuild & Deploy
```bash
npm run build
git add .env.local
git commit -m "Add Clerk authentication key"
git push origin main
```

Vercel will auto-deploy!

## Features Included

### ✅ Authentication Pages
- `/sign-in` - Sign in with email, password, or social providers
- `/sign-up` - Create new account with social sign-in
- `/profile` - User profile page with sign-out button
- `/` - Home page with real user data

### ✅ User Data
- User name, email, avatar
- User stats (ideas, sparks, following count)
- User bio
- All stored in Clerk

### ✅ Social Sign-In
By default, Clerk supports:
- Email/Password
- Google OAuth
- GitHub OAuth
- Discord OAuth
- Apple OAuth

### ✅ Sign Out
- Sign out button in header on home page
- Sign out button in profile page
- Available only when user is signed in

## What Changed

### Files Created
- `src/hooks/useAuth.ts` - React hook for Clerk integration
- `src/routes/sign-in.tsx` - Clerk sign-in page
- `src/routes/sign-up.tsx` - Clerk sign-up page

### Files Updated
- `src/routes/index.tsx` - Header now shows real user data
- `src/routes/profile.tsx` - Profile shows real user data from Clerk
- `src/components/AuthProvider.tsx` - Made Clerk optional for development

### Removed
- Hardcoded "Sandra Lee" user
- UserSwitcher demo component
- Mock user selection

## How It Works

### 1. User Flow
```
Not Signed In → Click Sign Up → Enter Email/OAuth → Verified → Home Page
Home Page → See "Hello, [Your Name]" → Click LogOut → Back to Home
Click Profile → "Sign in to view profile" → Click Sign In → Auth → Profile
```

### 2. Behind the Scenes
```
User Data → Clerk → useAuthUser() Hook → React Components → UI
Avatar, Name, Bio → Clerk stores → useAuthUser returns → Components display
```

### 3. Sign-In Flow
```
User clicks "Sign Up"
↓
Navigates to /sign-up
↓
Clerk SignUp component renders
↓
User chooses provider (Email, Google, GitHub, etc.)
↓
Completes OAuth/Email verification
↓
Redirected to /
↓
useAuthUser() now returns signed-in user data
↓
Header shows real user name and avatar
```

## Development Without Clerk Key

The app **works without Clerk key** during development:
- Shows welcome message "Hello, there"
- Can browse ideas (mock data)
- Cannot access profile page (shows sign-in prompt)
- Cannot create ideas (requires login)

Console warning: "⚠️ Clerk authentication key missing..."

## API Ready

These React Query hooks are ready to fetch data from Supabase once configured:
- `useIdeas()` - Fetch all ideas
- `useIdea(ideaId)` - Fetch single idea
- `useUserIdeas(userId)` - User's ideas
- `useCreateIdea()` - Create new idea
- `useLikeIdea(ideaId)` - Like an idea
- etc.

**Next step:** Connect components to use these hooks after setting up Clerk key.

## Customization

### Change Clerk Provider Logo
In `src/routes/sign-in.tsx` and `sign-up.tsx`, modify the `appearance` prop:
```typescript
<SignIn appearance={{ elements: { /* customize here */ } }} />
```

### Enable More OAuth Providers
In Clerk dashboard:
1. Go to **Authentication**
2. Scroll to **OAuth Connections**
3. Enable desired providers (Google, GitHub, etc.)
4. Add credentials (Client ID, Secret)

### Customize User Data
Store additional user data in Clerk metadata:
```typescript
// In useAuthUser.ts, access via:
user?.unsafeMetadata?.fieldName
```

## Troubleshooting

### White Page / "Missing VITE_CLERK_PUBLISHABLE_KEY"
- Add Clerk key to `.env.local`
- Rebuild: `npm run build`
- Redeploy: `git push origin main`

### Sign-in redirects to wrong page
- Update `redirectUrl` in sign-in.tsx (defaults to "/")
- Ensure route exists

### OAuth provider not showing
- Check Clerk dashboard for provider setup
- Verify Client ID and Secret are correct

## Security Notes

✅ Clerk handles:
- Password hashing
- OAuth token security
- Session management
- CSRF protection

✅ Environment variables:
- Publishable key is safe to expose (it's public)
- Secret key NOT needed for frontend

## Next Steps

1. ✅ Set Clerk publishable key in `.env.local`
2. ✅ Rebuild and deploy
3. ⏳ Test sign-up with email or OAuth
4. ⏳ Connect API hooks to components
5. ⏳ Set up Supabase database schema
6. ⏳ Create ideas and test full flow

---

**Questions?** Check Clerk docs: https://clerk.com/docs
