import React from "react";

/**
 * Skeleton loader card for idea grid
 */
export function IdeaCardSkeleton() {
  return (
    <div className="relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl p-4 shadow-soft bg-card animate-pulse">
      <div className="w-1/3 h-4 bg-secondary rounded-full"></div>
      <div className="space-y-2">
        <div className="h-5 bg-secondary rounded-lg w-5/6"></div>
        <div className="h-3 bg-secondary rounded-lg w-3/4"></div>
        <div className="pt-2 flex gap-2">
          <div className="h-4 bg-secondary rounded w-16"></div>
          <div className="h-4 bg-secondary rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton grid for multiple idea cards
 */
export function IdeaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <IdeaCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for list items (profile ideas)
 */
export function IdeaListSkeletons({ count = 3 }: { count?: number }) {
  return (
    <ul className="mt-3 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="rounded-2xl bg-card p-4 shadow-soft animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-secondary rounded-lg w-2/3"></div>
              <div className="mt-1 h-3 bg-secondary/50 rounded w-1/3"></div>
            </div>
            <div className="h-6 w-20 bg-mint/20 rounded-full"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Skeleton for idea detail page
 */
export function IdeaDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Idea hero section */}
      <section className="mt-4 rounded-3xl bg-lilac/50 p-5 shadow-pop">
        <div className="w-20 h-4 bg-lilac/30 rounded-full"></div>
        <div className="mt-3 h-8 bg-lilac/30 rounded-lg w-4/5"></div>
        <div className="mt-2 space-y-2">
          <div className="h-4 bg-lilac/30 rounded w-full"></div>
          <div className="h-4 bg-lilac/30 rounded w-3/4"></div>
        </div>
        <div className="mt-3 h-3 bg-lilac/30 rounded w-1/3"></div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 bg-lilac/30 rounded-full w-28"></div>
          <div className="h-8 bg-lilac/30 rounded-full w-40"></div>
        </div>
      </section>

      {/* Description section */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-soft">
        <div className="h-4 bg-secondary rounded w-32"></div>
        <div className="mt-2 space-y-2">
          <div className="h-4 bg-secondary rounded w-full"></div>
          <div className="h-4 bg-secondary rounded w-5/6"></div>
          <div className="h-4 bg-secondary rounded w-4/5"></div>
        </div>
      </section>

      {/* Community concepts section */}
      <section className="mt-5">
        <div className="h-5 bg-secondary rounded w-48"></div>
        <div className="mt-2 h-3 bg-secondary/50 rounded w-1/2"></div>
        <div className="mt-3 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card p-4 animate-pulse">
              <div className="h-4 bg-secondary rounded w-2/3"></div>
              <div className="mt-2 h-3 bg-secondary/50 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

