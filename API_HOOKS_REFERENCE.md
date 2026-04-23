# API Hooks Reference

All hooks are in `src/hooks/useApi.ts`

## Query Hooks (Fetching Data)

### `useIdeas()`
Fetch all ideas

```typescript
const { data: ideas, isLoading, error } = useIdeas();

ideas?.forEach(idea => console.log(idea.title));
```

**Returns:** `Idea[]`

---

### `useIdea(ideaId)`
Fetch single idea by ID

```typescript
const { data: idea, isLoading } = useIdea(params.ideaId);

return idea?.title;
```

**Returns:** `Idea`

---

### `useContributions(ideaId)`
Fetch all contributions for an idea

```typescript
const { data: contributions } = useContributions(ideaId);

const approved = contributions?.filter(c => c.status === 'approved');
```

**Returns:** `Contribution[]`

---

### `useUserIdeas(userId)`
Fetch ideas created by a user

```typescript
const { data: userIdeas } = useUserIdeas(userId);
```

**Returns:** `Idea[]`

---

## Mutation Hooks (Creating/Updating Data)

### `useCreateIdea()`
Create a new idea

```typescript
const { mutate: createIdea, isPending } = useCreateIdea();

const handleSubmit = () => {
  createIdea({
    title: 'My Idea',
    brief: 'Short summary',
    description: 'Long description',
    tag: 'Design',
    github_url: 'https://github.com/...',
    owner_id: userId,
  });
};

return <button disabled={isPending}>Create</button>;
```

**Input:**
```typescript
{
  title: string;
  brief: string;
  description: string;
  tag: string;
  github_url?: string;
  owner_id: string;
}
```

**Returns:** `Idea`

---

### `useUpdateIdea(ideaId)`
Update an existing idea

```typescript
const { mutate: updateIdea } = useUpdateIdea(ideaId);

updateIdea({
  title: 'Updated Title',
  likes_count: 42,
});
```

**Returns:** `Idea`

---

### `useDeleteIdea()`
Delete an idea

```typescript
const { mutate: deleteIdea } = useDeleteIdea();

deleteIdea(ideaId);
```

---

### `useLikeIdea(ideaId)`
Like/unlike an idea (toggle)

```typescript
const { mutate: toggleLike } = useLikeIdea(ideaId);

const handleLike = () => {
  toggleLike(userId); // Automatically likes if not liked, unlikes if liked
};
```

---

### `useProposeContribution()`
Propose a contribution to an idea

```typescript
const { mutate: propose } = useProposeContribution();

propose({
  idea_id: ideaId,
  author_id: userId,
  content: 'Add this feature...',
});
```

**Input:**
```typescript
{
  idea_id: string;
  author_id: string;
  content: string;
}
```

**Returns:** `Contribution`

---

### `useSetContributionStatus()`
Approve or reject a contribution

```typescript
const { mutate: setStatus } = useSetContributionStatus();

// Approve
setStatus({ 
  contributionId: 'c_123',
  status: 'approved'
});

// Reject
setStatus({ 
  contributionId: 'c_123',
  status: 'rejected'
});
```

---

## Usage Examples

### Complete Example: Display Ideas List

```typescript
import { useIdeas } from '@/hooks/useApi';

export function IdeasList() {
  const { data: ideas, isLoading, error } = useIdeas();

  if (isLoading) return <div>Loading ideas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {ideas?.map(idea => (
        <div key={idea.id}>
          <h2>{idea.title}</h2>
          <p>{idea.brief}</p>
          <span>{idea.tag}</span>
          <span>❤️ {idea.likes_count}</span>
        </div>
      ))}
    </div>
  );
}
```

---

### Complete Example: Create Idea Form

```typescript
import { useCreateIdea } from '@/hooks/useApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';

export function CreateIdeaForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutate: createIdea, isPending } = useCreateIdea();
  
  const [formData, setFormData] = useState({
    title: '',
    brief: '',
    description: '',
    tag: 'Design',
    github_url: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in first');
      return;
    }

    createIdea(
      {
        ...formData,
        owner_id: user.id,
      },
      {
        onSuccess: (newIdea) => {
          navigate({ to: `/idea/${newIdea.id}` });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        placeholder="Title"
      />
      {/* More fields... */}
      <button disabled={isPending} type="submit">
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

---

### Complete Example: Like Button

```typescript
import { useLikeIdea } from '@/hooks/useApi';
import { useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';

export function LikeButton({ idea }) {
  const { user } = useUser();
  const { mutate: toggleLike, isPending } = useLikeIdea(idea.id);

  if (!user) {
    return <span>Sign in to like</span>;
  }

  const handleLike = () => {
    toggleLike(user.id);
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      <Heart /> {idea.likes_count}
    </button>
  );
}
```

---

## Key Features

### 🔄 Automatic Refetching
When data is mutated, React Query automatically refetches affected queries:

```typescript
const { mutate: createIdea } = useCreateIdea();

// After this completes:
createIdea({...});

// These automatically refetch:
// - useIdeas() → gets the new idea
// - useUserIdeas(userId) → gets the new idea
```

### ⚡ Caching & Performance
React Query caches queries by default:

```typescript
// First call: Fetches from server
const { data: ideas1 } = useIdeas(); 

// Second call: Uses cache (instant)
const { data: ideas2 } = useIdeas();

// Force refetch if needed:
const { refetch } = useIdeas();
refetch();
```

### 🔄 Optimistic Updates (Advanced)
For better UX, you can update UI before server confirms:

```typescript
const { mutate: toggleLike } = useLikeIdea(ideaId);

toggleLike(userId, {
  onMutate: async () => {
    // Update UI immediately
    queryClient.setQueryData(['idea', ideaId], old => ({
      ...old,
      likes_count: old.likes_count + 1,
    }));
  },
});
```

---

## Error Handling

```typescript
const { data, error, isError } = useIdeas();

if (isError) {
  return <div>Error: {error?.message}</div>;
}
```

```typescript
const { mutate: createIdea } = useCreateIdea();

createIdea(
  {...},
  {
    onError: (error) => {
      console.error('Failed:', error.message);
      alert('Failed to create idea');
    },
  }
);
```

---

## Environment Check

Before using hooks, ensure `.env.local` has:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_CLERK_PUBLISHABLE_KEY=...
```

If missing, you'll get an error:
```
Missing Supabase environment variables. Check .env.local
```

---

That's it! You now have all the tools to build a full-stack app. 🚀
