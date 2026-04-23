import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
import { MobileFrame } from "@/components/MobileFrame";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: "Sign in — Sparkboard" },
      { name: "description", content: "Sign in to your Sparkboard account" },
    ],
  }),
});

function SignInPage() {
  const isClerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  return (
    <MobileFrame>
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-md px-4">
          <h1 className="text-2xl font-bold text-center mb-8">Sign in to Sparkboard</h1>
          {isClerkConfigured ? (
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-soft rounded-3xl",
                  headerTitle: "text-xl font-bold",
                  headerSubtitle: "text-sm text-muted-foreground",
                  socialButtonsBlockButton:
                    "rounded-lg bg-card shadow-soft border-0 h-12 text-sm font-medium transition-transform hover:scale-105",
                  formButtonPrimary:
                    "rounded-lg bg-ink text-ink-foreground h-12 text-sm font-semibold transition-transform hover:scale-105",
                  inputField: "rounded-lg bg-card border-0 h-11 text-sm",
                  footerActionLink: "text-ink font-semibold",
                },
              }}
              redirectUrl="/"
              forceRedirectUrl="/"
            />
          ) : (
            <div className="rounded-3xl bg-card p-6 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">
                Authentication is not configured for this deployment yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}
