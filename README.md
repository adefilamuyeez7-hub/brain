# Brainstorm Flow App

A collaborative brainstorming application where users can share ideas, propose community contributions, and build together.

## ✨ Features

### Fully Functional
- 🏠 **Home** - Browse trending ideas with community stats
- 💡 **Create Ideas** - Share new ideas with validation and optional GitHub repo link
- 📖 **Idea Details** - View idea descriptions and community contributions
- 🔍 **Explore** - Browse ideas by categories (Design, Product, Tech, Life, Wellness, Career)
- 👤 **Profile** - View user stats and shared ideas
- 🎨 **Beautiful UI** - Soft, colorful design with Radix UI components
- ✍️ **Community Contributions** - Propose and approve/reject contributions to ideas

### Current State
- **In-Memory Storage** - All data resets on refresh (Zustand store)
- **Mock Users** - 3 test users for demo (Sandra Lee, Mira Chen, Theo Park)
- **No Authentication** - Always signed in as test user
- **No Backend** - Client-only for now

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## 📁 Project Structure

```
brainstorm-flow-app/
├── src/
│   ├── routes/           # Page components (TanStack Router)
│   ├── components/       # Reusable UI components
│   ├── stores/           # Zustand state management
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── assets/           # Images and static files
│   ├── router.tsx        # Router configuration
│   ├── main.tsx          # Application entry point
│   └── styles.css        # Global styles
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
└── package.json          # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Framework**: React 19 + TanStack Router
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **Form Validation**: Zod + React Hook Form
- **Styling**: Tailwind CSS 4.2 + Custom components
- **UI Library**: Radix UI
- **Language**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier

## 📋 Code Quality Audit

### ✅ What's Working
1. **Core Routing** - All pages load and navigate correctly
2. **Form Validation** - Create idea form validates input with Zod
3. **State Management** - Zustand store handles ideas and contributions
4. **UI Components** - Full Radix UI + shadcn/ui components library
5. **Styling** - Tailwind with custom color themes (mango, sky, blush, mint, lilac)
6. **Contributions** - Users can propose changes, owners can approve/reject
7. **Like/Heart System** - Track idea popularity

### ⚠️ Incomplete Features
- **Search** - UI present, logic not wired
- **Settings** - Button exists, no page
- **User Following** - Stat shown, not functional
- **Mobile Responsiveness** - Limited testing

### ❌ To Implement
- **Authentication** - User sign-up/login (recommended: Clerk or Auth0)
- **Database** - Real data persistence (recommended: Supabase, Firebase)
- **Backend API** - Server-side logic (TanStack Start or Vercel Functions)
- **File Uploads** - Support for idea cover images
- **Search Engine** - Algolia or Meilisearch integration
- **Notifications** - Toast notifications (Sonner included)

## 🚢 Deployment

### GitHub Setup

```bash
# Create repository on github.com/new, then:
git remote add origin https://github.com/YOUR_USERNAME/brainstorm-flow-app.git
git branch -M main
git push -u origin main
```

### Vercel Deployment

#### Option 1: CLI (Fast)
```bash
npm install -g vercel
vercel
```

#### Option 2: Web Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select "GitHub"
4. Choose your repository
5. Accept default settings (Vercel auto-detects framework)
6. Click "Deploy"

**Build Settings Auto-Detected:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Environment Variables
Add these in Vercel dashboard → Settings → Environment Variables (if needed):
```
# For future backend services
VITE_API_URL=https://api.example.com
```

## 📊 Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Home - trending ideas | ✅ Full |
| `/create` | Create new idea | ✅ Full |
| `/idea/:ideaId` | Idea details | ✅ Full |
| `/explore` | Browse by topic | ✅ Full |
| `/profile` | User profile | ✅ Full |
| `/settings` | User settings | ❌ Not implemented |

## 🛣️ Roadmap

### Phase 1: Core Backend (Next)
- [ ] Supabase setup (PostgreSQL + Auth)
- [ ] Create server functions for mutations
- [ ] Migrate from in-memory to database

### Phase 2: Authentication
- [ ] Implement Clerk or Auth0
- [ ] Add sign-up/login pages
- [ ] User permissions (can only approve own ideas)

### Phase 3: Advanced Features
- [ ] Full-text search integration
- [ ] Idea cover image uploads
- [ ] User profiles and following
- [ ] Email notifications
- [ ] Export to GitHub/GitLab

### Phase 4: AI Features (Future)
- [ ] AI-powered idea suggestions
- [ ] Contribution auto-tagging
- [ ] Spam detection

## 📝 License

MIT

## 🤝 Contributing

This is a demo/prototype project. For production use:
1. Implement proper authentication
2. Add database backing
3. Deploy to Vercel or similar platform
4. Enable HTTPS and security headers

## 📧 Contact

For questions or issues, please refer to the DEPLOYMENT_GUIDE.md

---

**Last Updated:** April 23, 2026  
**Build Status:** ✅ Passing  
**Framework:** React 19 + TanStack Start / Vite
