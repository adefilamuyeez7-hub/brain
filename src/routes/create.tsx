import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { MobileFrame } from "@/components/MobileFrame";
import { useIdeasStore } from "@/stores/ideas";
import { Sparkles, Github } from "lucide-react";

export const Route = createFileRoute("/create")({
  component: CreatePage,
  head: () => ({
    meta: [
      { title: "Share an idea — Sparkboard" },
      { name: "description", content: "Capture your spark and share it with the community." },
    ],
  }),
});

const tags = ["Design", "Product", "Tech", "Life", "Wellness", "Career"];

const ideaSchema = z.object({
  title: z.string().trim().min(3, "Add a short title").max(80),
  brief: z.string().trim().min(5, "Add a one-line summary").max(140),
  description: z.string().trim().min(10, "Describe the idea a bit more").max(2000),
  tag: z.string().min(1),
  githubUrl: z
    .string()
    .trim()
    .max(200)
    .optional()
    .refine(
      (v) => !v || /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/i.test(v),
      "Use a https://github.com/owner/repo URL"
    ),
});

function CreatePage() {
  const navigate = useNavigate();
  const addIdea = useIdeasStore((s) => s.addIdea);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Design");
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = ideaSchema.safeParse({
      title,
      brief,
      description,
      tag,
      githubUrl: githubUrl || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    const id = addIdea(parsed.data);
    navigate({ to: "/idea/$ideaId", params: { ideaId: id } });
  };

  return (
    <MobileFrame>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New idea</h1>
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>
      </header>

      <p className="mt-2 text-xs text-muted-foreground">
        Open-source your idea. Others can propose concepts; you approve what makes it in.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="rounded-3xl bg-card p-4 shadow-soft">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="A one-line spark…"
            className="mt-1 w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-soft">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Brief description
          </label>
          <input
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            maxLength={140}
            placeholder="One sentence so people get it instantly"
            className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            {brief.length}/140
          </p>
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-soft">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Full description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            placeholder="What's the idea? Who is it for? Why now?"
            rows={6}
            className="mt-1 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-soft">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Github className="h-3.5 w-3.5" /> GitHub repo (optional)
          </label>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            maxLength={200}
            inputMode="url"
            placeholder="https://github.com/owner/repo"
            className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Link a public repo so others can contribute via pull requests.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Topic
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium shadow-soft transition-colors ${
                  tag === t ? "bg-ink text-ink-foreground" : "bg-card text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-lilac py-4 text-base font-semibold text-lilac-foreground shadow-pop transition-transform hover:scale-[1.01]"
        >
          <Sparkles className="h-5 w-5" />
          Share idea
        </button>
      </form>
    </MobileFrame>
  );
}
