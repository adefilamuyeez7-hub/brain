import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Github,
  Heart,
  Check,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useIdea, useContributions, useLikeIdea } from "@/hooks/useApi";
import { useAuthUser } from "@/hooks/useAuth";

export const Route = createFileRoute("/idea/$ideaId")({
  component: IdeaDetail,
  notFoundComponent: () => (
    <MobileFrame>
      <div className="mt-20 text-center">
        <h1 className="text-xl font-bold">Idea not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-muted-foreground underline">
          Back home
        </Link>
      </div>
    </MobileFrame>
  ),
  head: ({ params }) => ({
    meta: [
      { title: "Idea — Sparkboard" },
      {
        name: "description",
        content: `View and contribute to this idea.`,
      },
    ],
  }),
});

const proposalSchema = z
  .string()
  .trim()
  .min(10, "Add at least 10 characters")
  .max(500, "Keep it under 500 characters");

function IdeaDetail() {
  const { ideaId } = Route.useParams();
  const { user } = useAuthUser();
  
  // Fetch idea and contributions from API
  const { data: idea, isLoading: ideaLoading, error: ideaError } = useIdea(ideaId);
  const { data: contributions = [], isLoading: contribsLoading } = useContributions(ideaId);
  const likeIdea = useLikeIdea(ideaId);

  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (ideaLoading) {
    return (
      <MobileFrame>
        <div className="mt-20 text-center">
          <p className="text-muted-foreground">Loading idea...</p>
        </div>
      </MobileFrame>
    );
  }

  if (ideaError || !idea) {
    return (
      <MobileFrame>
        <div className="mt-20 text-center">
          <h1 className="text-xl font-bold">Idea not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-muted-foreground underline">
            Back home
          </Link>
        </div>
      </MobileFrame>
    );
  }

  const isOwner = user?.id === idea.user_id;
  const approved = contributions.filter((c: any) => c.status === "approved");
  const pending = contributions.filter((c: any) => c.status === "pending");

  const submitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = proposalSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    // Will call useProposeContribution hook here
    // proposeContribution({ ideaId: idea.id, content: parsed.data });
    setDraft("");
  };

  return (
    <MobileFrame>
      <header className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </header>

      {/* Idea hero */}
      <section className="mt-4 rounded-3xl bg-lilac p-5 shadow-pop">
        <span className="rounded-full bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
          {idea.tag}
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-lilac-foreground">
          {idea.title}
        </h1>
        <p className="mt-2 text-sm text-lilac-foreground/90">{idea.brief}</p>
        <p className="mt-3 text-xs text-lilac-foreground/80">by {idea.owner_name || "Unknown"}</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => likeIdea.mutate(user?.id || "")}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground"
          >
            <Heart className="h-3.5 w-3.5" /> {idea.likes_count || 0}
          </button>
          {idea.github_url ? (
            <a
              href={idea.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              <Github className="h-3.5 w-3.5" /> Contribute on GitHub
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/40 px-3 py-1.5 text-xs font-medium text-lilac-foreground/80">
              <Github className="h-3.5 w-3.5" /> No repo yet
            </span>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          About this idea
        </h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
          {idea.description}
        </p>
      </section>

      {/* Approved community concepts */}
      <section className="mt-5">
        <h2 className="text-lg font-bold">
          Community concepts{" "}
          <span className="text-sm font-medium text-muted-foreground">
            ({approved.length})
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">
          Concepts approved by the idea owner.
        </p>

        {approved.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
            No approved concepts yet. Be the first to propose one.
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {approved.map((c) => (
              <ConceptCard key={c.id} c={c} variant="approved" />
            ))}
          </ul>
        )}
      </section>

      {/* Owner approval queue */}
      {isOwner && pending.length > 0 && (
        <section className="mt-5">
          <h2 className="text-lg font-bold">
            Pending review{" "}
            <span className="text-sm font-medium text-muted-foreground">
              ({pending.length})
            </span>
          </h2>
          <ul className="mt-3 space-y-2">
            {pending.map((c) => (
              <ConceptCard
                key={c.id}
                c={c}
                variant="pending"
                onAction={(status) => setContributionStatus(c.id, status)}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Propose form (signed-in only — always true in mock) */}
      <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-lilac" /> Propose a concept
        </h2>
        {isOwner ? (
          <p className="mt-1 text-xs text-muted-foreground">
            You're the owner — wait for others to propose, then approve here.
          </p>
        ) : (
          <form onSubmit={submitProposal} className="mt-3 space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Add to this idea — a feature, twist, or use case…"
              className="w-full resize-none rounded-2xl bg-secondary p-3 text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" /> Owner approves before it's public
              </span>
              <span className="text-[10px] text-muted-foreground">
                {draft.length}/500
              </span>
            </div>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-ink-foreground"
            >
              Submit for approval
            </button>
          </form>
        )}
      </section>
    </MobileFrame>
  );
}

function ConceptCard({
  c,
  variant,
  onAction,
}: {
  c: Contribution;
  variant: "approved" | "pending";
  onAction?: (status: ContributionStatus) => void;
}) {
  return (
    <li className="rounded-2xl bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">{c.authorName}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            variant === "approved"
              ? "bg-mint text-mint-foreground"
              : "bg-mango text-mango-foreground"
          }`}
        >
          {c.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-snug">{c.content}</p>
      {variant === "pending" && onAction && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onAction("approved")}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2 text-xs font-semibold text-ink-foreground"
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </button>
          <button
            onClick={() => onAction("rejected")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold"
          >
            <X className="h-3.5 w-3.5" /> Reject
          </button>
        </div>
      )}
    </li>
  );
}
