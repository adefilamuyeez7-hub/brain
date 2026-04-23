import { createFileRoute } from "@tanstack/react-router";
import { useClerk } from "@clerk/clerk-react";
import { MobileFrame } from "@/components/MobileFrame";
import { LogOut } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuth";
import { useUserIdeas } from "@/hooks/useApi";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your profile — Sparkboard" },
      { name: "description", content: "Your shared ideas, sparks and saved collections." },
    ],
  }),
});

function ProfilePage() {
  const { isSignedIn, isLoaded, avatarUrl, fullName, bio, stats, user } = useAuthUser();
  const { signOut } = useClerk();

  // Fetch user's ideas from API if they have a user ID
  const userID = user?.id || "";
  const { data: userIdeas = [], isLoading: ideasLoading } = useUserIdeas(userID);

  if (isLoaded && !isSignedIn) {
    return (
      <MobileFrame>
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
        </header>
        <section className="mt-8 flex flex-col items-center rounded-3xl bg-card p-6 text-center shadow-soft">
          <p className="text-muted-foreground mb-4">Sign in to view your profile</p>
          <a
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground transition-transform hover:scale-105"
          >
            Sign in
          </a>
        </section>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => signOut()}
          aria-label="Sign out"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-soft transition-transform hover:scale-105"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <section className="mt-5 flex flex-col items-center rounded-3xl bg-card p-6 text-center shadow-soft">
        <img
          src={avatarUrl}
          alt={`${fullName}'s avatar`}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-background shadow-pop"
        />
        <h2 className="mt-3 text-xl font-bold">{fullName}</h2>
        <p className="text-xs text-muted-foreground">{bio || "Curator of ideas ✨"}</p>

        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {[
            { label: "Ideas", value: stats.ideas || userIdeas.length },
            { label: "Sparks", value: stats.sparks },
            { label: "Following", value: stats.following },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-secondary py-3">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <h3 className="mt-6 text-lg font-bold">Your ideas</h3>
      {ideasLoading ? (
        <p className="mt-3 text-center text-sm text-muted-foreground">Loading ideas...</p>
      ) : userIdeas.length === 0 ? (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          You haven't created any ideas yet.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {userIdeas.map((idea: any) => (
            <li
              key={idea.id}
              className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-soft"
            >
              <div>
                <p className="text-sm font-semibold">{idea.title}</p>
                <p className="text-xs text-muted-foreground">{idea.tag}</p>
              </div>
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-medium text-mint-foreground">
                ♥ {idea.likes_count || 0}
              </span>
            </li>
          ))}
        </ul>
      )}
    </MobileFrame>
  );
}
