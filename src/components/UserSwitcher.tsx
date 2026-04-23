import { useIdeasStore } from "@/stores/ideas";

export function UserSwitcher() {
  const users = useIdeasStore((s) => s.users);
  const currentUserId = useIdeasStore((s) => s.currentUserId);
  const setCurrentUser = useIdeasStore((s) => s.setCurrentUser);

  return (
    <label className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs shadow-soft">
      <span className="text-muted-foreground">Signed in as</span>
      <select
        value={currentUserId}
        onChange={(e) => setCurrentUser(e.target.value)}
        className="bg-transparent font-semibold outline-none"
        aria-label="Switch demo user"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </label>
  );
}
