import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  Github,
  Heart,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { IdeaDetailSkeleton } from "@/components/SkeletonLoaders";
import {
  useContributions,
  useIdea,
  useLikeIdea,
  useProposeContribution,
  useSetContributionStatus,
} from "@/hooks/useApi";
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
  head: () => ({
    meta: [
      { title: "Idea - Sparkboard" },
      { name: "description", content: "View and contribute to this idea." },
    ],
  }),
});

const proposalSchema = z
  .string()
  .trim()
  .min(10, "Add at least 10 characters")
  .max(500, "Keep it under 500 characters");

function IdeaDetail() {
  const navigate = useNavigate();
  const { ideaId } = Route.useParams();
  const { user, isSignedIn, isClerkConfigured } = useAuthUser();
  const { data: idea, isLoading: ideaLoading, error: ideaError } = useIdea(ideaId);
  const { data: contributionsResponse, isLoading: contributionsLoading } = useContributions(ideaId);
  const likeIdea = useLikeIdea(ideaId);
  const proposeContribution = useProposeContribution();
  const setContributionStatus = useSetContributionStatus();

  const contributions = contributionsResponse?.data ?? [];
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (ideaLoading) {
    return (
      <MobileFrame>
        <div>
          <Link
            to="/"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <IdeaDetailSkeleton />
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
  const approved = contributions.filter((contribution: any) => contribution.status === "approved");
  const pending = contributions.filter((contribution: any) => contribution.status === "pending");

  const submitProposal = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isSignedIn || !user?.id) {
      if (isClerkConfigured) {
        navigate({ to: "/sign-in" });
      } else {
        setError("Sign-in is not configured for this deployment yet.");
      }
      return;
    }

    const parsed = proposalSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    try {
      await proposeContribution.mutateAsync({
        idea_id: idea.id,
        user_id: user.id,
        title: parsed.data.slice(0, 60),
        description: parsed.data,
      });
      setDraft("");
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to submit contribution";
      setError(message);
    }
  };

  const handleLike = () => {
    if (!user?.id) {
      return;
    }
    likeIdea.mutate(user.id);
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
            onClick={handleLike}
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

      <section className="mt-5 rounded-3xl bg-card p-5 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          About this idea
        </h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{idea.description}</p>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-bold">
          Community concepts{" "}
          <span className="text-sm font-medium text-muted-foreground">({approved.length})</span>
        </h2>
        <p className="text-xs text-muted-foreground">Concepts approved by the idea owner.</p>

        {contributionsLoading ? (
          <div className="mt-3 rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-soft">
            Loading contributions...
          </div>
        ) : approved.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
            No approved concepts yet. Be the first to propose one.
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {approved.map((contribution: any) => (
              <ConceptCard key={contribution.id} contribution={contribution} variant="approved" />
            ))}
          </ul>
        )}
      </section>

      {isOwner && pending.length > 0 && (
        <section className="mt-5">
          <h2 className="text-lg font-bold">
            Pending review{" "}
            <span className="text-sm font-medium text-muted-foreground">({pending.length})</span>
          </h2>
          <ul className="mt-3 space-y-2">
            {pending.map((contribution: any) => (
              <ConceptCard
                key={contribution.id}
                contribution={contribution}
                variant="pending"
                onAction={(status) =>
                  setContributionStatus.mutate({
                    contributionId: contribution.id,
                    status,
                  })
                }
              />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5 rounded-3xl bg-card p-4 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-lilac" /> Propose a concept
        </h2>
        {isOwner ? (
          <p className="mt-1 text-xs text-muted-foreground">
            You're the owner - wait for others to propose, then approve here.
          </p>
        ) : (
          <form onSubmit={submitProposal} className="mt-3 space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder={
                isSignedIn
                  ? "Add to this idea - a feature, twist, or use case..."
                  : "Write your idea here. You'll only need to sign in when you submit."
              }
              className="w-full resize-none rounded-2xl bg-secondary p-3 text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" />{" "}
                {isSignedIn
                  ? "Owner approves before it's public"
                  : "Login is only required when you submit"}
              </span>
              <span className="text-[10px] text-muted-foreground">{draft.length}/500</span>
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
              {isSignedIn ? "Submit for approval" : "Sign in to contribute"}
            </button>
          </form>
        )}
      </section>
    </MobileFrame>
  );
}

function ConceptCard({
  contribution,
  variant,
  onAction,
}: {
  contribution: any;
  variant: "approved" | "pending";
  onAction?: (status: "approved" | "rejected") => void;
}) {
  const body = contribution.description || contribution.content || contribution.title;

  return (
    <li className="rounded-2xl bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">{contribution.author_name || "Community member"}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            variant === "approved"
              ? "bg-mint text-mint-foreground"
              : "bg-mango text-mango-foreground"
          }`}
        >
          {contribution.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-snug">{body}</p>
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
