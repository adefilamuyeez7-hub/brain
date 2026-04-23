import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { Settings } from "lucide-react";
import avatarUser from "@/assets/avatar-user.jpg";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your profile — Sparkboard" },
      { name: "description", content: "Your shared ideas, sparks and saved collections." },
    ],
  }),
});

const stats = [
  { label: "Ideas", value: 24 },
  { label: "Sparks", value: 1284 },
  { label: "Following", value: 96 },
];

const recent = [
  { title: "Soft UI for note apps", tag: "Design", likes: 128 },
  { title: "Async standups via voice memo", tag: "Product", likes: 86 },
  { title: "Calendars as playlists", tag: "Tech", likes: 312 },
];

function ProfilePage() {
  return (
    <MobileFrame>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-soft"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

      <section className="mt-5 flex flex-col items-center rounded-3xl bg-card p-6 text-center shadow-soft">
        <img
          src={avatarUser}
          alt="Sandra's avatar"
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-background shadow-pop"
        />
        <h2 className="mt-3 text-xl font-bold">Sandra Lee</h2>
        <p className="text-xs text-muted-foreground">Curator of small, useful ideas ✨</p>

        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-secondary py-3">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <h3 className="mt-6 text-lg font-bold">Your ideas</h3>
      <ul className="mt-3 space-y-3">
        {recent.map((r) => (
          <li
            key={r.title}
            className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-soft"
          >
            <div>
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.tag}</p>
            </div>
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-medium text-mint-foreground">
              ♥ {r.likes}
            </span>
          </li>
        ))}
      </ul>
    </MobileFrame>
  );
}
