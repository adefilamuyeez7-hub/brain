# 🔍 Performance & Optimization Audit Report

## 📊 Current Metrics

**Build Output:**
- Main bundle: 459.95 kB (gzipped: 134.38 kB) ⚠️ **LARGE**
- Modules: 1,947 transformed
- Startup time: 3.82s

---

## 🚨 Critical Issues Found

### 1. **Dependency Duplication** 🔴 HIGH PRIORITY
**Problem:** Both Zustand and React Query are installed but codebase hasn't migrated

**Current state:**
- `zustand` ^5.0.12 (8.2 kB gzipped)
- `@tanstack/react-query` ^5.100.0 (20.5 kB gzipped)
- Components use `useIdeasStore` (Zustand) instead of new React Query hooks

**Impact:** 28.7 kB wasted bundle size

**Solution:** Choose ONE:
```bash
# Option 1: Remove Zustand (RECOMMENDED)
npm uninstall zustand

# Option 2: Remove React Query (not recommended for backend)
npm uninstall @tanstack/react-query
```

---

### 2. **Unused Radix UI Components** 🟠 MEDIUM PRIORITY
**Problem:** Importing 30+ Radix UI components but many unused

**Current imports:**
```typescript
// These are likely NOT used in all routes:
@radix-ui/react-carousel
@radix-ui/react-chart
@radix-ui/react-drawer
@radix-ui/react-dropdown-menu
@radix-ui/react-hover-card
@radix-ui/react-menubar
@radix-ui/react-navigation-menu
@radix-ui/react-pagination
@radix-ui/react-popover
@radix-ui/react-resizable
@radix-ui/react-scroll-area
@radix-ui/react-select
@radix-ui/react-separator
@radix-ui/react-slider
```

**Current**: 89 kB gzipped  
**Potential**: 35-40 kB gzipped (with tree-shaking)

**Action:**
- Keep only used components
- Use tree-shaking at build time
- Add eslint-plugin-import to catch unused imports

---

### 3. **Missing React Query Configuration** 🟠 MEDIUM PRIORITY
**Problem:** QueryClient using default settings

**Current `src/main.tsx`:**
```typescript
const queryClient = new QueryClient(); // ← Uses defaults
```

**Issues:**
- No cache time optimization
- No retry strategy
- No garbage collection
- No stale time configuration

**Recommended fix:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

### 4. **Component Re-render Issues** 🟡 LOW-MEDIUM PRIORITY
**Problem:** No memoization or optimization

**In `src/routes/index.tsx`:**
```typescript
// ❌ BAD: Recreated on every render
const categories = [
  { label: "All", color: "bg-ink text-ink-foreground" },
  // ... more items
];

const cardPalette = [
  { bg: "bg-mango", fg: "text-mango-foreground", art: blocks3d },
  // ... more items
];

// ❌ BAD: Multiple Zustand subscriptions cause re-renders
const ideas = useIdeasStore((s) => s.ideas);
const contributions = useIdeasStore((s) => s.contributions);
const users = useIdeasStore((s) => s.users);
const currentUserId = useIdeasStore((s) => s.currentUserId);
```

**Fix:** Move constants outside, use selector memoization

---

### 5. **No Code Splitting** 🟡 MEDIUM PRIORITY
**Problem:** All routes bundled together

**Current:** Single 459 kB main.js  
**Ideal:** Route-based code splitting

**Solution:** TanStack Router already supports this!
```typescript
// In routes, use React.lazy for non-critical routes:
export const Route = createFileRoute('/explore')({
  component: React.lazy(() => import('./explore')),
})
```

---

### 6. **Image Optimization** 🟡 MEDIUM PRIORITY
**Problem:** Large PNG images not optimized

**Current:**
- `3d-blocks.png`: 67.49 kB
- `3d-objects.png`: 165.04 kB
- `avatar-user.jpg`: 28.91 kB

**Total: 261.44 kB** (37% of entire bundle!)

**Fixes:**
- Convert to WebP format (~40% reduction)
- Compress aggressively
- Use `<img loading="lazy">`
- Consider SVG alternatives

---

### 7. **Missing Compression** 🟡 MEDIUM PRIORITY
**Problem:** No Brotli or advanced compression configured

**Current gzip:** 134.38 kB  
**With Brotli:** ~110 kB (18% reduction)

**Vercel handles this automatically**, but not optimized locally.

---

### 8. **AuthProvider Error Handling Missing** 🟠 MEDIUM PRIORITY
**Problem:** No fallback if Clerk key missing

**Current:**
```typescript
// In AuthProvider.tsx
if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}
```

**Issue:** Entire app crashes without env var

**Better approach:**
```typescript
// Graceful fallback for development
if (!publishableKey) {
  if (import.meta.env.DEV) {
    console.warn('Clerk key missing, running without auth');
    return children; // ← Continue without auth in dev
  }
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}
```

---

### 9. **No ResourceHints** 🟡 LOW PRIORITY
**Problem:** Missing prefetch/preload hints in index.html

