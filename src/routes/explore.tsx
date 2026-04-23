import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { Search } from "lucide-react";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
  head: () => ({
    meta: [
      { title: "Explore ideas — Sparkboard" },
      { name: "description", content: "Browse trending ideas across design, product, tech and life." },
    ],
  }),
});

const topics = [
  { label: "Design", count: 124, bg: "bg-mango", fg: "text-mango-foreground" },
  { label: "Product", count: 87, bg: "bg-sky", fg: "text-sky-foreground" },
  { label: "Tech", count: 152, bg: "bg-lilac", fg: "text-lilac-foreground" },
  { label: "Life", count: 64, bg: "bg-blush", fg: "text-blush-foreground" },
  { label: "Wellness", count: 41, bg: "bg-mint", fg: "text-mint-foreground" },
  { label: "Career", count: 39, bg: "bg-card", fg: "text-foreground" },
];

function ExplorePage() {
  return (
    <MobileFrame>
      <header>
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="text-sm text-muted-foreground">Find ideas you'll love</p>
      </header>

      <div className="mt-5 flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-soft">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search ideas, people, tags…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <h2 className="mt-6 text-lg font-bold">Topics</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {topics.map((t) => (
          <button
            key={t.label}
            className={`flex h-28 flex-col items-start justify-between rounded-3xl p-4 text-left shadow-soft transition-transform hover:scale-[1.02] ${t.bg} ${t.fg}`}
          >
            <span className="text-xs font-medium opacity-70">{t.count} ideas</span>
            <span className="text-lg font-bold">{t.label}</span>
          </button>
        ))}
      </div>
    </MobileFrame>
  );
}
