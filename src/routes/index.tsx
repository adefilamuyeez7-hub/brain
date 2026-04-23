import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, Heart, MessageCircle, Github } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { UserSwitcher } from "@/components/UserSwitcher";
import { useIdeasStore } from "@/stores/ideas";
import avatarUser from "@/assets/avatar-user.jpg";
import objects3d from "@/assets/3d-objects.png";
import blocks3d from "@/assets/3d-blocks.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sparkboard — Share your ideas" },
      {
        name: "description",
        content:
          "A playful mobile space to capture, share, and grow ideas with a creative community.",
      },
    ],
  }),
});

const categories = [
  { label: "All", color: "bg-ink text-ink-foreground" },
  { label: "Design", color: "bg-card text-foreground" },
  { label: "Product", color: "bg-card text-foreground" },
  { label: "Tech", color: "bg-card text-foreground" },
  { label: "Life", color: "bg-card text-foreground" },
];

const cardPalette = [
  { bg: "bg-mango", fg: "text-mango-foreground", art: blocks3d },
  { bg: "bg-sky", fg: "text-sky-foreground", art: objects3d },
  { bg: "bg-blush", fg: "text-blush-foreground", art: blocks3d },
  { bg: "bg-mint", fg: "text-mint-foreground", art: objects3d },
];

function Index() {
  const ideas = useIdeasStore((s) => s.ideas);
  const contributions = useIdeasStore((s) => s.contributions);
  const users = useIdeasStore((s) => s.users);
  const currentUserId = useIdeasStore((s) => s.currentUserId);
  const me = users.find((u) => u.id === currentUserId)!;

  return (
    <MobileFrame>
      {/* Header */}
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <img
            src={avatarUser}
            alt="Your avatar"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-card shadow-soft"
          />
          <div>
            <h1 className="text-base font-semibold leading-tight">
              Hello, {me.name.split(" ")[0]}
            </h1>
            <p className="text-xs text-muted-foreground">Today 25 Nov.</p>
          </div>
        </div>
        <button
          aria-label="Search ideas"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-soft transition-transform hover:scale-105"
        >
          <Search className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </header>

      <div className="mt-3 flex justify-end">
        <UserSwitcher />
      </div>

      {/* Featured idea of the day */}
      <section className="relative mt-4 overflow-hidden rounded-3xl bg-lilac p-5 shadow-pop">
        <div className="relative z-10 max-w-[60%]">
          <h2 className="text-3xl font-bold leading-[1.05] text-lilac-foreground">
            Idea of <br /> the day
          </h2>
          <p className="mt-2 text-xs text-lilac-foreground/80">
            Open-source your spark. Others can contribute.
          </p>
          <Link
            to="/create"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Share an idea
          </Link>
        </div>
        <img
          src={objects3d}
          alt=""
          width={220}
          height={220}
          className="pointer-events-none absolute -right-4 -top-2 h-44 w-44 select-none drop-shadow-xl"
        />
      </section>

      {/* Category chips */}
      <section className="mt-6 -mx-5 overflow-x-auto px-5">
        <div className="flex gap-2.5">
          {categories.map((c) => (
            <button
              key={c.label}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium shadow-soft transition-transform hover:scale-[1.03] ${c.color}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Section title */}
      <div className="mt-6 flex items-end justify-between">
        <h3 className="text-xl font-bold">Fresh ideas</h3>
        <Link to="/explore" className="text-xs font-medium text-muted-foreground">
          See all
        </Link>
      </div>

      {/* Idea cards */}
      <section className="mt-3 grid grid-cols-2 gap-3">
        {ideas.map((idea, i) => {
          const palette = cardPalette[i % cardPalette.length];
          const approvedCount = contributions.filter(
            (c) => c.ideaId === idea.id && c.status === "approved"
          ).length;
          return (
            <Link
              key={idea.id}
              to="/idea/$ideaId"
              params={{ ideaId: idea.id }}
              className={`relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl p-4 shadow-soft transition-transform hover:scale-[1.02] ${palette.bg} ${palette.fg}`}
            >
              <span className="w-fit rounded-full bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                {idea.tag}
              </span>
              <img
                src={palette.art}
                alt=""
                width={140}
                height={140}
                loading="lazy"
                className="pointer-events-none absolute -right-4 top-6 h-24 w-24 select-none opacity-90"
              />
              <div>
                <h4 className="text-base font-bold leading-tight">{idea.title}</h4>
                <p className="mt-1 text-[11px] opacity-70">by {idea.ownerName}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" /> {idea.likes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> {approvedCount}
                  </span>
                  {idea.githubUrl && (
                    <span className="inline-flex items-center gap-1">
                      <Github className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Floating create CTA above bottom nav */}
      <Link
        to="/create"
        aria-label="Create new idea"
        className="fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-mango text-mango-foreground shadow-pop transition-transform hover:scale-105"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Link>
    </MobileFrame>
  );
}