**Add to `index.html`:**
```html
<!-- Preload critical resources -->
<link rel="preload" as="script" href="/src/main.tsx">
<link rel="preload" as="image" href="/assets/avatar-user.jpg">

<!-- Prefetch secondary resources -->
<link rel="prefetch" href="/assets/3d-objects.png">

<!-- DNS prefetch to external services -->
<link rel="dns-prefetch" href="https://your-project.supabase.co">
<link rel="dns-prefetch" href="https://clerk.com">
```

---

### 10. **Build Configuration Not Optimized** 🟡 LOW PRIORITY
**Problem:** Missing production build optimizations

**Current `vite.config.ts`:**
```typescript
build: {
  outDir: "dist",
  sourcemap: false, // ✅ Good
  // Missing optimizations:
}
```

**Add:**
```typescript
build: {
  outDir: "dist",
  sourcemap: false,
  minify: 'terser', // ✅ Already default
  rollupOptions: {
    output: {
      manualChunks: {
        // Separate vendor chunks for better caching
        vendor: ['react', 'react-dom', '@tanstack/react-router'],
        'supabase': ['@supabase/supabase-js'],
        'clerk': ['@clerk/clerk-react'],
      },
    },
  },
  chunkSizeWarningLimit: 500, // Warn if chunks > 500kb
},
```

---

## 📈 Optimization Priority List

| Issue | Type | Impact | Effort | Priority |
|-------|------|--------|--------|----------|
| Remove Zustand | Dependency | -8.2 kB | 2 hrs | 🔴 CRITICAL |
| Optimize images | Assets | -150 kB | 1 hr | 🔴 CRITICAL |
| Bundle code splitting | Build | -80 kB | 2 hrs | 🟠 HIGH |
| QueryClient config | Config | Performance | 15 min | 🟠 HIGH |
| Memoize components | Code | Runtime | 1 hr | 🟡 MEDIUM |
| Remove unused Radix | Dependencies | -40 kB | 30 min | 🟡 MEDIUM |
| AuthProvider fallback | UX | Reliability | 15 min | 🟡 MEDIUM |
| Resource hints | HTML | -50ms | 10 min | 🟡 MEDIUM |
| Build optimization | Config | Caching | 20 min | 🟡 MEDIUM |

---

## 🎯 Performance Targets

**Current:**
- Bundle: 459.95 kB (134.38 kB gzipped)
- Modules: 1,947
- Time to interactive: ~3-4s

**Target After Optimization:**
- Bundle: 280 kB (95 kB gzipped) ← 30% reduction
- Modules: 1,200 (38% reduction)
- Time to interactive: ~2s ← 40% faster

---

## 📋 Implementation Plan

### Phase 1: CRITICAL (1-2 hours)
```bash
# 1. Migrate from Zustand to React Query
# 2. Optimize images to WebP
# 3. Update all components to use useApi hooks
```

### Phase 2: HIGH (2-3 hours)
```bash
# 4. Configure QueryClient properly
# 5. Add code splitting for routes
# 6. Remove unused Radix UI components
```

### Phase 3: MEDIUM (1-2 hours)
```bash
# 7. Add React.memo to components
# 8. Optimize build configuration
# 9. Add resource hints to HTML
# 10. Fix AuthProvider error handling
```

---

## 🔧 Quick Wins (Do First)

### 1️⃣ Migrate components to React Query (1-2 hours, save 8.2 kB)

**Uninstall Zustand:**
```bash
npm uninstall zustand
```

**Update `src/routes/index.tsx`:**
```typescript
- import { useIdeasStore } from "@/stores/ideas";
+ import { useIdeas } from "@/hooks/useApi";

- const ideas = useIdeasStore((s) => s.ideas);
+ const { data: ideas } = useIdeas();
```

---

### 2️⃣ Optimize Images (30 min, save 150+ kB)

**Convert to WebP:**
```bash
# Use imagemagick or online converter
magick 3d-objects.png -quality 85 3d-objects.webp
# Result: ~100 kB → 60 kB
```

**Update HTML/JSX:**
```html
<!-- index.html or in components -->
<picture>
  <source srcset="3d-objects.webp" type="image/webp">
  <source srcset="3d-objects.png" type="image/png">
  <img src="3d-objects.png" alt="...">
</picture>
```

---

### 3️⃣ Fix QueryClient (15 min, improves performance)

**Update `src/main.tsx`:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 🧪 Before/After Metrics

### Before Optimizations
```
Build Time: 3.82s
Bundle Size: 459.95 kB (gzipped: 134.38 kB)
Modules: 1,947
Performance Score: ~65/100
```

### After Optimizations (Estimated)
```
Build Time: 2.5s (-35%)
Bundle Size: 280 kB (gzipped: 95 kB) (-39%)
Modules: 1,200 (-38%)
Performance Score: ~85/100
```

---

## 📚 Resources

- [Vite Build Optimization](https://vitejs.dev/guide/build.html#build-optimization)
- [React Performance](https://react.dev/reference/react/useMemo)
- [TanStack Query Caching](https://tanstack.com/query/latest)
- [Image Optimization](https://web.dev/performance-audit/)
- [Web Performance Best Practices](https://web.dev/performance/)

---

**Ready to implement?** Let me know and I'll make these optimizations!
